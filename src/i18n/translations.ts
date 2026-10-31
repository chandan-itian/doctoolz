export type Language = 'en' | 'hi';

export const translations = {
  en: {
    brand: 'DocToolz',
    tagline: 'All-in-One Image, Passport & PDF Productivity Suite',
    privacyBadge: '100% Private & Client-Side (No Files Leave Your Device)',
    searchPlaceholder: 'Search any tool (e.g. 50KB, Passport, PDF, Age, Watermark, QR)...',
    popularTags: ['UPSC / SSC 50KB', 'Passport 3.5×4.5cm', 'Age Calculator', 'Merge PDF', 'Watermark', 'QR Code'],
    backToAllTools: '← Back to All Tools',
    switchTool: '⚡ Switch Tool',
    searchTool: 'Search tool or feature...',
    quickJump: 'Quick Jump',
    dropzoneText: 'Drag & drop your file here, or',
    browseFiles: 'Browse Files',
    pasteSupport: 'or press Ctrl+V to paste an image',
    sampleImage: 'Try Sample Demo Image',
    downloadResult: 'Download Output',
    processAnother: 'Process Another File',
    originalSize: 'Original Size',
    newSize: 'New Size',
    dimensions: 'Dimensions',
    format: 'Format',
    quality: 'Quality',
    processing: 'Processing in browser...',
    successCelebration: 'Success! Your file is ready.',

    // Categories
    categories: {
      all: 'All Tools',
      image: 'Image & Photo',
      pdf: 'PDF Tools',
      exam: 'Exam & Students',
      privacy: 'Privacy & Safety',
    },

    // Tools List
    tools: {
      compressor: {
        name: 'Compress Image to Exact KB',
        desc: 'Reduce photo size to exactly 20KB, 50KB, 100KB, or custom KB for government exam portals without losing clarity. Download in JPG, PNG, or WebP.',
        badge: 'Top Exam Tool',
      },
      passport: {
        name: 'Passport Photo & Print Sheet Maker',
        desc: 'Create official 3.5×4.5 cm (India/UK) and 2×2 inch (US Visa) photos with custom background colors, KB targets, and printable 4×6 / A4 sheets.',
        badge: 'High Demand',
      },
      signature: {
        name: 'Signature Resizer & B/W Cleaner',
        desc: 'Resize signatures to any custom KB (10KB, 12KB, 15KB, 16KB, etc.). Auto-remove paper shadows and enhance black ink lines.',
        badge: 'Custom KB',
      },
      dimensionDpi: {
        name: 'Custom Size, DPI & Bit Depth',
        desc: 'Resize in Pixels, CM, MM, Inches. Embed exact 200/300 DPI metadata and convert to 24-bit RGB, 8-bit Grayscale, or 1-bit B/W.',
        badge: '300 DPI Header',
      },
      photoSignMerge: {
        name: 'Photo & Signature Merger',
        desc: 'Combine candidate photo and signature into a clean vertical card with custom target KB and JPG, PNG, or WebP format.',
        badge: 'Govt Form Card',
      },
      photoToPdf: {
        name: 'Photo to PDF Converter',
        desc: 'Convert single or multiple images into a compact PDF. Set page orientation, margins, and target file size under 200KB/500KB.',
        badge: 'Multi-Image',
      },
      pdfToPhoto: {
        name: 'PDF to Photo (JPG / PNG)',
        desc: 'Extract high-definition pages from PDF files at 150 or 300 DPI. Download individual pages or entire documents.',
        badge: 'High-Res 300 DPI',
      },
      ocr: {
        name: 'OCR Image to Text (Hindi & English)',
        desc: 'Extract printed text from images and documents in Hindi, English, or bilingual text with 100% in-browser WebAssembly.',
        badge: 'Hindi + English',
      },
      // New Tools
      sizeIncreaser: {
        name: 'Increase Photo Size to Exact KB',
        desc: 'Safely increase JPG/PNG file size to meet minimum portal limits (e.g., 20KB, 50KB, 100KB) without altering image resolution or quality.',
        badge: 'Exam Minimum KB',
      },
      ageCalculator: {
        name: 'Exam Age & Cut-off Date Calculator',
        desc: 'Calculate exact age in years, months, days on official exam cut-off dates. Includes category age relaxation and eligibility checker.',
        badge: 'SSC / UPSC / IBPS',
      },
      cgpaCalculator: {
        name: 'CGPA to Percentage & Marks Calculator',
        desc: 'Convert CBSE (×9.5), AICTE, Mumbai University, or VTU CGPA to percentage. Includes total marks to division and grade calculator.',
        badge: 'CBSE & AICTE',
      },
      signaturePad: {
        name: 'Digital Signature Pad & Maker',
        desc: 'Draw signatures directly on screen with touch or mouse. Export crisp signatures with 100% transparent PNG background or white card.',
        badge: 'Transparent PNG',
      },
      pdfCompressor: {
        name: 'Compress PDF to Target KB',
        desc: 'Shrink marksheets, caste certificates, and documents under strict upload limits (<100KB, <200KB, <500KB) 100% in browser.',
        badge: 'Under 100KB',
      },
      pdfMerger: {
        name: 'Merge Multiple PDFs into One',
        desc: 'Combine multiple PDF files (admit cards, marksheets, certificates) into a single document with drag-and-drop page reordering.',
        badge: 'Zero Uploads',
      },
      pdfSplitter: {
        name: 'Split & Extract PDF Pages',
        desc: 'Select individual pages or custom ranges (e.g. 1-3, 5) from large PDF files and export them into a new lightweight PDF.',
        badge: 'Page Extractor',
      },
      pdfPassword: {
        name: 'PDF Password Protect & Encrypt',
        desc: 'Secure sensitive documents and marksheets with military-grade 128-bit AES password encryption directly in your browser.',
        badge: '128-bit AES',
      },
      watermarkStamper: {
        name: 'Document Misuse Prevention Watermark',
        desc: 'Stamp custom diagonal security watermarks (e.g. "Only for SSC CGL 2026", "Do Not Misuse") with adjustable opacity across Aadhaar or PAN.',
        badge: 'Identity Safety',
      },
      documentRedactor: {
        name: 'Sensitive Data Redactor & Masker',
        desc: 'Blackout, pixelate, or blur private information (Aadhaar numbers, phone, signatures, QR codes) before sharing documents online.',
        badge: 'Mask Private Info',
      },
      qrTools: {
        name: 'QR Code Generator & Camera Scanner',
        desc: 'Generate custom QR codes for UPI payment, Wi-Fi, URLs, and text. Scan QR codes from image files or directly from your device camera.',
        badge: 'Generator + Scanner',
      },
      imageCropper: {
        name: 'Image Cropper & Circle Cut',
        desc: 'Crop photos with standard aspect ratios (1:1, 3:4, 16:9) or circular avatar cuts with transparent corners for official portal profile photos.',
        badge: 'Circle & Aspect Crop',
      },
    },

    // Compressor Specific
    compressorTab: {
      targetKbLabel: 'Target File Size (KB)',
      commonPresets: 'Quick Presets:',
      reduceBy: 'Reduced by',
      saved: 'Saved',
    },

    // Passport Specific
    passportTab: {
      standardPreset: 'Select Standard Preset:',
      indiaPassport: 'India Passport / PAN / Driving License (3.5 × 4.5 cm)',
      usVisa: 'US Visa / OCI / DS-160 (2 × 2 inches / 600×600 px)',
      custom: 'Custom Aspect Ratio',
      bgColor: 'Select Background Color:',
      white: 'White',
      lightBlue: 'Light Blue',
      navyBlue: 'Navy Blue',
      lightGray: 'Light Gray',
      addBorder: 'Add 1px Black Border (Official Passport Standard)',
      generateSheet: 'Printable Photo Sheet (4x6 / A4):',
      sheetCount: 'Photos per sheet:',
      singlePhoto: 'Single Photo Only',
      sheet4: '4 Photos (4×6 inch paper)',
      sheet8: '8 Photos (4×6 inch paper)',
      sheet12: '12 Photos (A4 paper)',
    },

    // Signature Specific
    signatureTab: {
      cleanMode: 'Signature Cleaner Filter:',
      cleanModeDesc: 'Removes paper shadows and camera noise to produce crisp black & white ink',
      targetSize: 'Target Size:',
      dimensions: 'Standard Dimensions:',
    },

    // Dimension & DPI Specific
    dpiTab: {
      unit: 'Unit:',
      pixels: 'Pixels (px)',
      cm: 'Centimeters (cm)',
      mm: 'Millimeters (mm)',
      inches: 'Inches (in)',
      dpiLabel: 'DPI (Dots Per Inch):',
      dpiHint: 'Government portals verify DPI headers (300 DPI recommended for official forms)',
      bitDepth: 'Color & Bit Depth:',
      color24: '24-bit True Color (RGB)',
      gray8: '8-bit Grayscale',
      bw1: '1-bit Monochrome (B/W)',
    },

    // Photo & Sign Merger
    mergerTab: {
      uploadPhoto: 'Upload Candidate Photo',
      uploadSign: 'Upload Candidate Signature',
      candidateName: 'Candidate Full Name:',
      namePlaceholder: 'e.g. RAHUL SHARMA',
      dop: 'Date of Photo (DOP):',
      dopPlaceholder: 'e.g. 25-10-2026',
      targetSize: 'Target Combined Size:',
    },

    // PDF to Photo
    pdfToPhotoTab: {
      renderDpi: 'Image Resolution:',
      standardDpi: '150 DPI (Fast & Standard)',
      highDpi: '300 DPI (Ultra-Sharp Print Quality)',
      outputFormat: 'Output Format:',
      pagesFound: 'Total Pages Found:',
      downloadPage: 'Download This Page',
      downloadAll: 'Download All Pages',
    },

    // Photo to PDF
    photoToPdfTab: {
      pageSize: 'Page Size:',
      orientation: 'Orientation:',
      portrait: 'Portrait',
      landscape: 'Landscape',
      margin: 'Margin:',
      noMargin: 'No Margin (Full Page)',
      smallMargin: 'Small Margin',
      normalMargin: 'Normal Margin',
      addMoreImages: '+ Add More Photos',
    },

    // OCR
    ocrTab: {
      language: 'Recognition Language:',
      english: 'English',
      hindi: 'Hindi (हिंदी)',
      bilingual: 'Hindi + English Both (Bilingual)',
      extractButton: 'Extract Text',
      copyText: 'Copy Text',
      copied: 'Copied!',
      downloadTxt: 'Download as .TXT',
      confidence: 'Confidence:',
      wordsDetected: 'Total Words:',
      aiNoteTitle: 'Need to extract handwritten notes?',
      aiNoteDesc: 'DocToolz runs 100% offline Tesseract.js. For complex cursive handwriting, free Google Gemini API integration can be used.',
    },

    // Footer
    footer: {
      builtFor: 'Engineered for speed, privacy, and Indian competitive exams and digital documents.',
      privacyCommitment: 'Zero Server Uploads: All photo processing, compression, and PDF operations occur 100% in your browser.',
      rights: 'All rights reserved.',
      madeBy: 'Made with ❤️ by Chandan Raj',
    },
  },

  hi: {
    brand: 'DocToolz',
    tagline: 'ऑल-इन-वन इमेज, पासपोर्ट और पीडीएफ टूल्स सूट',
    privacyBadge: '100% प्राइवेट और क्लाइंट-साइड (आपकी फाइल्स आपके डिवाइस से बाहर नहीं जातीं)',
    searchPlaceholder: 'कोई भी टूल खोजें (जैसे: 50KB, पासपोर्ट, PDF, उम्र कैलकुलेटर, वाटरमार्क, QR)...',
    popularTags: ['UPSC / SSC 50KB', 'पासपोर्ट 3.5×4.5cm', 'उम्र कैलकुलेटर', 'PDF मर्ज', 'वाटरमार्क', 'QR कोड'],
    backToAllTools: '← सभी टूल्स पर वापस जाएं',
    switchTool: '⚡ टूल बदलें',
    searchTool: 'टूल या फ़ंक्शन खोजें...',
    quickJump: 'त्वरित नेविगेशन',
    dropzoneText: 'अपनी फाइल यहां ड्रैग और ड्रॉप करें, या',
    browseFiles: 'फ़ाइल चुनें',
    pasteSupport: 'या इमेज पेस्ट करने के लिए Ctrl+V दबाएं',
    sampleImage: 'सैंपल डेमो फोटो आज़माएं',
    downloadResult: 'डाउनलोड करें',
    processAnother: 'दूसरी फ़ाइल प्रोसेस करें',
    originalSize: 'मूल साइज',
    newSize: 'नया साइज',
    dimensions: 'डाइमेंशन (लंबाई×चौड़ाई)',
    format: 'फॉर्मेट',
    quality: 'क्वालिटी',
    processing: 'ब्राउज़र में प्रोसेस हो रहा है...',
    successCelebration: 'सफल! आपकी फ़ाइल तैयार है।',

    // Categories
    categories: {
      all: 'सभी टूल्स',
      image: 'इमेज एवं फ़ोटो',
      pdf: 'पीडीएफ टूल्स',
      exam: 'परीक्षा एवं छात्र',
      privacy: 'सुरक्षा एवं प्राइवेसी',
    },

    // Tools List
    tools: {
      compressor: {
        name: 'फोटो का साइज KB में कम करें',
        desc: 'सरकारी परीक्षा पोर्टल के लिए फोटो का साइज बिना क्वालिटी खोए ठीक 20KB, 50KB, 100KB या मनचाहे कस्टम KB में कंप्रेस करें। JPG, PNG या WebP में डाउनलोड करें।',
        badge: 'टॉप एग्जाम टूल',
      },
      passport: {
        name: 'पासपोर्ट साइज फोटो और प्रिंट शीट मेकर',
        desc: '3.5×4.5 सेमी (भारत/यूके) और 2×2 इंच (यूएस वीजा) फोटो बनाएं। बैकग्राउंड कलर, कस्टम KB और 4, 6, 8, 12 फोटो वाली 4×6 / A4 शीट तैयार करें।',
        badge: 'सर्वाधिक लोकप्रिय',
      },
      signature: {
        name: 'सिग्नेचर रीसाइज़र और B/W क्लीनर',
        desc: 'सिग्नेचर को मनचाहे कस्टम साइज (10KB, 12KB, 15KB, 16KB आदि) में रीसाइज करें। मोबाइल फोटो की परछाई हटाकर साफ़ काली स्याही बनाएं।',
        badge: 'कस्टम KB',
      },
      dimensionDpi: {
        name: 'कस्टम साइज, DPI और बिट डेप्थ',
        desc: 'पिक्सल, सेमी, मिमी, इंच में साइज बदलें। 200/300 DPI मेटाडेटा जोड़ें और 24-बिट RGB, 8-बिट ग्रेस्केल या 1-बिट B/W में कन्वर्ट करें।',
        badge: '300 DPI हेडर',
      },
      photoSignMerge: {
        name: 'फोटो और सिग्नेचर मर्ज करें',
        desc: 'उम्मीदवार की फोटो और सिग्नेचर को मनचाहे कस्टम KB साइज में एक ही कार्ड में मर्ज करें। JPG, PNG या WebP में डाउनलोड करें।',
        badge: 'सरकारी फॉर्म कार्ड',
      },
      photoToPdf: {
        name: 'फोटो से PDF बनाएं',
        desc: 'एक या अनेक फोटो को कॉम्पैक्ट PDF में बदलें। पेज ओरिएंटेशन, मार्जिन सेट करें और 200KB/500KB के अंदर फाइल बनाएं।',
        badge: 'मल्टी-इमेज',
      },
      pdfToPhoto: {
        name: 'PDF से फोटो निकालें (JPG / PNG)',
        desc: 'PDF फाइलों के पेजों को 150 या 300 DPI हाई-डेफिनिशन इमेज में निकालें। अलग-अलग पेज या सभी पेज डाउनलोड करें।',
        badge: 'हाई-रेज़ 300 DPI',
      },
      ocr: {
        name: 'OCR इमेज से टेक्स्ट निकालें (हिंदी और अंग्रेजी)',
        desc: 'इमेज और दस्तावेजों से हिंदी और अंग्रेजी टेक्स्ट को 100% ब्राउज़र में बिना किसी सर्वर या शुल्क के तुरंत निकालें।',
        badge: 'हिंदी + इंग्लिश',
      },
      // New Tools
      sizeIncreaser: {
        name: 'फोटो साइज KB में बढ़ाएं (Size Increaser)',
        desc: 'परीक्षा पोर्टल की न्यूनतम साइज सीमा (जैसे: कम से कम 20KB, 50KB) पूरा करने के लिए बिना क्वालिटी खोए सुरक्षित रूप से KB बढ़ाएं।',
        badge: 'न्यूनतम KB कोटा',
      },
      ageCalculator: {
        name: 'सरकारी परीक्षा आयु कैलकुलेटर',
        desc: 'परीक्षा कट-ऑफ तिथि पर अपनी सटीक आयु (वर्ष, माह, दिन) निकालें। श्रेणी अनुसार आयु छूट (OBC +3, SC/ST +5, PwD +10) और पात्रता जांचें।',
        badge: 'SSC / UPSC / IBPS',
      },
      cgpaCalculator: {
        name: 'CGPA से प्रतिशत एवं मार्क्स कैलकुलेटर',
        desc: 'CBSE (×9.5), AICTE, मुंबई यूनिवर्सिटी या VTU के CGPA को प्रतिशत में बदलें। कुल प्राप्तांक से डिवीज़न और ग्रेड की गणना करें।',
        badge: 'CBSE और AICTE',
      },
      signaturePad: {
        name: 'डिजिटल सिग्नेचर पैड और मेकर',
        desc: 'टचस्क्रीन या माउस से डिजिटल हस्ताक्षर बनाएं। 100% पारदर्शी (Transparent PNG) या सफेद बैकग्राउंड में मनचाहे KB में डाउनलोड करें।',
        badge: 'पारदर्शी PNG',
      },
      pdfCompressor: {
        name: 'PDF कंप्रेसर टू एग्जैक्ट KB',
        desc: 'मार्कशीट, जाति प्रमाण पत्र और दस्तावेजों को सरकारी पोर्टल लिमिट (<100KB, <200KB, <500KB) में 100% ब्राउज़र में कंप्रेस करें।',
        badge: '100KB के अंदर',
      },
      pdfMerger: {
        name: 'PDF मर्जर (अनेक PDF एक में जोड़ें)',
        desc: 'अलग-अलग एडमिट कार्ड, मार्कशीट और सर्टिफिकेट्स की PDF फाइलों को ड्रैग-एंड-ड्रॉप से एक सिंगल मास्टर PDF में जोड़ें।',
        badge: 'शून्य अपलोड',
      },
      pdfSplitter: {
        name: 'PDF स्प्लिटर एवं पेज एक्सट्रैक्टर',
        desc: 'बड़ी PDF में से अपनी पसंद के पेज (जैसे 1-3, 5) चुनकर अलग कॉम्पैक्ट PDF फाइल बनाएं।',
        badge: 'पेज अलग करें',
      },
      pdfPassword: {
        name: 'PDF पासवर्ड सुरक्षा एवं एन्क्रिप्शन',
        desc: 'संवेदनशील दस्तावेजों और मार्कशीट में 128-बिट AES सुरक्षित पासवर्ड लगाएं ताकि कोई बिना अनुमति न खोल सके।',
        badge: '128-bit AES',
      },
      watermarkStamper: {
        name: 'सुरक्षा वाटरमार्क जनरेटर',
        desc: 'आधार, पैन या मार्कशीट पर तिरछा सुरक्षा वाटरमार्क (उदा: "Only for SSC CGL 2026", "Do Not Misuse") लगाएं ताकि कोई गलत इस्तेमाल न कर सके।',
        badge: 'दस्तावेज़ सुरक्षा',
      },
      documentRedactor: {
        name: 'संवेदनशील डेटा ब्लर / मास्क टूल',
        desc: 'दस्तावेज़ ऑनलाइन शेयर करने से पहले आधार नंबर, मोबाइल, हस्ताक्षर या QR कोड पर काला बॉक्स या ब्लर मास्क लगाएं।',
        badge: 'निजी डेटा छिपाएं',
      },
      qrTools: {
        name: 'QR कोड जनरेटर एवं स्कैनर',
        desc: 'UPI पेमेंट, वाई-फ़ाई, वेबसाइट और टेक्स्ट का QR कोड बनाएं, या फोटो अपलोड व कैमरे से तुरंत QR स्कैन करें।',
        badge: 'जनरेटर + स्कैनर',
      },
      imageCropper: {
        name: 'इमेज क्रॉप एवं सर्कल कट',
        desc: 'फोटो को मनचाहे अनुपात (1:1, 3:4, 16:9) में क्रॉप करें या एडमिट कार्ड व प्रोफाइल के लिए गोल (Circular) काटकर पारदर्शी PNG बनाएं।',
        badge: 'सर्कल एवं अनुपात क्रॉप',
      },
    },

    // Compressor Specific
    compressorTab: {
      targetKbLabel: 'टारगेट फ़ाइल साइज (KB):',
      commonPresets: 'त्वरित प्रीसेट्स:',
      reduceBy: 'कमी हुई',
      saved: 'बचत',
    },

    // Passport Specific
    passportTab: {
      standardPreset: 'मानक प्रीसेट चुनें:',
      indiaPassport: 'भारतीय पासपोर्ट / पैन कार्ड / ड्राइविंग लाइसेंस (3.5 × 4.5 सेमी)',
      usVisa: 'यूएस वीजा / ओसीआई / DS-160 (2 × 2 इंच / 600×600 px)',
      custom: 'कस्टम अनुपात',
      bgColor: 'बैकग्राउंड कलर चुनें:',
      white: 'सफेद (White)',
      lightBlue: 'हल्का नीला (Light Blue)',
      navyBlue: 'गहरा नीला (Navy Blue)',
      lightGray: 'हल्का ग्रे (Light Gray)',
      addBorder: '1px काला बॉर्डर जोड़ें (ऑफिशियल पासपोर्ट मानक)',
      generateSheet: 'प्रिंटेबल फोटो शीट (4x6 / A4):',
      sheetCount: 'शीट पर फोटो की संख्या:',
      singlePhoto: 'केवल 1 फोटो',
      sheet4: '4 फोटो (4×6 इंच पेपर)',
      sheet8: '8 फोटो (4×6 इंच पेपर)',
      sheet12: '12 फोटो (A4 पेपर)',
    },

    // Signature Specific
    signatureTab: {
      cleanMode: 'सिग्नेचर क्लीनर फ़िल्टर:',
      cleanModeDesc: 'कागज की परछाई और दाग हटाकर शुद्ध ब्लैक & व्हाइट स्याही बनाता है',
      targetSize: 'टारगेट साइज:',
      dimensions: 'मानक डाइमेंशन:',
    },

    // Dimension & DPI Specific
    dpiTab: {
      unit: 'इकाई (Unit):',
      pixels: 'पिक्सेल (px)',
      cm: 'सेंटीमीटर (cm)',
      mm: 'मिलीमीटर (mm)',
      inches: 'इंच (in)',
      dpiLabel: 'DPI (डॉट्स पर इंच):',
      dpiHint: 'सरकारी पोर्टल DPI हेडर चेक करते हैं (प्रिंट और फॉर्म के लिए 300 DPI अनुशंसित है)',
      bitDepth: 'कलर और बिट डेप्थ:',
      color24: '24-बिट ट्रू कलर (RGB)',
      gray8: '8-बिट ग्रेस्केल (Grayscale)',
      bw1: '1-बिट ब्लैक & व्हाइट',
    },

    // Photo & Sign Merger
    mergerTab: {
      uploadPhoto: 'उम्मीदवार की फोटो अपलोड करें',
      uploadSign: 'उम्मीदवार का सिग्नेचर अपलोड करें',
      candidateName: 'उम्मीदवार का पूरा नाम:',
      namePlaceholder: 'जैसे: RAHUL SHARMA',
      dop: 'फोटो की तारीख (DOP):',
      dopPlaceholder: 'जैसे: 25-10-2026',
      targetSize: 'टारगेट कुल साइज:',
    },

    // PDF to Photo
    pdfToPhotoTab: {
      renderDpi: 'इमेज रेजोल्यूशन:',
      standardDpi: '150 DPI (मानक और तेज़)',
      highDpi: '300 DPI (अल्ट्रा-शार्प प्रिंट क्वालिटी)',
      outputFormat: 'आउटपुट फॉर्मेट:',
      pagesFound: 'कुल पेज मिले:',
      downloadPage: 'यह पेज डाउनलोड करें',
      downloadAll: 'सभी पेज डाउनलोड करें',
    },

    // Photo to PDF
    photoToPdfTab: {
      pageSize: 'पेज साइज:',
      orientation: 'ओरिएंटेशन:',
      portrait: 'पोर्ट्रेट (खड़ा)',
      landscape: 'लैंडस्केप (आड़ा)',
      margin: 'मार्जिन:',
      noMargin: 'कोई मार्जिन नहीं (Full Page)',
      smallMargin: 'छोटा मार्जिन',
      normalMargin: 'मानक मार्जिन',
      addMoreImages: '+ और फोटो जोड़ें',
    },

    // OCR
    ocrTab: {
      language: 'पहचान की भाषा:',
      english: 'अंग्रेजी (English)',
      hindi: 'हिंदी (Hindi)',
      bilingual: 'हिंदी + अंग्रेजी दोनों (Bilingual)',
      extractButton: 'टेक्स्ट निकालें (Extract)',
      copyText: 'टेक्स्ट कॉपी करें',
      copied: 'कॉपी हो गया!',
      downloadTxt: '.TXT में डाउनलोड करें',
      confidence: 'सटीकता (Confidence):',
      wordsDetected: 'कुल शब्द:',
      aiNoteTitle: 'हस्तलिखित (Handwritten) टेक्स्ट निकालना है?',
      aiNoteDesc: 'DocToolz 100% ऑफलाइन Tesseract.js चलाता है। कर्सिव या हाथ से लिखे नोट्स के लिए आप मुफ्त Google Gemini API भी इस्तेमाल कर सकते हैं।',
    },

    // Footer
    footer: {
      builtFor: 'स्पीड, गोपनीयता और भारतीय प्रतियोगी परीक्षाओं व दस्तावेज़ों के लिए विशेष रूप से निर्मित।',
      privacyCommitment: 'शून्य सर्वर अपलोड: आपकी सभी फोटो, कंप्रेस और पीडीएफ कन्वर्जन आपके डिवाइस के ब्राउज़र में ही प्रोसेस होती हैं।',
      rights: 'सर्वाधिकार सुरक्षित।',
      madeBy: 'Made with ❤️ by Chandan Raj',
    },
  },
};
