"use client";
import React, { useState } from "react";
import UserDashboardLayout from "@/components/user/dashboard/UserDashboardLayout";

const UserHelpPage = () => {
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const translations = {
    en: {
      title: "Help & Support",
      subtitle: "Find answers to your questions and get support",
      searchPlaceholder: "Search for help...",
      categories: "Categories",
      gettingStarted: "Getting Started",
      accountManagement: "Account Management",
      services: "Government Services",
      appointments: "Appointments",
      documents: "Documents & Forms",
      technical: "Technical Support",
      contact: "Contact Support",
      phone: "Phone",
      email: "Email",
      chat: "Live Chat",
      faqs: "Frequently Asked Questions",
      tutorials: "Video Tutorials",
    },
    si: {
      title: "උදව් සහ සහාය",
      subtitle: "ඔබේ ප්‍රශ්නවලට පිළිතුරු සොයා ගන්න සහ සහාය ලබා ගන්න",
      searchPlaceholder: "උදව් සඳහා සොයන්න...",
      categories: "කාණ්ඩ",
      gettingStarted: "ආරම්භ කිරීම",
      accountManagement: "ගිණුම් කළමනාකරණය",
      services: "රජයේ සේවාවන්",
      appointments: "හමුවීම්",
      documents: "ලේඛන සහ ෆෝම්",
      technical: "තාක්ෂණික සහාය",
      contact: "සහාය අමතන්න",
      phone: "දුරකථනය",
      email: "ඊමේල්",
      chat: "සජීව කතාබස්",
      faqs: "නිතර අසන ප්‍රශ්න",
      tutorials: "වීඩියෝ නිබන්ධන",
    },
    ta: {
      title: "உதவி மற்றும் ஆதரவு",
      subtitle: "உங்கள் கேள்விகளுக்கான பதில்களைக் கண்டறிந்து ஆதரவைப் பெறுங்கள்",
      searchPlaceholder: "உதவிக்காக தேடுங்கள்...",
      categories: "வகைகள்",
      gettingStarted: "தொடங்குதல்",
      accountManagement: "கணக்கு நிர்வாகம்",
      services: "அரசாங்க சேவைகள்",
      appointments: "சந்திப்புகள்",
      documents: "ஆவணங்கள் மற்றும் படிவங்கள்",
      technical: "தொழில்நுட்ப ஆதரவு",
      contact: "ஆதரவைத் தொடர்பு கொள்ளவும்",
      phone: "தொலைபேசி",
      email: "மின்னஞ்சல்",
      chat: "நேரடி அரட்டை",
      faqs: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      tutorials: "வீடியோ பயிற்சிகள்",
    },
  };

  const t = translations[language];

  const helpCategories = [
    {
      id: "getting-started",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
      title: t.gettingStarted,
      articles: [
        {
          title: "How to register as a citizen",
          content:
            "To register as a citizen on GovLink:\n\n1. Click on 'Register' from the main page\n2. Fill in your personal details including your NIC number\n3. Provide a valid email address and mobile number\n4. Create a secure password\n5. Verify your email address by clicking the link sent to your inbox\n6. Complete your profile with additional information\n\nOnce registered, you'll have access to all government services available on the platform.",
        },
        {
          title: "First time login guide",
          content:
            "For your first login:\n\n1. Go to the citizen login page\n2. Enter your registered email and password\n3. If you forgot your password, use the 'Forgot Password' link\n4. After successful login, you'll be taken to your dashboard\n5. Complete your profile if prompted\n6. Explore the available services and features\n\nTip: Keep your login credentials secure and don't share them with anyone.",
        },
        {
          title: "Setting up your profile",
          content:
            "To complete your profile setup:\n\n1. Navigate to your profile page from the user menu\n2. Upload a clear profile picture\n3. Fill in all required personal information\n4. Add your address details\n5. Upload necessary verification documents\n6. Set your communication preferences\n7. Review and save your information\n\nA complete profile helps government agents serve you better and speeds up service delivery.",
        },
        {
          title: "Understanding the dashboard",
          content:
            "Your dashboard provides:\n\n1. **Quick Actions**: Apply for services, book appointments\n2. **Recent Activity**: View your recent applications and bookings\n3. **Notifications**: Important updates from government departments\n4. **Service Status**: Track your ongoing applications\n5. **Shortcuts**: Quick access to frequently used services\n6. **Help**: Access to support and guidance\n\nThe dashboard is your central hub for all government service interactions.",
        },
      ],
    },
    {
      id: "account-management",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: t.accountManagement,
      articles: [
        {
          title: "Updating your personal information",
          content:
            "To update your personal information:\n\n1. Go to your profile page\n2. Click on 'Edit Profile'\n3. Update the necessary fields\n4. Upload new documents if required\n5. Save your changes\n\nNote: Some changes may require verification by government officials.",
        },
        {
          title: "Changing your password",
          content:
            "To change your password:\n\n1. Go to Settings from your profile menu\n2. Click on 'Change Password'\n3. Enter your current password\n4. Enter your new password (must be strong)\n5. Confirm your new password\n6. Save changes\n\nFor security, you'll be logged out of all devices after changing your password.",
        },
        {
          title: "Managing notification preferences",
          content:
            "To manage your notifications:\n\n1. Go to Settings\n2. Navigate to 'Notification Preferences'\n3. Choose your preferred notification methods (email, SMS)\n4. Select which types of notifications you want to receive\n5. Set your notification frequency\n6. Save your preferences\n\nYou can update these settings anytime.",
        },
        {
          title: "Account verification process",
          content:
            "Account verification steps:\n\n1. Upload required documents (NIC, proof of address)\n2. Wait for government verification (usually 2-3 business days)\n3. Check your email for verification status updates\n4. If additional documents are needed, you'll be notified\n5. Once verified, you'll have access to all services\n\nVerified accounts have higher service limits and faster processing.",
        },
      ],
    },
    {
      id: "services",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      title: t.services,
      articles: [
        {
          title: "Available government services",
          content:
            "GovLink provides access to various government services:\n\n• **Identity Services**: NIC applications, passport renewals\n• **Business Services**: Business registration, licenses\n• **Health Services**: Medical certificates, health records\n• **Education Services**: Certificate verification, transcripts\n• **Social Services**: Welfare applications, pensions\n• **Property Services**: Land records, property transfers\n\nNew services are regularly added to the platform.",
        },
        {
          title: "How to apply for services",
          content:
            "To apply for government services:\n\n1. Browse available services from your dashboard\n2. Select the service you need\n3. Read the requirements and prepare documents\n4. Fill out the application form completely\n5. Upload required documents\n6. Review and submit your application\n7. Pay any applicable fees online\n8. Track your application status\n\nYou'll receive notifications about your application progress.",
        },
        {
          title: "Service status tracking",
          content:
            "Track your service applications:\n\n1. Go to your dashboard\n2. Click on 'My Applications'\n3. View the status of each application\n4. Click on any application for detailed information\n5. Check for updates and required actions\n6. Download completed documents when ready\n\nStatus updates include: Submitted, Under Review, Approved, Rejected, or Completed.",
        },
        {
          title: "Required documents checklist",
          content:
            "Common documents needed for services:\n\n**Identity Verification**:\n• Valid NIC (front and back)\n• Recent passport-size photograph\n\n**Address Verification**:\n• Utility bill (not older than 3 months)\n• Bank statement or rent agreement\n\n**Service-Specific Documents**:\n• Birth certificate (for passport applications)\n• Marriage certificate (for spouse-related services)\n• Educational certificates (for verification services)\n\nAlways check specific requirements for each service.",
        },
      ],
    },
    {
      id: "appointments",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: t.appointments,
      articles: [
        {
          title: "Booking an appointment",
          content:
            "To book an appointment:\n\n1. Go to 'Book Appointment' from your dashboard\n2. Select the government department\n3. Choose the service you need\n4. Select an available agent\n5. Pick a convenient date and time\n6. Provide the purpose of your visit\n7. Confirm your appointment details\n8. Receive confirmation via email and SMS\n\nArrive 10 minutes early with all required documents.",
        },
        {
          title: "Rescheduling appointments",
          content:
            "To reschedule an appointment:\n\n1. Go to 'My Appointments' in your dashboard\n2. Find the appointment you want to reschedule\n3. Click 'Reschedule'\n4. Select a new available time slot\n5. Confirm the changes\n6. You'll receive updated confirmation\n\nNote: You can reschedule up to 24 hours before your appointment time.",
        },
        {
          title: "Canceling appointments",
          content:
            "To cancel an appointment:\n\n1. Navigate to 'My Appointments'\n2. Select the appointment to cancel\n3. Click 'Cancel Appointment'\n4. Provide a reason for cancellation (optional)\n5. Confirm the cancellation\n6. You'll receive cancellation confirmation\n\nCanceling early helps others book available slots.",
        },
        {
          title: "Appointment reminders",
          content:
            "Appointment reminder system:\n\n• **24 hours before**: Email and SMS reminder\n• **2 hours before**: Final SMS reminder\n• **Digital calendar**: Add appointment to your calendar\n• **Dashboard alerts**: Visual reminders when you log in\n\nYou can customize reminder preferences in your settings to receive notifications via your preferred method.",
        },
      ],
    },
  ];

  const handleArticleClick = (articleTitle: string) => {
    setSelectedArticle(selectedArticle === articleTitle ? null : articleTitle);
  };

  const getSelectedArticleContent = () => {
    const currentCategory = helpCategories.find(
      (cat) => cat.id === activeCategory
    );
    if (!currentCategory || !selectedArticle) return null;

    const article = currentCategory.articles.find(
      (art) => typeof art === "object" && art.title === selectedArticle
    );
    return typeof article === "object" ? article.content : null;
  };

  const contactMethods = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      title: t.phone,
      value: "+94 11 234 5678",
      description: "Available 24/7",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22 6 12 13 2 6" />
        </svg>
      ),
      title: t.email,
      value: "support@govlink.lk",
      description: "Response within 24 hours",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: t.chat,
      value: "Start Live Chat",
      description: "Mon-Fri 8AM-6PM",
    },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        'You can reset your password by clicking the "Forgot Password" link on the login page and following the instructions sent to your email.',
    },
    {
      question: "How long does service processing take?",
      answer:
        "Processing times vary by service type. Most applications are processed within 5-10 business days. You can track the status in your dashboard.",
    },
    {
      question: "What documents do I need for verification?",
      answer:
        "You typically need a valid NIC, proof of address, and any service-specific documents. Check the requirements for each service.",
    },
    {
      question: "Can I cancel my application?",
      answer:
        "Yes, you can cancel applications that haven't been processed yet. Go to your dashboard and select the application to cancel.",
    },
  ];

  return (
    <UserDashboardLayout
      title={t.title}
      subtitle={t.subtitle}
      language={language}
      onLanguageChange={setLanguage}
    >
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-border rounded-xl bg-card/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#FFC72C]/50 shadow-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-6 shadow-lg sticky top-32">
              <h3 className="font-semibold mb-4">{t.categories}</h3>
              <nav className="space-y-2">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setSelectedArticle(null); // Reset selected article when changing categories
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      activeCategory === category.id
                        ? "bg-[#FFC72C]/10 text-[#FFC72C] border-l-2 border-l-[#FFC72C]"
                        : "hover:bg-card/30"
                    }`}
                  >
                    {category.icon}
                    <span className="text-sm font-medium">
                      {category.title}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Help Articles */}
            <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {helpCategories.find((cat) => cat.id === activeCategory)?.title}
              </h2>
              <div className="space-y-3">
                {helpCategories
                  .find((cat) => cat.id === activeCategory)
                  ?.articles.map((article, index) => (
                    <div key={index}>
                      <button
                        onClick={() =>
                          handleArticleClick(
                            typeof article === "object"
                              ? article.title
                              : article
                          )
                        }
                        className="w-full text-left p-4 border border-border rounded-lg hover:bg-card/30 transition-colors duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium group-hover:text-[#FFC72C] transition-colors duration-200">
                            {typeof article === "object"
                              ? article.title
                              : article}
                          </span>
                          <svg
                            className={`w-4 h-4 text-muted-foreground group-hover:text-[#FFC72C] transition-all duration-200 ${
                              selectedArticle ===
                              (typeof article === "object"
                                ? article.title
                                : article)
                                ? "rotate-90"
                                : ""
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      </button>

                      {/* Article Content */}
                      {selectedArticle ===
                        (typeof article === "object"
                          ? article.title
                          : article) && (
                        <div className="mt-3 p-4 bg-muted/20 border border-border/30 rounded-lg opacity-0 animate-fade-in-up">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            {typeof article === "object" ? (
                              <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                                {article.content}
                              </pre>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Content for this article will be available soon.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                {t.faqs}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="cursor-pointer p-4 border border-border rounded-lg hover:bg-card/30 transition-colors duration-200 list-none">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{faq.question}</span>
                        <svg
                          className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform duration-200"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </summary>
                    <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 10.5a3 3 0 1 1-6 0 2.5 2.5 0 0 0-5 0v.5a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3v-.5a2.5 2.5 0 0 0-5 0 3 3 0 1 1-6 0" />
                </svg>
                {t.contact}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg hover:bg-card/30 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {method.icon}
                      <span className="font-medium">{method.title}</span>
                    </div>
                    <div className="text-[#FFC72C] font-medium mb-1">
                      {method.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {method.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default UserHelpPage;
