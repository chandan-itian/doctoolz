/// <reference types="vite/client" />

declare module 'jsqr' {
  interface QRCode {
    data: string;
    location: {
      topRightCorner: { x: number; y: number };
      topLeftCorner: { x: number; y: number };
      bottomRightCorner: { x: number; y: number };
      bottomLeftCorner: { x: number; y: number };
    };
  }
  export default function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: { inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'both' | 'attemptBoth' }
  ): QRCode | null;
}

declare module '@pdfsmaller/pdf-encrypt' {
  export interface EncryptOptions {
    ownerPassword?: string;
    algorithm?: 'AES-256' | 'RC4-128' | 'RC4-40';
    permissions?: Record<string, boolean | string>;
  }
  export function encryptPDF(
    data: Uint8Array,
    userPassword: string,
    options?: EncryptOptions
  ): Promise<Uint8Array>;
  export function isEncrypted(data: Uint8Array): boolean;
}

declare module '@pdfsmaller/pdf-decrypt' {
  export function decryptPDF(data: Uint8Array, password?: string): Promise<Uint8Array>;
  export function isEncrypted(data: Uint8Array): boolean;
}
