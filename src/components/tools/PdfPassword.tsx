import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { KeyRound, Upload, Download, Eye, EyeOff, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import { protectPdfFile } from '../../utils/pdfAdvanced';
import confetti from 'canvas-confetti';

export const PdfPassword: React.FC = () => {
  const { t, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; sizeKb: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setResult(null);
    }
  };

  const handleProtect = async () => {
    if (!file) return;
    if (!password) {
      alert('Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please re-check.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await protectPdfFile(file, password);
      const url = URL.createObjectURL(res.blob);
      setResult({
        blob: res.blob,
        url,
        sizeKb: res.sizeKb,
      });
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      alert('Error encrypting PDF: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    const name = file.name.replace(/\.pdf$/i, '');
    a.download = `${name}_protected.pdf`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.pdfPassword.name}
        badge={t.tools.pdfPassword.badge}
        description={t.tools.pdfPassword.desc}
        icon={KeyRound}
        iconGradient="from-purple-700 to-indigo-800"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-10 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-1">
              {language === 'hi' ? 'PDF फाइल चुनें जिसमें पासवर्ड लगाना है' : 'Upload PDF to Password Protect'}
            </p>
            <p className="text-xs text-slate-400">100% In-Browser AES Military-Grade Encryption</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                    {file.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {Math.round((file.size / 1024) * 10) / 10} KB
                  </span>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-xs text-slate-400 hover:text-purple-600 font-semibold"
              >
                Change PDF
              </button>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'पासवर्ड दर्ज करें:' : 'Enter Password:'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secret password"
                    className="w-full px-4 py-2.5 pr-10 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'पासवर्ड की दोबारा पुष्टि करें:' : 'Confirm Password:'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            {result ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-sm font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    PDF Protected with Password!
                  </span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                    {result.sizeKb} KB
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Password-Protected PDF</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleProtect}
                disabled={isProcessing || !password}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Encrypting PDF in Browser...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Lock & Protect PDF with Password</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
