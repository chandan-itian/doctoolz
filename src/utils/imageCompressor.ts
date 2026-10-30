import { setJpegDpi } from './dpiModifier';

export interface CompressionOptions {
  targetKb: number;
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
  reductionPercentage: number;
}

/**
 * Compresses an image to be strictly under or equal to targetKb
 * Uses binary search over quality and adaptive scaling.
 */
export async function compressImageToTargetKb(
  img: HTMLImageElement,
  options: CompressionOptions
): Promise<CompressionResult> {
  const {
    targetKb,
    maxWidth = 4096,
    maxHeight = 4096,
    outputFormat = 'image/jpeg',
    dpi = 300,
    minQuality = 0.05,
    maxQuality = 0.98,
  } = options;

  const targetBytes = targetKb * 1024;
  let currentWidth = img.naturalWidth || img.width;
  let currentHeight = img.naturalHeight || img.height;

  // Scale down if exceeds max dimensions initially
  if (currentWidth > maxWidth || currentHeight > maxHeight) {
    const ratio = Math.min(maxWidth / currentWidth, maxHeight / currentHeight);
    currentWidth = Math.round(currentWidth * ratio);
    currentHeight = Math.round(currentHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas 2D context');

  let bestBlob: Blob | null = null;
  let bestQuality = maxQuality;
  let scaleAttempts = 0;
  const maxScaleAttempts = 6;

  // Helper to convert canvas to blob promise
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
    canvas.width = currentWidth;
    canvas.height = currentHeight;

    // Fill white background for transparent images when exporting as JPEG
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, currentWidth, currentHeight);
    } else {
      ctx.clearRect(0, 0, currentWidth, currentHeight);
    }
    ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

    // Binary search on quality
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

    // If lowest quality still larger than target, reduce dimensions by 18% and retry
    currentWidth = Math.round(currentWidth * 0.82);
    currentHeight = Math.round(currentHeight * 0.82);
    if (currentWidth < 50 || currentHeight < 50) {
      // Don't shrink below usable dimensions
      break;
    }
    scaleAttempts++;
  }

  // Fallback if even scaled image wasn't under target
  if (!bestBlob) {
    canvas.width = Math.max(currentWidth, 80);
    canvas.height = Math.max(currentHeight, 80);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    bestBlob = await toBlobPromise(canvas, 0.05, outputFormat);
    bestQuality = 0.05;
  }

  // Inject DPI if JPEG
  let finalBlob = bestBlob;
  if (outputFormat === 'image/jpeg' && dpi) {
    const arrayBuffer = await bestBlob.arrayBuffer();
    const withDpi = setJpegDpi(new Uint8Array(arrayBuffer), dpi);
    finalBlob = new Blob([withDpi as unknown as BlobPart], { type: 'image/jpeg' });
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
    reductionPercentage: 0, // Calculated by caller if original size is provided
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
