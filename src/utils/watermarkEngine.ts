/**
 * Document Misuse Prevention Watermark Engine
 * Stamps custom diagonal repeating or centered security watermarks across sensitive documents
 */

export interface WatermarkOptions {
  text: string;
  subText?: string;
  opacity: number; // 0.05 - 0.9
  fontSize: number; // 14 - 72
  color: string;
  angle: number; // in degrees, e.g. -35
  pattern: 'repeat' | 'center';
  addDateStamp: boolean;
}

export async function applyWatermarkToImage(
  imageSource: HTMLImageElement | ImageBitmap,
  options: WatermarkOptions,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg'
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number; sizeKb: number }> {
  const canvas = document.createElement('canvas');
  canvas.width = imageSource.width;
  canvas.height = imageSource.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Draw base image
  ctx.drawImage(imageSource, 0, 0);

  // 2. Prepare watermark text
  let primaryText = options.text || 'FOR VERIFICATION ONLY - DO NOT MISUSE';
  if (options.addDateStamp) {
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    primaryText += ` • ${today}`;
  }

  // 3. Set text styling
  ctx.save();
  ctx.globalAlpha = Math.max(0.05, Math.min(0.9, options.opacity));
  ctx.fillStyle = options.color || '#EF4444';
  ctx.font = `bold ${options.fontSize}px sans-serif`;
  ctx.textBaseline = 'middle';

  const rad = (options.angle * Math.PI) / 180;

  if (options.pattern === 'center') {
    // Single centered stamp
    ctx.textAlign = 'center';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);

    // Draw border box for stamp effect
    const metrics = ctx.measureText(primaryText);
    const boxWidth = metrics.width + 40;
    const boxHeight = options.fontSize * 2;

    ctx.strokeStyle = options.color || '#EF4444';
    ctx.lineWidth = Math.max(2, Math.round(options.fontSize / 8));
    ctx.strokeRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);

    ctx.fillText(primaryText, 0, 0);

    if (options.subText) {
      ctx.font = `${Math.round(options.fontSize * 0.6)}px sans-serif`;
      ctx.fillText(options.subText, 0, options.fontSize * 0.8);
    }
  } else {
    // Repeating diagonal grid pattern
    ctx.textAlign = 'center';
    const stepX = options.fontSize * 14;
    const stepY = options.fontSize * 6;

    for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
      for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rad);
        ctx.fillText(primaryText, 0, 0);
        if (options.subText) {
          ctx.font = `${Math.round(options.fontSize * 0.55)}px sans-serif`;
          ctx.fillText(options.subText, 0, options.fontSize * 0.7);
          ctx.font = `bold ${options.fontSize}px sans-serif`;
        }
        ctx.restore();
      }
    }
  }

  ctx.restore();

  // Export to Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate watermarked image blob'));
          return;
        }
        const dataUrl = canvas.toDataURL(format, 0.92);
        const sizeKb = Math.round((blob.size / 1024) * 10) / 10;
        resolve({
          blob,
          dataUrl,
          width: canvas.width,
          height: canvas.height,
          sizeKb,
        });
      },
      format,
      0.92
    );
  });
}
