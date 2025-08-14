"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Star, Send, MessageSquare, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
type Language = "en" | "si" | "ta";
type FeedbackType = "general" | "bug" | "feature" | "service";
type Rating = 1 | 2 | 3 | 4 | 5;

interface FeedbackData {
  name: string;
  email: string;
  feedbackType: FeedbackType;
  rating: Rating | null;
  subject: string;
  message: string;
}

// Feedback translations
const feedbackTranslations: Record<
  Language,
  {
    pageTitle: string;
    pageSubtitle: string;
    personalInfo: string;
    feedbackDetails: string;
    rating: string;
    ratingDescription: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    feedbackType: string;
    feedbackTypes: {
      general: string;
      bug: string;
      feature: string;
      service: string;
    };
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    backToHome: string;
    required: string;
    selectFeedbackType: string;
    rateExperience: string;
    excellent: string;
    good: string;
    average: string;
    poor: string;
    terrible: string;
  }
> = {
  en: {
    pageTitle: "Share Your Feedback",
    pageSubtitle:
      "Help us improve GovLink by sharing your thoughts and experiences",
    personalInfo: "Personal Information",
    feedbackDetails: "Feedback Details",
    rating: "Overall Rating",
    ratingDescription:
      "How would you rate your overall experience with GovLink?",
    name: "Full Name",
    namePlaceholder: "Enter your full name",
    email: "Email Address",
    emailPlaceholder: "Enter your email address",
    feedbackType: "Feedback Type",
    feedbackTypes: {
      general: "General Feedback",
      bug: "Report a Bug",
      feature: "Feature Request",
      service: "Service Experience",
    },
    subject: "Subject",
    subjectPlaceholder: "Brief description of your feedback",
    message: "Message",
    messagePlaceholder: "Please provide detailed feedback...",
    submit: "Submit Feedback",
    submitting: "Submitting...",
    successTitle: "Thank You!",
    successMessage:
      "Your feedback has been received. We appreciate your input and will use it to improve our services.",
    backToHome: "Back to Home",
    required: "Required",
    selectFeedbackType: "Select feedback type",
    rateExperience: "Rate your experience",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    poor: "Poor",
    terrible: "Terrible",
  },
  si: {
    pageTitle: "ඔබගේ ප්‍රතිපෝෂණය බෙදාගන්න",
    pageSubtitle:
      "ඔබගේ අදහස් සහ අත්දැකීම් බෙදාගැනීමෙන් GovLink වැඩිදියුණු කිරීමට උදව් කරන්න",
    personalInfo: "පුද්ගලික තොරතුරු",
    feedbackDetails: "ප්‍රතිපෝෂණ විස්තර",
    rating: "සමස්ත ශ්‍රේණිගත කිරීම",
    ratingDescription:
      "GovLink සමඟ ඔබගේ සමස්ත අත්දැකීම ඔබ කෙසේ ශ්‍රේණිගත කරනවාද?",
    name: "සම්පූර්ණ නම",
    namePlaceholder: "ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න",
    email: "විද්‍යුත් තැපෑල ලිපිනය",
    emailPlaceholder: "ඔබගේ විද්‍යුත් තැපෑල ලිපිනය ඇතුළත් කරන්න",
    feedbackType: "ප්‍රතිපෝෂණ වර්ගය",
    feedbackTypes: {
      general: "සාමාන්‍ය ප්‍රතිපෝෂණය",
      bug: "දෝෂයක් වාර්තා කරන්න",
      feature: "විශේෂාංග ඉල්ලීම",
      service: "සේවා අත්දැකීම",
    },
    subject: "විෂය",
    subjectPlaceholder: "ඔබගේ ප්‍රතිපෝෂණයේ කෙටි විස්තරයක්",
    message: "පණිවිඩය",
    messagePlaceholder: "කරුණාකර විස්තරාත්මක ප්‍රතිපෝෂණයක් ලබා දෙන්න...",
    submit: "ප්‍රතිපෝෂණය ඉදිරිපත් කරන්න",
    submitting: "ඉදිරිපත් කරමින්...",
    successTitle: "ස්තූතියි!",
    successMessage:
      "ඔබගේ ප්‍රතිපෝෂණය ලැබී ඇත. අපි ඔබගේ දායකත්වයට කෘතඥ වන අතර එය අපගේ සේවා වැඩිදියුණු කිරීමට භාවිතා කරන්නෙමු.",
    backToHome: "මුල් පිටුවට",
    required: "අවශ්‍ය",
    selectFeedbackType: "ප්‍රතිපෝෂණ වර්ගය තෝරන්න",
    rateExperience: "ඔබගේ අත්දැකීම ශ්‍රේණිගත කරන්න",
    excellent: "විශිෂ්ට",
    good: "හොඳ",
    average: "සාමාන්‍ය",
    poor: "දුර්වල",
    terrible: "භයානක",
  },
  ta: {
    pageTitle: "உங்கள் கருத்தைப் பகிரவும்",
    pageSubtitle:
      "உங்கள் எண்ணங்கள் மற்றும் அனுபவங்களைப் பகிர்ந்து GovLink ஐ மேம்படுத்த உதவுங்கள்",
    personalInfo: "தனிப்பட்ட தகவல்",
    feedbackDetails: "கருத்து விவரங்கள்",
    rating: "ஒட்டுமொத்த மதிப்பீடு",
    ratingDescription:
      "GovLink உடனான உங்கள் ஒட்டுமொத்த அனுபவத்தை எவ்வாறு மதிப்பிடுவீர்கள்?",
    name: "முழு பெயர்",
    namePlaceholder: "உங்கள் முழு பெயரை உள்ளிடவும்",
    email: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்",
    feedbackType: "கருத்து வகை",
    feedbackTypes: {
      general: "பொதுவான கருத்து",
      bug: "பிழையைப் புகாரளிக்கவும்",
      feature: "அம்ச கோரிக்கை",
      service: "சேவை அனுபவம்",
    },
    subject: "பொருள்",
    subjectPlaceholder: "உங்கள் கருத்தின் சுருக்கமான விளக்கம்",
    message: "செய்தி",
    messagePlaceholder: "தயவுசெய்து விரிவான கருத்தை வழங்கவும்...",
    submit: "கருத்தைச் சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கிறது...",
    successTitle: "நன்றி!",
    successMessage:
      "உங்கள் கருத்து பெறப்பட்டது. உங்கள் பங்களிப்பை நாங்கள் பாராட்டுகிறோம் மற்றும் எங்கள் சேவைகளை மேம்படுத்த இதைப் பயன்படுத்துவோம்.",
    backToHome: "முகப்புக்குத் திரும்பு",
    required: "தேவை",
    selectFeedbackType: "கருத்து வகையைத் தேர்ந்தெடுக்கவும்",
    rateExperience: "உங்கள் அனுபவத்தை மதிப்பிடுங்கள்",
    excellent: "சிறந்த",
    good: "நல்ல",
    average: "சராசரி",
    poor: "மோசமான",
    terrible: "பயங்கரமான",
  },
};

const ratingLabels = {
  1: { en: "Terrible", si: "භයානක", ta: "பயங்கரமான" },
  2: { en: "Poor", si: "දුර්වල", ta: "மோசமான" },
  3: { en: "Average", si: "සාමාන්‍ය", ta: "சராசரி" },
  4: { en: "Good", si: "හොඳ", ta: "நல்ல" },
  5: { en: "Excellent", si: "විශිෂ්ට", ta: "சிறந்த" },
};

export default function FeedbackPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FeedbackData>({
    name: "",
    email: "",
    feedbackType: "general",
    rating: null,
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FeedbackData>>({});

  const t = feedbackTranslations[currentLanguage];

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackData> = {};

    if (!formData.name.trim()) newErrors.name = t.required;
    if (!formData.email.trim()) newErrors.email = t.required;
    if (!formData.subject.trim()) newErrors.subject = t.required;
    if (!formData.message.trim()) newErrors.message = t.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          language: currentLanguage,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `Failed to submit feedback: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderStarRating = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {t.ratingDescription}
          </span>
          {formData.rating && (
            <span className="text-sm text-muted-foreground">
              {ratingLabels[formData.rating][currentLanguage]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleInputChange("rating", star as Rating)}
              className="group relative p-1 transition-all duration-200"
            >
              <Star
                className={`w-8 h-8 transition-all duration-200 ${
                  formData.rating && star <= formData.rating
                    ? "fill-[#FFC72C] text-[#FFC72C]"
                    : "text-muted-foreground hover:text-[#FFC72C]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-lg"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {t.successTitle}
              </h1>
              <p className="text-muted-foreground mb-8">{t.successMessage}</p>
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {t.backToHome}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFC72C]/20 to-[#FF5722]/20 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[#FF5722]" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.pageTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.pageSubtitle}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg"
          >
            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF5722] rounded-full"></div>
                {t.personalInfo}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.name} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={`w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                      errors.name ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.email} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={`w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                      errors.email ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FFC72C] rounded-full"></div>
                {t.feedbackDetails}
              </h2>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t.rating}
                </label>
                {renderStarRating()}
              </div>

              {/* Feedback Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.feedbackType}
                </label>
                <select
                  value={formData.feedbackType}
                  onChange={(e) =>
                    handleInputChange(
                      "feedbackType",
                      e.target.value as FeedbackType
                    )
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="general">{t.feedbackTypes.general}</option>
                  <option value="bug">{t.feedbackTypes.bug}</option>
                  <option value="feature">{t.feedbackTypes.feature}</option>
                  <option value="service">{t.feedbackTypes.service}</option>
                </select>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.subject} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder={t.subjectPlaceholder}
                  className={`w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    errors.subject ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.subject && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.message} <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder={t.messagePlaceholder}
                  rows={6}
                  className={`w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-vertical ${
                    errors.message ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.message && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    {t.submitting}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t.submit}
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
