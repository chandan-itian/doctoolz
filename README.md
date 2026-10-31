<div align="center">

# ⚡ DocToolz

### All-in-One Client-Side Image, Passport Photo & PDF Productivity Suite
**Superfast • 100% Private (Zero Server Uploads) • Bilingual (हिंदी / English) • Offline-Ready**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-chandan--itian.github.io%2Fdoctoolz-00C781?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chandan-itian.github.io/doctoolz/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chandan-itian/doctoolz)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/chandan-itian/doctoolz)
[![Privacy Guarantee](https://img.shields.io/badge/Privacy-100%25%20Client--Side-success?style=for-the-badge&logo=shield&logoColor=white)](#-100-client-side-privacy-guarantee)

---

### [👉 🚀 Open DocToolz Live in Browser](https://chandan-itian.github.io/doctoolz/) 👈

*Designed for Indian government exams (SSC, UPSC, IBPS, State PSCs), job portals, visa applications, and daily digital productivity.*

</div>

---

## 📑 Table of Contents

- [🌟 Why DocToolz?](#-why-doctoolz)
- [🛡️ 100% Client-Side Privacy Guarantee](#️-100-client-side-privacy-guarantee)
- [🛠️ Detailed Tool Suite (8 Core Tools)](#️-detailed-tool-suite-8-core-tools)
  - [1. Compress Image to Exact KB](#1-compress-image-to-exact-kb)
  - [2. Passport Photo & Print Sheet Maker](#2-passport-photo--print-sheet-maker)
  - [3. Signature Resizer & Cleaner](#3-signature-resizer--cleaner)
  - [4. Custom Dimension, DPI & Bit Depth](#4-custom-dimension-dpi--bit-depth)
  - [5. Photo & Signature Merger](#5-photo--signature-merger)
  - [6. Photo to PDF Converter](#6-photo-to-pdf-converter)
  - [7. PDF to Photo (JPG / PNG)](#7-pdf-to-photo-jpg--png)
  - [8. OCR Image to Text (Hindi + English)](#8-ocr-image-to-text-hindi--english)
- [🎨 UI & Experience (Bilingual & Dark Mode)](#-ui--experience-bilingual--dark-mode)
- [💻 Tech Stack & Architecture](#-tech-stack--architecture)
- [🚀 Local Development Setup](#-local-development-setup)
- [🧪 Automated Verification Suite](#-automated-verification-suite)
- [📦 GitHub Pages Deployment](#-github-pages-deployment)
- [👤 Author & Credits](#-author--credits)
- [📄 License](#-license)

---

## 🌟 Why DocToolz?

When applying for government recruitment portals, university admissions, and visa portals (e.g., SSC, UPSC, NTA, IBPS, US Visa, OCI), candidates encounter stringent photo and signature requirements:
- *"Photo must be strictly between 20 KB and 50 KB in JPEG format."*
- *"Dimensions must be exactly 3.5 cm × 4.5 cm with 200 / 300 DPI resolution."*
- *"Signature must be under 20 KB with a clean white background and black ink."*
- *"Combined photo and signature in a single file under 100 KB."*

Most online tools upload your confidential documents (Aadhaar cards, signatures, passport photos) to remote servers, risk data leakage, or compromise image clarity.

**DocToolz solves this problem completely.** Built with HTML5 Canvas, WebAssembly, and Pure JavaScript, every compression, background removal, DPI injection, and PDF render happens **locally in your browser**.

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

## 🛠️ Detailed Tool Suite (8 Core Tools)

### 1. Compress Image to Exact KB
- **Smart Adaptive Compression**: Uses binary search optimization to hit exact target sizes (e.g., 20 KB, 50 KB, 100 KB, or any custom value).
- **Custom Dimension Controls**: Resize dimensions in **Pixels (`px`)**, **Centimeters (`cm`)**, **Millimeters (`mm`)**, or **Inches (`in`)**.
- **Aspect Ratio Lock**: Seamless toggle to preserve or freely customize width and height.
- **Multi-Format Export**: Download in **JPEG**, **PNG**, or **WebP** formats with a live reduction percentage preview.

### 2. Passport Photo & Print Sheet Maker
- **Standard International Presets**:
  - **India / UK / Schengen**: `3.5 cm × 4.5 cm` (300 DPI)
  - **US Visa / OCI / Passport**: `2.0 in × 2.0 in` (300 DPI)
  - **Custom Size**: User-defined dimensions.
- **Smart Background Replacement**: Client-side floodfill & edge-color masking replaces backgrounds without remote AI API dependencies.
- **Interactive Color Palette**: White, light blue, gray presets, plus a full **Hex / Color Picker** (`<input type="color">`) with sensitivity threshold slider.
- **1-Click Print Sheet Maker**: Generate **4, 6, 8, or 12 photo grids** on standard **4×6 inch** or **A4** sheets with clean cut lines.
- **Custom Output Size & Format**: Define exact target file size in KB and download in **JPEG** or **PNG**.

### 3. Signature Resizer & Cleaner
- **Exam Standard Presets**: Preset dimensions for official portals (`140×60 px`, `200×100 px`, or custom dimensions).
- **Custom Target Size**: Choose any custom target KB (e.g., `10 KB`, `12 KB`, `15 KB`, `16 KB`, `20 KB`).
- **Signature Cleaner Filter**: Converts gray, shadowed paper photos into crisp black ink on a pure white background with adjustable contrast and brightness.
- **Format Toggle**: Choose between **JPEG** and **PNG** output.

### 4. Custom Dimension, DPI & Bit Depth
- **Multi-Unit Precision**: Convert images in `px`, `cm`, `mm`, or `inches` with auto-aspect calculation.
- **True JFIF DPI Binary Injection**: Injects genuine **200 DPI** or **300 DPI** headers into the binary APP0 marker of JPEG files.
- **Bit Depth Conversion**:
  - **24-bit True Color (RGB)**
  - **8-bit Grayscale** (256 shades of gray)
  - **1-bit Monochrome (B/W)** (strict thresholding)

### 5. Photo & Signature Merger
- **Candidate Submission Ready**: Stacks Candidate Photograph above Candidate Signature in a clean vertical alignment.
- **Custom Target Size**: Target combined file size in KB (e.g., `50 KB`, `100 KB`).
- **Multi-Format Export**: Download in **JPEG**, **PNG**, or **WebP**.
- **Clean Layout**: Streamlined composite without redundant date or name banners.

### 6. Photo to PDF Converter
- **Multi-Image Support**: Merge single or multiple photos (JPG, PNG, WebP) into a clean, compact PDF.
- **Page Layout Customization**: Select between **A4** and **US Letter** page sizes, **Portrait** or **Landscape** orientation.
- **Margin Controls**: Adjust page padding (None, Small, Normal).
- **Pure JavaScript**: Powered by `pdf-lib` without any backend server.

### 7. PDF to Photo (JPG / PNG)
- **High-Resolution Page Extraction**: Convert multi-page PDF documents into sharp images.
- **DPI Options**: Choose between standard web resolution (**150 DPI**) or high-definition print quality (**300 DPI**).
- **Selective Downloads**: Download individual extracted pages or export all pages simultaneously in **JPEG** or **PNG**.
- **Mozilla `pdfjs-dist`**: Safe, sandboxed in-browser rendering.

### 8. OCR Image to Text (Hindi + English)
- **Bilingual Optical Character Recognition**: Extract printed text from documents, letters, forms, and books.
- **Supported Languages**: **Hindi (हिंदी)** and **English (eng)**.
- **100% Private**: Powered by `tesseract.js` running in a local WebAssembly Web Worker.
- **One-Click Actions**: Live editable text area with one-click **Copy to Clipboard** and **Download as .txt**.

---

## 🎨 UI & Experience (Bilingual & Dark Mode)

- **🌐 Instant Bilingual Toggle**: Complete interface available in both **English** and **हिंदी (Hindi)**. All tool descriptions, buttons, tooltips, and badges toggle seamlessly without page reload.
- **🌙 Dark & Light Mode**: Built with Tailwind CSS v4 class-based theming. Detects system theme preference automatically and saves the user's manual choice in `localStorage`.
- **📱 Fully Responsive**: Fluid, mobile-first design adapted for mobile phones, tablets, and large desktop screens.
- **⚡ Zero Clutter**: Clean, accessible layout inspired by modern design principles.

---

## 💻 Tech Stack & Architecture

```
docToolz/
├── src/
│   ├── components/
│   │   ├── common/        # Header, Footer, Navbar, Language/Theme Toggles
│   │   ├── home/          # Hero banner, tool grid view, quick search
│   │   └── tools/         # 8 Dedicated Tool Components
│   ├── utils/
│   │   ├── imageCompressor.ts      # Canvas adaptive binary search engine
│   │   ├── backgroundReplacer.ts   # Edge floodfill & color distance masker
│   │   ├── dpiModifier.ts          # JFIF APP0 binary injection (200/300 DPI)
│   │   ├── bitDepthConverter.ts    # 24-bit, 8-bit, 1-bit pixel transformers
│   │   ├── pdfTools.ts             # Client-side PDF generation (pdf-lib)
│   │   ├── pdfRenderer.ts          # PDF to Image rendering (pdfjs-dist)
│   │   └── ocrEngine.ts            # WebAssembly OCR (tesseract.js)
│   ├── index.css          # Tailwind CSS v4 with custom dark mode variants
│   └── App.tsx            # Main application router and state container
```

- **Core Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS v4 with `@custom-variant dark`
- **Iconography**: Lucide React
- **Document Processing**: `pdf-lib`, `pdfjs-dist`, `tesseract.js`

---

## 🚀 Local Development Setup

Clone and run DocToolz locally in just a few steps:

```bash
# 1. Clone the repository
git clone https://github.com/chandan-itian/doctoolz.git
cd doctoolz

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173/doctoolz/` in your browser.

---

## 🧪 Automated Verification Suite

DocToolz includes an automated Node.js test suite to verify binary JFIF headers and PDF generation:

```bash
node scripts/test-tools.mjs
```

**Verification Results:**
- ✅ `TEST 1: Injects 200 DPI JFIF Header` (SOI `0xFFD8`, APP0 `0xFFE0`, Density `0x00C8`)
- ✅ `TEST 2: Injects 300 DPI JFIF Header` (Density `0x012C`)
- ✅ `TEST 3: Generates Valid PDF via pdf-lib` (A4 standard dimensions `595.28 × 841.89`)
- ✅ `TEST 4: Binary Search Compression Quality Scale`
- ✅ `TEST 5: Grayscale & B/W Pixel Transform Math`
- ✅ `TEST 6: Passport Print Sheet Grid Calculations`

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

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it for personal, educational, or commercial purposes.
