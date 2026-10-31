import React, { useState } from 'react';
import { useApp, DownloadedFileItem } from '../../context/AppContext';
import {
  DownloadCloud,
  FileImage,
  FileText,
  ExternalLink,
  Download,
  Trash2,
  Share2,
  ArrowLeft,
  Eye,
  X,
  FileCheck,
} from 'lucide-react';

export const DownloadsView: React.FC = () => {
  const { downloadedFiles, deleteDownloadedFile, setMainTab, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'image' | 'pdf'>('all');
  const [previewItem, setPreviewItem] = useState<DownloadedFileItem | null>(null);

  const filteredItems = downloadedFiles.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const handleReDownload = (item: DownloadedFileItem) => {
    // If Android Bridge exists
    if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.saveBase64 === 'function') {
      (window as any).AndroidBridge.saveBase64(item.url, item.name);
      return;
    }
    const a = document.createElement('a');
    a.href = item.url;
    a.download = item.name;
    a.click();
  };

  const handleShare = async (item: DownloadedFileItem) => {
    if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.shareFile === 'function') {
      (window as any).AndroidBridge.shareFile(item.url, item.name);
      return;
    }
    if (navigator.share) {
      try {
        const response = await fetch(item.url);
        const blob = await response.blob();
        const file = new File([blob], item.name, { type: blob.type });
        await navigator.share({
          title: item.name,
          files: [file],
        });
      } catch (err) {
        handleReDownload(item);
      }
    } else {
      handleReDownload(item);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-28 text-slate-900 dark:text-slate-100 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/92 dark:bg-slate-950/92 backdrop-blur-md py-2.5 -mx-4 px-4 flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setMainTab('home')}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <DownloadCloud className="w-5 h-5 text-blue-600" />
          <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Downloaded Files
          </h1>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold">
          {downloadedFiles.length}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-2xl mb-4">
        {[
          { id: 'all', label: 'All Files' },
          { id: 'image', label: 'Images' },
          { id: 'pdf', label: 'PDFs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`py-1.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Downloads List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-xs mt-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-500 flex items-center justify-center mx-auto mb-3">
            <DownloadCloud className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
            No Downloaded Files Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5">
            Photos you compress, format conversions, or scanned PDFs will be stored here for instant access.
          </p>
          <button
            onClick={() => setMainTab('home')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95"
          >
            Explore Tools
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3"
            >
              {/* Thumbnail / Type Icon */}
              <div
                onClick={() => setPreviewItem(item)}
                className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                {item.type === 'image' && item.url ? (
                  <img src={item.url} alt="Thumb" className="w-full h-full object-cover" />
                ) : item.type === 'pdf' ? (
                  <FileText className="w-5 h-5 text-red-500" />
                ) : (
                  <FileImage className="w-5 h-5 text-blue-500" />
                )}
              </div>

              {/* Details */}
              <div
                onClick={() => setPreviewItem(item)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {item.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {item.sizeKb} KB • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleShare(item)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleReDownload(item)}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 active:scale-90"
                  title="Download Again"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteDownloadedFile(item.id)}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 active:scale-90"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-4 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[200px]">
                {previewItem.name}
              </h3>
              <button
                data-modal-close="true"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center mb-4">
              {previewItem.type === 'image' ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center p-4">
                  <FileText className="w-16 h-16 text-red-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    PDF Document ({previewItem.sizeKb} KB)
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleShare(previewItem)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                onClick={() => handleReDownload(previewItem)}
                className="py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
