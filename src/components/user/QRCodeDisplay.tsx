'use client';

import React, { useState } from 'react';
import QRCodeImage from './QRCodeImage';

interface QRCodeDisplayProps {
  qrCodeImageUrl?: string;
  bookingReference: string;
  appointmentData?: {
    service?: string;
    date?: string;
    time?: string;
    agent?: string;
    location?: string;
  };
  onClose: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeImageUrl,
  bookingReference,
  appointmentData,
  onClose
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadQRCode = async () => {
    if (!qrCodeImageUrl) return;
    
    setIsDownloading(true);
    try {
      // Use the file retrieve API since R2 is not publicly accessible
      const response = await fetch(`/api/file/retrieve?url=${encodeURIComponent(qrCodeImageUrl)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `appointment-pass-${bookingReference}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download QR code');
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card/95 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-2xl max-w-md w-full mx-auto modern-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">QR Code Pass</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-card/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-center space-y-4">
            {qrCodeImageUrl ? (
              <div className="bg-white p-4 rounded-xl mx-auto inline-block">
                <QRCodeImage 
                  src={qrCodeImageUrl} 
                  alt={`QR Code for appointment ${bookingReference}`}
                  className="w-48 h-48 mx-auto"
                />
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl border border-gray-200 dark:border-gray-600 inline-block">
                <div className="w-48 h-48 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">QR Code not available</p>
                </div>
              </div>
            )}
            
            <div className="text-center space-y-2">
              <div className="bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium inline-block">
                REF: {bookingReference}
              </div>
              
              {appointmentData && (
                <div className="text-sm text-muted-foreground space-y-1">
                  {appointmentData.service && (
                    <p><strong>Service:</strong> {appointmentData.service}</p>
                  )}
                  {appointmentData.agent && (
                    <p><strong>Agent:</strong> {appointmentData.agent}</p>
                  )}
                  {appointmentData.date && appointmentData.time && (
                    <p><strong>Date & Time:</strong> {formatDate(appointmentData.date)} at {formatTime(appointmentData.time)}</p>
                  )}
                  {appointmentData.location && (
                    <p><strong>Location:</strong> {appointmentData.location}</p>
                  )}
                </div>
              )}
            </div>

            {qrCodeImageUrl && (
              <button
                onClick={downloadQRCode}
                disabled={isDownloading}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl"
              >
                {isDownloading ? 'Downloading...' : 'Download Pass'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
