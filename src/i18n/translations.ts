export type Language = 'en' | 'hi';

export const translations = {
  en: {
    brand: 'DocToolz',
    tagline: 'All-in-One Image, Passport & PDF Productivity Suite',
    privacyBadge: '100% Private & Client-Side (No Files Leave Your Device)',
    searchPlaceholder: 'Search any tool (e.g. 50KB, Passport, PDF, Signature, DPI)...',
    popularTags: ['UPSC / SSC 50KB', 'Passport 3.5×4.5cm', '300 DPI', 'Signature 20KB', 'Photo to PDF', 'Hindi OCR'],
    backToAllTools: '← Back to All Tools',
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
    
    // Tools List
    tools: {
      compressor: {
        name: 'Compress Image to Exact KB',
        desc: 'Reduce photo size to exactly 20KB, 50KB, 100KB, or custom KB for government exam portals without losing clarity.',
        category: 'Image Tools',
        badge: 'Top Exam Tool',
      },
      passport: {
        name: 'Passport Photo & Print Sheet Maker',
        desc: 'Create official 3.5×4.5 cm (India/UK) and 2×2 inch (US Visa) photos. Generate printable 4×6 or A4 sheets with 4, 6, 8, 12 photos.',
        category: 'ID & Passport',
        badge: 'High Demand',
      },
      signature: {
        name: 'Signature Resizer & B/W Cleaner',
        desc: 'Resize signatures to 10KB–20KB. Auto-remove shadows, gray phone camera tints, and enhance black ink contrast.',
        category: 'Exam Specials',
        badge: '10-20 KB Target',
      },
      dimensionDpi: {
        name: 'Custom Size, DPI & Bit Depth',
        desc: 'Resize in Pixels, CM, MM, Inches. Embed exact 200/300 DPI metadata and convert to 24-bit RGB or 8-bit Grayscale.',
        category: 'Image Tools',
        badge: '300 DPI Header',
      },
      photoSignMerge: {
        name: 'Photo & Signature Merger (DOP)',
        desc: 'Combine candidate photo and signature with Name and Date of Photo (DOP) on one card under 50KB/100KB.',
        category: 'Exam Specials',
        badge: 'Govt Form Card',
      },
      photoToPdf: {
        name: 'Photo to PDF Converter',
        desc: 'Convert single or multiple images into a compact PDF. Set page orientation, margins, and target file size under 200KB/500KB.',
        category: 'PDF Suite',
        badge: 'Multi-Image',
      },
      pdfToPhoto: {
        name: 'PDF to Photo (JPG / PNG)',
        desc: 'Extract high-definition pages from PDF files at 150 or 300 DPI. Download individual pages or entire documents.',
        category: 'PDF Suite',
        badge: 'High-Res 300 DPI',
      },
      ocr: {
        name: 'OCR Image to Text (Hindi & English)',
        desc: 'Extract printed text from images and documents in Hindi, English, or bilingual text with 100% in-browser WebAssembly.',
        category: 'OCR & AI',
        badge: 'Hindi + English',
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
      bgColor: 'Background Color:',
      white: 'White',
      lightBlue: 'Light Blue',
      navyBlue: 'Navy Blue',
      lightGray: 'Light Gray',
      addBorder: 'Add 1px Black Border (Official specification)',
      generateSheet: 'Printable Sheet Generator (4x6 / A4):',
      sheetCount: 'Number of Photos on Sheet:',
      singlePhoto: 'Single Photo',
      sheet4: '4 Photos (4×6 inch)',
      sheet8: '8 Photos (4×6 inch)',
      sheet12: '12 Photos (A4 Sheet)',
    },

    // Signature Specific
    signatureTab: {
      cleanMode: 'Signature Cleaner Filter:',
      cleanModeDesc: 'Removes paper shadows and enhances ink lines into pure black & white',
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
      dpiHint: 'Government portals verify DPI headers (300 DPI is recommended for printing & state forms)',
      bitDepth: 'Color & Bit Depth:',
      color24: '24-bit TrueColor (RGB)',
      gray8: '8-bit Grayscale',
      bw1: '1-bit Black & White',
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
      renderDpi: 'Extraction Resolution:',
      standardDpi: '150 DPI (Fast & Standard)',
      highDpi: '300 DPI (Ultra Sharp Print Quality)',
      outputFormat: 'Image Output Format:',
      pagesFound: 'Pages Found:',
      downloadPage: 'Download Page',
      downloadAll: 'Download All Pages',
    },

    // Photo to PDF
    photoToPdfTab: {
      pageSize: 'Page Size:',
      orientation: 'Orientation:',
      portrait: 'Portrait',
      landscape: 'Landscape',
      margin: 'Margin:',
      noMargin: 'No Margin (Edge-to-Edge)',
      smallMargin: 'Small Margin',
      normalMargin: 'Standard Margin',
      addMoreImages: '+ Add More Photos',
    },

    // OCR
    ocrTab: {
      language: 'Recognition Language:',
      english: 'English (eng)',
      hindi: 'Hindi (hin)',
      bilingual: 'Hindi + English Mixed (hin+eng)',
      extractButton: 'Extract Text Now',
      copyText: 'Copy Text',
      copied: 'Copied!',
      downloadTxt: 'Download as .TXT',
      confidence: 'Recognition Confidence:',
      wordsDetected: 'Words:',
      aiNoteTitle: 'Need to recognize cursive handwriting?',
      aiNoteDesc: 'DocToolz runs 100% offline Tesseract.js. For cursive or blurred handwriting, you can also use Google Gemini API for free.',
    },

    // Footer
    footer: {
      builtFor: 'Engineered for speed, privacy, and Indian competitive exams & official paperwork.',
      privacyCommitment: 'Zero Server Uploads: All image processing, compression, and PDF conversions occur strictly inside your local browser memory.',
      rights: 'All rights reserved.',
    },
  },

  hi: {
    brand: 'DocToolz',
    tagline: 'ऑल-इन-वन इमेज, पासपोर्ट और पीडीएफ टूल्स सूट',
    privacyBadge: '100% प्राइवेट और क्लाइंट-साइड (आपकी फाइल्स आपके डिवाइस से बाहर नहीं जातीं)',
    searchPlaceholder: 'कोई भी टूल खोजें (जैसे: 50KB, पासपोर्ट, PDF, सिग्नेचर, 300 DPI)...',
    popularTags: ['UPSC / SSC 50KB', 'पासपोर्ट 3.5×4.5cm', '300 DPI', 'सिग्नेचर 20KB', 'फोटो से PDF', 'हिंदी OCR'],
    backToAllTools: '← सभी टूल्स पर वापस जाएं',
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

    // Tools List
    tools: {
      compressor: {
        name: 'फोटो का साइज KB में कम करें',
        desc: 'सरकारी परीक्षा पोर्टल के लिए फोटो का साइज बिना क्वालिटी खोए ठीक 20KB, 50KB, 100KB या मनचाहे साइज में कंप्रेस करें।',
        category: 'इमेज टूल्स',
        badge: 'टॉप एग्जाम टूल',
      },
      passport: {
        name: 'पासपोर्ट साइज फोटो और प्रिंट शीट मेकर',
        desc: '3.5×4.5 सेमी (भारत/यूके) और 2×2 इंच (यूएस वीजा) फोटो बनाएं। 4, 6, 8, 12 फोटो वाली प्रिंटेबल 4×6 या A4 शीट तैयार करें।',
        category: 'आईडी और पासपोर्ट',
        badge: 'सर्वाधिक लोकप्रिय',
      },
      signature: {
        name: 'सिग्नेचर रीसाइज़र और B/W क्लीनर',
        desc: 'सिग्नेचर को 10KB–20KB में रीसाइज करें। मोबाइल से खींची फोटो की परछाई और पीलापन हटाकर साफ़ काला और सफेद बनाएं।',
        category: 'एग्जाम स्पेशल',
        badge: '10-20 KB टारगेट',
      },
      dimensionDpi: {
        name: 'कस्टम साइज, DPI और बिट डेप्थ',
        desc: 'पिक्सल, सेमी, मिमी, इंच में साइज बदलें। 200/300 DPI मेटाडेटा जोड़ें और 24-बिट RGB या 8-बिट ग्रेस्केल में कन्वर्ट करें।',
        category: 'इमेज टूल्स',
        badge: '300 DPI हेडर',
      },
      photoSignMerge: {
        name: 'फोटो और सिग्नेचर मर्ज करें (DOP)',
        desc: 'उम्मीदवार की फोटो और सिग्नेचर को नाम और फोटो की तारीख (DOP) के साथ एक ही कार्ड में 50KB/100KB के अंदर मर्ज करें।',
        category: 'एग्जाम स्पेशल',
        badge: 'सरकारी फॉर्म कार्ड',
      },
      photoToPdf: {
        name: 'फोटो से PDF बनाएं',
        desc: 'एक या अनेक फोटो को कॉम्पैक्ट PDF में बदलें। पेज ओरिएंटेशन, मार्जिन सेट करें और 200KB/500KB के अंदर फाइल बनाएं।',
        category: 'पीडीएफ सूट',
        badge: 'मल्टी-इमेज',
      },
      pdfToPhoto: {
        name: 'PDF से फोटो निकालें (JPG / PNG)',
        desc: 'PDF फाइलों के पेजों को 150 या 300 DPI हाई-डेफिनिशन इमेज में निकालें। अलग-अलग पेज या सभी पेज डाउनलोड करें।',
        category: 'पीडीएफ सूट',
        badge: 'हाई-रेज़ 300 DPI',
      },
      ocr: {
        name: 'OCR इमेज से टेक्स्ट निकालें (हिंदी और अंग्रेजी)',
        desc: 'इमेज और दस्तावेजों से हिंदी और अंग्रेजी टेक्स्ट को 100% ब्राउज़र में बिना किसी सर्वर या शुल्क के तुरंत निकालें।',
        category: 'OCR और AI',
        badge: 'हिंदी + इंग्लिश',
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
    },
  },
};
