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
    if (!appointment.qrCode?.imageUrl || typeof window === 'undefined') return;
    
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
    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-4 shadow-xl max-h-screen overflow-hidden">
      {/* Success Header - Compact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-green-700 dark:text-green-300">
              Appointment Confirmed!
            </h2>
            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
              REF: {appointment.bookingReference}
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout for Compact View */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Service Details */}
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">📋 Service Details</h3>
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Service:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 block">{appointment.serviceType}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Department:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 block">{appointment.department}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="ml-1 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Agent & Schedule Combined */}
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">👤 Agent Information</h3>
          <div className="space-y-1 text-xs mb-3">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Agent:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 block">{appointment.agent}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Position:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 block">{appointment.agentPosition}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Office:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 block">{appointment.agentOffice}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">📅 Schedule</h3>
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 block">{formatDate(appointment.date)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Time:</span>
              <span className="ml-1 font-medium text-green-600 text-sm block">{formatTime(appointment.time)}</span>
            </div>
          </div>
        </div>

        {/* QR Code Section - Compact */}
        {appointment.qrCode?.imageUrl && (
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm text-center">📱 Your Digital Pass</h3>
            
            {/* QR Code Preview - Smaller */}
            <div className="text-center mb-2">
              <div className="inline-block bg-white p-2 rounded-lg border border-yellow-400">
                <div onClick={() => setShowFullQR(true)} className="cursor-pointer hover:scale-105 transition-transform">
                  <QRCodeImage 
                    src={appointment.qrCode.imageUrl} 
                    alt={`QR Code for appointment ${appointment.bookingReference}`}
                    className="w-20 h-20 mx-auto"
                    width={80}
                    height={80}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">Click to view full size</p>
              </div>
            </div>

            {/* QR Code Action - Download Only */}
            <div>
              <button
                onClick={downloadQRCode}
                disabled={isDownloading}
                className="flex items-center justify-center gap-1 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-2 py-2 rounded text-xs font-medium transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isDownloading ? 'Wait...' : 'Download Pass'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section - Compact */}
      {appointment.notes && (
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 border border-gray-200 dark:border-gray-600 mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm">📝 Notes</h3>
          <p className="text-gray-700 dark:text-gray-300 text-xs">{appointment.notes}</p>
        </div>
      )}

      {/* Instructions - Compact */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-3 rounded-r-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1 text-sm">📋 Important Instructions</h4>
        <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-0.5">
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

              <div className="text-center">
                <button
                  onClick={downloadQRCode}
                  disabled={isDownloading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isDownloading ? 'Downloading...' : 'Download Pass'}
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
