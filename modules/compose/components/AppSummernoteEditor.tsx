'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import Script from 'next/script';

interface AppSummernoteEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
}

// Track global load state across instances
let jqueryLoaded = false;
let summernoteLoaded = false;

export function AppSummernoteEditor({
  value = '',
  onChange,
  placeholder = 'Write your message here...',
  height = 200,
  className = '',
}: AppSummernoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const internalChangeRef = useRef(false);

  const initSummernote = useCallback(() => {
    if (!editorRef.current || initializedRef.current) return;
    if (typeof window === 'undefined') return;

    const $ = (window as any).jQuery;
    if (!$ || !$.fn.summernote) return;

    const $editor = $(editorRef.current);

    $editor.summernote({
      placeholder,
      height,
      tabsize: 2,
      focus: false,
      disableDragAndDrop: false,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'hr']],
        ['view', ['codeview', 'undo', 'redo']],
      ],
      fontNames: [
        'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
        'Helvetica Neue', 'Impact', 'Source Sans Pro', 'Tahoma',
        'Times New Roman', 'Trebuchet MS', 'Verdana',
      ],
      callbacks: {
        onChange: (contents: string) => {
          internalChangeRef.current = true;
          onChange?.(contents);
        },
        onImageUpload: (files: FileList) => {
          // Convert pasted/uploaded images to inline base64
          for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              $editor.summernote('insertImage', base64, (img: HTMLImageElement) => {
                $(img).css('max-width', '100%');
              });
            };
            reader.readAsDataURL(files[i]);
          }
        },
      },
    });

    // Set initial value
    if (value) {
      $editor.summernote('code', value);
    }

    initializedRef.current = true;
  }, [height, onChange, placeholder, value]);

  // Try to initialize when scripts are loaded
  useEffect(() => {
    if (jqueryLoaded && summernoteLoaded) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(initSummernote, 50);
      return () => clearTimeout(timer);
    }
  }, [initSummernote]);

  // Sync external value changes
  useEffect(() => {
    if (!initializedRef.current) return;
    if (internalChangeRef.current) {
      internalChangeRef.current = false;
      return;
    }

    const $ = (window as any).jQuery;
    if (!$ || !editorRef.current) return;

    const $editor = $(editorRef.current);
    const currentCode = $editor.summernote('code');
    if (currentCode !== value) {
      $editor.summernote('code', value || '');
    }
  }, [value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (initializedRef.current && editorRef.current) {
        try {
          const $ = (window as any).jQuery;
          if ($ && $.fn.summernote) {
            $(editorRef.current).summernote('destroy');
          }
        } catch { /* ignore */ }
        initializedRef.current = false;
      }
    };
  }, []);

  const handleJQueryLoad = () => {
    jqueryLoaded = true;
    if (summernoteLoaded) {
      setTimeout(initSummernote, 50);
    }
  };

  const handleSummernoteLoad = () => {
    summernoteLoaded = true;
    if (jqueryLoaded) {
      setTimeout(initSummernote, 50);
    }
  };

  return (
    <>
      {/* Load jQuery first, then Summernote Lite */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        strategy="afterInteractive"
        onLoad={handleJQueryLoad}
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.9.1/summernote-lite.min.css"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.9.1/summernote-lite.min.js"
        strategy="afterInteractive"
        onLoad={handleSummernoteLoad}
      />

      <style>{`
        /* Note Frame Wrapper */
        .note-editor.note-frame {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          color: var(--foreground) !important;
          border-radius: 0px !important;
          overflow: hidden !important;
        }

        /* Toolbar */
        .note-editor .note-toolbar {
          background-color: var(--neutral) !important;
          border-bottom: 1px solid var(--border) !important;
          color: var(--foreground) !important;
          padding: 6px 12px !important;
        }

        /* Buttons in toolbar */
        .note-editor .note-btn {
          background-color: transparent !important;
          border-color: transparent !important;
          color: var(--text-info) !important;
          transition: all 0.15s ease !important;
        }

        .note-editor .note-btn:hover {
          background-color: var(--hover-bg) !important;
          color: var(--foreground) !important;
        }

        .note-editor .note-btn.active {
          background-color: var(--hover-bg) !important;
          color: var(--accent-1) !important;
        }

        /* Editable Text Area */
        .note-editor .note-editable {
          background-color: var(--background) !important;
          color: var(--foreground) !important;
        }

        /* Placeholder inside editable area */
        .note-editor .note-placeholder {
          color: var(--text-info) !important;
          opacity: 0.4 !important;
        }

        /* Dropdown Menu inside Summernote */
        .note-dropdown-menu {
          background-color: var(--neutral) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius-md) !important;
          box-shadow: var(--shadow-lg) !important;
        }

        .note-dropdown-menu .note-dropdown-item {
          color: var(--foreground) !important;
        }

        .note-dropdown-menu .note-dropdown-item:hover {
          background-color: var(--hover-bg) !important;
        }

        /* Modal/Dialog for link/image/table */
        .note-modal-content {
          background-color: var(--neutral) !important;
          border: 1px solid var(--border) !important;
          color: var(--foreground) !important;
        }

        .note-modal-header {
          border-bottom: 1px solid var(--border) !important;
        }

        .note-modal-footer {
          border-top: 1px solid var(--border) !important;
        }

        .note-form-label {
          color: var(--text-info) !important;
        }

        .note-input {
          background-color: var(--background) !important;
          border: 1px solid var(--border) !important;
          color: var(--foreground) !important;
          border-radius: var(--radius-md) !important;
        }

        /* Status Bar / Bottom resize bar */
        .note-statusbar {
          background-color: var(--neutral) !important;
          border-top: 1px solid var(--border) !important;
        }

        .note-statusbar .note-resizebar {
          border-top: 1px solid var(--border) !important;
        }
      `}</style>

      <div className={className}>
        <div ref={editorRef} />
      </div>
    </>
  );
}
