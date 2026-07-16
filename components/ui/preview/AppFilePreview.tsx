'use client';

import React, { useState, useEffect } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { formatFileSize } from '../attachments/AppAttachmentCard';

export interface AppFilePreviewProps {
  open: boolean;
  onClose: () => void;
  file: File | string | null;
  onDownload?: (file: File | string) => void;
}

export const AppFilePreview: React.FC<AppFilePreviewProps> = ({
  open,
  onClose,
  file,
  onDownload
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Esc key and scroll locking logic
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !file) {
      setBlobUrl(null);
      return;
    }

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof file === 'string') {
      const extension = file.split('.').pop()?.toLowerCase() || '';
      const isImg = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(extension);
      if (isImg) {
        setBlobUrl(`https://picsum.photos/seed/${file}/800/600`);
      } else if (extension === 'pdf') {
        setBlobUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
      }
    }
  }, [open, file]);

  if (!open || !file) return null;

  const fileName = file instanceof File ? file.name : file;
  const fileSize = file instanceof File ? file.size : undefined;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  const isImage = file instanceof File ? file.type.startsWith('image/') : ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(extension);
  const isPdf = file instanceof File ? file.type === 'application/pdf' : extension === 'pdf';

  const handleDownload = () => {
    if (onDownload) {
      onDownload(file);
      return;
    }

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert(`Downloading: ${fileName}`);
    }
  };

  const renderPreviewContent = () => {
    // 1. Image Preview
    if (isImage && blobUrl) {
      return (
        <div className="flex items-center justify-center w-full h-full p-4 overflow-auto">
          <img src={blobUrl} alt={fileName} className="max-w-full max-h-full object-contain shadow-lg" />
        </div>
      );
    }

    // 2. PDF Preview
    if (isPdf && blobUrl) {
      return (
        <iframe
          src={blobUrl}
          className="w-full h-full border-0 bg-white"
          title={fileName}
        />
      );
    }

    // Static error layout (no mock spreadsheet/document templates)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 text-zinc-400">
        <FileText size={48} className="mb-3 opacity-30 text-white" />
        <h3 className="text-sm font-semibold text-white mb-1">{fileName}</h3>
        <p className="text-xs max-w-xs text-center mb-6 text-zinc-400">
          Preview failed or format not supported. Please download the file to view its contents.
        </p>
        <button
          onClick={handleDownload}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Download size={13} />
          Download File
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-black/95 text-white animate-fade-in font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10 shrink-0">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white truncate flex items-center gap-2">
            <span className="bg-[#107c41] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0">
              {extension || 'FILE'}
            </span>
            <span className="truncate">{fileName}</span>
          </h2>
          {fileSize && (
            <p className="text-[10px] text-zinc-400 font-medium mt-0.5">{formatFileSize(fileSize)}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            title="Download"
            onClick={handleDownload}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <Download size={16} />
          </button>
          <button
            title="Close"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="flex-1 w-full h-full overflow-hidden relative bg-[#121214] flex items-center justify-center cursor-zoom-out"
      >
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="w-full h-full flex items-center justify-center cursor-default"
        >
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  );
};

AppFilePreview.displayName = 'AppFilePreview';
