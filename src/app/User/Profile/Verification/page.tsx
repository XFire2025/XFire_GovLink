// src/app/User/Profile/Verification/page.tsx
"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';

// Types
type Language = 'en' | 'si' | 'ta';
type VerificationStep = 'upload' | 'review' | 'processing' | 'completed';
type DocumentType = 'nic' | 'selfie';

// Translations
const verificationTranslations: Record<Language, {
  title: string;
  subtitle: string;
  backToProfile: string;
  uploadStep: string;
  reviewStep: string;
  processingStep: string;
  completedStep: string;
  uploadNIC: string;
  uploadSelfie: string;
  nicHint: string;
  selfieHint: string;
  tipsTitle: string;
  tips: string[];
  securityNote: string;
  cancel: string;
  submitForVerification: string;
  reviewDocuments: string;
  confirmSubmission: string;
  processing: string;
  processingDesc: string;
  verificationComplete: string;
  verificationCompleteDesc: string;
  backToDashboard: string;
  dragDrop: string;
  browseFiles: string;
  uploadSuccessful: string;
  removeImage: string;
  fileTypeError: string;
  fileSizeError: string;
  required: string;
}> = {
  en: {
    title: 'Identity Verification',
    subtitle: 'Secure document verification to protect your account and access government services',
    backToProfile: '← Back to Profile',
    uploadStep: 'Upload Documents',
    reviewStep: 'Review & Confirm',
    processingStep: 'Processing',
    completedStep: 'Completed',
    uploadNIC: 'Upload NIC',
    uploadSelfie: 'Upload Selfie',
    nicHint: 'Front side of your National ID card',
    selfieHint: 'Hold your NIC next to your face',
    tipsTitle: 'Tips for Success',
    tips: [
      'Use good lighting, avoid shadows',
      'Remove glasses and headwear',
      'Ensure all text on NIC is clear',
      'Fit the entire document in frame',
      'Hold the document steady'
    ],
    securityNote: 'Your data is encrypted and secure',
    cancel: 'Cancel',
    submitForVerification: 'Submit for Verification',
    reviewDocuments: 'Review Your Documents',
    confirmSubmission: 'Confirm & Submit',
    processing: 'Processing Your Documents',
    processingDesc: 'Our secure system is verifying your documents. This usually takes 1-2 minutes.',
    verificationComplete: 'Verification Complete!',
    verificationCompleteDesc: 'Your identity has been successfully verified. You now have full access to all government services.',
    backToDashboard: 'Back to Dashboard',
    dragDrop: 'Drag & drop or',
    browseFiles: 'browse files',
    uploadSuccessful: 'Upload Successful',
    removeImage: 'Remove image',
    fileTypeError: 'Please upload JPG, PNG, or WebP images only',
    fileSizeError: 'File size must be less than 5MB',
    required: 'Required'
  },
  si: {
    title: 'හැඳුනුම්කරණ සත්‍යාපනය',
    subtitle: 'ඔබගේ ගිණුම ආරක්ෂා කිරීමට සහ රාජ්‍ය සේවා වෙත ප්‍රවේශ වීමට ආරක්ෂිත ලේඛන සත්‍යාපනය',
    backToProfile: '← පැතිකඩට ආපසු',
    uploadStep: 'ලේඛන උඩුගත කරන්න',
    reviewStep: 'සමාලෝචනය සහ තහවුරු කරන්න',
    processingStep: 'සැකසෙමින්',
    completedStep: 'සම්පූර්ණයි',
    uploadNIC: 'NIC උඩුගත කරන්න',
    uploadSelfie: 'ස්වයං ඡායාරූපය උඩුගත කරන්න',
    nicHint: 'ඔබගේ ජාතික හැඳුනුම්පතේ ඉදිරිපස',
    selfieHint: 'ඔබගේ මුහුණ අසල NIC රුව',
    tipsTitle: 'සාර්ථකත්වය සඳහා උපදෙස්',
    tips: [
      'හොඳ ආලෝකය භාවිතා කරන්න, සෙවන වළකින්න',
      'කණ්ණාඩි සහ හිස් ආවරණ ඉවත් කරන්න',
      'NIC හි සියලුම පෙළ පැහැදිලි වන්න',
      'සම්පූර්ණ ලේඛනය රාමුව තුළ තබන්න',
      'ලේඛනය ස්ථිරව අල්ලාගෙන සිටින්න'
    ],
    securityNote: 'ඔබගේ දත්ත සංකේතනය කර ආරක්ෂිතයි',
    cancel: 'අවලංගු කරන්න',
    submitForVerification: 'සත්‍යාපනය සඳහා ගොනු කරන්න',
    reviewDocuments: 'ඔබගේ ලේඛන සමාලෝචනය කරන්න',
    confirmSubmission: 'තහවුරු කර ගොනු කරන්න',
    processing: 'ඔබගේ ලේඛන සැකසෙමින්',
    processingDesc: 'අපගේ ආරක්ෂිත පද්ධතිය ඔබගේ ලේඛන සත්‍යාපනය කරමින් පවතී. මෙයට සාමාන්‍යයෙන් මිනිත්තු 1-2 ක් ගතවේ.',
    verificationComplete: 'සත්‍යාපනය සම්පූර්ණයි!',
    verificationCompleteDesc: 'ඔබගේ අනන්‍යතාවය සාර්ථකව සත්‍යාපනය කර ඇත. ඔබට දැන් සියලුම රාජ්‍ය සේවා වෙත සම්පූර්ණ ප්‍රවේශයක් ඇත.',
    backToDashboard: 'පුවරුවට ආපසු',
    dragDrop: 'ඇදගෙන දමන්න හෝ',
    browseFiles: 'ගොනු සොයන්න',
    uploadSuccessful: 'උඩුගත කිරීම සාර්ථකයි',
    removeImage: 'ඡායාරූපය ඉවත් කරන්න',
    fileTypeError: 'කරුණාකර JPG, PNG, හෝ WebP ඡායාරූප පමණක් උඩුගත කරන්න',
    fileSizeError: 'ගොනුවේ ප්‍රමාණය MB 5 ට වඩා අඩු විය යුතුය',
    required: 'අවශ්‍යයි'
  },
  ta: {
    title: 'அடையாள சரிபார்ப்பு',
    subtitle: 'உங்கள் கணக்கைப் பாதுகாக்கவும் அரசாங்க சேவைகளை அணுகவும் பாதுகாப்பான ஆவண சரிபார்ப்பு',
    backToProfile: '← சுயவிவரத்திற்கு திரும்பவும்',
    uploadStep: 'ஆவணங்களைப் பதிவேற்றவும்',
    reviewStep: 'மதிப்பாய்வு மற்றும் உறுதிப்படுத்தவும்',
    processingStep: 'செயலாக்கம்',
    completedStep: 'நிறைவு',
    uploadNIC: 'NIC பதிவேற்றவும்',
    uploadSelfie: 'செல்ஃபி பதிவேற்றவும்',
    nicHint: 'உங்கள் தேசிய அடையாள அட்டையின் முன் பக்கம்',
    selfieHint: 'உங்கள் முகத்திற்கு அருகில் NIC ஐ வைத்துக்கொள்ளுங்கள்',
    tipsTitle: 'வெற்றிக்கான குறிப்புகள்',
    tips: [
      'நல்ல வெளிச்சத்தைப் பயன்படுத்துங்கள், நிழல்களைத் தவிர்க்கவும்',
      'கண்ணாடி மற்றும் தலை அணிகளை அகற்றவும்',
      'NIC இல் உள்ள அனைத்து உரையும் தெளிவாக இருப்பதை உறுதிப்படுத்துங்கள்',
      'முழு ஆவணத்தையும் சட்டத்திற்குள் பொருத்தவும்',
      'ஆவணத்தை நிலையாக வைத்திருங்கள்'
    ],
    securityNote: 'உங்கள் தரவு குறியாக்கம் செய்யப்பட்டு பாதுகாப்பானது',
    cancel: 'ரத்து செய்யவும்',
    submitForVerification: 'சரிபார்ப்புக்காக சமர்ப்பிக்கவும்',
    reviewDocuments: 'உங்கள் ஆவணங்களை மதிப்பாய்வு செய்யவும்',
    confirmSubmission: 'உறுதிப்படுத்தி சமர்ப்பிக்கவும்',
    processing: 'உங்கள் ஆவணங்களைச் செயலாக்குகிறது',
    processingDesc: 'எங்கள் பாதுகாப்பான அமைப்பு உங்கள் ஆவணங்களைச் சரிபார்க்கிறது. இது பொதுவாக 1-2 நிமிடங்கள் ஆகும்.',
    verificationComplete: 'சரிபார்ப்பு முடிந்தது!',
    verificationCompleteDesc: 'உங்கள் அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டது. இப்போது உங்களுக்கு அனைத்து அரசாங்க சேவைகளுக்கும் முழு அணுகல் உள்ளது.',
    backToDashboard: 'டாஷ்போர்டுக்குத் திரும்பவும்',
    dragDrop: 'இழுத்து விடவும் அல்லது',
    browseFiles: 'கோப்புகளை உலாவவும்',
    uploadSuccessful: 'பதிவேற்றம் வெற்றிகரமானது',
    removeImage: 'படத்தை அகற்றவும்',
    fileTypeError: 'தயவுசெய்து JPG, PNG, அல்லது WebP படங்களை மட்டுமே பதிவேற்றவும்',
    fileSizeError: 'கோப்பு அளவு 5MB க்கும் குறைவாக இருக்க வேண்டும்',
    required: 'தேவை'
  }
};

// Enhanced Sri Lankan Background with consistent design
const SriLankanBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main background image */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95">
        <div 
          className="absolute inset-0 opacity-55 dark:opacity-15 bg-center bg-no-repeat bg-cover transition-opacity duration-1000"
          style={{
            backgroundImage: 'url("/2.png")',
            backgroundPosition: 'center 20%',
            filter: 'saturate(1.2) brightness(1.1)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 dark:from-background/40 dark:via-transparent dark:to-background/60"></div>
      </div>
      
      {/* Enhanced lotus-inspired accent patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFC72C]/8 dark:bg-[#FFC72C]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#8D153A]/8 dark:bg-[#8D153A]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5722]/6 dark:bg-[#FF5722]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-[#FFA726]/6 dark:bg-[#FFA726]/3 rounded-full blur-2xl animate-pulse" style={{animationDuration: '14s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/6 left-1/5 w-56 h-56 bg-[#FF9800]/5 dark:bg-[#FF9800]/2 rounded-full blur-3xl animate-pulse" style={{animationDuration: '16s', animationDelay: '6s'}}></div>
      </div>
    </div>
  );
};

// Icons
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

const IdCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="6" y1="10" x2="10" y2="10"></line><line x1="14" y1="15" x2="18" y2="15"></line><line x1="6" y1="15" x2="10" y2="15"></line><path d="M14 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 3.03 1.1 5.4 3 7h8c1.9-1.6 3-3.97 3-7a7 7 0 0 0-7-7Z"/></svg>
);

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/></svg>
);

const LoadingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M9 12l2 2 4-4"/></svg>
);

// Progress Steps Component
const ProgressSteps = ({ currentStep, steps, t }: { 
  currentStep: VerificationStep; 
  steps: VerificationStep[]; 
  t: any;
}) => {
  const getStepIndex = (step: VerificationStep) => steps.indexOf(step);
  const currentIndex = getStepIndex(currentStep);
  
  const getStepStatus = (step: VerificationStep) => {
    const stepIndex = getStepIndex(step);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStepLabel = (step: VerificationStep) => {
    switch (step) {
      case 'upload': return t.uploadStep;
      case 'review': return t.reviewStep;
      case 'processing': return t.processingStep;
      case 'completed': return t.completedStep;
    }
  };

  return (
    <div className="mb-12 animate-fade-in-up">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-4 sm:space-x-8">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            return (
              <li key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${status === 'completed' 
                      ? 'bg-gradient-to-r from-[#008060] to-[#FFC72C] border-[#008060] text-white' 
                      : status === 'current' 
                      ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] border-[#FFC72C] text-white animate-pulse' 
                      : 'bg-card border-border text-muted-foreground'
                    }
                  `}>
                    {status === 'completed' ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`
                    mt-2 text-xs sm:text-sm font-medium text-center
                    ${status === 'current' ? 'text-[#FFC72C]' : 'text-muted-foreground'}
                  `}>
                    {getStepLabel(step)}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    ml-4 sm:ml-8 h-0.5 w-12 sm:w-16 transition-all duration-300
                    ${status === 'completed' ? 'bg-gradient-to-r from-[#008060] to-[#FFC72C]' : 'bg-border'}
                  `} />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

// Enhanced Dropzone Component with improved accessibility and validation
interface DropzoneProps {
  title: string;
  hint: string;
  onFile: (file: File) => void;
  onRemove: () => void;
  accept?: string[];
  file: File | null;
  icon: React.ElementType;
  required?: boolean;
  error?: string;
  t: any;
}

function EnhancedDropzone({
  title,
  hint,
  onFile,
  onRemove,
  accept = ["image/jpeg", "image/png", "image/webp"],
  file,
  icon: Icon,
  required = false,
  error,
  t
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  
  const previewUrl = file ? URL.createObjectURL(file) : null;
  
  const validateFile = (selectedFile: File): boolean => {
    // File type validation
    if (!accept.includes(selectedFile.type)) {
      setValidationError(t.fileTypeError);
      return false;
    }
    
    // File size validation (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setValidationError(t.fileSizeError);
      return false;
    }
    
    setValidationError("");
    return true;
  };

  const handleFile = useCallback((selectedFile: File | undefined) => {
    if (selectedFile && validateFile(selectedFile)) {
      onFile(selectedFile);
    }
  }, [onFile, t]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  }, [handleFile]);

  const currentError = error || validationError;

  return (
    <div className="w-full animate-fade-in-up">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          {required && <span className="text-[#FF5722] text-sm font-medium">*{t.required}</span>}
        </div>
        <p className="text-muted-foreground text-sm mt-1">{hint}</p>
      </div>
      
      <div
        className={`
          relative group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border-2 border-dashed transition-all duration-300 modern-card hover:shadow-glow
          ${isOver ? "border-[#FFC72C] bg-[#FFC72C]/5" : "border-border/50 hover:border-[#FFC72C]/60"}
          ${currentError ? "border-[#FF5722]" : ""}
          ${file ? "border-[#008060]" : ""}
        `}
        onDragEnter={(e) => e.preventDefault()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={`${title} upload area`}
        onClick={() => !file && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !file) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <div className="relative w-full h-64 flex flex-col items-center justify-center overflow-hidden rounded-xl">
          {previewUrl ? (
            <>
              <Image 
                src={previewUrl} 
                alt={`${title} preview`} 
                fill 
                className="object-cover rounded-xl" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end items-center p-4">
                <div className="w-14 h-14 bg-[#008060] rounded-full flex items-center justify-center mb-3 border-2 border-white/50 backdrop-blur-sm shadow-lg">
                  <CheckIcon className="w-7 h-7 text-white" />
                </div>
                <p className="text-white font-semibold text-sm mb-1">{t.uploadSuccessful}</p>
                <p className="text-white/80 text-xs">{file?.name}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                  setValidationError("");
                }}
                className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-[#FF5722] transition-colors duration-300 focus:ring-2 focus:ring-white"
                aria-label={t.removeImage}
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#FFC72C]/20">
                <Icon className="h-8 w-8 text-[#FFC72C]" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.dragDrop} <span className="font-semibold text-[#FFC72C] hover:text-[#FF5722] cursor-pointer transition-colors duration-300">{t.browseFiles}</span>
              </p>
              <p className="text-xs text-muted-foreground/60">
                JPG, PNG, WebP • Max 5MB
              </p>
            </div>
          )}
        </div>
        
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
          aria-describedby={currentError ? `${title}-error` : undefined}
        />
      </div>
      
      {currentError && (
        <div id={`${title}-error`} className="mt-2 flex items-center gap-2 text-[#FF5722] text-sm animate-fade-in-up">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {currentError}
        </div>
      )}
    </div>
  );
}

export default function VerificationPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentStep, setCurrentStep] = useState<VerificationStep>('upload');
  const [nicFile, setNicFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = verificationTranslations[currentLanguage];
  const steps: VerificationStep[] = ['upload', 'review', 'processing', 'completed'];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleSubmit = async () => {
    if (!nicFile || !selfieFile) return;
    
    setIsSubmitting(true);
    setCurrentStep('review');
    
    // Simulate review step
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStep('processing');
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setCurrentStep('completed');
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (currentStep === 'processing') return;
    setNicFile(null);
    setSelfieFile(null);
    setCurrentStep('upload');
  };

  const renderUploadStep = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Upload Areas */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <EnhancedDropzone
            title={t.uploadNIC}
            hint={t.nicHint}
            onFile={setNicFile}
            onRemove={() => setNicFile(null)}
            file={nicFile}
            icon={IdCardIcon}
            required
            t={t}
          />
          <EnhancedDropzone
            title={t.uploadSelfie}
            hint={t.selfieHint}
            onFile={setSelfieFile}
            onRemove={() => setSelfieFile(null)}
            file={selfieFile}
            icon={CameraIcon}
            required
            t={t}
          />
        </div>

        {/* Tips Panel */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl">
                <LightbulbIcon className="w-5 h-5 text-[#FFC72C]" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{t.tipsTitle}</h3>
            </div>
            
            <ul className="space-y-4">
              {t.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-muted-foreground text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 border border-[#008060]/20">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-4 h-4 text-[#008060]" />
                <span className="font-semibold text-sm text-[#008060]">{t.securityNote}</span>
              </div>
              <p className="text-xs text-muted-foreground">End-to-end encryption protects your documents</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t.reviewDocuments}</h2>
        <p className="text-muted-foreground">Please review your uploaded documents before submission</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {nicFile && (
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-glow modern-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <IdCardIcon className="w-5 h-5 text-[#FFC72C]" />
              {t.uploadNIC}
            </h3>
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <Image src={URL.createObjectURL(nicFile)} alt="NIC Preview" fill className="object-cover" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{nicFile.name}</p>
          </div>
        )}
        
        {selfieFile && (
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-glow modern-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CameraIcon className="w-5 h-5 text-[#FFC72C]" />
              {t.uploadSelfie}
            </h3>
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <Image src={URL.createObjectURL(selfieFile)} alt="Selfie Preview" fill className="object-cover" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{selfieFile.name}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="animate-fade-in-up">
        <div className="w-24 h-24 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <LoadingIcon className="w-12 h-12 text-white animate-spin" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">{t.processing}</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">{t.processingDesc}</p>
      </div>
      
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-glow modern-card">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-3 h-3 bg-[#FFC72C] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-3 h-3 bg-[#FF5722] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-3 h-3 bg-[#8D153A] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
        <p className="text-sm text-muted-foreground">Analyzing documents with advanced security protocols...</p>
      </div>
    </div>
  );

  const renderCompletedStep = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="animate-fade-in-up">
        <div className="w-24 h-24 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">{t.verificationComplete}</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">{t.verificationCompleteDesc}</p>
      </div>
      
      <div className="bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 rounded-2xl p-8 border border-[#008060]/20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-[#008060]" />
          <span className="font-bold text-[#008060]">Verified Account</span>
        </div>
        <p className="text-sm text-muted-foreground">Your account now has full access to all government services</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/User/Dashboard" 
          className="px-6 py-3 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
        >
          {t.backToDashboard}
        </Link>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload': return renderUploadStep();
      case 'review': return renderReviewStep();
      case 'processing': return renderProcessingStep();
      case 'completed': return renderCompletedStep();
      default: return renderUploadStep();
    }
  };

  return (
    <>
      <SriLankanBackground />
      <UserDashboardLayout
        title={
          <span className="animate-title-wave">
            <span className="text-foreground">{t.title.split(' ')[0]}</span>{' '}
            <span className="text-gradient">
              {t.title.split(' ')[1] || ''}
            </span>
          </span>
        }
        subtitle={t.subtitle}
        language={currentLanguage}
        onLanguageChange={handleLanguageChange}
      >
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/User/Profile"
              className="inline-flex items-center gap-2 px-4 py-2 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105 group"
            >
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              {t.backToProfile}
            </Link>
          </div>

          {/* Progress Steps */}
          <ProgressSteps currentStep={currentStep} steps={steps} t={t} />

          {/* Step Content */}
          <div className="mb-12">
            {renderStepContent()}
          </div>

          {/* Action Bar */}
          {currentStep === 'upload' && (
            <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/50 p-6 -mx-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end max-w-7xl mx-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
                  disabled={isSubmitting}
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!nicFile || !selfieFile || isSubmitting}
                  className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingIcon className="w-5 h-5 animate-spin" />
                      {t.processing}
                    </>
                  ) : (
                    t.submitForVerification
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/50 p-6 -mx-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end max-w-7xl mx-auto">
                <button
                  type="button"
                  onClick={() => setCurrentStep('upload')}
                  className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105 group flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-[#008060] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FF5722] rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  {t.confirmSubmission}
                </button>
              </div>
            </div>
          )}
        </div>
      </UserDashboardLayout>
    </>
  );
}