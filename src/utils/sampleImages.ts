/**
 * Dynamic Client-Side Sample Data Generator
 * Generates test images, ID cards, signatures, and multi-page PDFs directly in the browser
 * with zero external network dependencies!
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

/**
 * 1. Sample Passport Portrait Photo (JPG)
 */
export function generateSamplePortrait(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d')!;

    // Clean gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 1000);
    gradient.addColorStop(0, '#e2e8f0');
    gradient.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 1000);

    // Torso / Suit
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(400, 950, 280, 220, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shirt collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(340, 750);
    ctx.lineTo(400, 860);
    ctx.lineTo(460, 750);
    ctx.closePath();
    ctx.fill();

    // Tie
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(390, 820);
    ctx.lineTo(410, 820);
    ctx.lineTo(415, 980);
    ctx.lineTo(400, 1000);
    ctx.lineTo(385, 980);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(360, 680, 80, 100);

    // Head oval
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(400, 520, 160, 200, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(400, 470, 170, Math.PI, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(345, 510, 12, 0, Math.PI * 2);
    ctx.arc(455, 510, 12, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(400, 580, 45, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Watermark text
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DocToolz Demo Photo', 400, 150);

    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'demo-portrait-photo.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}

/**
 * 2. Small Photo under 15 KB (Specifically for Size Increaser test)
 */
export function generateSmallSamplePhoto(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 375;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 0, 300, 375);

    // Simple avatar
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(150, 140, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(150, 330, 110, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Small Demo Photo', 150, 40);
    ctx.font = '12px sans-serif';
    ctx.fillText('(Original ~12 KB)', 150, 60);

    // Save with 0.5 quality so file size is small (~12KB)
    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'small-candidate-photo-12kb.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.5);
  });
}

/**
 * 3. Sample Paper Signature (JPG)
 */
export function generateSampleSignature(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 250;
    const ctx = canvas.getContext('2d')!;

    // Slightly off-white paper background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 600, 250);

    // Signature path in dark blue ink
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(80, 150);
    ctx.bezierCurveTo(120, 80, 160, 60, 200, 140);
    ctx.bezierCurveTo(240, 210, 260, 120, 310, 110);
    ctx.bezierCurveTo(360, 100, 370, 180, 420, 130);
    ctx.bezierCurveTo(460, 90, 490, 140, 520, 120);
    ctx.stroke();

    // Underline flourish
    ctx.beginPath();
    ctx.moveTo(110, 180);
    ctx.bezierCurveTo(250, 190, 390, 175, 500, 180);
    ctx.stroke();

    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'demo-paper-signature.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}

/**
 * 4. Sample Identity Card / Sensitive Document (For Redactor & Watermark tools)
 */
export function generateSampleIdCard(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 850;
    canvas.height = 540;
    const ctx = canvas.getContext('2d')!;

    // ID Card background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 850, 540);

    // Header gradient banner
    const grad = ctx.createLinearGradient(0, 0, 850, 0);
    grad.addColorStop(0, '#1e3a8a');
    grad.addColorStop(1, '#3b82f6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 850, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('SAMPLE STUDENT / CITIZEN IDENTITY CARD', 40, 55);

    // Card border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 846, 536);

    // Photo Box Placeholder
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(50, 130, 150, 190);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 130, 150, 190);

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(125, 200, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(125, 300, 65, Math.PI, Math.PI * 2);
    ctx.fill();

    // Sensitive Data Labels & Values
    ctx.textAlign = 'left';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#64748b';

    const fields = [
      { label: 'Full Name:', val: 'RAHUL SHARMA (उम्मीदवार)', y: 155 },
      { label: 'Father Name:', val: 'SURESH SHARMA', y: 195 },
      { label: 'Date of Birth:', val: '15/08/2000 (Age: 24 Yrs)', y: 235 },
      { label: 'Aadhaar No:', val: '5642 9871 3412 (Confidential)', y: 275 },
      { label: 'Mobile No:', val: '+91 98765 43210', y: 315 },
      { label: 'Address:', val: 'House 42, Civil Lines, New Delhi - 110001', y: 355 },
    ];

    fields.forEach((f) => {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(f.label, 230, f.y);

      ctx.fillStyle = f.label.includes('Aadhaar') || f.label.includes('Mobile') ? '#dc2626' : '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(f.val, 360, f.y);
    });

    // Mock QR Code Box (Bottom Right)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(660, 130, 140, 140);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(660, 130, 140, 140);

    // Mock QR patterns
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(670, 140, 35, 35);
    ctx.fillRect(755, 140, 35, 35);
    ctx.fillRect(670, 225, 35, 35);
    ctx.fillRect(720, 185, 25, 25);
    ctx.font = '10px sans-serif';
    ctx.fillText('MOCK QR', 705, 260);

    // Footer Caution
    ctx.fillStyle = '#fef2f2';
    ctx.fillRect(20, 460, 810, 60);
    ctx.strokeStyle = '#fecaca';
    ctx.strokeRect(20, 460, 810, 60);

    ctx.fillStyle = '#991b1b';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('⚠️ DOCTOOLZ DEMO ID: Practice masking your Aadhaar, phone, or stamping watermark here!', 35, 495);

    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'demo-sample-id-card.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}

/**
 * 5. Sample Multi-Page PDF Document (3 Pages)
 * (For PDF Compressor, Splitter, Password Protect, and PDF to Photo)
 */
export async function generateSamplePdf(pageCount: number = 3): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Admit Card / Hall Ticket Demo
  const p1 = pdfDoc.addPage([595.28, 841.89]); // A4
  p1.drawRectangle({
    x: 40,
    y: 720,
    width: 515,
    height: 70,
    color: rgb(0.12, 0.23, 0.54),
  });
  p1.drawText('DOCTOOLZ DEMO ADMIT CARD / HALL TICKET', {
    x: 60,
    y: 755,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  p1.drawText('Examination Roll No: 2026-SSC-987654 | Candidate: Rahul Sharma', {
    x: 60,
    y: 735,
    size: 11,
    font: font,
    color: rgb(0.85, 0.9, 1),
  });

  p1.drawText('Page 1: Official Candidate Details & Examination Center Instructions', {
    x: 60,
    y: 670,
    size: 13,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  p1.drawText('1. Candidate must bring this admit card and a valid original photo ID.', {
    x: 60,
    y: 630,
    size: 11,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });
  p1.drawText('2. Electronic gadgets, smart watches, and calculators are strictly prohibited.', {
    x: 60,
    y: 605,
    size: 11,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });
  p1.drawText('3. Reporting time: 08:30 AM | Exam Duration: 120 Minutes.', {
    x: 60,
    y: 580,
    size: 11,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Page 2: Marksheet Demo
  if (pageCount >= 2) {
    const p2 = pdfDoc.addPage([595.28, 841.89]);
    p2.drawRectangle({
      x: 40,
      y: 720,
      width: 515,
      height: 70,
      color: rgb(0.02, 0.45, 0.35),
    });
    p2.drawText('DOCTOOLZ DEMO MARKSHEET / CERTIFICATE', {
      x: 60,
      y: 755,
      size: 18,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    p2.drawText('Page 2: Subject-wise Marks & Semester Performance', {
      x: 60,
      y: 735,
      size: 11,
      font: font,
      color: rgb(0.85, 1, 0.95),
    });

    p2.drawText('Subject: Mathematics - 95 / 100 (Grade A+)', {
      x: 60,
      y: 660,
      size: 12,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });
    p2.drawText('Subject: Science & Technology - 92 / 100 (Grade A+)', {
      x: 60,
      y: 630,
      size: 12,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });
    p2.drawText('Subject: English Communication - 88 / 100 (Grade A)', {
      x: 60,
      y: 600,
      size: 12,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });
    p2.drawText('Total Score: 440 / 500 (Percentage: 88.0% - First Class Distinction)', {
      x: 60,
      y: 550,
      size: 13,
      font: fontBold,
      color: rgb(0.02, 0.45, 0.35),
    });
  }

  // Page 3: Terms & Verification
  if (pageCount >= 3) {
    const p3 = pdfDoc.addPage([595.28, 841.89]);
    p3.drawRectangle({
      x: 40,
      y: 720,
      width: 515,
      height: 70,
      color: rgb(0.55, 0.15, 0.25),
    });
    p3.drawText('DOCTOOLZ DEMO VERIFICATION & DECLARATION', {
      x: 60,
      y: 755,
      size: 18,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    p3.drawText('Page 3: Terms, Conditions, and Authority Signature Stamp', {
      x: 60,
      y: 735,
      size: 11,
      font: font,
      color: rgb(1, 0.9, 0.9),
    });

    p3.drawText('Declaration by Candidate:', {
      x: 60,
      y: 660,
      size: 13,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    p3.drawText('I hereby declare that all details furnished in this application are true to my knowledge.', {
      x: 60,
      y: 630,
      size: 11,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    p3.drawText('[Authorized Digital Seal & Signature - DocToolz Testing Document]', {
      x: 60,
      y: 560,
      size: 11,
      font: fontBold,
      color: rgb(0.55, 0.15, 0.25),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes.buffer as ArrayBuffer], 'sample-demo-document-3pages.pdf', {
    type: 'application/pdf',
  });
}

/**
 * 6. Two Sample PDFs (For PDF Merger testing)
 */
export async function generateTwoSamplePdfs(): Promise<[File, File]> {
  const doc1 = await PDFDocument.create();
  const fontBold = await doc1.embedFont(StandardFonts.HelveticaBold);
  const p1 = doc1.addPage([595.28, 841.89]);
  p1.drawText('DOCUMENT PART 1 (Front Page)', {
    x: 60,
    y: 750,
    size: 20,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.6),
  });
  p1.drawText('This is Sample PDF #1 for testing the DocToolz PDF Merger.', {
    x: 60,
    y: 700,
    size: 13,
    color: rgb(0.3, 0.3, 0.3),
  });
  const b1 = await doc1.save();
  const f1 = new File([b1.buffer as ArrayBuffer], 'sample-part-1.pdf', { type: 'application/pdf' });

  const doc2 = await PDFDocument.create();
  const fontBold2 = await doc2.embedFont(StandardFonts.HelveticaBold);
  const p2 = doc2.addPage([595.28, 841.89]);
  p2.drawText('DOCUMENT PART 2 (Back Page)', {
    x: 60,
    y: 750,
    size: 20,
    font: fontBold2,
    color: rgb(0.6, 0.2, 0.1),
  });
  p2.drawText('This is Sample PDF #2 for testing the DocToolz PDF Merger.', {
    x: 60,
    y: 700,
    size: 13,
    color: rgb(0.3, 0.3, 0.3),
  });
  const b2 = await doc2.save();
  const f2 = new File([b2.buffer as ArrayBuffer], 'sample-part-2.pdf', { type: 'application/pdf' });

  return [f1, f2];
}

/**
 * 7. Sample QR Code Image (For QR Scanner testing)
 */
export async function generateSampleQrImage(): Promise<File> {
  const dataUrl = await QRCode.toDataURL('https://chandan-itian.github.io/doctoolz/ - DocToolz Official URL', {
    width: 400,
    margin: 2,
  });
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], 'demo-sample-qrcode.png', { type: 'image/png' });
}

/**
 * 8. Sample OCR Document
 */
export function generateSampleOcrDocument(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d')!;

    // White paper
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 700);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('DocToolz - दस्तावेज़ और ओसीआर टेस्ट', 60, 90);

    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('1. यह एक सैंपल दस्तावेज़ है जिसका उपयोग OCR टेस्टिंग के लिए किया जा सकता है।', 60, 160);
    ctx.fillText('2. This is an English sentence for bilingual optical character recognition test.', 60, 210);
    ctx.fillText('3. पासपोर्ट साइज फोटो का मानक रेजोल्यूशन 300 DPI और 3.5cm x 4.5cm होता है।', 60, 260);
    ctx.fillText('4. Government portals require signatures between 10KB to 20KB.', 60, 310);
    ctx.fillText('5. DocToolz आपकी फाइल्स को पूरी सुरक्षा के साथ आपके फोन या लैपटॉप में ही प्रोसेस करता है।', 60, 360);
    ctx.fillText('6. Roll Number: 9876543210 | Registration ID: DOC-2026-X9', 60, 430);

    // Border around document
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 940, 640);

    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'sample-ocr-document.png', { type: 'image/png' }));
    }, 'image/png');
  });
}
