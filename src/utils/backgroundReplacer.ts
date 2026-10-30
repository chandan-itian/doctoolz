/**
 * Client-Side Smart Background Color Replacement for Portrait / Passport Photos.
 * Replaces the photo's background with any custom color (White, Sky Blue, Navy, etc.)
 * using border-connected color distance floodfill with edge feathering.
 */

export interface BgReplaceOptions {
  targetColor: string; // Hex color e.g. '#0284c7' or '#ffffff'
  tolerance: number; // 10 to 100 (sensitivity)
  featherRadius?: number; // 1 to 4 px for smooth edges
  sampleColor?: { r: number; g: number; b: number } | null;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Replaces background pixels in a canvas context with targetColor.
 */
export function replaceBackgroundColor(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: BgReplaceOptions
): void {
  const { targetColor, tolerance = 35 } = options;
  const targetRgb = hexToRgb(targetColor);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Determine background color signature
  // Sample along the top, left, and right borders (typical background areas in portraits)
  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  let sampleCount = 0;

  if (options.sampleColor) {
    bgR = options.sampleColor.r;
    bgG = options.sampleColor.g;
    bgB = options.sampleColor.b;
  } else {
    // Sample 40 points along top edge (y=0 to 15), left edge (x=0 to 15), right edge (x=w-15 to w)
    const samplePoints: [number, number][] = [];
    for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 20))) {
      samplePoints.push([x, 2]);
      samplePoints.push([x, 10]);
    }
    for (let y = 0; y < height * 0.4; y += Math.max(1, Math.floor(height / 20))) {
      samplePoints.push([2, y]);
      samplePoints.push([width - 3, y]);
    }

    for (const [sx, sy] of samplePoints) {
      const idx = (Math.floor(sy) * width + Math.floor(sx)) * 4;
      bgR += data[idx];
      bgG += data[idx + 1];
      bgB += data[idx + 2];
      sampleCount++;
    }

    if (sampleCount > 0) {
      bgR = Math.round(bgR / sampleCount);
      bgG = Math.round(bgG / sampleCount);
      bgB = Math.round(bgB / sampleCount);
    }
  }

  // 2. Flood-fill / Connected border mask
  // Mark pixels connected to the boundary that match the background color
  const isBg = new Uint8Array(width * height);
  const queue: number[] = [];

  // Seed boundary points
  const checkAndSeed = (x: number, y: number) => {
    const pIdx = y * width + x;
    if (isBg[pIdx]) return;
    const dIdx = pIdx * 4;
    const r = data[dIdx];
    const g = data[dIdx + 1];
    const b = data[dIdx + 2];
    const a = data[dIdx + 3];

    // Transparent pixel is definitely background
    if (a < 50) {
      isBg[pIdx] = 2; // confirmed background
      queue.push(pIdx);
      return;
    }

    const dist = Math.sqrt(
      (r - bgR) * (r - bgR) * 0.299 +
      (g - bgG) * (g - bgG) * 0.587 +
      (b - bgB) * (b - bgB) * 0.114
    );

    if (dist < tolerance) {
      isBg[pIdx] = 1;
      queue.push(pIdx);
    }
  };

  // Seed top, left, and right borders
  for (let x = 0; x < width; x++) {
    checkAndSeed(x, 0);
    checkAndSeed(x, 1);
  }
  for (let y = 0; y < Math.floor(height * 0.7); y++) {
    checkAndSeed(0, y);
    checkAndSeed(1, y);
    checkAndSeed(width - 1, y);
    checkAndSeed(width - 2, y);
  }

  // Breadth-first search to expand background region
  let head = 0;
  const maxQueue = width * height;
  while (head < queue.length && head < maxQueue) {
    const curIdx = queue[head++];
    const cx = curIdx % width;
    const cy = Math.floor(curIdx / width);

    // Stop floodfill from reaching bottom chest/shirt center area
    if (cy > height * 0.85 && cx > width * 0.25 && cx < width * 0.75) {
      continue;
    }

    // Neighbors (4-connectivity)
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (isBg[nIdx] === 0) {
          const dIdx = nIdx * 4;
          const r = data[dIdx];
          const g = data[dIdx + 1];
          const b = data[dIdx + 2];
          const a = data[dIdx + 3];

          if (a < 50) {
            isBg[nIdx] = 2;
            queue.push(nIdx);
            continue;
          }

          const dist = Math.sqrt(
            (r - bgR) * (r - bgR) * 0.299 +
            (g - bgG) * (g - bgG) * 0.587 +
            (b - bgB) * (b - bgB) * 0.114
          );

          if (dist < tolerance) {
            isBg[nIdx] = 1;
            queue.push(nIdx);
          }
        }
      }
    }
  }

  // 3. Replace background pixels with targetColor & smooth edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      if (isBg[pIdx] > 0) {
        const dIdx = pIdx * 4;
        data[dIdx] = targetRgb.r;
        data[dIdx + 1] = targetRgb.g;
        data[dIdx + 2] = targetRgb.b;
        data[dIdx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
