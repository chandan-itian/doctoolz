import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  UserCheck,
  Upload,
  Download,
  CreditCard,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { PDFDocument } from 'pdf-lib';

export const IdCardMaker: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [candidateName, setCandidateName] = useState('Chandan Raj');
  const [rollNo, setRollNo] = useState('DTZ-2026-9842');
  const [examName, setExamName] = useState('UPSC Civil Services Prelims');
  const [centerCode, setCenterCode] = useState('DL-0428 (New Delhi)');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    const initDemo = async () => {
      try {
        const demo = await generateSamplePortrait();
        if (!active) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          if (active && e.target?.result) {
            setPhotoUrl(e.target.result as string);
          }
        };
        reader.readAsDataURL(demo);
      } catch (err) {
        console.error(err);
      }
    };
    initDemo();
    return () => {
      active = false;
    };
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setPhotoUrl(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const downloadCard = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 360);

    // Header bar
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(0, 0, 600, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('CANDIDATE ADMIT & ID CARD', 24, 44);

    // Candidate Photo
    if (photoUrl) {
      const img = new Image();
      img.src = photoUrl;
      await new Promise((res) => {
        img.onload = res;
      });
      ctx.drawImage(img, 24, 90, 150, 190);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(24, 90, 150, 190);
    }

    // Text Details
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('CANDIDATE NAME:', 200, 115);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(candidateName, 200, 140);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('ROLL NUMBER / REG ID:', 200, 175);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(rollNo, 200, 195);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('EXAMINATION:', 200, 230);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(examName, 200, 250);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('TEST CENTER:', 200, 285);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(centerCode, 200, 305);

    // Bottom Bar
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 325, 600, 35);
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText('★ OFFICIAL CANDIDATE IDENTIFICATION • GENERATED VIA DOCTOOLZ', 24, 347);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Candidate_ID_${candidateName.replace(/\s+/g, '_')}.jpg`;
    a.click();
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
          <CreditCard className="w-5 h-5 text-teal-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'आईडी कार्ड मेकर' : 'ID Card Maker'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Interactive ID Card Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div
          ref={cardRef}
          className="bg-white text-slate-900 rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-sm"
        >
          <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-extrabold text-sm tracking-wide">
              CANDIDATE ADMIT & ID CARD
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              2026 VALID
            </span>
          </div>

          <div className="p-4 flex gap-4">
            <div className="w-24 h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0 relative group">
              {photoUrl ? (
                <img src={photoUrl} alt="Portrait" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <UserCheck className="w-8 h-8" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold transition-opacity"
              >
                Change
              </button>
            </div>

            <div className="flex-1 space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Candidate Name</span>
                <span className="font-bold text-slate-900 text-sm">{candidateName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Roll Number</span>
                <span className="font-mono font-bold text-teal-700">{rollNo}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Examination</span>
                <span className="font-semibold text-slate-700 line-clamp-1">{examName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Test Center</span>
                <span className="font-medium text-slate-600 line-clamp-1">{centerCode}</span>
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>

      {/* Edit Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-4 space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            {language === 'hi' ? 'उम्मीदवार का नाम' : 'Candidate Name'}
          </label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            {language === 'hi' ? 'रोल नंबर' : 'Roll Number'}
          </label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-semibold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            {language === 'hi' ? 'परीक्षा का नाम' : 'Exam Name'}
          </label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            {language === 'hi' ? 'परीक्षा केंद्र' : 'Exam Center'}
          </label>
          <input
            type="text"
            value={centerCode}
            onChange={(e) => setCenterCode(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
          />
        </div>
      </div>

      <button
        onClick={downloadCard}
        className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Download className="w-5 h-5" />
        <span>{language === 'hi' ? 'आईडी कार्ड डाउनलोड करें' : 'Download ID Card'}</span>
      </button>
    </div>
  );
};
