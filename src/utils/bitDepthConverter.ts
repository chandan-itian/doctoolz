/**
 * Color and Bit-Depth manipulation utilities
 */

export type BitDepthMode = '24-bit' | '8-bit-gray' | '1-bit-bw';

export function applyBitDepthAndFilters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mode: BitDepthMode,
  options?: {
    contrast?: number; // -100 to 100
    brightness?: number; // -100 to 100
    bwThreshold?: number; // 0 to 255 (for signature cleaner)
  }
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const len = data.length;

  const contrast = options?.contrast ?? 0;
  const brightness = options?.brightness ?? 0;
  const bwThreshold = options?.bwThreshold ?? 185;

  // Contrast factor calculation
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply brightness
    if (brightness !== 0) {
      r = Math.min(255, Math.max(0, r + brightness));
      g = Math.min(255, Math.max(0, g + brightness));
      b = Math.min(255, Math.max(0, b + brightness));
    }

    // Apply contrast
    if (contrast !== 0) {
      r = Math.min(255, Math.max(0, factor * (r - 128) + 128));
      g = Math.min(255, Math.max(0, factor * (g - 128) + 128));
      b = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }

    if (mode === '8-bit-gray') {
      // Standard ITU-R BT.601 luma formula
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    } else if (mode === '1-bit-bw') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const bw = gray > bwThreshold ? 255 : 0;
      data[i] = bw;
      data[i + 1] = bw;
      data[i + 2] = bw;
    } else {
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
