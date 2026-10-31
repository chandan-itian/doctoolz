/**
 * Interactive Image Cropper & Circle Cut Engine
 */

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AspectRatioOption = 'free' | '1:1' | '3:4' | '4:3' | '16:9' | 'circle';

export async function cropAndExportImage(
  sourceImage: HTMLImageElement | ImageBitmap,
  cropArea: CropArea,
  options: {
    isCircle?: boolean;
    rotation?: number; // 0, 90, 180, 270
    flipH?: boolean;
    flipV?: boolean;
    format?: 'image/jpeg' | 'image/png';
    quality?: number;
  }
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number; sizeKb: number }> {
  const isCircle = options.isCircle || false;
  const format = isCircle ? 'image/png' : options.format || 'image/jpeg';
  const quality = options.quality || 0.92;

  const targetWidth = Math.max(1, Math.round(cropArea.width));
  const targetHeight = Math.max(1, Math.round(cropArea.height));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get 2D canvas context');

  // If circle cut, apply circular clipping path
  if (isCircle) {
    ctx.beginPath();
    const radius = Math.min(targetWidth, targetHeight) / 2;
    ctx.arc(targetWidth / 2, targetHeight / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  // Handle transformation (flips, rotation)
  ctx.save();
  ctx.translate(targetWidth / 2, targetHeight / 2);

  if (options.rotation) {
    ctx.rotate((options.rotation * Math.PI) / 180);
  }
  if (options.flipH || options.flipV) {
    ctx.scale(options.flipH ? -1 : 1, options.flipV ? -1 : 1);
  }

  // Draw the cropped region
  ctx.drawImage(
    sourceImage,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    -targetWidth / 2,
    -targetHeight / 2,
    targetWidth,
    targetHeight
  );

  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate cropped image'));
          return;
        }
        const dataUrl = canvas.toDataURL(format, quality);
        const sizeKb = Math.round((blob.size / 1024) * 10) / 10;
        resolve({
          blob,
          dataUrl,
          width: targetWidth,
          height: targetHeight,
          sizeKb,
        });
      },
      format,
      quality
    );
  });
}
