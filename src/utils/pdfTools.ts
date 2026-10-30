import { PDFDocument } from 'pdf-lib';

export interface ImageToPdfOptions {
  pageSize: 'A4' | 'Letter' | 'Fit';
  orientation: 'portrait' | 'landscape';
  margin: number; // in points
  quality: number; // 0.1 to 1.0
}

/**
 * Converts one or more image files to a single PDF document.
 */
export async function convertImagesToPdf(
  images: { file: File; dataUrl: string }[],
  options: ImageToPdfOptions
): Promise<{ blob: Blob; url: string; sizeKb: number }> {
  const pdfDoc = await PDFDocument.create();

  // Page dimension constants in points (72 points = 1 inch)
  const A4_PORTRAIT: [number, number] = [595.28, 841.89];
  const LETTER_PORTRAIT: [number, number] = [612, 792];

  for (const item of images) {
    const arrayBuffer = await item.file.arrayBuffer();
    const isPng = item.file.type === 'image/png';

    let embeddedImage;
    if (isPng) {
      try {
        embeddedImage = await pdfDoc.embedPng(arrayBuffer);
      } catch {
        // Fallback to jpg if png embedding fails
        embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
      }
    } else {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === 'Fit') {
      pageWidth = imgWidth + options.margin * 2;
      pageHeight = imgHeight + options.margin * 2;
    } else {
      let baseDims = options.pageSize === 'A4' ? A4_PORTRAIT : LETTER_PORTRAIT;
      if (options.orientation === 'landscape') {
        pageWidth = baseDims[1];
        pageHeight = baseDims[0];
      } else {
        pageWidth = baseDims[0];
        pageHeight = baseDims[1];
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate dimensions to fit inside page margins
    const availableWidth = pageWidth - options.margin * 2;
    const availableHeight = pageHeight - options.margin * 2;

    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    // Center image on the page
    const x = options.margin + (availableWidth - drawWidth) / 2;
    const y = options.margin + (availableHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const sizeKb = Math.round((blob.size / 1024) * 10) / 10;

  return { blob, url, sizeKb };
}
