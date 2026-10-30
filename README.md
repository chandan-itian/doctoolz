# DocToolz ⚡
> **All-in-One Client-Side Image, Passport Photo & PDF Productivity Suite**  
> *Inspired by PI7.org & built for Indian competitive exam forms, official paperwork, and creators.*

![DocToolz License](https://img.shields.io/badge/License-MIT-blue.svg)
![Build](https://img.shields.io/badge/Build-Passing-emerald.svg)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green.svg)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-indigo.svg)

---

## 🌟 Overview & Key Features

DocToolz is a lightweight, mobile-responsive, and modern web productivity platform designed to solve the everyday frustrations of resizing photos, formatting passport pictures, modifying DPI, converting PDFs, and extracting text from images.

### 🛡️ 100% Client-Side Privacy (Zero Server Uploads)
Unlike typical online converter websites, **DocToolz runs 100% in your browser's local memory**:
- Sensitive documents (Aadhaar, PAN, Passports, Signatures) **never upload to any server**.
- Works offline as a static Progressive Web App.
- **₹0 Server Hosting Cost**: Hosted 100% free on **GitHub Pages**.

### 🌐 Bilingual & Dual Theme Support
- **Dual Language**: Seamless instant toggle between **English** and **Hindi (हिंदी)** across all tools, labels, and guides.
- **Dark & Light Mode**: Auto-detects system preference with a clean manual toggle saved to `localStorage`.
- **Fully Responsive**: Optimized for both small mobile screens and large desktop monitors.

---

## 🛠️ The 8 Core Tools

| # | Tool Name | Description & Presets | Technical Engine |
|---|---|---|---|
| **1** | **Compress Image to Exact KB** | Compress photos strictly under 20KB, 50KB, 100KB, or custom KB. Live reduction % preview. | HTML5 Canvas + Adaptive Binary Search |
| **2** | **Passport Photo & Print Sheet Maker** | Official 3.5×4.5 cm (India/UK) and 2×2 inch (US Visa) formats. Background color changer, 1px border, and 1-click **4×6 / A4 Print Sheet Generator** (4, 6, 8, 12 photos). | Canvas Coordinate Transformation + 300 DPI Export |
| **3** | **Signature Resizer & Cleaner** | Formats signatures to 10KB–20KB (140×60 px / 200×100 px). Features a **Signature Cleaner Filter** that removes paper shadows and produces crisp black ink lines. | Canvas Luminance Binarization Filter |
| **4** | **Custom Size, DPI & Bit Depth** | Resize in Pixels, CM, MM, Inches. Embeds official **200 / 300 DPI JFIF headers** and converts to 24-bit RGB, 8-bit Grayscale, or 1-bit B/W. | Binary JFIF APP0 Segment Injection |
| **5** | **Photo & Signature Merger (DOP)** | Combines Candidate Photo + Candidate Name + Date of Photo (DOP) + Signature into a single composite card under 50KB/100KB for state & central exams. | Canvas Multi-layer Composite |
| **6** | **Photo to PDF Converter** | Combine single or multiple JPG/PNG/WebP images into a compact PDF. Set A4/Letter size, portrait/landscape, and custom margins. | `pdf-lib` Pure JS Engine |
| **7** | **PDF to Photo (JPG / PNG)** | Extract high-definition pages from PDF documents at 150 DPI or 300 DPI print quality. Download individual pages or all pages. | Mozilla `pdfjs-dist` Canvas Renderer |
| **8** | **OCR Image to Text (Hindi & English)** | Extract printed text from documents in Hindi, English, or bilingual text without sending data to third parties. | `tesseract.js` WebAssembly Worker |

---

## 🚀 Local Development

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/doctoolz.git
cd doctoolz

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated test suite
node scripts/test-tools.mjs

# 5. Build production bundle
npm run build
```

---

## 📦 Deploying to GitHub Pages (Free & Automatic)

This repository includes a ready-to-run GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of DocToolz"
   git branch -M main
   git remote add origin https://github.com/<your-username>/doctoolz.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. That's it! GitHub will automatically build and deploy your site to:
   `https://<your-username>.github.io/doctoolz/`

---

## 🧪 Testing & Verification

Run the built-in automated test suite:
```bash
node scripts/test-tools.mjs
```
Verifies:
- JPEG SOI and JFIF APP0 header injection for 200 DPI and 300 DPI metadata.
- PDF generation and dimension calculations via `pdf-lib`.

---

## 📄 License
MIT License. Free for personal, commercial, and educational use.
