// src/components/department/QRScanner.tsx
"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  isActive: boolean;
}

export default function QRScanner({ onScanSuccess, onScanError, isActive }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isActiveRef = useRef(isActive);
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanErrorRef = useRef(onScanError);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scannerState, setScannerState] = useState<'idle' | 'starting' | 'running' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [scanMode, setScanMode] = useState<'camera' | 'file'>('camera');

  // Update refs when props change
  useEffect(() => {
    isActiveRef.current = isActive;
    onScanSuccessRef.current = onScanSuccess;
    onScanErrorRef.current = onScanError;
  }, [isActive, onScanSuccess, onScanError]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (PNG, JPG, etc.)');
      if (onScanErrorRef.current) {
        onScanErrorRef.current('Invalid file type');
      }
      return;
    }

    setScannerState('starting');
    setErrorMessage('');

    try {
      const html5QrCode = new Html5Qrcode("file-scan-result");
      const result = await html5QrCode.scanFile(file, true);
      
      console.log("QR Code from file:", result);
      setScannerState('running');
      onScanSuccessRef.current(result);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Failed to scan QR from file:", error);
      setScannerState('error');
      setErrorMessage('Failed to read QR code from image. Make sure the image contains a clear QR code.');
      if (onScanErrorRef.current) {
        onScanErrorRef.current(error instanceof Error ? error.message : String(error));
      }
    }
  }, []);

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((error) => {
        console.error("Error stopping scanner:", error);
      });
      scannerRef.current = null;
    }
    setScannerState('idle');
    setErrorMessage('');
  }, []);

  const startScanner = useCallback(() => {
    if (scannerRef.current || !isActiveRef.current) {
      return;
    }

    console.log("Starting QR Scanner...");
    setScannerState('starting');
    setErrorMessage('');

    try {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0], // Only QR codes
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 1
      };

      scannerRef.current = new Html5QrcodeScanner("qr-scanner", config, false);
      
      scannerRef.current.render(
        (decodedText: string) => {
          console.log("QR Code scanned successfully:", decodedText);
          setScannerState('running');
          onScanSuccessRef.current(decodedText);
        },
        (error: string) => {
          // Don't log continuous scanning errors, but log camera/permission errors
          if (!error.includes("QR code parse error") && !error.includes("No MultiFormat Readers")) {
            console.log("Scanner error:", error);
            if (error.includes("Permission") || error.includes("Camera")) {
              setScannerState('error');
              setErrorMessage("Camera permission denied or camera not available");
            }
            if (onScanErrorRef.current) {
              onScanErrorRef.current(error);
            }
          }
        }
      );

      // Set running state after a short delay to allow scanner to initialize
      setTimeout(() => {
        if (scannerRef.current) {
          setScannerState('running');
        }
      }, 1000);

    } catch (error) {
      console.error("Failed to start scanner:", error);
      setScannerState('error');
      setErrorMessage("Failed to initialize camera scanner");
      if (onScanErrorRef.current) {
        onScanErrorRef.current(error instanceof Error ? error.message : String(error));
      }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isActive, startScanner, stopScanner]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode Selection */}
      <div className="mb-4 flex rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-gray-100 dark:bg-gray-700">
        <button
          onClick={() => setScanMode('camera')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            scanMode === 'camera'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📷 Camera Scan
        </button>
        <button
          onClick={() => setScanMode('file')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            scanMode === 'file'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📁 Upload Image
        </button>
      </div>

      {/* Camera Scanning Mode */}
      {scanMode === 'camera' && (
        <>
          <div 
            id="qr-scanner" 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden min-h-[300px] bg-black qr-scanner-container"
            style={{ 
              minHeight: '300px',
              display: isActive ? 'block' : 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!isActive && (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">📷</div>
                <div>QR Scanner is paused</div>
                <div className="text-sm mt-2">Click &quot;Start Scanner&quot; to begin</div>
              </div>
            )}
            {isActive && scannerState === 'starting' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p>Starting camera...</p>
                </div>
              </div>
            )}
            {isActive && scannerState === 'error' && (
              <div className="flex items-center justify-center h-full text-center">
                <div className="text-white">
                  <div className="text-4xl mb-2">⚠️</div>
                  <p className="text-red-400 font-medium">Camera Error</p>
                  <p className="text-sm text-gray-300 mt-1">{errorMessage}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Please allow camera permissions and refresh the page
                  </p>
                </div>
              </div>
            )}
          </div>
          {isActive && scannerState === 'running' && (
            <div className="text-center text-sm text-green-600 dark:text-green-400 mt-2">
              <div className="mb-1">✅ Camera is active - Point your QR code at the camera</div>
            </div>
          )}
          {isActive && scannerState === 'idle' && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              <div className="mb-1">📱 Point your camera at the QR code</div>
              <div className="text-xs">Make sure the QR code is clearly visible and well-lit</div>
              <div className="text-xs mt-1 text-blue-600">
                Camera should be visible above. If not, check browser permissions.
              </div>
            </div>
          )}
        </>
      )}

      {/* File Upload Mode */}
      {scanMode === 'file' && (
        <>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg min-h-[300px] bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Upload QR Code Image
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select an image file containing a QR code to scan
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="qr-file-input"
              />
              
              <label
                htmlFor="qr-file-input"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
              >
                📁 Choose Image File
              </label>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Supported formats: PNG, JPG, JPEG, GIF, BMP
              </p>
            </div>
          </div>
          
          {/* Hidden div for file scanning */}
          <div id="file-scan-result" className="hidden"></div>
          
          {scannerState === 'starting' && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Processing image...</span>
              </div>
            </div>
          )}
          
          {scannerState === 'error' && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center">
                <div className="text-red-400 mr-2">⚠️</div>
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Upload Error</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {scannerState === 'running' && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center">
                <div className="text-green-400 mr-2">✅</div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  QR code successfully read from image!
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
