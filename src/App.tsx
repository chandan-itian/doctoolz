import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/home/HomeView';

// Original 8 Core Tools
import { ImageCompressor } from './components/tools/ImageCompressor';
import { PassportPhotoMaker } from './components/tools/PassportPhotoMaker';
import { SignatureResizer } from './components/tools/SignatureResizer';
import { CustomDimensionDpi } from './components/tools/CustomDimensionDpi';
import { PhotoSignatureMerger } from './components/tools/PhotoSignatureMerger';
import { PhotoToPdf } from './components/tools/PhotoToPdf';
import { PdfToPhoto } from './components/tools/PdfToPhoto';
import { OcrExtractor } from './components/tools/OcrExtractor';

// New Category 1 Tools (Exam & Student Essentials)
import { SizeIncreaser } from './components/tools/SizeIncreaser';
import { AgeCalculator } from './components/tools/AgeCalculator';
import { CgpaCalculator } from './components/tools/CgpaCalculator';
import { SignaturePad } from './components/tools/SignaturePad';

// New Category 2 Tools (Advanced PDF Suite)
import { PdfCompressor } from './components/tools/PdfCompressor';
import { PdfMerger } from './components/tools/PdfMerger';
import { PdfSplitter } from './components/tools/PdfSplitter';
import { PdfPassword } from './components/tools/PdfPassword';

// New Category 3 Tools (Document Safety & Privacy)
import { WatermarkStamper } from './components/tools/WatermarkStamper';
import { DocumentRedactor } from './components/tools/DocumentRedactor';

// New Category 4 Tools (Utilities 11 & 12)
import { QrTools } from './components/tools/QrTools';
import { ImageCropper } from './components/tools/ImageCropper';

const MainContent: React.FC = () => {
  const { activeTool } = useApp();

  // Scroll to top whenever active tool changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTool]);

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'compressor':
        return <ImageCompressor />;
      case 'passport':
        return <PassportPhotoMaker />;
      case 'signature':
        return <SignatureResizer />;
      case 'dimensionDpi':
        return <CustomDimensionDpi />;
      case 'photoSignMerge':
        return <PhotoSignatureMerger />;
      case 'photoToPdf':
        return <PhotoToPdf />;
      case 'pdfToPhoto':
        return <PdfToPhoto />;
      case 'ocr':
        return <OcrExtractor />;
      case 'sizeIncreaser':
        return <SizeIncreaser />;
      case 'ageCalculator':
        return <AgeCalculator />;
      case 'cgpaCalculator':
        return <CgpaCalculator />;
      case 'signaturePad':
        return <SignaturePad />;
      case 'pdfCompressor':
        return <PdfCompressor />;
      case 'pdfMerger':
        return <PdfMerger />;
      case 'pdfSplitter':
        return <PdfSplitter />;
      case 'pdfPassword':
        return <PdfPassword />;
      case 'watermarkStamper':
        return <WatermarkStamper />;
      case 'documentRedactor':
        return <DocumentRedactor />;
      case 'qrTools':
        return <QrTools />;
      case 'imageCropper':
        return <ImageCropper />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">{renderActiveTool()}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
