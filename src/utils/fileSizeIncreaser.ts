/**
 * Client-side File Size Increaser
 * Safely increases JPG or PNG file size to target KB without altering image resolution or visual quality.
 */

export async function increaseFileSize(
  file: File,
  targetKb: number
): Promise<{ blob: Blob; finalSizeKb: number; originalSizeKb: number }> {
  const originalBuffer = await file.arrayBuffer();
  const currentBytes = originalBuffer.byteLength;
  const targetBytes = Math.round(targetKb * 1024);

  const originalSizeKb = Math.round((currentBytes / 1024) * 10) / 10;

  // If already larger than or equal to target, return original
  if (currentBytes >= targetBytes) {
    return {
      blob: new Blob([originalBuffer], { type: file.type || 'image/jpeg' }),
      finalSizeKb: originalSizeKb,
      originalSizeKb,
    };
  }

  const bytesToAdd = targetBytes - currentBytes;
  const uint8 = new Uint8Array(originalBuffer);

  // Check if JPEG (starts with 0xFF 0xD8)
  if (uint8[0] === 0xff && uint8[1] === 0xd8) {
    const padded = padJpeg(uint8, bytesToAdd);
    const finalSizeKb = Math.round((padded.byteLength / 1024) * 10) / 10;
    return {
      blob: new Blob([padded.buffer as ArrayBuffer], { type: 'image/jpeg' }),
      finalSizeKb,
      originalSizeKb,
    };
  }

  // Check if PNG (starts with 0x89 'PNG')
  if (
    uint8[0] === 0x89 &&
    uint8[1] === 0x50 &&
    uint8[2] === 0x4e &&
    uint8[3] === 0x47
  ) {
    const padded = padPng(uint8, bytesToAdd);
    const finalSizeKb = Math.round((padded.byteLength / 1024) * 10) / 10;
    return {
      blob: new Blob([padded.buffer as ArrayBuffer], { type: 'image/png' }),
      finalSizeKb,
      originalSizeKb,
    };
  }

  // Fallback generic padding (appending null bytes)
  const padded = new Uint8Array(targetBytes);
  padded.set(uint8);
  const finalSizeKb = Math.round((padded.byteLength / 1024) * 10) / 10;
  return {
    blob: new Blob([padded.buffer as ArrayBuffer], { type: file.type || 'application/octet-stream' }),
    finalSizeKb,
    originalSizeKb,
  };
}

/**
 * Inserts JPEG COM (0xFFFE) comment markers with padding payload
 */
function padJpeg(jpeg: Uint8Array, bytesToAdd: number): Uint8Array {
  // Find insertion point right after SOI (index 2) or after JFIF APP0 marker
  let insertIdx = 2;
  if (jpeg[2] === 0xff && (jpeg[3] === 0xe0 || jpeg[3] === 0xe1)) {
    const appLen = (jpeg[4] << 8) | jpeg[5];
    insertIdx = 4 + appLen;
  }

  // We need to create COM markers (0xFFFE + 2-byte length + payload)
  // Max payload per marker is 65533 bytes (65535 - 2 for length field)
  const chunks: Uint8Array[] = [];
  let remaining = bytesToAdd;

  while (remaining > 0) {
    // Each COM marker has 4 bytes overhead: 0xFF, 0xFE, lenHigh, lenLow
    const overhead = 4;
    const chunkSize = Math.min(remaining, 65535);
    const payloadSize = Math.max(0, chunkSize - overhead);
    const markerLen = payloadSize + 2;

    const chunk = new Uint8Array(overhead + payloadSize);
    chunk[0] = 0xff;
    chunk[1] = 0xfe; // COM marker
    chunk[2] = (markerLen >> 8) & 0xff;
    chunk[3] = markerLen & 0xff;

    // Fill payload with safe ASCII characters or spaces
    chunk.fill(0x20, 4, 4 + payloadSize);

    chunks.push(chunk);
    remaining -= (overhead + payloadSize);
  }

  const totalPaddingBytes = chunks.reduce((acc, c) => acc + c.byteLength, 0);
  const result = new Uint8Array(jpeg.byteLength + totalPaddingBytes);

  result.set(jpeg.subarray(0, insertIdx), 0);
  let offset = insertIdx;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.byteLength;
  }
  result.set(jpeg.subarray(insertIdx), offset);

  return result;
}

/**
 * Inserts a valid PNG ancillary chunk (tEXt) with padding payload before IEND
 */
function padPng(png: Uint8Array, bytesToAdd: number): Uint8Array {
  // Find IEND chunk (starts at png.length - 12)
  const insertIdx = Math.max(0, png.byteLength - 12);

  // tEXt chunk structure: 4-byte len, 4-byte 'tEXt', keyword + null + text, 4-byte CRC
  const overhead = 12; // 4 len + 4 type + 4 CRC
  const keyword = 'Comment\0';
  const keywordBytes = new TextEncoder().encode(keyword);
  const payloadSize = Math.max(0, bytesToAdd - overhead - keywordBytes.byteLength);

  const chunkData = new Uint8Array(keywordBytes.byteLength + payloadSize);
  chunkData.set(keywordBytes, 0);
  chunkData.fill(0x20, keywordBytes.byteLength);

  const chunkLen = chunkData.byteLength;
  const chunk = new Uint8Array(overhead + chunkLen);

  // Length
  chunk[0] = (chunkLen >> 24) & 0xff;
  chunk[1] = (chunkLen >> 16) & 0xff;
  chunk[2] = (chunkLen >> 8) & 0xff;
  chunk[3] = chunkLen & 0xff;

  // Type: 'tEXt'
  chunk[4] = 0x74;
  chunk[5] = 0x45;
  chunk[6] = 0x58;
  chunk[7] = 0x74;

  // Data
  chunk.set(chunkData, 8);

  // Simple CRC32 computation for PNG chunk
  const crc = computeCrc32(chunk.subarray(4, 8 + chunkLen));
  const crcOffset = 8 + chunkLen;
  chunk[crcOffset] = (crc >> 24) & 0xff;
  chunk[crcOffset + 1] = (crc >> 16) & 0xff;
  chunk[crcOffset + 2] = (crc >> 8) & 0xff;
  chunk[crcOffset + 3] = crc & 0xff;

  const result = new Uint8Array(png.byteLength + chunk.byteLength);
  result.set(png.subarray(0, insertIdx), 0);
  result.set(chunk, insertIdx);
  result.set(png.subarray(insertIdx), insertIdx + chunk.byteLength);

  return result;
}

function computeCrc32(buf: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
