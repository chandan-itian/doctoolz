/**
 * Sensitive Data Redactor & Masking Engine
 * Applies blackouts, pixelation, or blur to private regions (Aadhaar numbers, phone, signatures, QR codes)
 */

export interface RedactionRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'blackout' | 'pixelate' | 'blur';
}

export function applyRedactionsToCanvas(
  sourceImage: HTMLImageElement | ImageBitmap,
  redactions: RedactionRect[]
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = sourceImage.width;
  canvas.height = sourceImage.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Failed to get 2D canvas context');

  // Draw base image
  ctx.drawImage(sourceImage, 0, 0);

  for (const rect of redactions) {
    const rx = Math.max(0, Math.min(canvas.width, rect.x));
    const ry = Math.max(0, Math.min(canvas.height, rect.y));
    const rw = Math.max(1, Math.min(canvas.width - rx, rect.width));
    const rh = Math.max(1, Math.min(canvas.height - ry, rect.height));

    if (rect.type === 'blackout') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(rx, ry, rw, rh);
    } else if (rect.type === 'pixelate') {
      pixelateRegion(ctx, rx, ry, rw, rh, 12);
    } else if (rect.type === 'blur') {
      blurRegion(ctx, rx, ry, rw, rh);
    }
  }

  return canvas;
}

function pixelateRegion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  blockSize: number = 10
) {
  const imgData = ctx.getImageData(x, y, w, h);
  const data = imgData.data;

  for (let py = 0; py < h; py += blockSize) {
    for (let px = 0; px < w; px += blockSize) {
      // Calculate average color in block
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < blockSize && py + dy < h; dy++) {
        for (let dx = 0; dx < blockSize && px + dx < w; dx++) {
          const idx = ((py + dy) * w + (px + dx)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }

      if (count > 0) {
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Fill block with average color
        for (let dy = 0; dy < blockSize && py + dy < h; dy++) {
          for (let dx = 0; dx < blockSize && px + dx < w; dx++) {
            const idx = ((py + dy) * w + (px + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, x, y);
}

function blurRegion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Fast box blur via multi-pass downsampling
  const offscreen = document.createElement('canvas');
  const smallW = Math.max(4, Math.floor(w / 10));
  const smallH = Math.max(4, Math.floor(h / 10));

  offscreen.width = smallW;
  offscreen.height = smallH;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  offCtx.drawImage(ctx.canvas, x, y, w, h, 0, 0, smallW, smallH);

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(offscreen, 0, 0, smallW, smallH, x, y, w, h);
}
