// src/components/department/QRValidator.tsx
"use client";

import React, { useState, useCallback, useRef } from 'react';
import QRScanner from './QRScanner';

interface AppointmentData {
  ref: string;
  name: string;
  service: string;
  dept: string;
  date: string;
  time: string;
  agent: string;
  office: string;
  verify: string;
  generated: string;
}

interface ValidationResult {
  success: boolean;
  message: string;
  appointment?: {
    bookingReference: string;
    citizenName: string;
    serviceType: string;
    date: string;
    time: string;
    status: string;
    department?: string;
  };
  timeStatus?: 'early' | 'valid' | 'late' | 'expired';
  departmentMatch?: boolean;
}

interface QRValidatorProps {
  departmentName: string;
  onValidationResult?: (result: ValidationResult) => void;
}

export default function QRValidator({ departmentName, onValidationResult }: QRValidatorProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const recentScansRef = useRef<string[]>([]);

  const parseQRData = useCallback((qrString: string): AppointmentData | null => {
    try {
      const parsed = JSON.parse(qrString);
      if (parsed.ref && parsed.date && parsed.time && parsed.dept) {
        return parsed as AppointmentData;
      }
      return null;
    } catch (error) {
      console.error('Failed to parse QR data:', error);
      return null;
    }
  }, []);

  const validateTimeWindow = useCallback((appointmentDate: string, appointmentTime: string): 'early' | 'valid' | 'late' | 'expired' => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    
    // Calculate time difference in minutes
    const diffMinutes = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);
    
    // Valid window: 1 hour before to 15 minutes after
    if (diffMinutes > 60) {
      return 'early'; // Too early (more than 1 hour before)
    } else if (diffMinutes >= -15) {
      return 'valid'; // Within valid window
    } else if (diffMinutes >= -120) {
      return 'late'; // Late but within 2 hours
    } else {
      return 'expired'; // Too late (more than 2 hours past)
    }
  }, []);

  const validateAppointment = useCallback(async (qrData: AppointmentData): Promise<ValidationResult> => {
    try {
      // Check department match
      const departmentMatch = qrData.dept.toLowerCase().includes(departmentName.toLowerCase()) ||
                             departmentName.toLowerCase().includes(qrData.dept.toLowerCase());

      // Check time window
      const timeStatus = validateTimeWindow(qrData.date, qrData.time);

      // Validate with backend API
      const response = await fetch(`/api/public/verify-appointment?ref=${qrData.ref}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.status}`);
      }

      const apiResult = await response.json();

      if (!apiResult.success) {
        return {
          success: false,
          message: apiResult.message || 'Appointment verification failed',
          timeStatus,
          departmentMatch
        };
      }

      // Check if appointment status allows entry
      const appointment = apiResult.data;
      if (appointment.status === 'cancelled') {
        return {
          success: false,
          message: 'This appointment has been cancelled',
          appointment,
          timeStatus,
          departmentMatch
        };
      }

      if (appointment.status === 'completed') {
        return {
          success: false,
          message: 'This appointment has already been completed',
          appointment,
          timeStatus,
          departmentMatch
        };
      }

      // Determine overall success based on time and department
      let success = true;
      let message = '';

      if (!departmentMatch) {
        success = false;
        message = `This appointment is for ${qrData.dept}, not ${departmentName}`;
      } else if (timeStatus === 'early') {
        success = false;
        message = `Too early! Please arrive no more than 1 hour before your appointment (${qrData.time})`;
      } else if (timeStatus === 'late') {
        success = false;
        message = `You are late! Your appointment was at ${qrData.time}. Please contact reception.`;
      } else if (timeStatus === 'expired') {
        success = false;
        message = `This appointment has expired. Your appointment was at ${qrData.time} on ${qrData.date}.`;
      } else {
        message = 'Valid appointment! You may proceed to reception.';
      }

      return {
        success,
        message,
        appointment,
        timeStatus,
        departmentMatch
      };

    } catch (error) {
      console.error('Validation error:', error);
      return {
        success: false,
        message: 'Failed to validate appointment. Please try again or contact reception.',
        timeStatus: 'expired',
        departmentMatch: false
      };
    }
  }, [departmentName, validateTimeWindow]);

  const handleQRScan = useCallback(async (qrString: string) => {
    // Check for recent duplicate scans
    if (recentScansRef.current.includes(qrString)) {
      return; // Skip duplicate
    }

    // Add to recent scans and keep only last 5
    recentScansRef.current = [...recentScansRef.current.slice(-4), qrString];
    
    setIsValidating(true);

    const qrData = parseQRData(qrString);
    
    if (!qrData) {
      const result: ValidationResult = {
        success: false,
        message: 'Invalid QR code format. Please ensure this is a valid GovLink appointment QR code.'
      };
      setValidationResult(result);
      onValidationResult?.(result);
      setIsValidating(false);
      return;
    }

    const result = await validateAppointment(qrData);
    setValidationResult(result);
    onValidationResult?.(result);
    setIsValidating(false);

    // Auto-clear result after 10 seconds
    setTimeout(() => {
      setValidationResult(null);
    }, 10000);
  }, [onValidationResult, validateAppointment, parseQRData]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input so the same file can be uploaded again if needed
    event.target.value = '';

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const result: ValidationResult = {
        success: false,
        message: 'Please upload a valid image file (PNG, JPG, JPEG, etc.)'
      };
      setValidationResult(result);
      onValidationResult?.(result);
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    setUploadingFile(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      
      // Create a temporary div for the scanner
      const tempDiv = document.createElement('div');
      tempDiv.id = 'temp-file-scanner-' + Date.now();
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
      
      const html5QrCode = new Html5Qrcode(tempDiv.id);
      
      try {
        // Use the scanFile method on the instance
        const qrString = await html5QrCode.scanFile(file, true);
        console.log("QR Code from file:", qrString);
        
        // Process the scanned QR code same as camera scan
        await handleQRScan(qrString);
        
      } catch (scanError) {
        console.error('QR scan error:', scanError);
        throw new Error('Could not detect a valid QR code in the uploaded image. Please ensure the image contains a clear, well-lit QR code.');
      } finally {
        // Clean up
        try {
          await html5QrCode.clear();
        } catch (clearError) {
          console.log('Clear error (non-critical):', clearError);
        }
        document.body.removeChild(tempDiv);
        setIsValidating(false);
        setUploadingFile(false);
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      const result: ValidationResult = {
        success: false,
        message: error instanceof Error 
          ? error.message 
          : 'Could not read QR code from the uploaded image. Please ensure the image contains a clear, well-lit QR code.'
      };
      setValidationResult(result);
      onValidationResult?.(result);
      setIsValidating(false);
      setUploadingFile(false);
    }
  }, [handleQRScan, onValidationResult]);

  const getResultColor = (result: ValidationResult) => {
    if (result.success) return 'bg-green-50 border-green-200 text-green-800';
    if (result.timeStatus === 'early') return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    if (result.timeStatus === 'late') return 'bg-orange-50 border-orange-200 text-orange-800';
    return 'bg-red-50 border-red-200 text-red-800';
  };

  const getResultIcon = (result: ValidationResult) => {
    if (result.success) return '✅';
    if (result.timeStatus === 'early') return '⏰';
    if (result.timeStatus === 'late') return '⏳';
    if (!result.departmentMatch) return '🏢';
    return '❌';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          QR Code Appointment Validator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Department: <span className="font-semibold text-blue-600">{departmentName}</span>
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isScanning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isScanning ? '⏹️ Stop Camera' : '📷 Use Camera'}
          </button>
          
          <label className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-2 ${
            uploadingFile 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}>
            {uploadingFile ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>📁 Upload QR Image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploadingFile}
            />
          </label>
        </div>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Choose to scan with camera or upload a QR code image
        </p>
      </div>

      {isScanning && (
        <div className="mb-6">
          <QRScanner
            onScanSuccess={handleQRScan}
            onScanError={(error) => console.error('Scan error:', error)}
            isActive={isScanning}
          />
          <p className="text-center text-sm text-gray-500 mt-2">
            Use camera or upload an image file containing a QR code
          </p>
        </div>
      )}

      {/* Hidden div for file scanning */}
      <div id="temp-reader" style={{ display: 'none' }}></div>

      {isValidating && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {uploadingFile ? 'Processing uploaded image...' : 'Validating appointment...'}
          </p>
        </div>
      )}

      {validationResult && !isValidating && (
        <div className={`p-6 rounded-lg border-2 ${getResultColor(validationResult)} mb-6`}>
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{getResultIcon(validationResult)}</div>
            <h3 className="text-xl font-bold mb-2">
              {validationResult.success ? 'Valid Appointment' : 'Invalid Appointment'}
            </h3>
            <p className="text-lg">{validationResult.message}</p>
          </div>

          {validationResult.appointment && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mt-4">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Appointment Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Reference:</strong> {validationResult.appointment.bookingReference}</div>
                <div><strong>Name:</strong> {validationResult.appointment.citizenName}</div>
                <div><strong>Service:</strong> {validationResult.appointment.serviceType}</div>
                <div><strong>Date:</strong> {new Date(validationResult.appointment.date).toLocaleDateString()}</div>
                <div><strong>Time:</strong> {validationResult.appointment.time}</div>
                <div><strong>Status:</strong> {validationResult.appointment.status}</div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setValidationResult(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              Clear Result
            </button>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="mb-2">
          <strong>Validation Rules:</strong>
        </div>
        <ul className="space-y-1">
          <li>✅ Valid: 1 hour before to 15 minutes after appointment time</li>
          <li>⏰ Too Early: More than 1 hour before appointment</li>
          <li>⏳ Late: 15 minutes to 2 hours after appointment</li>
          <li>❌ Expired: More than 2 hours after appointment</li>
          <li>🏢 Department must match</li>
        </ul>
      </div>
    </div>
  );
}
