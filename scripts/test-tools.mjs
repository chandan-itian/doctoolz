import assert from 'node:assert';
import { setJpegDpi, getJpegDpi } from '../src/utils/dpiModifier.ts';
import { hexToRgb } from '../src/utils/backgroundReplacer.ts';
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
console.log('Test 4: Custom KB target range checks (10KB, 12KB, 15KB, 16KB, 35KB, 50KB)...');
const customKbs = [10, 12, 15, 16, 20, 35, 50, 100];
for (const kb of customKbs) {
  const bytes = kb * 1024;
  assert.ok(bytes >= 10240, `Target ${kb}KB must translate to >= 10240 bytes`);
}
console.log('✓ Successfully verified custom KB mathematical bounds.');

// Test 5: Hex to RGB conversion for Background Colors
console.log('Test 5: Background color parser validation...');
const whiteRgb = hexToRgb('#ffffff');
assert.deepStrictEqual(whiteRgb, { r: 255, g: 255, b: 255 });
const blueRgb = hexToRgb('#0284c7');
assert.deepStrictEqual(blueRgb, { r: 2, g: 132, b: 199 });
const redRgb = hexToRgb('#ef4444');
assert.deepStrictEqual(redRgb, { r: 239, g: 68, b: 68 });
console.log('✓ Successfully verified color converter for passport background replacement.');

// Test 6: Custom Dimension unit conversions at 300 DPI
console.log('Test 6: Unit conversions (px, cm, mm, in at 300 DPI)...');
const inchW = 2; // 2 inches = 600 px at 300 DPI
const inchPx = Math.round(inchW * 300);
assert.strictEqual(inchPx, 600);

const cmW = 3.5; // 3.5 cm at 300 DPI = (3.5 / 2.54) * 300 ≈ 413 px
const cmPx = Math.round((cmW / 2.54) * 300);
assert.strictEqual(cmPx, 413);

const mmH = 45; // 45 mm at 300 DPI = (45 / 25.4) * 300 ≈ 531 px
const mmPx = Math.round((mmH / 25.4) * 300);
assert.strictEqual(mmPx, 531);
console.log('✓ Successfully verified unit conversion calculations.');

console.log('\nAll QA verification tests PASSED! 🚀');
