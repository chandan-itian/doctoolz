import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { loadImageFromFile, compressImageToTargetKb } from '../../utils/imageCompressor';
import { generateSamplePortrait, generateSampleSignature } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, Upload, Sparkles, ArrowLeft } from 'lucide-react';

export const PhotoSignatureMerger: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signFile, setSignFile] = useState<File | null>(null);

  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [signImg, setSignImg] = useState<HTMLImageElement | null>(null);

  const [name, setName] = useState<string>('RAHUL SHARMA');
  const [dop, setDop] = useState<string>('28-10-2026');
  const [targetKb, setTargetKb] = useState<number>(50);

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
      // Standard card dimensions: 400px width x 600px height
      const cardWidth = 400;
      const cardHeight = 600;

      const canvas = document.createElement('canvas');
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // 1. Photo area (Top 65% = 390px)
      const photoAreaHeight = 390;
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

      // 2. Name & DOP strip
      const textStripHeight = 55;
      const textStripY = photoAreaHeight;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, textStripY, cardWidth, textStripHeight);

      // Thin separator line
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, textStripY, cardWidth, textStripHeight);

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.fillText(name.toUpperCase(), cardWidth / 2, textStripY + 23);

      ctx.font = '13px Inter, sans-serif';
      ctx.fillText(`DOP: ${dop}`, cardWidth / 2, textStripY + 44);

      // 3. Signature area (Bottom remainder = 155px)
      const signAreaY = textStripY + textStripHeight;
      const signAreaHeight = cardHeight - signAreaY;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, signAreaY, cardWidth, signAreaHeight);

      const sRatio = signImg.naturalWidth / signImg.naturalHeight;
      let sDrawW = cardWidth - 40;
      let sDrawH = sDrawW / sRatio;
      if (sDrawH > signAreaHeight - 16) {
        sDrawH = signAreaHeight - 16;
        sDrawW = sDrawH * sRatio;
      }
      const sOffsetX = (cardWidth - sDrawW) / 2;
      const sOffsetY = signAreaY + (signAreaHeight - sDrawH) / 2;

      ctx.drawImage(signImg, sOffsetX, sOffsetY, sDrawW, sDrawH);

      // Outer border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, cardWidth - 2, cardHeight - 2);

      // Compress to target KB
      const tempImg = new Image();
      const tempUrl = canvas.toDataURL('image/jpeg', 0.95);
      await new Promise((res) => {
        tempImg.onload = res;
        tempImg.src = tempUrl;
      });

      const compressed = await compressImageToTargetKb(tempImg, {
        targetKb: targetKb,
        dpi: 300,
        outputFormat: 'image/jpeg',
      });

      setResultKb(compressed.sizeKb);
      setResultDataUrl(compressed.dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [photoImg, signImg, name, dop, targetKb]);

  useEffect(() => {
    if (photoImg && signImg) {
      mergeCard();
    }
  }, [mergeCard, photoImg, signImg]);

  const handleDownload = () => {
    if (!resultDataUrl) return;
    fireConfetti();
    const a = document.createElement('a');
    a.href = resultDataUrl;
    a.download = `photo-sign-card-${resultKb}kb.jpg`;
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
                <span>{photoFile ? photoFile.name : 'Choose Photo File'}</span>
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
                <span>{signFile ? signFile.name : 'Choose Signature File'}</span>
                <input type="file" accept="image/*" onChange={handleSignUpload} className="hidden" />
              </label>
            </div>

            {/* Candidate Name & Date */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.mergerTab.candidateName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.mergerTab.namePlaceholder}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.mergerTab.dop}
                </label>
                <input
                  type="text"
                  value={dop}
                  onChange={(e) => setDop(e.target.value)}
                  placeholder={t.mergerTab.dopPlaceholder}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.mergerTab.targetSize} <span className="text-indigo-600 font-bold">{targetKb} KB</span>
                </label>
                <div className="flex gap-2">
                  {[30, 50, 100, 200].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setTargetKb(kb)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${
                        targetKb === kb
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Download Column */}
          <div className="flex flex-col items-center justify-between space-y-6">
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center w-full">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Combined Card Output Preview ({resultKb} KB)
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
                  {t.downloadResult} ({resultKb} KB)
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
