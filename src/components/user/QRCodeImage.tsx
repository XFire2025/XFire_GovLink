// components/user/QRCodeImage.tsx
"use client";

import { useState, useEffect } from 'react';

interface QRCodeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const QRCodeImage: React.FC<QRCodeImageProps> = ({ 
  src, 
  alt, 
  className = "w-48 h-48 mx-auto", 
  width = 192, 
  height = 192 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    // Convert R2 URL to API endpoint URL
    const apiUrl = `/api/file/retrieve?url=${encodeURIComponent(src)}`;
    setImageUrl(apiUrl);
    setLoading(false);
  }, [src]);

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xs text-gray-500">Loading QR Code...</p>
        </div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="text-center text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs">QR Code not available</p>
        </div>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img 
      src={imageUrl}
      alt={alt}
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
      onError={() => {
        console.error('Failed to load QR code image from API:', imageUrl);
        setError(true);
      }}
    />
  );
};

export default QRCodeImage;
