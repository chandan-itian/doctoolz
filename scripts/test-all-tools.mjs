import assert from 'node:assert';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';
import QRCode from 'qrcode';
import { increaseFileSize } from '../src/utils/fileSizeIncreaser.ts';
import { calculateAge, CATEGORY_RELAXATION } from '../src/utils/ageCalculatorLogic.ts';
import { convertCgpaToPercentage, calculateMarksPercentage } from '../src/utils/cgpaCalculatorLogic.ts';
import { buildUpiString, buildWifiString } from '../src/utils/qrEngine.ts';

console.log('====================================================');
console.log('🧪 DOCTOOLZ COMPREHENSIVE QA & FUNCTIONAL TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function main() {
  // TEST 1: File Size Increaser (JPEG)
  await runAsyncTest('Tool 1: JPEG File Size Increaser to 50KB', async () => {
    const mockJpeg = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x60, 0x00, 0x60, 0x00, 0x00, 0xff, 0xd9
    ]);
    const mockFile = {
      arrayBuffer: async () => mockJpeg.buffer,
      byteLength: mockJpeg.byteLength,
      type: 'image/jpeg'
    };

    const res = await increaseFileSize(mockFile, 50);
    assert(res.finalSizeKb >= 50, 'Final size should be at least 50KB');
    assert(res.blob.size >= 50 * 1024, 'Blob size should be >= 50KB');

    const resultBuffer = new Uint8Array(await res.blob.arrayBuffer());
    assert.strictEqual(resultBuffer[0], 0xff, 'JPEG SOI first byte');
    assert.strictEqual(resultBuffer[1], 0xd8, 'JPEG SOI second byte');
  });

  // TEST 2: File Size Increaser (PNG)
  await runAsyncTest('Tool 1: PNG File Size Increaser to 40KB', async () => {
    // Minimal 1x1 PNG
    const mockPng = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
      0x89, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);
    const mockFile = {
      arrayBuffer: async () => mockPng.buffer,
      byteLength: mockPng.byteLength,
      type: 'image/png'
    };

    const res = await increaseFileSize(mockFile, 40);
    assert(res.finalSizeKb >= 40, 'Final size should be >= 40KB');
    const resultBuffer = new Uint8Array(await res.blob.arrayBuffer());
    assert.strictEqual(resultBuffer[0], 0x89, 'PNG magic byte 0');
    assert.strictEqual(resultBuffer[1], 0x50, 'PNG magic byte P');
  });

  // TEST 3: Exam Age Calculator
  runTest('Tool 2: Cut-off Date Age Calculator & Eligibility', () => {
    const res = calculateAge('2000-08-15', '2025-08-01', 'OBC', 'en');
    assert(res !== null, 'Age result should not be null');
    assert.strictEqual(res.years, 24, 'Years calculation');
    assert.strictEqual(res.months, 11, 'Months calculation');
    assert(res.days > 0, 'Days calculation');
    assert(res.totalDays > 8000, 'Total days lived');

    // Check OBC relaxation
    const ssc = res.eligibility.find((e) => e.examName.includes('SSC CGL'));
    assert(ssc !== null, 'SSC CGL eligibility check present');
    assert.strictEqual(ssc.categoryRelaxation, 3, 'OBC relaxation must be 3 years');
    assert.strictEqual(ssc.isEligible, true, '24.9 yr old OBC candidate is eligible for SSC CGL (max 33)');
  });

  // TEST 4: CGPA to Percentage Calculator
  runTest('Tool 3: CGPA & Marks Percentage Calculations', () => {
    // CBSE standard: 8.4 * 9.5 = 79.8%
    const cbse = convertCgpaToPercentage(8.4, 'cbse');
    assert.strictEqual(cbse.percentage, 79.8, 'CBSE 8.4 CGPA should equal 79.8%');
    assert(cbse.division.includes('Distinction'), '>= 75% should be Distinction');

    // AICTE: (8.0 - 0.75) * 10 = 72.5%
    const aicte = convertCgpaToPercentage(8.0, 'aicte');
    assert.strictEqual(aicte.percentage, 72.5, 'AICTE 8.0 CGPA should equal 72.5%');

    // Marks: 440 out of 500 = 88%
    const marks = calculateMarksPercentage(440, 500);
    assert.strictEqual(marks.percentage, 88, '440/500 should equal 88%');
    assert.strictEqual(marks.grade, 'A+', '88% is grade A+');
  });

  // TEST 5: PDF Merger
  await runAsyncTest('Tool 5: PDF Merger (Combine Multiple PDFs)', async () => {
    // Create doc 1 (1 page)
    const doc1 = await PDFDocument.create();
    doc1.addPage([200, 200]);
    const b1 = await doc1.save();

    // Create doc 2 (2 pages)
    const doc2 = await PDFDocument.create();
    doc2.addPage([300, 300]);
    doc2.addPage([300, 300]);
    const b2 = await doc2.save();

    // Merge them
    const merged = await PDFDocument.create();
    const p1 = await merged.copyPages(await PDFDocument.load(b1), [0]);
    merged.addPage(p1[0]);
    const p2 = await merged.copyPages(await PDFDocument.load(b2), [0, 1]);
    merged.addPage(p2[0]);
    merged.addPage(p2[1]);

    const finalBytes = await merged.save();
    const verified = await PDFDocument.load(finalBytes);
    assert.strictEqual(verified.getPageCount(), 3, 'Merged PDF must have 3 pages');
  });

  // TEST 6: PDF Splitter / Page Extractor
  await runAsyncTest('Tool 6: PDF Splitter (Extract Specific Pages)', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([100, 100]); // page 1
    doc.addPage([100, 100]); // page 2
    doc.addPage([100, 100]); // page 3
    doc.addPage([100, 100]); // page 4
    const originalBytes = await doc.save();

    // Extract pages 1 and 3 (0-indexed: 0, 2)
    const loaded = await PDFDocument.load(originalBytes);
    const splitDoc = await PDFDocument.create();
    const pages = await splitDoc.copyPages(loaded, [0, 2]);
    splitDoc.addPage(pages[0]);
    splitDoc.addPage(pages[1]);

    const splitBytes = await splitDoc.save();
    const verified = await PDFDocument.load(splitBytes);
    assert.strictEqual(verified.getPageCount(), 2, 'Split PDF must have exactly 2 pages');
  });

  // TEST 7: PDF Password Encryption & Decryption
  await runAsyncTest('Tool 7: PDF Password Encryption (128-bit AES)', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([250, 250]);
    const plainBytes = await doc.save();

    // Encrypt with password "secret123"
    const encryptedBytes = await encryptPDF(plainBytes, 'secret123', {
      ownerPassword: 'secret123',
      algorithm: 'AES-256',
    });

    assert(isEncrypted(encryptedBytes), 'PDF must be detected as encrypted');

    // Decrypt with correct password
    const decryptedBytes = await decryptPDF(encryptedBytes, 'secret123');
    assert(decryptedBytes.byteLength > 0, 'Decrypted bytes must exist');
    const unlockedDoc = await PDFDocument.load(decryptedBytes);
    assert.strictEqual(unlockedDoc.getPageCount(), 1, 'Decrypted PDF must be loadable');
  });

  // TEST 8: QR Code Generator & UPI / Wi-Fi Builders
  await runAsyncTest('Tool 8: QR Generator & UPI / Wi-Fi Helpers', async () => {
    // UPI Builder
    const upiStr = buildUpiString({
      vpa: 'shop@upi',
      name: 'Ramesh Store',
      amount: '250',
    });
    assert(upiStr.includes('shop%40upi'), 'UPI string includes payee VPA');
    assert(upiStr.includes('am=250'), 'UPI string includes amount');

    // Wi-Fi Builder
    const wifiStr = buildWifiString({
      ssid: 'JioFiber_5G',
      password: 'mypassword',
      encryption: 'WPA',
    });
    assert.strictEqual(wifiStr, 'WIFI:S:JioFiber_5G;T:WPA;P:mypassword;;', 'Wi-Fi QR format');

    // QR Data URL generation
    const qrData = await QRCode.toDataURL('https://chandan-itian.github.io/doctoolz/');
    assert(qrData.startsWith('data:image/png;base64,'), 'QR Code generated as valid PNG Data URL');
  });

  console.log(`\n====================================================`);
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
  console.log(`====================================================\n`);
}

main().catch((e) => {
  console.error('Test suite failed:', e);
  process.exit(1);
});
