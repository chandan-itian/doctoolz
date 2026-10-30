import { createWorker } from 'tesseract.js';

export interface OcrProgress {
  status: string;
  progress: number; // 0 to 1
}

export interface OcrResult {
  text: string;
  confidence: number;
  wordsCount: number;
  linesCount: number;
}

/**
 * Executes 100% Client-Side OCR on an image file or canvas using Tesseract.js WebAssembly
 */
export async function performOcr(
  imageSource: File | Blob | string | HTMLCanvasElement,
  languages: 'eng' | 'hin' | 'eng+hin' = 'eng+hin',
  onProgress?: (progress: OcrProgress) => void
): Promise<OcrResult> {
  const langList = languages.split('+');
  
  // Create worker
  const worker = await createWorker(langList, undefined, {
    logger: (m) => {
      if (onProgress && m.status) {
        onProgress({
          status: m.status,
          progress: typeof m.progress === 'number' ? m.progress : 0,
        });
      }
    },
  });

  try {
    const ret = await worker.recognize(imageSource);
    await worker.terminate();

    const rawText = ret.data.text || '';
    const confidence = Math.round(ret.data.confidence || 0);
    const words = rawText.trim().split(/\s+/).filter(Boolean);
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);

    return {
      text: rawText,
      confidence,
      wordsCount: words.length,
      linesCount: lines.length,
    };
  } catch (err) {
    await worker.terminate();
    throw err;
  }
}
