/**
 * Generates sample test images (portrait, signature, document) dynamically on canvas
 * without requiring any external network download!
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
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DocToolz Demo Photo', 400, 150);

    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'sample-passport-photo.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}

export function generateSampleSignature(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 250;
    const ctx = canvas.getContext('2d')!;

    // Slightly off-white paper with simulated scanner background
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
      resolve(new File([blob!], 'sample-signature.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}

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
    ctx.font = 'bold 36px "Noto Sans Devanagari", Inter, sans-serif';
    ctx.fillText('DocToolz - दस्तावेज़ और ओसीआर टेस्ट', 60, 90);

    ctx.font = '22px "Noto Sans Devanagari", Inter, sans-serif';
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
