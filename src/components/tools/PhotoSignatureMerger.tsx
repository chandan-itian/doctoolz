import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { loadImageFromFile, compressImageToTargetKb } from '../../utils/imageCompressor';
import { generateSamplePortrait, generateSampleSignature } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, Upload, Sparkles, ArrowLeft, Sliders } from 'lucide-react';

export const PhotoSignatureMerger: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signFile, setSignFile] = useState<File | null>(null);

  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [signImg, setSignImg] = useState<HTMLImageElement | null>(null);

  // Custom Target KB
  const [targetKb, setTargetKb] = useState<number>(50);
  const [customKbInput, setCustomKbInput] = useState<string>('50');
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultKb, setResultKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setPhotoFile(f);
      const img = await loadImageFromFile(f);
      setPhotoImg(img);
    }
  };

  const handleSignUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSignFile(f);
      const img = await loadImageFromFile(f);
      setSignImg(img);
    }
  };

  const loadSampleBoth = async () => {
    const sPhoto = await generateSamplePortrait();
    const sSign = await generateSampleSignature();
    setPhotoFile(sPhoto);
    setSignFile(sSign);
    const pImg = await loadImageFromFile(sPhoto);
    const sImg = await loadImageFromFile(sSign);
    setPhotoImg(pImg);
    setSignImg(sImg);
  };

  const mergeCard = useCallback(async () => {
    if (!photoImg || !signImg) return;
    setIsProcessing(true);

    try {
      // Standard merged card: 400px width x 560px height
      const cardWidth = 400;
      const cardHeight = 560;

      const canvas = document.createElement('canvas');
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // 1. Photo area (Top 70% = 392px)
      const photoAreaHeight = 392;
      const pRatio = photoImg.naturalWidth / photoImg.naturalHeight;
      let pDrawW = cardWidth;
      let pDrawH = cardWidth / pRatio;
      if (pDrawH < photoAreaHeight) {
        pDrawH = photoAreaHeight;
        pDrawW = photoAreaHeight * pRatio;
      }
      const pOffsetX = (cardWidth - pDrawW) / 2;
      const pOffsetY = (photoAreaHeight - pDrawH) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, cardWidth, photoAreaHeight);
      ctx.clip();
      ctx.drawImage(photoImg, pOffsetX, pOffsetY, pDrawW, pDrawH);
      ctx.restore();

      // Thin separator line between Photo and Signature
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, photoAreaHeight);
      ctx.lineTo(cardWidth, photoAreaHeight);
      ctx.stroke();

      // 2. Signature area directly below photo (Bottom 30% = 168px)
      const signAreaY = photoAreaHeight;
      const signAreaHeight = cardHeight - signAreaY;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, signAreaY, cardWidth, signAreaHeight);

      const sRatio = signImg.naturalWidth / signImg.naturalHeight;
      let sDrawW = cardWidth - 36;
      let sDrawH = sDrawW / sRatio;
      if (sDrawH > signAreaHeight - 20) {
        sDrawH = signAreaHeight - 20;
        sDrawW = sDrawH * sRatio;
      }
      const sOffsetX = (cardWidth - sDrawW) / 2;
      const sOffsetY = signAreaY + (signAreaHeight - sDrawH) / 2;

      ctx.drawImage(signImg, sOffsetX, sOffsetY, sDrawW, sDrawH);

      // Outer border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, cardWidth - 2, cardHeight - 2);

      // Convert canvas to image and compress strictly to custom target KB
      const tempImg = new Image();
      const tempUrl = canvas.toDataURL(format, 0.95);
      await new Promise((res) => {
        tempImg.onload = res;
        tempImg.src = tempUrl;
      });

      const compressed = await compressImageToTargetKb(tempImg, {
        targetKb: targetKb,
        dpi: 300,
        outputFormat: format,
      });

      setResultKb(compressed.sizeKb);
      setResultDataUrl(compressed.dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [photoImg, signImg, targetKb, format]);

  useEffect(() => {
    if (photoImg && signImg) {
      mergeCard();
    }
  }, [mergeCard, photoImg, signImg]);

  const handleApplyCustomKb = () => {
    const val = parseFloat(customKbInput);
    if (!isNaN(val) && val >= 5) {
      setTargetKb(val);
    }
  };

  const handleDownload = () => {
    if (!resultDataUrl) return;
    fireConfetti();
    const a = document.createElement('a');
    a.href = resultDataUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    a.download = `photo-signature-merged-${resultKb}kb.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveTool(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToAllTools}</span>
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium">
          {t.tools.photoSignMerge.badge}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {t.tools.photoSignMerge.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.tools.photoSignMerge.desc}
            </p>
          </div>
          <button
            onClick={loadSampleBoth}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Sample Photo & Signature</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Column */}
          <div className="space-y-4">
            {/* Photo upload box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                1. {t.mergerTab.uploadPhoto}
              </label>
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-700 cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50">
                <Upload className="w-4 h-4" />
                <span>{photoFile ? photoFile.name : 'Choose Candidate Photo'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {/* Signature upload box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                2. {t.mergerTab.uploadSign}
              </label>
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-700 cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50">
                <Upload className="w-4 h-4" />
                <span>{signFile ? signFile.name : 'Choose Candidate Signature'}</span>
                <input type="file" accept="image/*" onChange={handleSignUpload} className="hidden" />
              </label>
            </div>

            {/* Custom Target Combined Size & Format Controls */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              {/* Format selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Download Format:
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'image/jpeg', label: 'JPG' },
                    { id: 'image/png', label: 'PNG' },
                    { id: 'image/webp', label: 'WebP' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id as 'image/jpeg' | 'image/png' | 'image/webp')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        format === fmt.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Size in KB */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Custom Combined Target Size (KB):
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      step="1"
                      value={customKbInput}
                      onChange={(e) => setCustomKbInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. 30, 50, 80, 100 KB"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400">
                      KB
                    </span>
                  </div>
                  <button
                    onClick={handleApplyCustomKb}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Set KB</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target size set to: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{targetKb} KB</strong> (Customizable by candidate)
                </p>
              </div>
            </div>
          </div>

          {/* Preview & Download Column */}
          <div className="flex flex-col items-center justify-between space-y-6">
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center w-full">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Combined Output Preview ({resultKb} KB • {format === 'image/jpeg' ? 'JPG' : format === 'image/png' ? 'PNG' : 'WebP'})
              </span>

              {resultDataUrl ? (
                <img
                  src={resultDataUrl}
                  alt="Merged Card Preview"
                  className="max-h-[380px] w-auto rounded-lg shadow-xl border border-slate-300 dark:border-slate-700 bg-white"
                />
              ) : (
                <div className="p-16 text-center text-xs text-slate-400">
                  Upload both photo and signature above to see merged preview.
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="w-full">
              <button
                onClick={handleDownload}
                disabled={!resultDataUrl || isProcessing}
                className="w-full px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {t.downloadResult} as {format === 'image/jpeg' ? 'JPG' : format === 'image/png' ? 'PNG' : 'WebP'} ({resultKb} KB)
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
