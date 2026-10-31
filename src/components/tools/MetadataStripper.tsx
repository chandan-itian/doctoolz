import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Download,
  Trash2,
  FileCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { PDFDocument } from 'pdf-lib';

export const MetadataStripper: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [cleanedFileName, setCleanedFileName] = useState<string>('');
  const [strippedInfo, setStrippedInfo] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setCleanedUrl(null);
    setFile(selectedFile);

    try {
      if (selectedFile.type === 'application/pdf') {
        // Strip PDF metadata using pdf-lib
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

        pdf.setTitle('');
        pdf.setAuthor('');
        pdf.setSubject('');
        pdf.setKeywords([]);
        pdf.setProducer('');
        pdf.setCreator('');
        pdf.setCreationDate(new Date(0));
        pdf.setModificationDate(new Date(0));

        const cleanedBytes = await pdf.save();
        const blob = new Blob([cleanedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setCleanedUrl(url);
        setCleanedFileName(`Cleaned_${selectedFile.name}`);
        setStrippedInfo([
          'Author & Creator tags removed',
          'Producer software signature removed',
          'Creation & modification timestamps reset',
          'Document title & subject scrubbed',
        ]);
      } else {
        // Strip Image EXIF metadata by re-encoding pure pixel buffer onto fresh HTML5 canvas
        const img = new Image();
        const objectUrl = URL.createObjectURL(selectedFile);
        img.src = objectUrl;

        await new Promise((res) => {
          img.onload = res;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const cleanedDataUrl = canvas.toDataURL(
            selectedFile.type === 'image/png' ? 'image/png' : 'image/jpeg',
            0.96
          );
          setCleanedUrl(cleanedDataUrl);
          setCleanedFileName(`Cleaned_${selectedFile.name.replace(/\.[^/.]+$/, '')}.jpg`);
          setStrippedInfo([
            'GPS Latitude & Longitude scrubbed',
            'Camera Make, Model & Serial Number deleted',
            'Shooting date, time & shutter speeds wiped',
            'Photoshop & Editing software tags removed',
            'Device thumbnail cache eliminated',
          ]);
        }
        URL.revokeObjectURL(objectUrl);
      }
    } catch (err) {
      console.error('Error stripping metadata:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemo = async () => {
    try {
      const demo = await generateSamplePortrait();
      processFile(demo);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'मेटाडेटा क्लीनर' : 'Metadata Stripper'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {!file ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs">
          <ShieldAlert className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            {language === 'hi' ? 'फाइल से गुप्त डेटा हटाएं' : 'Scrub Hidden Metadata'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {language === 'hi'
              ? 'GPS लोकेशन, कैमरा मॉडल, डिवाइस आईडी और पर्सनल टैग्स पूरी तरह हटाएं।'
              : 'Remove GPS coordinates, device IDs, creation dates, and camera tags before uploading.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-purple-500/20 active:scale-95"
            >
              {language === 'hi' ? 'फोटो या पीडीएफ चुनें' : 'Choose Photo or PDF'}
            </button>
            <button
              onClick={handleDemo}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs hover:bg-slate-200 active:scale-95"
            >
              {language === 'hi' ? 'डेमो फाइल आज़माएं' : 'Try Demo File'}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) processFile(e.target.files[0]);
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-xs">
                {file.name}
              </span>
              <button
                onClick={() => {
                  setFile(null);
                  setCleanedUrl(null);
                }}
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                {language === 'hi' ? 'अन्य फाइल' : 'Choose Another'}
              </button>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-2xl border border-purple-100 dark:border-purple-900/40 mb-4">
              <div className="flex items-center gap-2 mb-2 text-purple-700 dark:text-purple-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{language === 'hi' ? 'हटाए गए संवेदनशील टैग्स' : 'Successfully Scrubbed Tags'}</span>
              </div>
              <ul className="space-y-1">
                {strippedInfo.map((info, idx) => (
                  <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            {cleanedUrl && (
              <a
                href={cleanedUrl}
                download={cleanedFileName}
                className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>
                  {language === 'hi' ? 'सुरक्षित फाइल डाउनलोड करें' : 'Download Scrubbed File'}
                </span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
