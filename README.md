<div align="center">

# ⚡ DocToolz

### All-in-One Client-Side Image, Passport Photo & PDF Productivity Suite
**20+ Superfast Tools • 100% Private (Zero Server Uploads) • Bilingual (हिंदी / English) • Offline-Ready**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-chandan--itian.github.io%2Fdoctoolz-00C781?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chandan-itian.github.io/doctoolz/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chandan-itian/doctoolz)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/chandan-itian/doctoolz)
[![Privacy Guarantee](https://img.shields.io/badge/Privacy-100%25%20Client--Side-success?style=for-the-badge&logo=shield&logoColor=white)](#-100-client-side-privacy-guarantee)

---

### [👉 🚀 Open DocToolz Live in Browser](https://chandan-itian.github.io/doctoolz/) 👈

*Designed for Indian government exams (SSC, UPSC, IBPS, State PSCs), university admissions, visa applications, and everyday digital document security.*

</div>

---

## 📑 Table of Contents

- [🌟 Why DocToolz?](#-why-doctoolz)
- [🛡️ 100% Client-Side Privacy Guarantee](#️-100-client-side-privacy-guarantee)
- [🧭 Modern UI & Quick Tool Navigation](#-modern-ui--quick-tool-navigation)
- [🛠️ The 20 Core Tools by Category](#️-the-20-core-tools-by-category)
  - [Category 1: Exam & Student Form Essentials](#-category-1-exam--student-form-essentials)
  - [Category 2: Advanced PDF Suite](#-category-2-advanced-pdf-suite)
  - [Category 3: Document Safety & Privacy](#-category-3-document-safety--privacy)
  - [Category 4: Image, Photo & Productivity Utilities](#-category-4-image-photo--productivity-utilities)
- [🎨 UI & Experience (Bilingual & Dark Mode)](#-ui--experience-bilingual--dark-mode)
- [💻 Tech Stack & Architecture](#-tech-stack--architecture)
- [🚀 Local Development Setup](#-local-development-setup)
- [🧪 Comprehensive QA & Verification Test Suite](#-comprehensive-qa--verification-test-suite)
- [📦 GitHub Pages Deployment](#-github-pages-deployment)
- [👤 Author & Credits](#-author--credits)
- [📄 License](#-license)

---

## 🌟 Why DocToolz?

When applying for government recruitment portals, university admissions, and visa applications (e.g., SSC, UPSC, NTA, IBPS, US Visa, OCI), candidates encounter stringent requirements:
- *"Photo must be strictly between 20 KB and 50 KB in JPEG format."*
- *"Photo must meet minimum file size limit (rejected if under 20 KB)."*
- *"Dimensions must be exactly 3.5 cm × 4.5 cm with 200 / 300 DPI resolution."*
- *"Calculate exact age as on 01-08-2025 with category relaxation."*
- *"Combined photo and signature in a single file under 100 KB."*
- *"Convert CBSE CGPA (×9.5) to percentage and marks division."*
- *"Protect documents with security watermarks to prevent identity theft."*

Most online converter tools upload your confidential documents (Aadhaar cards, signatures, marksheet PDFs) to external remote servers, risking data leaks.

**DocToolz solves this problem completely.** Built with HTML5 Canvas, WebAssembly, and Pure JavaScript, every compression, background removal, DPI injection, PDF merge/split, and password encryption happens **100% locally in your browser memory**.

---

## 🛡️ 100% Client-Side Privacy Guarantee

| Security Dimension | Traditional Online Converters | DocToolz ⚡ |
|---|---|---|
| **Server Uploads** | ❌ Files sent to external third-party servers | ✅ **Zero server uploads (100% in-browser memory)** |
| **Privacy & Leak Risk** | ❌ Risk of identity and document leaks | ✅ **Zero telemetry, zero file retention** |
| **Network Speed** | ❌ Dependent on upload/download bandwidth | ✅ **Instant canvas processing (sub-second speeds)** |
| **Offline Capability** | ❌ Fails without active internet | ✅ **Works completely offline once loaded** |
| **Hosting Cost** | ❌ Expensive cloud storage & API costs | ✅ **₹0 Hosting (Hosted on GitHub Pages)** |

---

## 🧭 Modern UI & Quick Tool Navigation

1. **Senior-Grade Category Filter Tabs**:
   - 🌟 **All Tools** (20 Tools)
   - 🖼️ **Image & Photo** (8 Tools)
   - 📄 **PDF Tools** (6 Tools)
   - 🎓 **Exam & Students** (8 Tools)
   - 🛡️ **Privacy & Safety** (5 Tools)
2. **Instant Search Bar**: Filter tools by keywords (e.g. *50KB, Passport, Age, Watermark, QR, Split*).
3. **⚡ Quick Tool Switcher (`ToolSwitcherModal`)**: 
   - Available on every page in the top navbar and tool header.
   - Switch between any of the 20 tools in 1 click without going back to Home!

---

## 🛠️ The 20 Core Tools by Category

### 🎓 Category 1: Exam & Student Form Essentials

| Tool Name | Key Capabilities | Technical Engine |
|---|---|---|
| **1. Increase Photo Size to Exact KB** | Safely increase JPG/PNG file size to meet minimum portal limits (e.g. 20KB, 50KB, 100KB) without altering image resolution or visual quality. | JPEG COM marker & PNG tEXt padding |
| **2. Exam Age & Cut-off Date Calculator** | Calculate exact age in years, months, days on official exam cut-off dates. Includes category age relaxation (OBC +3y, SC/ST +5y, PwD +10y) and eligibility checks for SSC, UPSC, IBPS, NDA, RRB. | Date difference & relaxation engine |
| **3. CGPA to % & Marks Calculator** | Convert CBSE (×9.5), AICTE `((CGPA - 0.75) * 10)`, Mumbai Uni, or custom CGPA to percentage. Includes total marks to division (Distinction, 1st, 2nd, 3rd) and grade. | Math & Board Formula Registry |
| **4. Digital Signature Pad & Maker** | Draw digital signature with touch or mouse. Fine, medium, bold thickness, black/blue/red pen ink. Export crisp signatures with 100% transparent PNG background or white card. | HTML5 Canvas Touch & Pen API |

---

### 📄 Category 2: Advanced PDF Suite

| Tool Name | Key Capabilities | Technical Engine |
|---|---|---|
| **5. Compress PDF to Target KB** | Shrink marksheets, caste certificates, and documents under strict upload limits (<100KB, <200KB, <500KB) directly in your browser. | `pdfjs-dist` + Canvas + `pdf-lib` |
| **6. Merge Multiple PDFs into One** | Combine multiple PDF files (admit cards, marksheets, certificates) into a single document with drag-and-drop page reordering. | `pdf-lib` stream merging |
| **7. Split & Extract PDF Pages** | Select individual pages or custom ranges (e.g. 1-3, 5, odd/even pages) from large PDF files and export them into a new lightweight PDF. | `pdf-lib` page slicing |
| **8. PDF Password Protect & Encrypt** | Secure sensitive documents and marksheets with military-grade 128-bit AES password encryption directly in browser. | `@pdfsmaller/pdf-encrypt` AES-256/128 |
| **9. Photo to PDF Converter** | Convert single or multiple images (JPG, PNG, WebP) into a compact PDF with orientation and margin controls. | `pdf-lib` pure JS engine |
| **10. PDF to Photo (JPG / PNG)** | Extract high-definition pages from PDF files at 150 DPI or 300 DPI print quality. Download individual pages or entire documents. | Mozilla `pdfjs-dist` Canvas Renderer |

---

### 🛡️ Category 3: Document Safety & Privacy

| Tool Name | Key Capabilities | Technical Engine |
|---|---|---|
| **11. Document Misuse Prevention Watermark** | Stamp custom diagonal security watermarks (e.g. *"Only for SSC CGL 2026"*, *"Self Attested Copy - Do Not Misuse"*) with adjustable opacity across Aadhaar or PAN. | Canvas 2D Text Stamping with Opacity |
| **12. Sensitive Data Redactor & Masker** | Blackout box, pixelate mosaic, or blur private information (Aadhaar numbers, phone, signatures, QR codes) before sharing documents online. | Canvas Pixel Manipulation & Box Blur |
| **13. OCR Image to Text (Hindi & English)** | Extract printed text from images and documents in Hindi, English, or bilingual text without sending any data to external servers. | `tesseract.js` WebAssembly Worker |

---

### 🖼️ Category 4: Image, Photo & Productivity Utilities

| Tool Name | Key Capabilities | Technical Engine |
|---|---|---|
| **14. Compress Image to Exact KB** | Reduce photo size to exactly 20KB, 50KB, 100KB, or custom KB. Multi-unit dimension controls (`px`, `cm`, `mm`, `in`), aspect ratio lock, and JPG/PNG/WebP format options. | HTML5 Canvas + Adaptive Binary Search |
| **15. Passport Photo & Print Sheet Maker** | Official 3.5×4.5 cm (India/UK) and 2×2 inch (US Visa) formats. Dynamic background color replacement, custom KB targets, and 1-click **4×6 / A4 Print Sheet Generator** (4, 6, 8, 12 photos). | Canvas Coordinate Transformation + 300 DPI Export |
| **16. Signature Resizer & Cleaner** | Resize signatures to any custom KB (10KB, 12KB, 15KB, 16KB, etc.). Auto-remove paper shadows, phone camera tints, and enhance black ink lines. | Canvas Luminance Binarization Filter |
| **17. Custom Size, DPI & Bit Depth** | Resize in Pixels, CM, MM, Inches. Embeds official **200 / 300 DPI JFIF headers** and converts to 24-bit RGB, 8-bit Grayscale, or 1-bit B/W. | Binary JFIF APP0 Segment Injection |
| **18. Photo & Signature Merger** | Combine candidate photo and signature into a clean vertical composite card under custom target KB and JPG, PNG, or WebP format. | Canvas Multi-layer Composite |
| **19. QR Code Generator & Camera Scanner** | Generate custom QR codes for UPI payments, Wi-Fi, URLs, and text. Scan QR codes from image files or directly from your device camera. | `qrcode` + `jsQR` (Pure JS) |
| **20. Image Cropper & Circle Cut** | Crop photos with standard aspect ratios (1:1, 3:4, 16:9) or circular avatar cuts with transparent corners for official portal profile photos. | Canvas Clipping & Geometric Transform |

---

## 🎨 UI & Experience (Bilingual & Dark Mode)

- **🌐 Instant Bilingual Toggle**: Complete interface available in both **English** and **हिंदी (Hindi)**. All tool descriptions, buttons, tooltips, and badges toggle seamlessly without page reload.
- **🌙 Dark & Light Mode**: Built with Tailwind CSS v4 class-based theming. Detects system theme preference automatically and saves the user's manual choice in `localStorage`.
- **📱 Fully Responsive**: Fluid, mobile-first design adapted for mobile phones, tablets, and large desktop screens.
- **⚡ Zero Clutter**: Clean, accessible layout inspired by modern design principles.

---

## 💻 Tech Stack & Architecture

- **Core Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS v4 with `@custom-variant dark`
- **Iconography**: Lucide React
- **PDF Processing**: `pdf-lib`, `pdfjs-dist`, `@pdfsmaller/pdf-encrypt`, `@pdfsmaller/pdf-decrypt`
- **Computer Vision & OCR**: `tesseract.js`, `jsqr`, `qrcode`

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/chandan-itian/doctoolz.git
cd doctoolz

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Run automated test suite
node scripts/test-all-tools.mjs
```

Open `http://localhost:5173/doctoolz/` in your browser.

---

## 🧪 Comprehensive QA & Verification Test Suite

DocToolz includes an automated Node.js test suite to verify every engine:

```bash
node scripts/test-all-tools.mjs
```

**Verification Results:**
- ✅ `TEST 1: JPEG File Size Increaser to 50KB` (SOI `0xFFD8`, APP0 `0xFFE0`, COM padding)
- ✅ `TEST 2: PNG File Size Increaser to 40KB` (PNG magic byte, tEXt chunk, valid CRC32)
- ✅ `TEST 3: Cut-off Date Age Calculator & Eligibility` (Years, months, days, OBC +3y relaxation)
- ✅ `TEST 4: CGPA & Marks Percentage Calculations` (CBSE 8.4 = 79.8%, AICTE, Marks to Division)
- ✅ `TEST 5: PDF Merger (Combine Multiple PDFs)` (Combines multiple documents into 1 PDF)
- ✅ `TEST 6: PDF Splitter (Extract Specific Pages)` (Extracts chosen page indices)
- ✅ `TEST 7: PDF Password Encryption (128-bit AES)` (Protects & unlocks PDF with password)
- ✅ `TEST 8: QR Generator & UPI / Wi-Fi Helpers` (UPI pay format, Wi-Fi string, Data URL)

---

## 📦 GitHub Pages Deployment

The project is deployed to GitHub Pages via the `gh-pages` branch with `.nojekyll` enabled:

```bash
# Build production bundle and deploy to gh-pages branch
npm run deploy
```

- **Production URL**: [https://chandan-itian.github.io/doctoolz/](https://chandan-itian.github.io/doctoolz/)

---

## 👤 Author & Credits

- **Creator & Developer**: **Chandan Raj**
- **GitHub**: [@chandan-itian](https://github.com/chandan-itian)
- **Live Project**: [DocToolz on GitHub Pages](https://chandan-itian.github.io/doctoolz/)

<div align="center">
  <sub>Made with ❤️ by <b>Chandan Raj</b></sub>
</div>

---

## 📄 License

This project is licensed under the **MIT License** — free for personal, educational, and commercial use.
