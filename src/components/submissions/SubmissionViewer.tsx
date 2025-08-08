// src/components/agent/submissions/SubmissionViewer.tsx
"use client";
import React, { useState, useEffect } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';

interface SubmissionFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

interface SubmissionViewerProps {
  files: SubmissionFile[];
  isOpen: boolean;
  onClose: () => void;
  initialFileIndex?: number;
  language?: Language;
  submissionId?: string;
  citizenName?: string;
}

// Viewer translations
const viewerTranslations: Record<Language, {
  documentViewer: string;
  attachments: string;
  fileInfo: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  download: string;
  downloadAll: string;
  close: string;
  previous: string;
  next: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  rotate: string;
  fullscreen: string;
  unsupportedFormat: string;
  loadingError: string;
  noFiles: string;
  fileNotFound: string;
  of: string;
}> = {
  en: {
    documentViewer: 'Document Viewer',
    attachments: 'Attachments',
    fileInfo: 'File Information',
    fileName: 'File Name',
    fileSize: 'File Size',
    fileType: 'File Type',
    download: 'Download',
    downloadAll: 'Download All',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset Zoom',
    rotate: 'Rotate',
    fullscreen: 'Fullscreen',
    unsupportedFormat: 'Unsupported file format',
    loadingError: 'Error loading file',
    noFiles: 'No files to display',
    fileNotFound: 'File not found',
    of: 'of'
  },
  si: {
    documentViewer: 'ලේඛන දර්ශකය',
    attachments: 'ඇමුණුම්',
    fileInfo: 'ගොනු තොරතුරු',
    fileName: 'ගොනු නම',
    fileSize: 'ගොනු ප්‍රමාණය',
    fileType: 'ගොනු වර්ගය',
    download: 'බාගත කරන්න',
    downloadAll: 'සියල්ල බාගත කරන්න',
    close: 'වසන්න',
    previous: 'පෙර',
    next: 'ඊළඟ',
    zoomIn: 'විශාල කරන්න',
    zoomOut: 'කුඩා කරන්න',
    resetZoom: 'සෙසු කරන්න',
    rotate: 'කරකන්න',
    fullscreen: 'සම්පූර්ණ තිරය',
    unsupportedFormat: 'සහාය නොදක්වන ගොනු ආකෘතිය',
    loadingError: 'ගොනුව පූරණය කිරීමේ දෝෂය',
    noFiles: 'පෙන්වීමට ගොනු නැත',
    fileNotFound: 'ගොනුව හමු නොවීය',
    of: 'න්'
  },
  ta: {
    documentViewer: 'ஆவண காட்சியாளர்',
    attachments: 'இணைப்புகள்',
    fileInfo: 'கோப்பு தகவல்',
    fileName: 'கோப்பு பெயர்',
    fileSize: 'கோப்பு அளவு',
    fileType: 'கோப்பு வகை',
    download: 'பதிவிறக்கம்',
    downloadAll: 'அனைத்தையும் பதிவிறக்கவும்',
    close: 'மூடு',
    previous: 'முந்தைய',
    next: 'அடுத்து',
    zoomIn: 'பெரிதாக்கு',
    zoomOut: 'சிறிதாக்கு',
    resetZoom: 'மீட்டமை',
    rotate: 'சுழற்று',
    fullscreen: 'முழுத்திரை',
    unsupportedFormat: 'ஆதரிக்கப்படாத கோப்பு வடிவம்',
    loadingError: 'கோப்பு ஏற்றுவதில் பிழை',
    noFiles: 'காட்ட கோப்புகள் இல்லை',
    fileNotFound: 'கோப்பு காணப்படவில்லை',
    of: 'இல்'
  }
};

const SubmissionViewer: React.FC<SubmissionViewerProps> = ({
  files,
  isOpen,
  onClose,
  initialFileIndex = 0,
  language = 'en',
  submissionId,
  citizenName
}) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(initialFileIndex);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [hasError, setHasError] = useState(false);
  const t = viewerTranslations[language];

  useEffect(() => {
    if (isOpen) {
      setCurrentFileIndex(initialFileIndex);
      setZoom(100);
      setRotation(0);
      setHasError(false);
    }
  }, [isOpen, initialFileIndex]);

  if (!isOpen || !files.length) return null;

  const currentFile = files[currentFileIndex];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5722]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      );
    } else if (fileType.includes('image')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#008060]">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      );
    } else {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFC72C]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      );
    }
  };

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const isPdfFile = (fileType: string) => {
    return fileType === 'application/pdf';
  };

  const handlePrevious = () => {
    setCurrentFileIndex(prev => prev > 0 ? prev - 1 : files.length - 1);
    setZoom(100);
    setRotation(0);
    setHasError(false);
  };

  const handleNext = () => {
    setCurrentFileIndex(prev => prev < files.length - 1 ? prev + 1 : 0);
    setZoom(100);
    setRotation(0);
    setHasError(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = (file: SubmissionFile) => {
    console.log(`Downloading file: ${file.fileName}`);
    // In real implementation, this would trigger file download
    const link = document.createElement('a');
    link.href = file.fileUrl;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    console.log('Downloading all files as ZIP');
    // In real implementation, this would create and download a ZIP file
    files.forEach(file => {
      setTimeout(() => handleDownload(file), 100);
    });
  };

  const renderFileContent = () => {
    if (!currentFile) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p className="text-foreground font-medium">{t.fileNotFound}</p>
          </div>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-[#FF5722]">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <p className="text-foreground font-medium">{t.loadingError}</p>
            <button
              onClick={() => {
                setHasError(false);
              }}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (isImageFile(currentFile.fileType)) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentFile.fileUrl}
            alt={currentFile.fileName}
            className="max-w-full max-h-full object-contain transition-all duration-300"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
            onError={() => {
              setHasError(true);
            }}
          />
        </div>
      );
    } else if (isPdfFile(currentFile.fileType)) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <iframe
            src={currentFile.fileUrl}
            className="w-full h-full border-0 rounded-lg"
            title={currentFile.fileName}
            onError={() => {
              setHasError(true);
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {getFileIcon(currentFile.fileType)}
            <p className="mt-4 text-foreground font-medium">{t.unsupportedFormat}</p>
            <p className="text-sm text-muted-foreground mt-2">{currentFile.fileName}</p>
            <button
              onClick={() => handleDownload(currentFile)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 text-sm font-medium"
            >
              {t.download}
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col z-50 animate-fade-in-up">
      {/* Header */}
      <div className="glass-morphism border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{t.documentViewer}</h2>
            {(submissionId || citizenName) && (
              <p className="text-sm text-muted-foreground">
                {submissionId && `ID: ${submissionId}`}
                {submissionId && citizenName && ' • '}
                {citizenName}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* File counter */}
            <span className="text-sm text-muted-foreground px-3 py-1 bg-card/30 rounded-lg">
              {currentFileIndex + 1} {t.of} {files.length}
            </span>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-card/30 border border-border/50 text-foreground hover:bg-card/50 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-black/20">
          {/* Toolbar */}
          <div className="glass-morphism border-b border-border/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Navigation */}
                <button
                  onClick={handlePrevious}
                  disabled={files.length <= 1}
                  className="p-2 rounded-lg bg-card/30 border border-border/50 text-foreground hover:bg-card/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={files.length <= 1}
                  className="p-2 rounded-lg bg-card/30 border border-border/50 text-foreground hover:bg-card/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>

                <div className="w-px h-6 bg-border/50 mx-2"></div>

                {/* Zoom controls (for images) */}
                {currentFile && isImageFile(currentFile.fileType) && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      className="p-2 rounded-lg bg-card/30 border border-border/50 text-foreground hover:bg-card/50 transition-all duration-300"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </button>
                    <span className="text-sm text-foreground px-2 py-1 bg-card/30 rounded">
                      {zoom}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 rounded-lg bg-card/30 border border-border/50 text-foreground hover:bg-card/50 transition-all duration-300"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="px-3 py-2 rounded-lg bg-card/30 border border-border/50 text-foreground hover:bg-card/50 transition-all duration-300 text-xs"
                    >
                      {t.resetZoom}
                    </button>
                    <button
                      onClick={handleRotate}
                      className="p-2 rounded-lg bg-card/30 border border-border/50 text-foreground hover:bg-card/50 transition-all duration-300"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => currentFile && handleDownload(currentFile)}
                  className="px-3 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-lg hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 text-sm font-medium"
                >
                  {t.download}
                </button>
                {files.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className="px-3 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 text-sm font-medium"
                  >
                    {t.downloadAll}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* File Content */}
          {renderFileContent()}
        </div>

        {/* Sidebar */}
        <div className="w-80 glass-morphism border-l border-border/50 flex flex-col">
          {/* File Info */}
          <div className="p-4 border-b border-border/30">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t.fileInfo}</h3>
            {currentFile && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {getFileIcon(currentFile.fileType)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm break-words">{currentFile.fileName}</p>
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-muted-foreground">{t.fileSize}:</span>
                    <span className="text-foreground ml-2">{formatFileSize(currentFile.fileSize)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.fileType}:</span>
                    <span className="text-foreground ml-2 break-words">{currentFile.fileType}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t.attachments} ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <button
                  key={file.id}
                  onClick={() => {
                    setCurrentFileIndex(index);
                    setZoom(100);
                    setRotation(0);
                    setHasError(false);
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all duration-300 ${
                    index === currentFileIndex
                      ? 'bg-[#FFC72C]/10 border-[#FFC72C]/30 text-[#FFC72C]'
                      : 'bg-card/30 border-border/50 text-foreground hover:bg-card/50 hover:border-[#FFC72C]/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getFileIcon(file.fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm break-words">{file.fileName}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionViewer;
