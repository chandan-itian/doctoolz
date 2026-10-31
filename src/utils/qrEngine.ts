/**
 * 100% Client-Side QR Code Generator & Scanner Engine
 */

import QRCode from 'qrcode';
import jsQR from 'jsqr';

export interface UpiPaymentDetails {
  vpa: string;
  name: string;
  amount?: string;
  note?: string;
}

export interface WifiDetails {
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export function buildUpiString(details: UpiPaymentDetails): string {
  let upi = `upi://pay?pa=${encodeURIComponent(details.vpa)}&pn=${encodeURIComponent(details.name || 'Merchant')}`;
  if (details.amount && parseFloat(details.amount) > 0) {
    upi += `&am=${encodeURIComponent(details.amount)}&cu=INR`;
  }
  if (details.note) {
    upi += `&tn=${encodeURIComponent(details.note)}`;
  }
  return upi;
}

export function buildWifiString(details: WifiDetails): string {
  return `WIFI:S:${details.ssid};T:${details.encryption};P:${details.password || ''};${details.hidden ? 'H:true;' : ''};`;
}

export async function generateQrDataUrl(
  text: string,
  options?: {
    width?: number;
    colorDark?: string;
    colorLight?: string;
    margin?: number;
  }
): Promise<string> {
  return QRCode.toDataURL(text, {
    width: options?.width || 360,
    margin: options?.margin !== undefined ? options.margin : 2,
    color: {
      dark: options?.colorDark || '#000000',
      light: options?.colorLight || '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  });
}

export async function scanQrFromImage(imageFile: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });
        resolve(code ? code.data : null);
      };
      img.onerror = (e) => reject(e);
      img.src = reader.result as string;
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(imageFile);
  });
}

export function scanQrFromCanvas(canvas: HTMLCanvasElement): string | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });
  return code ? code.data : null;
}
