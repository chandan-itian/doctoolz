import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
}

export interface RenderedPdfPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Loads a PDF file and renders all its pages to high-resolution image blobs.
 * @param file PDF file
 * @param dpi 150 (standard web) or 300 (high definition print)
 * @param format 'image/jpeg' | 'image/png'
 * @param onProgress callback reporting (currentPage, totalPages)
 */
export async function renderPdfToImages(
  file: File,
  dpi: number = 200,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  onProgress?: (current: number, total: number) => void
): Promise<RenderedPdfPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pages: RenderedPdfPage[] = [];

  // Default PDF resolution is 72 DPI. Scale = targetDPI / 72.
  const scale = dpi / 72;

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) onProgress(i, numPages);

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Background white fill
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvas: canvas,
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to convert canvas to blob'));
        },
        format,
        0.95
      );
    });

    pages.push({
      pageNumber: i,
      dataUrl: URL.createObjectURL(blob),
      blob,
      width: Math.round(viewport.width),
      height: Math.round(viewport.height),
    });
  }

  return pages;
}
