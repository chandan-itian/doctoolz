import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/home/HomeView';

// Tools
import { ImageCompressor } from './components/tools/ImageCompressor';
import { PassportPhotoMaker } from './components/tools/PassportPhotoMaker';
import { SignatureResizer } from './components/tools/SignatureResizer';
import { CustomDimensionDpi } from './components/tools/CustomDimensionDpi';
import { PhotoSignatureMerger } from './components/tools/PhotoSignatureMerger';
import { PhotoToPdf } from './components/tools/PhotoToPdf';
import { PdfToPhoto } from './components/tools/PdfToPhoto';
import { OcrExtractor } from './components/tools/OcrExtractor';

const MainContent: React.FC = () => {
  const { activeTool } = useApp();

  // Scroll to top whenever tool switches
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
