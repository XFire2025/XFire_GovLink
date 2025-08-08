"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Header } from '@/components/Header';
import Link from "next/link";
import { SelectField } from '@/components/SelectField';

// --- SHARED VISUAL COMPONENTS ---
const GlobalParticleBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.25] sm:opacity-[0.30] md:opacity-[0.35] dark:opacity-0">
            <Image src="/flag-of-sri-lanka-1.gif" alt="Sri Lankan Flag Background" fill className="object-cover object-center scale-110 sm:scale-105 md:scale-100" style={{ filter: 'contrast(2.2) brightness(0.45) saturate(2.2) sepia(0.25) hue-rotate(8deg)', mixBlendMode: 'multiply' }} unoptimized />
        </div>
        <div className="absolute inset-0 opacity-0 dark:opacity-[0.02]">
            <Image src="/flag-of-sri-lanka-1.gif" alt="Sri Lankan Flag Background" fill className="object-cover object-center scale-110 sm:scale-105 md:scale-100" unoptimized />
        </div>
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#8D153A]/10 dark:bg-[#FFC72C]/6 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#FF5722]/12 dark:bg-[#FF5722]/6 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-8 h-36 w-36 rounded-full bg-[#008060]/10 dark:bg-[#008060]/6 blur-2xl" />
        <div className="absolute bottom-6 right-10 h-24 w-24 rounded-full bg-[#FFC72C]/15 dark:bg-[#FFC72C]/8 blur-xl" />
    </div>
);

const Footer = () => (
    <footer className="relative py-16 mt-24">
        <div className="container mx-auto px-6">
            <div className="pt-8 border-t border-border text-center">
                <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} GovLink Sri Lanka. An initiative to streamline public services.</p>
            </div>
        </div>
    </footer>
);

// --- ICONS ---
const CheckCircleIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertTriangleIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const UploadIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const FileIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const HomeIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;

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

// --- HELPERS ---
const generateReference = () => 'GV-' + Date.now().toString().slice(-8);

// --- ALERTS ---
const ErrorAlert = ({ message }: { message: string }) => (
    <div className="glass-morphism p-4 rounded-2xl border border-red-500/40 flex items-center gap-3">
        <AlertTriangleIcon className="w-5 h-5 text-red-400" />
        <p className="text-sm text-red-300 font-medium">{message}</p>
    </div>
);
const SuccessAlert = ({ message }: { message: string }) => (
    <div className="glass-morphism p-4 rounded-2xl border border-emerald-500/40 flex items-center gap-3">
        <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
        <p className="text-sm text-emerald-300 font-medium">{message}</p>
    </div>
);

// --- MAIN PAGE ---
export default function DynamicSubmissionPage() {
    const [taskCode, setTaskCode] = useState<string>('');
        const [formValues, setFormValues] = useState<Record<string, unknown>>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [submitted, setSubmitted] = useState(false);
    const [reference, setReference] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

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
        if (!schema) return 'Please select a task type.';
        for (const field of schema.fields) {
            if (field.required && !formValues[field.name]) {
                return `Missing required field: ${field.label}`;
            }
            if (field.upload && field.required) {
                if (!files[field.name]) return `Please upload: ${field.label}`;
            }
        }
        return null;
    }, [schema, formValues, files]);

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
        setSuccess('Your submission has been received. Reference ' + ref);
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
                            <button type="button" onClick={() => handleFile(field, null)} className="text-xs text-red-300 hover:text-red-200 transition-colors">Remove</button>
                        )}
                    </div>
                    <div className="border-2 border-dashed rounded-xl p-4 bg-card/40 border-border/50 hover:border-[#FFC72C]/60 transition-colors">
                        <input
                            id={field.name}
                            type="file"
                            accept={field.accept}
                            className="hidden"
                            onChange={e => handleFile(field, e.target.files)}
                        />
                        <label htmlFor={field.name} className="flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
                            <div className="w-12 h-12 rounded-full bg-[#FFC72C]/15 flex items-center justify-center">
                                <FileIcon className="w-6 h-6 text-[#FFC72C]" />
                            </div>
                            {file ? (
                                <span className="text-sm font-medium text-foreground">{file.name}</span>
                            ) : (
                                <span className="text-sm text-muted-foreground">Click to upload {field.optionalUpload && '(Optional)'}</span>
                            )}
                            {field.helper && <p className="text-xs text-muted-foreground max-w-xs">{field.helper}</p>}
                            {field.accept && <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Allowed: {field.accept.replace(/\./g,'').replace(/,/g, ', ')}</p>}
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
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateValue(field.name, e.target.value),
                className: 'w-full px-4 py-3 rounded-xl border bg-card/40 border-border/50 focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/30 transition-all outline-none text-sm'
            } as const;

        let control: React.ReactNode = null;
        if (field.type === 'textarea') control = <textarea {...common} rows={4} />;
        else if (field.type === 'select') control = (
            <SelectField
                id={field.name}
                name={field.name}
                value={(formValues[field.name] as string) ?? ''}
                required={field.required}
                onChange={(val) => updateValue(field.name, val)}
                options={field.options || []}
                placeholder={`Select ${field.label}`}
                hideLabel
            />
        );
        else control = <input {...common} type={field.type} />;

        return (
            <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-foreground">{field.label}{field.required && <span className="text-red-400 ml-1">*</span>}</label>
                {control}
                {field.helper && <p className="text-xs text-muted-foreground">{field.helper}</p>}
            </div>
        );
    };

    return (
        <div className="bg-background text-foreground min-h-screen relative">
            <GlobalParticleBackground />
            <div className="relative z-10">
                <Header />
                <main className="container mx-auto px-4 sm:px-6 py-32 sm:py-40">
                    <div className="max-w-5xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <h1 className="text-3xl sm:text-5xl font-extrabold"><span className="text-gradient">Public Service Submission</span></h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Submit documentation and details for a selected government service task. Please select a service type below.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="glass-morphism p-6 sm:p-10 rounded-3xl border border-border/50 space-y-10">
                            {error && <ErrorAlert message={error} />}
                            {success && <SuccessAlert message={success} />}

                            {/* Task Selection */}
                            <div className="space-y-4">
                                <SelectField
                                    id="taskType"
                                    label="Select Service Type"
                                    value={taskCode}
                                    required
                                    placeholder="Choose a service task"
                                    onChange={(val) => resetForTask(val)}
                                    options={TASK_SCHEMAS.map(t => ({ value: t.code, label: t.title }))}
                                />
                                {schema && <p className="text-xs text-muted-foreground">{schema.description}</p>}
                                {schema?.docNote && <p className="text-xs text-[#FFC72C] font-medium">{schema.docNote}</p>}
                            </div>

                            {/* Dynamic Fields */}
                            {schema && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {schema.fields.map(f => renderField(f))}
                                </div>
                            )}

                            {/* Submission Summary (post-submit) */}
                            {submitted && schema && (
                                <div className="space-y-6">
                                    <div className="border border-border/40 rounded-2xl p-6 bg-card/40">
                                        <div className="flex items-center gap-3 mb-4">
                                            <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                                            <h2 className="text-lg font-bold text-gradient">Submission Summary</h2>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div className="space-y-1">
                                                <p className="text-muted-foreground">Reference</p>
                                                <p className="font-mono text-[#FFC72C] text-sm">{reference}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-muted-foreground">Service</p>
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
                                            <h3 className="text-sm font-semibold mb-2 text-foreground">Uploaded Documents</h3>
                                            <ul className="space-y-2 text-sm">
                                                {schema.fields.filter(f => f.upload).map(f => (
                                                    <li key={f.name} className="flex items-center gap-2">
                                                        <FileIcon className="w-4 h-4 text-[#FFC72C]" />
                                                        <span>{f.label}: </span>
                                                        <span className="text-muted-foreground">{files[f.name]?.name || (f.optionalUpload ? 'Optional / Not Provided' : '—')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-4">
                                <div className="text-xs text-muted-foreground flex-1">Required uploads: {requiredUploads.length > 0 ? requiredUploads.length : 'None'}</div>
                                <div className="flex gap-3 justify-end">
                                    {submitted && (
                                        <button
                                            type="button"
                                            onClick={() => { setSubmitted(false); setSuccess(null); setReference(''); }}
                                            className="px-5 py-3 rounded-xl border border-border/50 bg-card/40 hover:bg-card/60 text-sm font-medium transition-colors"
                                        >Edit Submission</button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!schema || submitting}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFC72C] to-[#FF5722] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white shadow-glow hover:shadow-2xl transition-all"
                                    >{submitting ? 'Submitting...' : (submitted ? 'Resubmit' : 'Submit')}</button>
                                </div>
                            </div>
                        </form>

                        {/* Post-submission guidance */}
                        {submitted && (
                            <div className="glass-morphism p-6 rounded-3xl border border-border/50 flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div className="space-y-3 flex-1">
                                    <h3 className="text-lg font-bold text-gradient">What Happens Next?</h3>
                                    <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-5">
                                        <li>You will receive an email with your reference ID <span className="text-[#FFC72C] font-mono">{reference}</span>.</li>
                                        <li>Our officers will verify the documents and may request clarifications.</li>
                                        <li>You can track progress in the upcoming Dashboard &gt; Submissions section.</li>
                                    </ul>
                                    <div className="pt-2 flex flex-wrap gap-3">
                                        <Link href="/user" className="px-5 py-2.5 rounded-xl border border-border/50 bg-card/40 hover:bg-card/60 text-sm font-medium transition-colors flex items-center gap-2">
                                            <HomeIcon className="w-4 h-4" /> Dashboard
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
