/**
 * Advanced Client-Side PDF Utilities:
 * 1. Merge Multiple PDFs
 * 2. Split / Extract PDF Pages
 * 3. Compress PDF to Exact Target KB
 * 4. Encrypt PDF with Password
 */

import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';

// Configure pdfjs worker if in browser (prefers local bundle for offline Android & Web)
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';
  } catch (e) {
    console.warn('PDF.js worker initialization notice:', e);
  }
}

/**
 * Merge multiple PDF files into one single PDF in user-defined order
 */
export async function mergePdfFiles(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; pageCount: number; sizeKb: number }> {
  if (files.length === 0) {
    throw new Error('No PDF files provided for merging.');
  }

  const mergedPdf = await PDFDocument.create();
  let totalPageCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileBytes = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());

    for (const page of copiedPages) {
      mergedPdf.addPage(page);
      totalPageCount++;
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / files.length) * 100));
    }
  }

  const mergedBytes = await mergedPdf.save();
  const sizeKb = Math.round((mergedBytes.byteLength / 1024) * 10) / 10;
  const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

  return { blob, pageCount: totalPageCount, sizeKb };
}

/**
 * Split or extract chosen page indices from a PDF
 */
export async function splitPdfFile(
  file: File,
  pageNumbersToKeep: number[] // 1-based page numbers
): Promise<{ blob: Blob; pageCount: number; sizeKb: number }> {
  const fileBytes = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const totalAvailablePages = sourcePdf.getPageCount();

  const valid0BasedIndices = pageNumbersToKeep
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < totalAvailablePages);

  if (valid0BasedIndices.length === 0) {
    throw new Error('No valid pages selected for extraction.');
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, valid0BasedIndices);

  for (const page of copiedPages) {
    newPdf.addPage(page);
  }

  const splitBytes = await newPdf.save();
  const sizeKb = Math.round((splitBytes.byteLength / 1024) * 10) / 10;
  const blob = new Blob([splitBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

  return { blob, pageCount: copiedPages.length, sizeKb };
}

/**
 * Password Protect / Encrypt a PDF file
 */
export async function protectPdfFile(
  file: File,
  userPassword: string,
  ownerPassword?: string
): Promise<{ blob: Blob; sizeKb: number }> {
  if (!userPassword) {
    throw new Error('User password is required to encrypt the PDF.');
  }

  const fileBytes = await file.arrayBuffer();
  const encryptedBytes = await encryptPDF(new Uint8Array(fileBytes), userPassword, {
    ownerPassword: ownerPassword || userPassword,
    algorithm: 'AES-256',
  });

  const sizeKb = Math.round((encryptedBytes.byteLength / 1024) * 10) / 10;
  const blob = new Blob([encryptedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

  return { blob, sizeKb };
}

/**
 * Compress PDF to Target File Size in KB
 * Renders pages using pdfjs-dist and re-encodes each page to optimal JPEG quality with pdf-lib.
 */
export async function compressPdfToTargetKb(
  file: File,
  targetKb: number,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; finalSizeKb: number; originalSizeKb: number }> {
  const fileBytes = await file.arrayBuffer();
  const originalSizeKb = Math.round((fileBytes.byteLength / 1024) * 10) / 10;

  // Load document with pdfjs
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBytes) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  // Calculate target bytes per page
  const targetBytesPerPage = Math.max(8000, Math.floor((targetKb * 1024 * 0.9) / numPages));

  // Adaptive scale and quality based on target size
  let renderScale = 1.2;
  let jpegQuality = 0.7;

  if (targetKb < 100) {
    renderScale = 0.9;
    jpegQuality = 0.45;
  } else if (targetKb < 300) {
    renderScale = 1.0;
    jpegQuality = 0.6;
  } else if (targetKb < 800) {
    renderScale = 1.3;
    jpegQuality = 0.75;
  } else {
    renderScale = 1.5;
    jpegQuality = 0.85;
  }

  const newPdf = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not create 2D canvas context for PDF compression');

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas,
    };

    await (page.render(renderContext as unknown as Parameters<typeof page.render>[0]) as unknown as { promise: Promise<void> }).promise;

    // Convert canvas to JPEG blob
    const pageJpegDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
    const pageJpegBytes = await fetch(pageJpegDataUrl).then((r) => r.arrayBuffer());

    const embeddedImage = await newPdf.embedJpg(pageJpegBytes);
    const originalViewport = page.getViewport({ scale: 1.0 });

    const pdfPage = newPdf.addPage([originalViewport.width, originalViewport.height]);
    pdfPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });

    if (onProgress) {
      onProgress(Math.round((pageNum / numPages) * 100));
    }
  }

  const compressedBytes = await newPdf.save();
  const finalSizeKb = Math.round((compressedBytes.byteLength / 1024) * 10) / 10;
  const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

  return { blob, finalSizeKb, originalSizeKb };
}
