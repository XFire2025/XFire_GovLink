"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';

// Types
type Language = 'en' | 'si' | 'ta';

// Submission translations
const submissionTranslations: Record<Language, {
  title: string;
  subtitle: string;
  backToDashboard: string;
  selectService: string;
  selectServicePlaceholder: string;
  whatHappensNext: string;
  nextSteps: {
    step1: string;
    step2: string;
    step3: string;
  };
  requiredUploads: string;
  none: string;
  editSubmission: string;
  submit: string;
  submitting: string;
  resubmit: string;
  submissionSummary: string;
  reference: string;
  service: string;
  uploadedDocuments: string;
  optional: string;
  notProvided: string;
  dashboard: string;
  clickToUpload: string;
  remove: string;
  allowed: string;
  missingField: string;
  pleaseUpload: string;
  pleaseSelectTask: string;
  submissionReceived: string;
}> = {
  en: {
    title: 'Service Submission',
    subtitle: 'Submit documentation and applications for government services',
    backToDashboard: 'Back to Dashboard',
    selectService: 'Select Service Type',
    selectServicePlaceholder: 'Choose a service task',
    whatHappensNext: 'What Happens Next?',
    nextSteps: {
      step1: 'You will receive an email with your reference ID',
      step2: 'Our officers will verify the documents and may request clarifications',
      step3: 'You can track progress in the Dashboard > Submissions section'
    },
    requiredUploads: 'Required uploads',
    none: 'None',
    editSubmission: 'Edit Submission',
    submit: 'Submit',
    submitting: 'Submitting...',
    resubmit: 'Resubmit',
    submissionSummary: 'Submission Summary',
    reference: 'Reference',
    service: 'Service',
    uploadedDocuments: 'Uploaded Documents',
    optional: 'Optional',
    notProvided: 'Not Provided',
    dashboard: 'Dashboard',
    clickToUpload: 'Click to upload',
    remove: 'Remove',
    allowed: 'Allowed',
    missingField: 'Missing required field',
    pleaseUpload: 'Please upload',
    pleaseSelectTask: 'Please select a task type',
    submissionReceived: 'Your submission has been received. Reference'
  },
  si: {
    title: 'සේවා ඉදිරිපත් කිරීම',
    subtitle: 'රජයේ සේවා සඳහා ලේඛන සහ අයදුම්පත් ඉදිරිපත් කරන්න',
    backToDashboard: 'පැලනයට ආපසු',
    selectService: 'සේවා වර්ගය තෝරන්න',
    selectServicePlaceholder: 'සේවා කාර්යයක් තෝරන්න',
    whatHappensNext: 'ඊළඟට සිදුවන්නේ කුමක්ද?',
    nextSteps: {
      step1: 'ඔබගේ සමුද්දේශ අංකය සමඟ ඔබට විදුත් තැපිලක් ලැබෙනු ඇත',
      step2: 'අපගේ නිලධාරීන් ලේඛන සත්යාපනය කර පහදිලි කිරීම් ඉල්ලා සිටිය හැක',
      step3: 'ඔබට පැලනය > ඉදිරිපත්කිරීම් කොටසේහි ප්රගතිය නිරීක්ෂණය කළ හැක'
    },
    requiredUploads: 'අවශ්ය උඩුගත කිරීම්',
    none: 'කිසිවක් නැත',
    editSubmission: 'ඉදිරිපත්කිරීම සංස්කරණය කරන්න',
    submit: 'ඉදිරිපත් කරන්න',
    submitting: 'ඉදිරිපත් කරමින්...',
    resubmit: 'නවත ඉදිරිපත් කරන්න',
    submissionSummary: 'ඉදිරිපත්කිරීම සාරාංශය',
    reference: 'සමුද්දේශය',
    service: 'සේවාව',
    uploadedDocuments: 'උඩුගත කළ ලේඛන',
    optional: 'විකල්ප',
    notProvided: 'සපයා නොමැත',
    dashboard: 'පැලනය',
    clickToUpload: 'උඩුගත කිරීමට ක්ලික් කරන්න',
    remove: 'ඉවත් කරන්න',
    allowed: 'අනුමතයි',
    missingField: 'අවශ්ය ක්ෂේත්රය අස්ථානගත වී ඇත',
    pleaseUpload: 'කරුණාකර උඩුගත කරන්න',
    pleaseSelectTask: 'කරුණාකර කාර්ය වර්ගයක් තෝරන්න',
    submissionReceived: 'ඔබගේ ඉදිරිපත්කිරීම ලැබී ඇත. සමුද්දේශය'
  },
  ta: {
    title: 'சேவை சமர்ப்பணை',
    subtitle: 'அரச சேவைகளுக்கான ஆவணங்கள் மற்றும் விண்ணப்பங்களை சமர்ப்பிக்கவும்',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பவும்',
    selectService: 'சேவை வகையைத் தேர்ந்தெடுக்கவும்',
    selectServicePlaceholder: 'ஒரு சேவை பணியைத் தேர்ந்தெடுக்கவும்',
    whatHappensNext: 'அடுத்து என்ன நடக்கும்?',
    nextSteps: {
      step1: 'உங்கள் குறிப்பு எண்ணுடன் நீங்கள் மின்னஞ்சல் பெறுவீர்கள்',
      step2: 'எங்கள் அதிகாரிகள் ஆவணங்களை சரிபார்த்து விளக்கங்களைக் கோரலாம்',
      step3: 'டாஷ்போர்ட் > சமர்ப்பிப்புகள் பிரிவில் முன்னேற்றத்தைக் கண்காணிக்கலாம்'
    },
    requiredUploads: 'தேவையான பதிவேற்றங்கள்',
    none: 'எதுவுமில்லை',
    editSubmission: 'சமர்ப்பிப்பைத் திருத்தவும்',
    submit: 'சமர்ப்பிக்கவும்',
    submitting: 'சமர்ப்பிக்கிறது...',
    resubmit: 'மீண்டும் சமர்ப்பிக்கவும்',
    submissionSummary: 'சமர்ப்பிப்பு சுருக்கம்',
    reference: 'குறிப்பு',
    service: 'சேவை',
    uploadedDocuments: 'பதிவேற்றப்பட்ட ஆவணங்கள்',
    optional: 'விருப்பமானது',
    notProvided: 'வழங்கப்படவில்லை',
    dashboard: 'டாஷ்போர்ட்',
    clickToUpload: 'பதிவேற்ற கிளிக் செய்யவும்',
    remove: 'அகற்று',
    allowed: 'அனுமதிக்கப்பட்டது',
    missingField: 'தேவையான புலம் காணவில்லை',
    pleaseUpload: 'தயவுசெய்து பதிவேற்றவும்',
    pleaseSelectTask: 'தயவுசெய்து ஒரு பணி வகையைத் தேர்ந்தெடுக்கவும்',
    submissionReceived: 'உங்கள் சமர்ப்பிப்பு பெறப்பட்டது. குறிப்பு'
  }
};

// --- ICONS ---
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const CheckCircleIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertTriangleIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const UploadIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const FileIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const HomeIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

// --- TASK SCHEMA ---
type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'email' | 'tel';
interface TaskField {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: { value: string; label: string }[];
    helper?: string;
    upload?: boolean;          // indicates this field expects a document upload
    optionalUpload?: boolean;  // upload is optional
    accept?: string;           // file accept filter
}
interface TaskSchema {
    code: string;
    title: string;
    description: string;
    fields: TaskField[];
    docNote?: string;
}

const TASK_SCHEMAS: TaskSchema[] = [
    {
        code: 'passport-renewal',
        title: 'Passport Renewal',
        description: 'Renew an existing Sri Lankan passport.',
        docNote: 'Scans must be clear, color and less than 5MB each (JPEG / PDF).',
        fields: [
            { name: 'fullName', label: 'Full Name (as in NIC)', type: 'text', required: true },
            { name: 'nicNumber', label: 'NIC Number', type: 'text', required: true, helper: 'Enter the 12-digit NIC (no spaces)' },
            { name: 'passportNumber', label: 'Current Passport Number', type: 'text', required: true },
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
            { name: 'contactEmail', label: 'Email Address', type: 'email', required: true },
            { name: 'contactPhone', label: 'Mobile Number', type: 'tel', required: true },
            { name: 'officeLocation', label: 'Preferred Collection Office', type: 'select', required: true, options: [
                { value: 'colombo', label: 'Colombo Head Office' },
                { value: 'kandy', label: 'Kandy Regional Office' },
                { value: 'galle', label: 'Galle Regional Office' }
            ] },
            { name: 'reason', label: 'Reason / Remarks', type: 'textarea', required: false },
            { name: 'nicScan', label: 'NIC Scan', type: 'text', upload: true, required: true, accept: '.jpg,.jpeg,.png,.pdf' },
            { name: 'oldPassportScan', label: 'Old Passport (Bio Page)', type: 'text', upload: true, required: true, accept: '.jpg,.jpeg,.png,.pdf' },
            { name: 'photo', label: 'Recent Passport Photo', type: 'text', upload: true, required: true, accept: '.jpg,.jpeg,.png' }
        ]
    },
    {
        code: 'business-registration',
        title: 'Business Registration',
        description: 'Register a new business entity.',
        fields: [
            { name: 'businessName', label: 'Business Name', type: 'text', required: true },
            { name: 'businessType', label: 'Business Type', type: 'select', required: true, options: [
                { value: 'sole', label: 'Sole Proprietorship' },
                { value: 'partnership', label: 'Partnership' },
                { value: 'private-limited', label: 'Private Limited Company' }
            ] },
            { name: 'registrationType', label: 'Registration Type', type: 'select', required: true, options: [
                { value: 'fresh', label: 'New Registration' },
                { value: 'name-change', label: 'Name Change' }
            ] },
            { name: 'ownerFullName', label: 'Owner Full Name', type: 'text', required: true },
            { name: 'nicNumber', label: 'Owner NIC Number', type: 'text', required: true },
            { name: 'address', label: 'Business Address', type: 'textarea', required: true },
            { name: 'email', label: 'Contact Email', type: 'email', required: true },
            { name: 'phone', label: 'Contact Phone', type: 'tel', required: true },
            { name: 'capitalAmount', label: 'Stated Capital (LKR)', type: 'number', required: true },
            { name: 'nicScan', label: 'Owner NIC Scan', type: 'text', upload: true, required: true, accept: '.jpg,.jpeg,.png,.pdf' },
            { name: 'addressProof', label: 'Address Proof (Utility Bill)', type: 'text', upload: true, required: true, accept: '.jpg,.jpeg,.png,.pdf' },
            { name: 'draftArticles', label: 'Draft Articles (Optional)', type: 'text', upload: true, optionalUpload: true, accept: '.pdf' }
        ]
    },
    {
        code: 'driving-license',
        title: 'Driving License Application',
        description: 'Apply for a new or additional class driving license.',
        fields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'nicNumber', label: 'NIC Number', type: 'text', required: true },
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
            { name: 'licenseType', label: 'License Type', type: 'select', required: true, options: [
                { value: 'light-vehicle', label: 'Light Vehicle' },
                { value: 'motorcycle', label: 'Motorcycle' },
                { value: 'heavy-vehicle', label: 'Heavy Vehicle' }
            ] },
            { name: 'testCenter', label: 'Preferred Test Center', type: 'select', required: true, options: [
                { value: 'werahera', label: 'Werahera' },
                { value: 'kurunegala', label: 'Kurunegala' },
                { value: 'galle', label: 'Galle' }
            ] },
            { name: 'bloodGroup', label: 'Blood Group', type: 'select', required: true, options: [
                { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' }, { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }, { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' }
            ] },
            { name: 'contactEmail', label: 'Email', type: 'email', required: true },
            { name: 'contactPhone', label: 'Phone', type: 'tel', required: true },
            { name: 'nicScan', label: 'NIC Scan', type: 'text', upload: true, required: true, accept: '.jpg,.jpeg,.png,.pdf' },
            { name: 'medicalCertificate', label: 'Medical Certificate', type: 'text', upload: true, required: true, accept: '.jpg,.jpeg,.png,.pdf' }
        ]
    },
    {
        code: 'marriage-certificate',
        title: 'Marriage Certificate Copy',
        description: 'Request a certified copy of a marriage certificate.',
        fields: [
            { name: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
            { name: 'spouseName', label: 'Spouse Name', type: 'text', required: true },
            { name: 'marriageDate', label: 'Marriage Date', type: 'date', required: true },
            { name: 'placeOfMarriage', label: 'Place of Marriage', type: 'text', required: true },
            { name: 'district', label: 'District', type: 'select', required: true, options: [
                { value: 'colombo', label: 'Colombo' }, { value: 'gampaha', label: 'Gampaha' }, { value: 'kandy', label: 'Kandy' }, { value: 'galle', label: 'Galle' }
            ] },
            { name: 'contactEmail', label: 'Email', type: 'email', required: true },
            { name: 'contactPhone', label: 'Phone', type: 'tel', required: true },
            { name: 'nicScan', label: 'Applicant NIC Scan', type: 'text', upload: true, required: true, accept: '.jpg,.jpeg,.png,.pdf' },
            { name: 'affidavit', label: 'Affidavit (If Required)', type: 'text', upload: true, optionalUpload: true, accept: '.pdf,.jpg,.jpeg,.png' }
        ]
    }
];

// Custom Dropdown Component
const CustomDropdown = ({ 
    id, 
    value, 
    onChange, 
    disabled, 
    placeholder, 
    options,
    label,
    required
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder: string;
    options: { value: string; label: string }[];
    label?: string;
    required?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(placeholder);
    
    React.useEffect(() => {
        const selected = options.find(opt => opt.value === value);
        setSelectedLabel(selected ? selected.label : placeholder);
    }, [value, options, placeholder]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">
                    {label}{required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`
                        w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-between backdrop-blur-md
                        ${disabled 
                            ? 'opacity-60 cursor-not-allowed bg-card/20 dark:bg-card/30 border-border/30' 
                            : 'bg-card/50 dark:bg-card/70 border-border/50 hover:border-[#FFC72C]/60 hover:bg-card/70 dark:hover:bg-card/80 focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/30'
                        }
                        shadow-md hover:shadow-lg modern-card
                    `}
                >
                    <span className={`${value ? 'text-foreground' : 'text-muted-foreground'} font-medium`}>
                        {selectedLabel}
                    </span>
                    <ChevronDownIcon 
                        className={`w-5 h-5 text-[#FFC72C] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                </button>

                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsOpen(false)}
                        />
                        
                        <div className="absolute top-full left-0 right-0 mt-2 z-20">
                            <div className="bg-card/95 dark:bg-card/95 border border-border/50 rounded-xl shadow-glow backdrop-blur-md overflow-hidden modern-card">
                                <div className="max-h-60 overflow-y-auto">
                                    {options.map((option, index) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={`
                                                w-full text-left px-4 py-3 transition-all duration-200 border-b border-border/30 last:border-b-0
                                                ${value === option.value 
                                                    ? 'bg-[#FFC72C]/20 text-[#FFC72C] font-semibold' 
                                                    : 'text-foreground hover:bg-card/30 hover:text-[#FFC72C]'
                                                }
                                                ${index === 0 ? 'rounded-t-xl' : ''}
                                                ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                                            `}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- HELPERS ---
const generateReference = () => 'GV-' + Date.now().toString().slice(-8);

// --- ALERTS ---
const ErrorAlert = ({ message }: { message: string }) => (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#FF5722]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
        <AlertTriangleIcon className="w-6 h-6 text-[#FF5722] flex-shrink-0" />
        <p className="text-sm font-medium text-[#FF5722]">{message}</p>
    </div>
);
const SuccessAlert = ({ message }: { message: string }) => (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#008060]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
        <CheckCircleIcon className="w-6 h-6 text-[#008060] flex-shrink-0" />
        <p className="text-sm font-medium text-[#008060]">{message}</p>
    </div>
);

// --- MAIN PAGE ---
export default function DynamicSubmissionPage() {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    const [taskCode, setTaskCode] = useState<string>('');
    const [formValues, setFormValues] = useState<Record<string, unknown>>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [submitted, setSubmitted] = useState(false);
    const [reference, setReference] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const t = submissionTranslations[currentLanguage];

    const handleLanguageChange = (newLanguage: Language) => {
        setCurrentLanguage(newLanguage);
    };

    const schema = useMemo(() => TASK_SCHEMAS.find(s => s.code === taskCode) || null, [taskCode]);

    const requiredUploads = schema?.fields.filter(f => f.upload && f.required).map(f => f.name) || [];

    const resetForTask = (code: string) => {
        setTaskCode(code);
        setFormValues({});
        setFiles({});
        setSubmitted(false);
        setSuccess(null);
        setError(null);
    };

    const updateValue = (name: string, value: unknown) => {
        setFormValues(v => ({ ...v, [name]: value }));
    };

    const handleFile = (field: TaskField, fileList: FileList | null) => {
        if (!fileList || !fileList[0]) {
            setFiles(f => ({ ...f, [field.name]: null }));
        } else {
            setFiles(f => ({ ...f, [field.name]: fileList[0] }));
        }
    };

    const validate = useCallback(() => {
        if (!schema) return t.pleaseSelectTask;
        for (const field of schema.fields) {
            if (field.required && !formValues[field.name]) {
                return `${t.missingField}: ${field.label}`;
            }
            if (field.upload && field.required) {
                if (!files[field.name]) return `${t.pleaseUpload}: ${field.label}`;
            }
        }
        return null;
    }, [schema, formValues, files, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); setSuccess(null);
        const err = validate();
        if (err) { setError(err); return; }
        setSubmitting(true);
        await new Promise(res => setTimeout(res, 1000)); // simulate
        const ref = generateReference();
        setReference(ref);
        setSubmitted(true);
        setSuccess(`${t.submissionReceived} ${ref}`);
        // (In real app: send to backend with FormData)
        setSubmitting(false);
    };

    // --- RENDER HELPERS ---
    const renderField = (field: TaskField) => {
        if (field.upload) {
            const file = files[field.name];
            return (
                <div key={field.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <UploadIcon className="w-4 h-4 text-[#FFC72C]" />
                            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        {file && (
                            <button type="button" onClick={() => handleFile(field, null)} className="text-xs text-[#FF5722] hover:text-[#FF5722]/80 transition-colors">{t.remove}</button>
                        )}
                    </div>
                    <div className="border-2 border-dashed rounded-xl p-4 bg-card/40 dark:bg-card/50 border-border/50 hover:border-[#FFC72C]/60 transition-colors backdrop-blur-md modern-card">
                        <input
                            id={field.name}
                            type="file"
                            accept={field.accept}
                            className="hidden"
                            onChange={e => handleFile(field, e.target.files)}
                        />
                        <label htmlFor={field.name} className="flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
                            <div className="w-12 h-12 rounded-full bg-[#FFC72C]/15 flex items-center justify-center border border-[#FFC72C]/30">
                                <FileIcon className="w-6 h-6 text-[#FFC72C]" />
                            </div>
                            {file ? (
                                <span className="text-sm font-medium text-foreground">{file.name}</span>
                            ) : (
                                <span className="text-sm text-muted-foreground">{t.clickToUpload} {field.optionalUpload && `(${t.optional})`}</span>
                            )}
                            {field.helper && <p className="text-xs text-muted-foreground max-w-xs">{field.helper}</p>}
                            {field.accept && <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.allowed}: {field.accept.replace(/\./g,'').replace(/,/g, ', ')}</p>}
                        </label>
                    </div>
                </div>
            );
        }

        const common = {
            id: field.name,
            name: field.name,
            required: field.required,
            value: (formValues[field.name] as string) ?? '',
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateValue(field.name, e.target.value),
            className: 'w-full px-4 py-3 rounded-xl border bg-card/50 dark:bg-card/70 border-border/50 focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/30 transition-all outline-none text-sm backdrop-blur-md hover:border-[#FFC72C]/60 text-foreground placeholder:text-muted-foreground'
        } as const;

        let control: React.ReactNode = null;
        if (field.type === 'textarea') control = <textarea {...common} rows={4} />;
        else if (field.type === 'select') control = (
            <CustomDropdown
                id={field.name}
                value={(formValues[field.name] as string) ?? ''}
                required={field.required}
                onChange={(val: string) => updateValue(field.name, val)}
                options={field.options || []}
                placeholder={`Select ${field.label}`}
            />
        );
        else control = <input {...common} type={field.type} />;

        return (
            <div key={field.name} className="space-y-2">
                {field.type !== 'select' && (
                    <label htmlFor={field.name} className="text-sm font-medium text-foreground">{field.label}{field.required && <span className="text-red-400 ml-1">*</span>}</label>
                )}
                {control}
                {field.helper && <p className="text-xs text-muted-foreground">{field.helper}</p>}
            </div>
        );
    };

    return (
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
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                    <Link 
                        href="/user/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        {t.backToDashboard}
                    </Link>
                </div>

                {error && <div className="mb-8"><ErrorAlert message={error} /></div>}
                {success && <div className="mb-8"><SuccessAlert message={success} /></div>}

                <form onSubmit={handleSubmit} className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border/50 shadow-glow modern-card hover:border-[#FFC72C]/30 transition-all duration-500 space-y-8">
                    {/* Task Selection */}
                    <div className="space-y-4">
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
                                <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
                                <span className="text-xs sm:text-sm font-medium text-foreground">{t.selectService}</span>
                            </div>
                        </div>
                        
                        <CustomDropdown
                            id="taskType"
                            label={t.selectService}
                            value={taskCode}
                            required
                            placeholder={t.selectServicePlaceholder}
                            onChange={(val: string) => resetForTask(val)}
                            options={TASK_SCHEMAS.map(t => ({ value: t.code, label: t.title }))}
                        />
                        {schema && <p className="text-xs text-muted-foreground">{schema.description}</p>}
                        {schema?.docNote && <p className="text-xs text-[#FFC72C] font-medium">{schema.docNote}</p>}
                    </div>

                    {/* Dynamic Fields */}
                    {schema && (
                        <div className="space-y-6">
                            <div className="border-t border-border/30"></div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {schema.fields.map(f => renderField(f))}
                            </div>
                        </div>
                    )}

                    {/* Submission Summary (post-submit) */}
                    {submitted && schema && (
                        <div className="space-y-6">
                            <div className="border-t border-border/30"></div>
                            <div className="border border-border/40 rounded-2xl p-6 bg-card/40 dark:bg-card/50 backdrop-blur-md modern-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircleIcon className="w-6 h-6 text-[#008060]" />
                                    <h2 className="text-lg font-bold text-gradient">{t.submissionSummary}</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">{t.reference}</p>
                                        <p className="font-mono text-[#FFC72C] text-sm">{reference}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">{t.service}</p>
                                        <p className="font-medium">{schema.title}</p>
                                    </div>
                                    {schema.fields.filter(f => !f.upload).slice(0,6).map(f => (
                                        <div key={f.name} className="space-y-1">
                                            <p className="text-muted-foreground">{f.label}</p>
                                            <p className="font-medium break-words">{String(formValues[f.name] || '-')}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold mb-2 text-foreground">{t.uploadedDocuments}</h3>
                                    <ul className="space-y-2 text-sm">
                                        {schema.fields.filter(f => f.upload).map(f => (
                                            <li key={f.name} className="flex items-center gap-2">
                                                <FileIcon className="w-4 h-4 text-[#FFC72C]" />
                                                <span>{f.label}: </span>
                                                <span className="text-muted-foreground">{files[f.name]?.name || (f.optionalUpload ? `${t.optional} / ${t.notProvided}` : '—')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-4 border-t border-border/30">
                        <div className="text-xs text-muted-foreground flex-1">{t.requiredUploads}: {requiredUploads.length > 0 ? requiredUploads.length : t.none}</div>
                        <div className="flex gap-3 justify-end">
                            {submitted && (
                                <button
                                    type="button"
                                    onClick={() => { setSubmitted(false); setSuccess(null); setReference(''); }}
                                    className="px-5 py-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/70 text-sm font-medium transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105 text-foreground"
                                >{t.editSubmission}</button>
                            )}
                            <button
                                type="submit"
                                disabled={!schema || submitting}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                            >{submitting ? t.submitting : (submitted ? t.resubmit : t.submit)}</button>
                        </div>
                    </div>
                </form>

                {/* Post-submission guidance */}
                {submitted && (
                    <div className="mt-8 bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card flex flex-col md:flex-row gap-6 items-start hover:border-[#008060]/30 transition-all duration-500">
                        <div className="w-12 h-12 rounded-full bg-[#008060]/20 flex items-center justify-center border border-[#008060]/30">
                            <CheckCircleIcon className="w-6 h-6 text-[#008060]" />
                        </div>
                        <div className="space-y-3 flex-1">
                            <h3 className="text-lg font-bold text-gradient">{t.whatHappensNext}</h3>
                            <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-5">
                                <li>{t.nextSteps.step1} <span className="text-[#FFC72C] font-mono">{reference}</span>.</li>
                                <li>{t.nextSteps.step2}.</li>
                                <li>{t.nextSteps.step3}.</li>
                            </ul>
                            <div className="pt-2 flex flex-wrap gap-3">
                                <Link href="/user/dashboard" className="px-5 py-2.5 rounded-xl border border-border/50 bg-card/50 hover:bg-card/70 text-sm font-medium transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105 flex items-center gap-2 text-foreground">
                                    <HomeIcon className="w-4 h-4" /> {t.dashboard}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserDashboardLayout>
    );
}