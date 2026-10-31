import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { QrCode, Scan, Download, Copy, Check, ExternalLink, Camera, Upload, RefreshCw } from 'lucide-react';
import {
  generateQrDataUrl,
  scanQrFromImage,
  scanQrFromCanvas,
  buildUpiString,
  buildWifiString,
  UpiPaymentDetails,
  WifiDetails,
} from '../../utils/qrEngine';
import confetti from 'canvas-confetti';

export const QrTools: React.FC = () => {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');

  // Generator State
  const [qrType, setQrType] = useState<'text' | 'url' | 'upi' | 'wifi'>('url');
  const [textInput, setTextInput] = useState('https://chandan-itian.github.io/doctoolz/');
  const [upiDetails, setUpiDetails] = useState<UpiPaymentDetails>({
    vpa: 'user@upi',
    name: 'DocToolz User',
    amount: '',
  });
  const [wifiDetails, setWifiDetails] = useState<WifiDetails>({
    ssid: 'MyHomeWiFi',
    password: '',
    encryption: 'WPA',
  });
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Scanner State
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Re-generate QR
  useEffect(() => {
    let payload = textInput;
    if (qrType === 'upi') payload = buildUpiString(upiDetails);
    else if (qrType === 'wifi') payload = buildWifiString(wifiDetails);

    if (payload) {
      generateQrDataUrl(payload, { width: 400 })
        .then((url) => setQrDataUrl(url))
        .catch(console.error);
    }
  }, [qrType, textInput, upiDetails, wifiDetails]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setScannedResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        requestScanFrame();
      }
    } catch (err) {
      alert('Camera access denied or not available: ' + (err as Error).message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsCameraActive(false);
  };

  const requestScanFrame = () => {
    if (!videoRef.current || !scanCanvasRef.current) return;
    const video = videoRef.current;
    const canvas = scanCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const code = scanQrFromCanvas(canvas);
      if (code) {
        setScannedResult(code);
        stopCamera();
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        return;
      }
    }

    animFrameRef.current = requestAnimationFrame(requestScanFrame);
  };

  const handleScanImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const code = await scanQrFromImage(file);
      if (code) {
        setScannedResult(code);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } else {
        alert('No QR code found in this image. Please upload a clear QR photo.');
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode_${qrType}.png`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.qrTools.name}
        badge={t.tools.qrTools.badge}
        description={t.tools.qrTools.desc}
        icon={QrCode}
        iconGradient="from-teal-600 to-cyan-700"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setActiveTab('generate');
              stopCamera();
            }}
            className={`pb-3 px-5 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'generate'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{language === 'hi' ? 'QR कोड बनाएं (Generator)' : 'Generate QR Code'}</span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`pb-3 px-5 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'scan'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>{language === 'hi' ? 'QR कोड स्कैन करें (Scanner)' : 'Scan QR Code'}</span>
          </button>
        </div>

        {activeTab === 'generate' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select QR Code Type:
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
                  {[
                    { id: 'url', label: 'Website' },
                    { id: 'upi', label: 'UPI Pay' },
                    { id: 'wifi', label: 'Wi-Fi' },
                    { id: 'text', label: 'Text' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setQrType(item.id as typeof qrType)}
                      className={`py-2 rounded-xl border text-center transition-all ${
                        qrType === item.id
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Inputs based on type */}
              {qrType === 'url' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website URL:
                  </label>
                  <input
                    type="url"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              )}

              {qrType === 'upi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      UPI VPA / ID (e.g. name@okhdfcbank, name@paytm):
                    </label>
                    <input
                      type="text"
                      value={upiDetails.vpa}
                      onChange={(e) => setUpiDetails((p) => ({ ...p, vpa: e.target.value }))}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Payee Name:
                    </label>
                    <input
                      type="text"
                      value={upiDetails.name}
                      onChange={(e) => setUpiDetails((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Amount in ₹ (Optional):
                    </label>
                    <input
                      type="number"
                      placeholder="Leave empty for customer-entered amount"
                      value={upiDetails.amount || ''}
                      onChange={(e) => setUpiDetails((p) => ({ ...p, amount: e.target.value }))}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {qrType === 'wifi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Wi-Fi Network Name (SSID):
                    </label>
                    <input
                      type="text"
                      value={wifiDetails.ssid}
                      onChange={(e) => setWifiDetails((p) => ({ ...p, ssid: e.target.value }))}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Password:
                    </label>
                    <input
                      type="password"
                      value={wifiDetails.password || ''}
                      onChange={(e) => setWifiDetails((p) => ({ ...p, password: e.target.value }))}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {qrType === 'text' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Text / Message Content:
                  </label>
                  <textarea
                    rows={4}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Right Preview */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 object-contain" />
                ) : (
                  <RefreshCw className="w-10 h-10 animate-spin text-slate-400" />
                )}
                <span className="text-[11px] text-slate-400 mt-2">
                  100% In-Browser High-Correction QR
                </span>
              </div>

              <button
                onClick={handleDownloadQr}
                className="w-full max-w-xs py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Code (PNG)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Scanner Tab */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`p-6 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  isCameraActive
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600'
                    : 'bg-slate-50 dark:bg-slate-800 hover:border-teal-500 text-slate-800 dark:text-slate-100'
                }`}
              >
                <Camera className="w-8 h-8 text-teal-600" />
                <span className="font-semibold text-sm">
                  {isCameraActive ? 'Stop Camera' : 'Scan via Device Camera'}
                </span>
                <span className="text-xs text-slate-400">Works directly on mobile & laptop</span>
              </button>

              <label className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-teal-500 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScanImageUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-teal-600" />
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                  Upload Photo containing QR
                </span>
                <span className="text-xs text-slate-400">Scans instantly from image file</span>
              </label>
            </div>

            {/* Video preview for camera */}
            {isCameraActive && (
              <div className="relative max-w-md mx-auto aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-teal-500">
                <video ref={videoRef} playsInline className="w-full h-full object-cover" />
                <canvas ref={scanCanvasRef} className="hidden" />
                <div className="absolute inset-10 border-2 border-dashed border-teal-400/80 rounded-xl pointer-events-none animate-pulse" />
              </div>
            )}

            {/* Scanned Result */}
            {scannedResult && (
              <div className="p-5 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Scanned Result Content:
                </span>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800 font-mono text-sm break-all">
                  {scannedResult}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleCopy(scannedResult)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                  {scannedResult.startsWith('http') && (
                    <a
                      href={scannedResult}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Link</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
