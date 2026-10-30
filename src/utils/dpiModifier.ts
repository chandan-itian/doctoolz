/**
 * Utility to inject or update JFIF DPI (Dots Per Inch) metadata in JPEG images.
 * This ensures portals checking metadata (like UPSC, SSC, Banking) see the exact DPI.
 */

export function setJpegDpi(jpegBytes: Uint8Array, dpi: number): Uint8Array {
  // Check if valid JPEG SOI (Start Of Image)
  if (jpegBytes[0] !== 0xff || jpegBytes[1] !== 0xd8) {
    return jpegBytes; // Not a valid JPEG, return unmodified
  }

  const dpiX = dpi;
  const dpiY = dpi;
  const dpiXHigh = (dpiX >> 8) & 0xff;
  const dpiXLow = dpiX & 0xff;
  const dpiYHigh = (dpiY >> 8) & 0xff;
  const dpiYLow = dpiY & 0xff;

  // Check if existing APP0 marker is at byte 2
  if (jpegBytes[2] === 0xff && jpegBytes[3] === 0xe0) {
    // Check if it has 'JFIF\0'
    const isJfif =
      jpegBytes[6] === 0x4a && // 'J'
      jpegBytes[7] === 0x46 && // 'F'
      jpegBytes[8] === 0x49 && // 'I'
      jpegBytes[9] === 0x46 && // 'F'
      jpegBytes[10] === 0x00;

    if (isJfif) {
      // Create a copy of the buffer to modify
      const result = new Uint8Array(jpegBytes);
      result[13] = 0x01; // Units: 1 = dots per inch (DPI)
      result[14] = dpiXHigh;
      result[15] = dpiXLow;
      result[16] = dpiYHigh;
      result[17] = dpiYLow;
      return result;
    }
  }

  // Construct a standard 18-byte JFIF APP0 header
  const app0 = new Uint8Array([
    0xff, 0xe0, // APP0 marker
    0x00, 0x10, // Length = 16 bytes
    0x4a, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
    0x01, 0x02, // Version 1.2
    0x01,       // Units: 1 = dots per inch
    dpiXHigh, dpiXLow, // Xdensity
    dpiYHigh, dpiYLow, // Ydensity
    0x00, 0x00  // Thumbnail dimensions (0x0)
  ]);

  // Insert APP0 right after SOI (0xFF 0xD8)
  const result = new Uint8Array(jpegBytes.length + app0.length);
  result[0] = 0xff;
  result[1] = 0xd8;
  result.set(app0, 2);
  result.set(jpegBytes.subarray(2), 2 + app0.length);

  return result;
}

/**
 * Reads DPI from a JPEG if present
 */
export function getJpegDpi(jpegBytes: Uint8Array): number | null {
  if (jpegBytes[0] !== 0xff || jpegBytes[1] !== 0xd8) return null;
  if (jpegBytes[2] === 0xff && jpegBytes[3] === 0xe0) {
    const isJfif =
      jpegBytes[6] === 0x4a &&
      jpegBytes[7] === 0x46 &&
      jpegBytes[8] === 0x49 &&
      jpegBytes[9] === 0x46 &&
      jpegBytes[10] === 0x00;
    if (isJfif && jpegBytes[13] === 0x01) {
      return (jpegBytes[14] << 8) | jpegBytes[15];
    }
  }
  return 72; // default fallback
}
