import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { WebHomeView } from './components/home/WebHomeView';
import { AndroidHomeView } from './components/home/AndroidHomeView';
import { SettingsView } from './components/settings/SettingsView';
import { DownloadsView } from './components/downloads/DownloadsView';
import { BottomNav } from './components/common/BottomNav';

// Web 20 Tools
import { ImageCompressor } from './components/tools/ImageCompressor';
import { PassportPhotoMaker } from './components/tools/PassportPhotoMaker';
import { SignatureResizer } from './components/tools/SignatureResizer';
import { CustomDimensionDpi } from './components/tools/CustomDimensionDpi';
import { PhotoSignatureMerger } from './components/tools/PhotoSignatureMerger';
import { PhotoToPdf } from './components/tools/PhotoToPdf';
import { PdfToPhoto } from './components/tools/PdfToPhoto';
import { OcrExtractor } from './components/tools/OcrExtractor';
import { SizeIncreaser } from './components/tools/SizeIncreaser';
import { AgeCalculator } from './components/tools/AgeCalculator';
import { CgpaCalculator } from './components/tools/CgpaCalculator';
import { SignaturePad } from './components/tools/SignaturePad';
import { PdfCompressor } from './components/tools/PdfCompressor';
import { PdfMerger } from './components/tools/PdfMerger';
import { PdfSplitter } from './components/tools/PdfSplitter';
import { PdfPassword } from './components/tools/PdfPassword';
import { WatermarkStamper } from './components/tools/WatermarkStamper';
import { DocumentRedactor } from './components/tools/DocumentRedactor';
import { QrTools } from './components/tools/QrTools';
import { ImageCropper } from './components/tools/ImageCropper';

// Android Specialized Tools & Aliases
import { ExactKbResizer } from './components/tools/ExactKbResizer';
import { DocumentScanner } from './components/tools/DocumentScanner';
import { MergeSplit } from './components/tools/MergeSplit';
import { FormatConverter } from './components/tools/FormatConverter';
import { DigitalSignatureStudio } from './components/tools/DigitalSignatureStudio';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { ReorderPages } from './components/tools/ReorderPages';
import { MetadataStripper } from './components/tools/MetadataStripper';
import { MarksheetCutoff } from './components/tools/MarksheetCutoff';
import { IdCardMaker } from './components/tools/IdCardMaker';
import { BatchProcess } from './components/tools/BatchProcess';

export const isRunningInAndroidApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  // If native Android Bridge is injected by MainActivity.java
  if (typeof (window as any).AndroidBridge !== 'undefined') return true;
  // If loaded via doctoolz.app origin (Android WebView APP_HOST)
  if (window.location.hostname === 'doctoolz.app') return true;
  // Optional preview parameter for testing mobile layout on web: ?app=true
  if (new URLSearchParams(window.location.search).get('app') === 'true') return true;
  return false;
};

const MainContent: React.FC = () => {
  const { activeTool, setActiveTool, mainTab, setMainTab } = useApp();
  const [inAndroidApp, setInAndroidApp] = useState(false);

  useEffect(() => {
    setInAndroidApp(isRunningInAndroidApp());
  }, []);

  // Scroll to top whenever active tool or main tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTool, mainTab]);

  // Handle hardware back button from native Android bridge gracefully
  useEffect(() => {
    (window as any).onAndroidBackPressed = () => {
      const modalCloseBtn = document.querySelector('[data-modal-close="true"]') as HTMLElement;
      if (modalCloseBtn) {
        modalCloseBtn.click();
        return true;
      }
      if (activeTool) {
        setActiveTool(null);
        return true;
      }
      if (mainTab !== 'home') {
        setMainTab('home');
        return true;
      }
      return false;
    };
    return () => {
      delete (window as any).onAndroidBackPressed;
    };
  }, [activeTool, mainTab, setActiveTool, setMainTab]);

  // Android Native Layout
  const renderAndroidContent = () => {
    if (mainTab === 'settings' && !activeTool) {
      return <SettingsView />;
    }

    if (mainTab === 'downloads' && !activeTool) {
      return <DownloadsView />;
    }

    if (activeTool) {
      switch (activeTool) {
        case 'exactKbResizer':
        case 'compressor':
          return <ExactKbResizer />;
        case 'pdfCompress':
        case 'pdfCompressor':
          return <PdfCompressor />;
        case 'mergeSplit':
        case 'pdfMerger':
          return <MergeSplit />;
        case 'pdfSplitter':
          return <PdfSplitter />;
        case 'docScanner':
          return <DocumentScanner />;
        case 'pdfProtect':
        case 'pdfPassword':
          return <PdfPassword />;
        case 'admitCardPrep':
        case 'photoSignMerge':
          return <PhotoSignatureMerger />;
        case 'ageEligibility':
        case 'ageCalculator':
          return <AgeCalculator />;
        case 'cgpaPercent':
        case 'cgpaCalculator':
          return <CgpaCalculator />;
        case 'digitalSignature':
          return <DigitalSignatureStudio />;
        case 'signature':
          return <SignatureResizer />;
        case 'signaturePad':
          return <SignaturePad />;
        case 'documentRedactor':
          return <DocumentRedactor />;
        case 'customWatermark':
        case 'watermarkStamper':
          return <WatermarkStamper />;
        case 'formatConvert':
        case 'photoToPdf':
          return <FormatConverter />;
        case 'pdfToPhoto':
          return <PdfToPhoto />;
        case 'pdfToWordOcr':
        case 'ocr':
          return <OcrExtractor />;
        case 'qrBarcodeStudio':
        case 'qrTools':
          return <QrTools />;
        case 'backgroundRemover':
          return <BackgroundRemover />;
        case 'passport':
          return <PassportPhotoMaker />;
        case 'reorderPages':
          return <ReorderPages />;
        case 'metadataStripper':
          return <MetadataStripper />;
        case 'marksheetCutoff':
          return <MarksheetCutoff />;
        case 'idCardMaker':
          return <IdCardMaker />;
        case 'batchProcess':
          return <BatchProcess />;
        case 'sizeIncreaser':
          return <SizeIncreaser />;
        case 'dimensionDpi':
          return <CustomDimensionDpi />;
        case 'imageCropper':
          return <ImageCropper />;
        default:
          return <AndroidHomeView />;
      }
    }

    return <AndroidHomeView />;
  };

  // Web Layout (Original GitHub Pages Website)
  const renderWebContent = () => {
    switch (activeTool) {
      case 'compressor':
      case 'exactKbResizer':
        return <ImageCompressor />;
      case 'passport':
        return <PassportPhotoMaker />;
      case 'signature':
        return <SignatureResizer />;
      case 'dimensionDpi':
        return <CustomDimensionDpi />;
      case 'photoSignMerge':
      case 'admitCardPrep':
        return <PhotoSignatureMerger />;
      case 'photoToPdf':
      case 'formatConvert':
        return <PhotoToPdf />;
      case 'pdfToPhoto':
        return <PdfToPhoto />;
      case 'ocr':
      case 'pdfToWordOcr':
        return <OcrExtractor />;
      case 'sizeIncreaser':
        return <SizeIncreaser />;
      case 'ageCalculator':
      case 'ageEligibility':
        return <AgeCalculator />;
      case 'cgpaCalculator':
      case 'cgpaPercent':
        return <CgpaCalculator />;
      case 'signaturePad':
      case 'digitalSignature':
        return <SignaturePad />;
      case 'pdfCompressor':
      case 'pdfCompress':
        return <PdfCompressor />;
      case 'pdfMerger':
      case 'mergeSplit':
        return <PdfMerger />;
      case 'pdfSplitter':
        return <PdfSplitter />;
      case 'pdfPassword':
      case 'pdfProtect':
        return <PdfPassword />;
      case 'watermarkStamper':
      case 'customWatermark':
        return <WatermarkStamper />;
      case 'documentRedactor':
        return <DocumentRedactor />;
      case 'qrTools':
      case 'qrBarcodeStudio':
        return <QrTools />;
      case 'imageCropper':
        return <ImageCropper />;
      case 'docScanner':
        return <DocumentScanner />;
      case 'backgroundRemover':
        return <BackgroundRemover />;
      case 'reorderPages':
        return <ReorderPages />;
      case 'metadataStripper':
        return <MetadataStripper />;
      case 'marksheetCutoff':
        return <MarksheetCutoff />;
      case 'idCardMaker':
        return <IdCardMaker />;
      case 'batchProcess':
        return <BatchProcess />;
      default:
        return <WebHomeView />;
    }
  };

  if (inAndroidApp) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <main className="flex-1">{renderAndroidContent()}</main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{renderWebContent()}</main>
      <Footer />
      <MobileBottomBar />
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
