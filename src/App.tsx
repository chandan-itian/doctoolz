import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeView } from './components/home/HomeView';
import { SettingsView } from './components/settings/SettingsView';
import { DownloadsView } from './components/downloads/DownloadsView';
import { BottomNav } from './components/common/BottomNav';

// 20 Canonical Tools + Aliases
import { ExactKbResizer } from './components/tools/ExactKbResizer';
import { PdfCompressor } from './components/tools/PdfCompressor';
import { MergeSplit } from './components/tools/MergeSplit';
import { DocumentScanner } from './components/tools/DocumentScanner';
import { PdfPassword } from './components/tools/PdfPassword';
import { PhotoSignatureMerger } from './components/tools/PhotoSignatureMerger';
import { AgeCalculator } from './components/tools/AgeCalculator';
import { CgpaCalculator } from './components/tools/CgpaCalculator';
import { DigitalSignatureStudio } from './components/tools/DigitalSignatureStudio';
import { DocumentRedactor } from './components/tools/DocumentRedactor';
import { WatermarkStamper } from './components/tools/WatermarkStamper';
import { FormatConverter } from './components/tools/FormatConverter';
import { OcrExtractor } from './components/tools/OcrExtractor';
import { QrTools } from './components/tools/QrTools';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { ReorderPages } from './components/tools/ReorderPages';
import { MetadataStripper } from './components/tools/MetadataStripper';
import { MarksheetCutoff } from './components/tools/MarksheetCutoff';
import { IdCardMaker } from './components/tools/IdCardMaker';
import { BatchProcess } from './components/tools/BatchProcess';

// Additional tools & Aliases
import { SizeIncreaser } from './components/tools/SizeIncreaser';
import { CustomDimensionDpi } from './components/tools/CustomDimensionDpi';
import { ImageCropper } from './components/tools/ImageCropper';
import { PassportPhotoMaker } from './components/tools/PassportPhotoMaker';
import { SignatureResizer } from './components/tools/SignatureResizer';
import { SignaturePad } from './components/tools/SignaturePad';
import { PdfSplitter } from './components/tools/PdfSplitter';
import { PdfMerger } from './components/tools/PdfMerger';
import { PhotoToPdf } from './components/tools/PhotoToPdf';
import { PdfToPhoto } from './components/tools/PdfToPhoto';

const MainContent: React.FC = () => {
  const { activeTool, setActiveTool, mainTab, setMainTab } = useApp();

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

  const renderContent = () => {
    // If Settings tab is active and no active tool, show SettingsView (Screen 2)
    if (mainTab === 'settings' && !activeTool) {
      return <SettingsView />;
    }

    // If Downloads tab is active and no active tool, show DownloadsView
    if (mainTab === 'downloads' && !activeTool) {
      return <DownloadsView />;
    }

    // If an active tool is selected, render that tool (e.g. Screen 3 for exactKbResizer)
    if (activeTool) {
      switch (activeTool) {
        case 'exactKbResizer':
        case 'compressor':
          return <ExactKbResizer />;
        case 'pdfCompress':
        case 'pdfCompressor':
          return <PdfCompressor />;
        case 'mergeSplit':
          return <MergeSplit />;
        case 'pdfMerger':
          return <PdfMerger />;
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
          return <FormatConverter />;
        case 'photoToPdf':
          return <PhotoToPdf />;
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
          return <HomeView />;
      }
    }

    // Default: HomeView (Screen 1 Dashboard)
    return <HomeView />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main className="flex-1">{renderContent()}</main>
      <BottomNav />
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
