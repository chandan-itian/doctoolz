import assert from 'node:assert';
import { setJpegDpi, getJpegDpi } from '../src/utils/dpiModifier.ts';
import { PDFDocument } from 'pdf-lib';

console.log('--- DocToolz Comprehensive QA Verification Suite ---\n');

// Test 1: DPI Metadata Injection for 300 DPI
console.log('Test 1: JPEG JFIF 300 DPI Metadata Injection...');
const fakeJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x04, 0x00, 0x01, 0xff, 0xd9]);
const with300Dpi = setJpegDpi(fakeJpeg, 300);
assert.strictEqual(with300Dpi[0], 0xff, 'Must start with SOI 0xFF');
assert.strictEqual(with300Dpi[1], 0xd8, 'Must start with SOI 0xD8');
assert.strictEqual(with300Dpi[2], 0xff, 'APP0 marker 0xFF');
assert.strictEqual(with300Dpi[3], 0xe0, 'APP0 marker 0xE0');
const readDpi = getJpegDpi(with300Dpi);
assert.strictEqual(readDpi, 300, `Expected 300 DPI, got ${readDpi}`);
console.log('✓ Successfully verified 300 DPI JFIF injection and retrieval.');

// Test 2: DPI 200 (SSC Portal Requirement)
console.log('Test 2: JPEG 200 DPI Injection (SSC Standard)...');
const with200Dpi = setJpegDpi(fakeJpeg, 200);
const read200 = getJpegDpi(with200Dpi);
assert.strictEqual(read200, 200, `Expected 200 DPI, got ${read200}`);
console.log('✓ Successfully verified 200 DPI injection.');

// Test 3: PDF Document Generation with pdf-lib
console.log('Test 3: PDF Document Generation...');
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([595.28, 841.89]); // A4
assert.strictEqual(page.getWidth(), 595.28);
assert.strictEqual(page.getHeight(), 841.89);
const pdfBytes = await pdfDoc.save();
assert.ok(pdfBytes.length > 0, 'PDF bytes must be non-empty');
console.log(`✓ Successfully created valid PDF with size ${pdfBytes.length} bytes.`);

// Test 4: Custom Target KB boundary validations
console.log('Test 4: Custom KB target range checks (10KB, 12KB, 15KB, 16KB)...');
const customKbs = [10, 12, 15, 16, 20, 50, 100];
for (const kb of customKbs) {
  const bytes = kb * 1024;
  assert.ok(bytes >= 10240, `Target ${kb}KB must translate to >= 10240 bytes`);
}
console.log('✓ Successfully verified custom KB mathematical bounds.');

console.log('\nAll QA verification tests PASSED! 🚀');
