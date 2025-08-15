// components/user/AppointmentSuccessCard.tsx
"use client";

import { useState } from 'react';
import QRCodeImage from './QRCodeImage';

interface AppointmentData {
  id: string;
  bookingReference: string;
  citizenName: string;
  serviceType: string;
  department: string;
  agent: string;
  agentPosition: string;
  agentOffice: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  qrCode?: {
    imageUrl: string;
    generatedAt: string;
  } | null;
}

interface AppointmentSuccessCardProps {
  appointment: AppointmentData;
}

const AppointmentSuccessCard: React.FC<AppointmentSuccessCardProps> = ({ appointment }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFullQR, setShowFullQR] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const downloadQRCode = async () => {
    if (!appointment.qrCode?.imageUrl) return;
    
    setIsDownloading(true);
    try {
      // Use API endpoint to fetch the QR code image
      const apiUrl = `/api/file/retrieve?url=${encodeURIComponent(appointment.qrCode.imageUrl)}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch QR code: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `appointment-pass-${appointment.bookingReference}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-6 shadow-xl">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
          🎉 Appointment Confirmed!
        </h2>
        <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-lg font-bold inline-block">
          REF: {appointment.bookingReference}
        </div>
      </div>

      {/* Appointment Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Service Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Service:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{appointment.serviceType}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Department:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{appointment.department}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="ml-2 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">👤 Agent Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Agent:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{appointment.agent}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Position:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{appointment.agentPosition}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Office:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{appointment.agentOffice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📅 Schedule</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{formatDate(appointment.date)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Time:</span>
                <span className="ml-2 font-medium text-green-600 text-lg">{formatTime(appointment.time)}</span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          {appointment.qrCode?.imageUrl && (
            <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">📱 Your Digital Pass</h3>
              
              {/* QR Code Preview */}
              <div className="text-center mb-4">
                <div className="inline-block bg-white p-4 rounded-xl border-2 border-dashed border-yellow-400 shadow-lg">
                  <div onClick={() => setShowFullQR(true)} className="cursor-pointer hover:scale-105 transition-transform">
                    <QRCodeImage 
                      src={appointment.qrCode.imageUrl} 
                      alt={`QR Code for appointment ${appointment.bookingReference}`}
                      className="w-32 h-32 mx-auto"
                      width={128}
                      height={128}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Click to view full size</p>
                </div>
              </div>

              {/* QR Code Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={downloadQRCode}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Pass
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      {appointment.notes && (
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-600 mb-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📝 Notes</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{appointment.notes}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-4 rounded-r-xl">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">📋 Important Instructions</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• <strong>Check your email</strong> for the appointment pass with QR code</li>
          <li>• <strong>Arrive 15 minutes early</strong> for document verification</li>
          <li>• <strong>Bring original documents</strong> and the required photocopies</li>
          <li>• <strong>Present your QR code</strong> at the reception for quick check-in</li>
          <li>• <strong>Keep your phone charged</strong> to display the digital pass</li>
        </ul>
      </div>

      {/* Full Size QR Code Modal */}
      {showFullQR && appointment.qrCode?.imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Appointment Pass</h3>
              <button 
                onClick={() => setShowFullQR(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block mb-4">
                <QRCodeImage 
                  src={appointment.qrCode.imageUrl} 
                  alt={`QR Code for appointment ${appointment.bookingReference}`}
                  className="w-64 h-64 mx-auto"
                  width={256}
                  height={256}
                />
              </div>
              
              <div className="text-center mb-4">
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                  REF: {appointment.bookingReference}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(appointment.date)} at {formatTime(appointment.time)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadQRCode}
                  disabled={isDownloading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isDownloading ? 'Downloading...' : 'Download'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentSuccessCard;
