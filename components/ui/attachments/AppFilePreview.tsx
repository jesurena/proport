'use client';

import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { AppLabel } from '../labels/AppLabel';
import { AppButton } from '../buttons/AppButton';
import { formatFileSize, getAttachmentIcon } from './AppAttachmentCard';

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
  const [hasError, setHasError] = useState(false);

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
      setHasError(false);
      return;
    }

    setHasError(false);

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof file === 'string') {
      const targetUrl = file.startsWith('http://') || file.startsWith('https://') || file.startsWith('blob:') || file.startsWith('/')
        ? file
        : `http://localhost:7090/api/viewFile/${file}`;

      // Check if file URL is valid / 200 OK
      fetch(targetUrl, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) {
            setBlobUrl(targetUrl);
          } else {
            setHasError(true);
          }
        })
        .catch(() => {
          setHasError(true);
        });
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
    } else if (blobUrl && !hasError) {
      window.open(blobUrl, '_blank');
    } else {
      window.open(`http://localhost:7090/api/viewFile/${fileName}`, '_blank');
    }
  };

  const renderPreviewContent = () => {
    // If error occurs or format not supported or 404
    if (hasError || (!isImage && !isPdf)) {
      const iconSrc = getAttachmentIcon(fileName);

      return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 text-text-info animate-in fade-in duration-200">
          <img
            src={iconSrc}
            alt={fileName}
            className="w-20 h-20 mb-4 object-contain drop-shadow-md select-none"
          />
          <AppLabel as="h3" className="text-sm font-semibold text-text mb-1 max-w-md text-center truncate">
            {fileName}
          </AppLabel>
          <AppLabel as="p" variant="description" className="text-xs max-w-xs text-center mb-6 text-text-info">
            Preview failed or format not supported. Please download the file to view its contents.
          </AppLabel>
          <AppButton
            variant="neutral"
            size="sm"
            leftIcon={<Download size={13} />}
            onClick={handleDownload}
          >
            Download File
          </AppButton>
        </div>
      );
    }

    // 1. Image Preview
    if (isImage && blobUrl) {
      return (
        <div className="flex items-center justify-center w-full h-full p-4 overflow-auto">
          <img
            src={blobUrl}
            alt={fileName}
            onError={() => setHasError(true)}
            className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
          />
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
          onError={() => setHasError(true)}
        />
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-background/95 text-text backdrop-blur-md animate-fade-in font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-card-bg/90 border-b border-border/40 shrink-0">
        <div className="min-w-0 flex items-center gap-3">
          <img
            src={getAttachmentIcon(fileName)}
            alt="file icon"
            className="w-6 h-6 object-contain shrink-0"
          />
          <div className="min-w-0">
            <AppLabel as="h2" className="text-sm font-bold text-text truncate">
              {fileName}
            </AppLabel>
            {fileSize && (
              <AppLabel as="p" variant="description" className="text-[10px] text-text-info mt-0.5">
                {formatFileSize(fileSize)}
              </AppLabel>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <AppButton
            variant="ghost"
            size="icon"
            shape="pill"
            title="Download"
            onClick={handleDownload}
          >
            <Download size={15} />
          </AppButton>
          <AppButton
            variant="ghost"
            size="icon"
            shape="pill"
            title="Close"
            onClick={onClose}
          >
            <X size={16} />
          </AppButton>
        </div>
      </div>

      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="flex-1 w-full h-full overflow-hidden relative bg-neutral/5 flex items-center justify-center cursor-zoom-out"
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
