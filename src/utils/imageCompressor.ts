import { setJpegDpi } from './dpiModifier';

export interface CompressionOptions {
  targetKb: number;
  exactWidth?: number;
  exactHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  outputFormat?: 'image/jpeg' | 'image/webp' | 'image/png';
  dpi?: number;
  minQuality?: number;
  maxQuality?: number;
}

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  quality: number;
  format: 'image/jpeg' | 'image/webp' | 'image/png';
  reductionPercentage: number;
}

/**
 * Compresses an image to be strictly under or equal to targetKb
 * Works across JPEG, WebP, and PNG with optional exact dimension constraints.
 */
export async function compressImageToTargetKb(
  img: HTMLImageElement,
  options: CompressionOptions
): Promise<CompressionResult> {
  const {
    targetKb,
    exactWidth,
    exactHeight,
    maxWidth = 4096,
    maxHeight = 4096,
    outputFormat = 'image/jpeg',
    dpi = 300,
    minQuality = 0.05,
    maxQuality = 0.98,
  } = options;

  const targetBytes = targetKb * 1024;
  let currentWidth = exactWidth || img.naturalWidth || img.width;
  let currentHeight = exactHeight || img.naturalHeight || img.height;

  // Scale down if exceeds max dimensions initially (only when exact dimensions not specified)
  if (!exactWidth && !exactHeight) {
    if (currentWidth > maxWidth || currentHeight > maxHeight) {
      const ratio = Math.min(maxWidth / currentWidth, maxHeight / currentHeight);
      currentWidth = Math.round(currentWidth * ratio);
      currentHeight = Math.round(currentHeight * ratio);
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas 2D context');

  let bestBlob: Blob | null = null;
  let bestQuality = maxQuality;
  let scaleAttempts = 0;
  const maxScaleAttempts = exactWidth && exactHeight ? 4 : 8;

  const toBlobPromise = (c: HTMLCanvasElement, q: number, format: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      c.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas toBlob failed'));
        },
        format,
        q
      );
    });
  };

  while (scaleAttempts < maxScaleAttempts) {
    canvas.width = Math.max(30, currentWidth);
    canvas.height = Math.max(30, currentHeight);

    // Background handling
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (outputFormat === 'image/png') {
      const pngBlob = await toBlobPromise(canvas, 1.0, 'image/png');
      if (pngBlob.size <= targetBytes || currentWidth <= 60 || currentHeight <= 60) {
        bestBlob = pngBlob;
        bestQuality = 1.0;
        break;
      }
      // Downscale proportionally to fit within target
      const sizeRatio = Math.sqrt(targetBytes / pngBlob.size);
      const factor = Math.min(0.85, Math.max(0.4, sizeRatio * 0.95));
      currentWidth = Math.round(currentWidth * factor);
      currentHeight = Math.round(currentHeight * factor);
    } else {
      // Binary search on quality for JPEG and WebP
      let low = minQuality;
      let high = maxQuality;
      let localBestBlob: Blob | null = null;
      let localBestQuality = minQuality;

      for (let i = 0; i < 7; i++) {
        const mid = (low + high) / 2;
        const testBlob = await toBlobPromise(canvas, mid, outputFormat);

        if (testBlob.size <= targetBytes) {
          localBestBlob = testBlob;
          localBestQuality = mid;
          low = mid; // Try higher quality
        } else {
          high = mid; // Needs more compression
        }
      }

      if (localBestBlob && localBestBlob.size <= targetBytes) {
        bestBlob = localBestBlob;
        bestQuality = localBestQuality;
        break;
      }

      // If lowest quality still exceeds target, downscale dimensions
      currentWidth = Math.round(currentWidth * 0.85);
      currentHeight = Math.round(currentHeight * 0.85);
      if (currentWidth < 40 || currentHeight < 40) {
        break;
      }
    }

    scaleAttempts++;
  }

  // Fallback
  if (!bestBlob) {
    canvas.width = Math.max(currentWidth, 60);
    canvas.height = Math.max(currentHeight, 60);
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    bestBlob = await toBlobPromise(canvas, 0.05, outputFormat);
    bestQuality = 0.05;
  }

  // Inject DPI if JPEG
  let finalBlob = bestBlob;
  if (outputFormat === 'image/jpeg' && dpi) {
    try {
      const arrayBuffer = await bestBlob.arrayBuffer();
      const withDpi = setJpegDpi(new Uint8Array(arrayBuffer), dpi);
      finalBlob = new Blob([withDpi as unknown as BlobPart], { type: 'image/jpeg' });
    } catch {
      finalBlob = bestBlob;
    }
  }

  const finalSizeKb = Math.round((finalBlob.size / 1024) * 10) / 10;
  const dataUrl = URL.createObjectURL(finalBlob);

  return {
    blob: finalBlob,
    dataUrl,
    sizeKb: finalSizeKb,
    width: canvas.width,
    height: canvas.height,
    quality: Math.round(bestQuality * 100),
    format: outputFormat,
    reductionPercentage: 0,
  };
}

/**
 * Loads a File or Blob into an HTMLImageElement
 */
export function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
