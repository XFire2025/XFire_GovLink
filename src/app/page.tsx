// app/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';

// Types for translations
type Language = 'en' | 'si' | 'ta';

interface HomeTranslations {
  // Hero Section
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroDescription: string;
  searchPlaceholders: string[];
  searchSuggestions: string[];
  trustIndicators: {
    trusted: string;
    available: string;
    endorsed: string;
  };
  
  // Features Section
  featuresTitle1: string;
  featuresTitle2: string;
  featuresDescription: string;
  features: {
    documents: {
      title: string;
      description: string;
      benefits: string[];
    };
    information: {
      title: string;
      description: string;
      benefits: string[];
    };
    appointments: {
      title: string;
      description: string;
      benefits: string[];
    };
  };
  
  // About Section
  aboutTitle1: string;
  aboutTitle2: string;
  aboutDescription: string;
  aboutFeatures: {
    simplified: {
      title: string;
      description: string;
    };
    availability: {
      title: string;
      description: string;
    };
    transparent: {
      title: string;
      description: string;
    };
  };
  aboutButtons: {
    learnMore: string;
    mission: string;
  };
  aboutStats: {
    citizens: string;
    forms: string;
    departments: string;
    uptime: string;
    users: string;
    support: string;
  };
  aboutTrust: {
    title: string;
    description: string;
  };
  
  // Contact Section
  contactTitle1: string;
  contactTitle2: string;
  contactDescription: string;
  contactMethods: {
    phone: {
      title: string;
      number: string;
      hours: string;
    };
    email: {
      title: string;
      address: string;
      availability: string;
    };
    location: {
      title: string;
      address: string;
      description: string;
    };
  };
  faq: {
    title: string;
    questions: {
      forms: {
        question: string;
        answer: string;
      };
      official: {
        question: string;
        answer: string;
      };
      tracking: {
        question: string;
        answer: string;
      };
      support: {
        question: string;
        answer: string;
      };
    };
  };
  
  // Footer
  footer: {
    description: string;
    quickLinks: {
      services: string;
      about: string;
      contact: string;
      help: string;
    };
    legal: {
      privacy: string;
      terms: string;
      cookies: string;
      accessibility: string;
    };
    status: string;
    copyright: string;
    crafted: string;
    forSriLanka: string;
  };
}

// Translation data
const translations: Record<Language, HomeTranslations> = {
  en: {
    // Hero Section
    heroTitle1: "Simplifying Government",
    heroTitle2: "for Every Sri Lankan",
    heroSubtitle: "Ask questions, find services, and access government information instantly.",
    heroDescription: "Your direct link to public services in Sri Lanka.",
    searchPlaceholders: [
      "How do I renew my passport?",
      "Where can I register my business?",
      "How to apply for a driving license?",
      "What documents do I need for marriage registration?"
    ],
    searchSuggestions: ["🛂 Passport Renewal", "🏢 Business Registration", "💍 Marriage Certificate", "🚗 Driving License"],
    trustIndicators: {
      trusted: "Trusted by 50K+ Citizens",
      available: "24/7 Available",
      endorsed: "Government Endorsed"
    },
    
    // Features Section
    featuresTitle1: "Everything You Need,",
    featuresTitle2: "All in One Place",
    featuresDescription: "GovLink is designed to make your interaction with government services seamless and efficient.",
    features: {
      documents: {
        title: "Access Forms & Documents",
        description: "Instantly find and download official government forms for passports, licenses, and more.",
        benefits: ["📥 Instant Downloads", "🕒 24/7 Availability", "📁 Multiple Formats"]
      },
      information: {
        title: "Get Instant Information",
        description: "Ask any question about public services and get clear, step-by-step guidance.",
        benefits: ["⚡ Real-time Answers", "📋 Step-by-step Guides", "🌐 Multi-language Support"]
      },
      appointments: {
        title: "Schedule Appointments",
        description: "Find available slots and book appointments with government departments online.",
        benefits: ["📅 Online Booking", "📱 SMS Reminders", "🔄 Easy Rescheduling"]
      }
    },
    
    // About Section
    aboutTitle1: "Bridging the Gap Between",
    aboutTitle2: "Citizens & Government",
    aboutDescription: "Making government services accessible, transparent, and efficient for every Sri Lankan citizen. Our platform revolutionizes how citizens interact with government departments, eliminating bureaucratic hurdles and streamlining essential processes.",
    aboutFeatures: {
      simplified: {
        title: "Simplified Access",
        description: "One unified platform for all government services. No more visiting multiple departments or websites. Everything you need is accessible from a single dashboard."
      },
      availability: {
        title: "24/7 Availability",
        description: "Access government services anytime, anywhere. Our digital platform never closes, ensuring you can complete tasks at your convenience, even outside office hours."
      },
      transparent: {
        title: "Transparent Process",
        description: "Clear step-by-step guidance with real-time tracking. Know exactly what documents you need, how long processes take, and track your application status every step of the way."
      }
    },
    aboutButtons: {
      learnMore: "Learn More About Us",
      mission: "Our Mission & Vision"
    },
    aboutStats: {
      citizens: "Citizens Served",
      forms: "Government Forms",
      departments: "Departments",
      uptime: "Uptime",
      users: "Users",
      support: "Support"
    },
    aboutTrust: {
      title: "Trusted by Government",
      description: "Officially endorsed by the Ministry of Public Administration and recognized as the primary digital gateway for citizen services in Sri Lanka."
    },
    
    // Contact Section
    contactTitle1: "Need Help?",
    contactTitle2: "We're Here for You",
    contactDescription: "Have questions about government services? Our support team is ready to assist you.",
    contactMethods: {
      phone: {
        title: "📞 Call Us",
        number: "+94 11 234 5678",
        hours: "Mon - Fri, 8AM - 6PM"
      },
      email: {
        title: "📧 Email Us",
        address: "support@govlink.lk",
        availability: "24/7 Support"
      },
      location: {
        title: "📍 Visit Us",
        address: "Colombo, Sri Lanka",
        description: "Government Services Hub"
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      questions: {
        forms: {
          question: "How do I access government forms?",
          answer: "Simply search for the form you need or browse our services section. All forms are available for instant download."
        },
        official: {
          question: "Is GovLink an official platform?",
          answer: "Yes, GovLink is officially endorsed by the Government of Sri Lanka for digital service delivery."
        },
        tracking: {
          question: "Can I track my application status?",
          answer: "Absolutely! Use your application reference number to track the progress of your submissions."
        },
        support: {
          question: "What if I need technical support?",
          answer: "Our technical support team is available 24/7 via phone, email, or live chat to assist you."
        }
      }
    },
    
    // Footer
    footer: {
      description: "🇱🇰 Simplifying government services for every Sri Lankan. Access information, download forms, and complete procedures with ease through our modern digital platform.",
      quickLinks: {
        services: "🛡️ Services",
        about: "🏛️ About Us",
        contact: "📞 Contact",
        help: "❓ Help Center"
      },
      legal: {
        privacy: "🔒 Privacy Policy",
        terms: "📋 Terms of Service",
        cookies: "🍪 Cookie Policy",
        accessibility: "♿ Accessibility"
      },
      status: "All systems operational",
      copyright: "GovLink Sri Lanka. An initiative to streamline public services.",
      crafted: "Crafted with",
      forSriLanka: "🇱🇰 Sri Lanka"
    }
  },
  
  si: {
    // Hero Section
    heroTitle1: "රජයේ සේවා සරල කිරීම",
    heroTitle2: "සෑම ශ්‍රී ලාංකිකයා වෙනුවෙන්",
    heroSubtitle: "ප්‍රශ්න ඇසීම, සේවා සොයාගැනීම, සහ රජයේ තොරතුරු ක්ෂණිකව ලබාගැනීම.",
    heroDescription: "ශ්‍රී ලංකාවේ පොදු සේවා වෙත ඔබේ සෘජු සම්බන්ධතාවය.",
    searchPlaceholders: [
      "මගේ ගමන් බලපත්‍රය අලුත් කරන්නේ කොහොමද?",
      "මගේ ව්‍යාපාරය ලියාපදිංචි කරන්නේ කොහේද?",
      "රියදුරු බලපත්‍රයක් ලබාගන්නේ කොහොමද?",
      "විවාහ ලියාපදිංචිය සඳහා මොනවා ලේඛන අවශ්‍යද?"
    ],
    searchSuggestions: ["🛂 ගමන් බලපත්‍ර අලුත් කිරීම", "🏢 ව්‍යාපාර ලියාපදිංචිය", "💍 විවාහ සහතිකය", "🚗 රියදුරු බලපත්‍රය"],
    trustIndicators: {
      trusted: "50K+ පුරවැසියන්ගේ විශ්වාසය",
      available: "24/7 ලබාගත හැකි",
      endorsed: "රජයේ අනුමැතිය"
    },
    
    // Features Section
    featuresTitle1: "ඔබට අවශ්‍ය සියල්ල,",
    featuresTitle2: "එක තැනකම",
    featuresDescription: "GovLink නිර්මාණය කර ඇත්තේ රජයේ සේවා සමග ඔබේ අන්තර්ක්‍රියාව සුමට හා කාර්යක්ෂම කිරීමට ය.",
    features: {
      documents: {
        title: "ආකෘති පත්‍ර සහ ලේඛන වෙත ප්‍රවේශය",
        description: "ගමන් බලපත්‍ර, බලපත්‍ර සහ තවත් බොහෝ දේ සඳහා නිල රජයේ ආකෘති පත්‍ර ක්ෂණිකව සොයා බාගන්න.",
        benefits: ["📥 ක්ෂණික බාගත කිරීම්", "🕒 24/7 ලබාගත හැකි", "📁 විවිධ ආකෘති"]
      },
      information: {
        title: "ක්ෂණික තොරතුරු ලබාගන්න",
        description: "පොදු සේවා ගැන ඕනෑම ප්‍රශ්නයක් අසා පැහැදිලි, පියවරින් පියවර මඟපෙන්වීම ලබාගන්න.",
        benefits: ["⚡ තත්‍ය කාලීන පිළිතුරු", "📋 පියවරින් පියවර මාර්ගෝපදේශන", "🌐 බහුභාෂා සහාය"]
      },
      appointments: {
        title: "හමුවීම් කාලසටහන් කරන්න",
        description: "රජයේ දෙපාර්තමේන්තු සමග අන්තර්ජාලය හරහා ලබාගත හැකි වේලාවන් සොයා හමුවීම් වෙන්කරවාගන්න.",
        benefits: ["📅 අන්තර්ජාල වෙන්කිරීම්", "📱 SMS මතක්කරුවන්", "🔄 පහසු නැවත සකස් කිරීම"]
      }
    },
    
    // About Section
    aboutTitle1: "අතර පරතරය වසා දැමීම",
    aboutTitle2: "පුරවැසියන් සහ රජය",
    aboutDescription: "සෑම ශ්‍රී ලාංකික පුරවැසියකු සඳහාම රජයේ සේවා ප්‍රවේශ විය හැකි, විනිවිද පෙනෙන සහ කාර්යක්ෂම කිරීම. අපගේ වේදිකාව පුරවැසියන් රජයේ දෙපාර්තමේන්තු සමග අන්තර්ක්‍රියා කරන ආකාරය විප්ලවීය වෙනසක් ඇති කරයි.",
    aboutFeatures: {
      simplified: {
        title: "සරල කළ ප්‍රවේශය",
        description: "සියළුම රජයේ සේවා සඳහා එක ඒකාබද්ධ වේදිකාවක්. තවදුරටත් බහුවිධ දෙපාර්තමේන්තු හෝ වෙබ් අඩවි වෙත යාමක් නැත. ඔබට අවශ්‍ය සියල්ල එකම උපකරණ පුවරුවකින් ප්‍රවේශ කළ හැකිය."
      },
      availability: {
        title: "24/7 ලබාගත හැකිබව",
        description: "ඕනෑම වේලාවක, ඕනෑම තැනක රජයේ සේවා වෙත ප්‍රවේශ වන්න. අපගේ ඩිජිටල් වේදිකාව කිසි විටක වසා නොදමයි, කාර්යාල කාලයෙන් පිටත පවා ඔබට පහසුවෙන් කාර්යයන් සම්පූර්ණ කළ හැකිය."
      },
      transparent: {
        title: "විනිවිද පෙනෙන ක්‍රියාවලිය",
        description: "තත්‍ය කාලීන ලුහුබැඳීම සමඟ පැහැදිලි පියවරින් පියවර මඟපෙන්වීම. ඔබට අවශ්‍ය ලේඛන මොනවාද, ක්‍රියාවලි කොපමණ කාලයක් ගතවේද, සහ ඔබේ අයදුම්පත්‍රයේ තත්ත්වය සෑම පියවරකදීම ලුහුබැඳීම."
      }
    },
    aboutButtons: {
      learnMore: "අප ගැන වැඩි දැනගන්න",
      mission: "අපගේ මෙහෙයුම සහ දැක්ම"
    },
    aboutStats: {
      citizens: "සේවාලත් පුරවැසියන්",
      forms: "රජයේ ආකෘති පත්‍ර",
      departments: "දෙපාර්තමේන්තු",
      uptime: "ක්‍රියාකාරිත්වය",
      users: "පරිශීලකයන්",
      support: "සහාය"
    },
    aboutTrust: {
      title: "රජයේ විශ්වාසය",
      description: "මහජන පරිපාලන අමාත්‍යංශයේ නිල අනුමැතිය සහ ශ්‍රී ලංකාවේ පුරවැසි සේවා සඳහා මූලික ඩිජිටල් ගේට්වේ ලෙස පිළිගැනීම."
    },
    
    // Contact Section
    contactTitle1: "උදව්වක් අවශ්‍යද?",
    contactTitle2: "අපි ඔබ වෙනුවෙන් මෙහි සිටිමු",
    contactDescription: "රජයේ සේවා ගැන ප්‍රශ්න තිබේද? අපගේ සහාය කණ්ඩායම ඔබට සහාය වීමට සූදානම්.",
    contactMethods: {
      phone: {
        title: "📞 අපට ඇමතුම් දෙන්න",
        number: "+94 11 234 5678",
        hours: "සඳුදා - සිකුරාදා, උදෑසන 8 - සවස 6"
      },
      email: {
        title: "📧 අපට ඊමේල් කරන්න",
        address: "support@govlink.lk",
        availability: "24/7 සහාය"
      },
      location: {
        title: "📍 අප වෙත පැමිණෙන්න",
        address: "කොළඹ, ශ්‍රී ලංකාව",
        description: "රජයේ සේවා මධ්‍යස්ථානය"
      }
    },
    faq: {
      title: "නිතර අසන ප්‍රශ්න",
      questions: {
        forms: {
          question: "රජයේ ආකෘති පත්‍ර වෙත ප්‍රවේශ වන්නේ කොහොමද?",
          answer: "ඔබට අවශ්‍ය ආකෘතිය සඳහා සෙවීම හෝ අපගේ සේවා අංශය පිරික්සීම පමණි. සියළුම ආකෘති ක්ෂණික බාගත කිරීම සඳහා ලබාගත හැකිය."
        },
        official: {
          question: "GovLink නිල වේදිකාවක්ද?",
          answer: "ඔව්, GovLink ඩිජිටල් සේවා සැපයීම සඳහා ශ්‍රී ලංකා රජයේ නිල අනුමැතිය ලබා ඇත."
        },
        tracking: {
          question: "මගේ අයදුම්පත්‍රයේ තත්ත්වය ලුහුබැඳීමට හැකිද?",
          answer: "අනිවාර්යයෙන්! ඔබේ අයදුම් සිටුවම්වල ප්‍රගතිය ලුහුබැඳීම සඳහා ඔබේ අයදුම්පත්‍ර යොමු අංකය භාවිතා කරන්න."
        },
        support: {
          question: "මට තාක්ෂණික සහාය අවශ්‍ය නම් කුමක් කළ යුතුද?",
          answer: "අපගේ තාක්ෂණික සහාය කණ්ඩායම දුරකථනය, ඊමේල් හෝ සජීවි චැට් හරහා 24/7 ඔබට සහාය වීමට ලැබී ඇත."
        }
      }
    },
    
    // Footer
    footer: {
      description: "🇱🇰 සෑම ශ්‍රී ලාංකිකයකු සඳහාම රජයේ සේවා සරල කිරීම. අපගේ නවීන ඩිජිටල් වේදිකාව හරහා පහසුවෙන් තොරතුරු ප්‍රවේශ කිරීම, ආකෘති බාගත කිරීම සහ ක්‍රියාවලි සම්පූර්ණ කිරීම.",
      quickLinks: {
        services: "🛡️ සේවා",
        about: "🏛️ අප ගැන",
        contact: "📞 සම්බන්ධවීම",
        help: "❓ උදව් මධ්‍යස්ථානය"
      },
      legal: {
        privacy: "🔒 පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
        terms: "📋 සේවා කොන්දේසි",
        cookies: "🍪 කුකී ප්‍රතිපත්තිය",
        accessibility: "♿ ප්‍රවේශ්‍යතාව"
      },
      status: "සියළුම පද්ධති ක්‍රියාත්මකයි",
      copyright: "GovLink ශ්‍රී ලංකාව. පොදු සේවා සරල කිරීමේ මුලපිරීමක්.",
      crafted: "සකස් කරන ලද්දේ",
      forSriLanka: "🇱🇰 ශ්‍රී ලංකාව"
    }
  },
  
  ta: {
    // Hero Section
    heroTitle1: "அரசாங்க சேவைகளை எளிமைப்படுத்துதல்",
    heroTitle2: "ஒவ்வொரு இலங்கையருக்கும்",
    heroSubtitle: "கேள்விகளைக் கேளுங்கள், சேவைகளைக் கண்டறியுங்கள், மற்றும் அரசாங்க தகவல்களை உடனடியாகப் பெறுங்கள்.",
    heroDescription: "இலங்கையில் பொதுச் சேவைகளுக்கான உங்கள் நேரடித் தொடர்பு.",
    searchPlaceholders: [
      "எனது பாஸ்போர்ட்டை எவ்வாறு புதுப்பிப்பது?",
      "எனது வணிகத்தை எங்கே பதிவு செய்வது?",
      "ஓட்டுநர் உரிமத்திற்கு எவ்வாறு விண்ணப்பிப்பது?",
      "திருமணப் பதிவிற்கு என்ன ஆவணங்கள் தேவை?"
    ],
    searchSuggestions: ["🛂 பாஸ்போர்ட் புதுப்பித்தல்", "🏢 வணிகப் பதிவு", "💍 திருமணச் சான்றிதழ்", "🚗 ஓட்டுநர் உரிமம்"],
    trustIndicators: {
      trusted: "50K+ குடிமக்களின் நம்பிக்கை",
      available: "24/7 கிடைக்கிறது",
      endorsed: "அரசாங்க ஒப்புதல்"
    },
    
    // Features Section
    featuresTitle1: "உங்களுக்குத் தேவையான அனைத்தும்,",
    featuresTitle2: "ஒரே இடத்தில்",
    featuresDescription: "அரசாங்கச் சேவைகளுடனான உங்கள் தொடர்புகளை மென்மையாகவும் திறமையாகவும் மாற்ற GovLink வடிவமைக்கப்பட்டுள்ளது.",
    features: {
      documents: {
        title: "படிவங்கள் & ஆவணங்களை அணுகவும்",
        description: "பாஸ்போர்ட்டுகள், உரிமங்கள் மற்றும் பலவற்றிற்கான அதிகாரப்பூர்வ அரசாங்கப் படிவங்களை உடனடியாகக் கண்டறிந்து பதிவிறக்கம் செய்யுங்கள்.",
        benefits: ["📥 உடனடிப் பதிவிறக்கங்கள்", "🕒 24/7 கிடைக்கக்கூடியது", "📁 பல வடிவங்கள்"]
      },
      information: {
        title: "உடனடித் தகவல்களைப் பெறுங்கள்",
        description: "பொதுச் சேவைகள் பற்றிய எந்தவொரு கேள்வியையும் கேட்டு, தெளிவான, படிப்படியான வழிகாட்டுதலைப் பெறுங்கள்.",
        benefits: ["⚡ நிகழ்நேர பதில்கள்", "📋 படிப்படியான வழிகாட்டிகள்", "🌐 பல மொழி ஆதரவு"]
      },
      appointments: {
        title: "சந்திப்புகளை திட்டமிடுங்கள்",
        description: "கிடைக்கக்கூடிய இடங்களைக் கண்டறிந்து, அரசாங்கத் துறைகளுடன் ஆன்லைனில் சந்திப்புகளை முன்பதிவு செய்யுங்கள்.",
        benefits: ["📅 ஆன்லைன் முன்பதிவு", "📱 SMS நினைவூட்டல்கள்", "🔄 எளிய மறுதிட்டமிடல்"]
      }
    },
    
    // About Section
    aboutTitle1: "இடைவெளியைக் குறைத்தல்",
    aboutTitle2: "குடிமக்கள் & அரசாங்கம்",
    aboutDescription: "ஒவ்வொரு இலங்கைக் குடிமகனுக்கும் அரசாங்கச் சேவைகளை அணுகக்கூடியதாகவும், வெளிப்படையாகவும், திறமையாகவும் மாற்றுதல். எங்கள் தளம் குடிமக்கள் அரசாங்கத் துறைகளுடன் தொடர்புகொள்ளும் விதத்தில் புரட்சி ஏற்படுத்துகிறது.",
    aboutFeatures: {
      simplified: {
        title: "எளிமைப்படுத்தப்பட்ட அணுகல்",
        description: "அனைத்து அரசாங்கச் சேவைகளுக்கும் ஒரு ஒருங்கிணைந்த தளம். இனி பல துறைகள் அல்லது இணையதளங்களுக்குச் செல்ல வேண்டாம். உங்களுக்குத் தேவையான அனைத்தும் ஒரே டாஷ்போர்டில் இருந்து அணுகக்கூடியது."
      },
      availability: {
        title: "24/7 கிடைக்கக்கூடியது",
        description: "எந்த நேரத்திலும், எங்கிருந்தும் அரசாங்கச் சேவைகளை அணுகுங்கள். எங்கள் டிஜிட்டல் தளம் ஒருபோதும் மூடுவதில்லை, அலுவலக நேரங்களுக்கு வெளியேயும் உங்கள் வசதிக்கேற்ப பணிகளை முடிக்க முடியும்."
      },
      transparent: {
        title: "வெளிப்படையான செயல்முறை",
        description: "நிகழ்நேரக் கண்காணிப்புடன் தெளிவான படிப்படியான வழிகாட்டுதல். உங்களுக்குத் தேவையான ஆவணங்கள் என்னென்ன, செயல்முறைகள் எவ்வளவு நேரம் எடுக்கும், மற்றும் ஒவ்வொரு படியிலும் உங்கள் விண்ணப்ப நிலையைக் கண்காணிக்கவும்."
      }
    },
    aboutButtons: {
      learnMore: "எங்களைப் பற்றி மேலும் அறிக",
      mission: "எங்கள் நோக்கம் & தொலைநோக்கு"
    },
    aboutStats: {
      citizens: "சேவை செய்யப்பட்ட குடிமக்கள்",
      forms: "அரசாங்கப் படிவங்கள்",
      departments: "துறைகள்",
      uptime: "இயக்க நேரம்",
      users: "பயனர்கள்",
      support: "ஆதரவு"
    },
    aboutTrust: {
      title: "அரசாங்கத்தின் நம்பிக்கை",
      description: "பொது நிர்வாக அமைச்சகத்தின் அதிகாரப்பூர்வ ஒப்புதல் மற்றும் இலங்கையில் குடிமக்கள் சேவைகளுக்கான முதன்மை டிஜிட்டல் நுழைவாயிலாக அங்கீகரிக்கப்பட்டது."
    },
    
    // Contact Section
    contactTitle1: "உதவி தேவையா?",
    contactTitle2: "நாங்கள் உங்களுக்காக இங்கே இருக்கிறோம்",
    contactDescription: "அரசாங்கச் சேவைகள் பற்றி கேள்விகள் உள்ளதா? எங்கள் ஆதரவு குழு உங்களுக்கு உதவத் தயாராக உள்ளது.",
    contactMethods: {
      phone: {
        title: "📞 எங்களை அழைக்கவும்",
        number: "+94 11 234 5678",
        hours: "திங்கள் - வெள்ளி, காலை 8 - மாலை 6"
      },
      email: {
        title: "📧 எங்களுக்கு மின்னஞ்சல் அனுப்பவும்",
        address: "support@govlink.lk",
        availability: "24/7 ஆதரவு"
      },
      location: {
        title: "📍 எங்களைப் பார்க்கவும்",
        address: "கொழும்பு, இலங்கை",
        description: "அரசாங்கச் சேவைகள் மையம்"
      }
    },
    faq: {
      title: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      questions: {
        forms: {
          question: "அரசாங்கப் படிவங்களை எவ்வாறு அணுகுவது?",
          answer: "உங்களுக்குத் தேவையான படிவத்தைத் தேடவும் அல்லது எங்கள் சேவைகள் பிரிவைப் பார்க்கவும். அனைத்துப் படிவங்களும் உடனடிப் பதிவிறக்கத்திற்குக் கிடைக்கின்றன."
        },
        official: {
          question: "GovLink அதிகாரப்பூர்வ தளமா?",
          answer: "ஆம், GovLink டிஜிட்டல் சேவை வழங்கலுக்காக இலங்கை அரசாங்கத்தால் அதிகாரப்பூர்வமாக ஒப்புதல் அளிக்கப்பட்டுள்ளது."
        },
        tracking: {
          question: "எனது விண்ணப்ப நிலையைக் கண்காணிக்க முடியுமா?",
          answer: "நிச்சயமாக! உங்கள் சமர்பிப்புகளின் முன்னேற்றத்தைக் கண்காணிக்க உங்கள் விண்ணப்பக் குறிப்பு எண்ணைப் பயன்படுத்துங்கள்."
        },
        support: {
          question: "எனக்குத் தொழில்நுட்ப ஆதரவு தேவைப்பட்டால் என்ன செய்வது?",
          answer: "எங்கள் தொழில்நுட்ப ஆதரவுக் குழு தொலைபேசி, மின்னஞ்சல் அல்லது நேரடி சாட் மூலம் 24/7 உங்களுக்கு உதவ கிடைக்கிறது."
        }
      }
    },
    
    // Footer
    footer: {
      description: "🇱🇰 ஒவ்வொரு இலங்கையருக்கும் அரசாங்கச் சேவைகளை எளிமைப்படுத்துதல். எங்கள் நவீன டிஜிட்டல் தளத்தின் மூலம் எளிதாகத் தகவல்களை அணுகவும், படிவங்களைப் பதிவிறக்கம் செய்யவும், மற்றும் நடைமுறைகளை முடிக்கவும்.",
      quickLinks: {
        services: "🛡️ சேவைகள்",
        about: "🏛️ எங்களைப் பற்றி",
        contact: "📞 தொடர்பு",
        help: "❓ உதவி மையம்"
      },
      legal: {
        privacy: "🔒 தனியுரிமைக் கொள்கை",
        terms: "📋 சேவை விதிமுறைகள்",
        cookies: "🍪 குக்கீ கொள்கை",
        accessibility: "♿ அணুகல்"
      },
      status: "அனைத்து அமைப்புகளும் செயல்பாட்டில் உள்ளன",
      copyright: "GovLink இலங்கை. பொதுச் சேவைகளை எளிமைப்படுத்துவதற்கான முயற்சி.",
      crafted: "அன்புடன் உருவாக்கப்பட்டது",
      forSriLanka: "🇱🇰 இலங்கை"
    }
  }
};

// Language options
const languageOptions = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' }
];

// --- ELEGANT SRI LANKAN BACKGROUND COMPONENT ---
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
        {/* Overlay gradients for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 dark:from-background/40 dark:via-transparent dark:to-background/60"></div>
      </div>
      
      {/* Enhanced lotus-inspired accent patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFC72C]/8 dark:bg-[#FFC72C]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#8D153A]/8 dark:bg-[#8D153A]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5722]/6 dark:bg-[#FF5722]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        {/* Additional subtle accents */}
        <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-[#FFA726]/6 dark:bg-[#FFA726]/3 rounded-full blur-2xl animate-pulse" style={{animationDuration: '14s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/6 left-1/5 w-56 h-56 bg-[#FF9800]/5 dark:bg-[#FF9800]/2 rounded-full blur-3xl animate-pulse" style={{animationDuration: '16s', animationDelay: '6s'}}></div>
      </div>
    </div>
  );
};

// --- BEAUTIFUL SRI LANKAN ICON COMPONENTS ---
// Beautiful Detailed Lotus Flower Icon
const LotusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 100 100">
    {/* Outer layer petals */}
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(36 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(72 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(108 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(144 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(180 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(216 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(252 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(288 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(324 50 50)"/>

    {/* Middle layer petals */}
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(18 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(54 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(90 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(126 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(162 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(198 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(234 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(270 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(306 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(342 50 50)"/>

    {/* Inner petals */}
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(45 50 50)"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(90 50 50)"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(135 50 50)"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(180 50 50)"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(225 50 50)"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(270 50 50)"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(315 50 50)"/>

    {/* Center */}
    <circle cx="50" cy="50" r="7" fill="#FFC72C"/>
    <circle cx="50" cy="50" r="3" fill="#FF8F00"/>
  </svg>
);

// --- OTHER ICON COMPONENTS ---
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);


// --- MOBILE-OPTIMIZED HERO SECTION ---
const Hero = ({ 
  language, 
  onLanguageChange 
}: { 
  language: Language; 
  onLanguageChange: (lang: Language) => void; 
}) => {
  const [searchText, setSearchText] = useState('');
  const t = translations[language];
  
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % t.searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [t.searchPlaceholders.length]);

  // Allow Shift+Enter to insert newline, Enter (without Shift) will submit the form
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Insert newline without submitting the form
      e.stopPropagation();
      // Let the default newline behavior happen
      return;
    }
    if (e.key === 'Enter') {
      // Prevent adding a newline so the form can submit cleanly
      e.preventDefault();
      // Find the closest form and submit it
      const form = (e.currentTarget as HTMLTextAreaElement).closest('form') as HTMLFormElement | null;
      if (form) form.requestSubmit();
    }
  };

  return (
    <section className="relative min-h-[60vh] sm:min-h-[75vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden pt-2 pb-4 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Compact Hero Content */}
          <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in-up">
            <div className="flex flex-col items-center mb-1 sm:mb-2 lg:mb-3">
              <div className="relative mb-1 sm:mb-1 lg:mb-2">
                <LotusIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
              </div>
            </div>
            <h1 className={`${language === 'en' ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl' : language === 'si' ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'} font-bold leading-tight mb-3 sm:mb-4 lg:mb-6`}>
              <span className="block text-foreground mb-1 sm:mb-2">{t.heroTitle1}</span>
              <span className="block text-gradient animate-title-wave">{t.heroTitle2}</span>
            </h1>
            <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 bg-gradient-to-r from-[#FFC72C] via-[#FF5722] to-[#8D153A] mx-auto rounded-full shadow-lg"></div>
          </div>
          
          {/* Compact Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-light px-4 sm:px-0" style={{animationDelay: '0.2s'}}>
            {t.heroSubtitle}<br className="hidden sm:block" />
            <span className="text-foreground/80 font-medium">{t.heroDescription}</span>
          </p>
          
          {/* Compact Search Interface */}
          <div className="max-w-3xl mx-auto animate-fade-in-up px-4 sm:px-0" style={{animationDelay: '0.4s'}}>
            <form action="/chat" method="GET" className="relative group mb-4 sm:mb-6">
              <div className="relative bg-card/90 dark:bg-card/95 backdrop-blur-md border-2 border-border/50 hover:border-[#FFC72C]/70 rounded-xl p-1.5 transition-all duration-500 hover:shadow-2xl shadow-lg modern-card">
                <textarea
                  name="q"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-foreground placeholder-muted-foreground p-3 sm:p-4 pr-14 sm:pr-16 rounded-lg resize-none focus:outline-none text-sm sm:text-base lg:text-lg leading-relaxed border-none font-medium"
                  placeholder={t.searchPlaceholders[currentPlaceholder]}
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.max(target.scrollHeight, 45)}px`;
                  }}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-gradient-to-r from-[#FFC72C] via-[#FF5722] to-[#8D153A] hover:from-[#FF5722] hover:via-[#8D153A] hover:to-[#FFC72C] rounded-lg transition-all duration-300 hover:scale-110 shadow-xl group hover:shadow-2xl"
                >
                  <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
              
              {/* Compact Suggestions */}
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                {t.searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSearchText(suggestion.split(' ').slice(1).join(' '))}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-card/80 hover:bg-accent/80 border border-border/50 hover:border-[#FFC72C]/60 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm modern-card"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </form>
            
            {/* Compact Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 lg:gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>{t.trustIndicators.trusted}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span>{t.trustIndicators.available}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                <span>{t.trustIndicators.endorsed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MOBILE-OPTIMIZED FEATURES SECTION ---
const Features = ({ language }: { language: Language }) => {
  const t = translations[language];
  
  const featuresList = [
    { 
      icon: <DocumentIcon />, 
      title: t.features.documents.title, 
      description: t.features.documents.description,
      color: "#FF5722",
      benefits: t.features.documents.benefits
    },
    { 
      icon: <InfoIcon />, 
      title: t.features.information.title, 
      description: t.features.information.description,
      color: "#008060",
      benefits: t.features.information.benefits
    },
    { 
      icon: <CalendarIcon />, 
      title: t.features.appointments.title, 
      description: t.features.appointments.description,
      color: "#FFC72C",
      benefits: t.features.appointments.benefits
    },
  ];
  
  return (
    <section id="services" className="py-4 sm:py-8 lg:py-12 -mt-4 sm:-mt-8 lg:mt-0 relative">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Compact Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-3 sm:mb-4 modern-card">
            <LotusIcon className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Our Services</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight">
            <span className="block text-foreground mb-1">{t.featuresTitle1}</span>
            <span className="block text-gradient">{t.featuresTitle2}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.featuresDescription}
          </p>
        </div>        
        
        {/* Enhanced Feature Cards with Fixed Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/50 hover:border-[#FFC72C]/70 hover:shadow-2xl transition-all duration-500 animate-fade-in-up modern-card hover-lift flex flex-col h-full"
              style={{animationDelay: `${index * 0.15}s`}}
            >
              {/* Card Content Container */}
              <div className="p-3 sm:p-6 lg:p-8 flex flex-col h-full min-h-[280px] sm:min-h-[400px] lg:min-h-[450px]">
                {/* Enhanced Icon Container */}
                <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl mb-2 sm:mb-4 lg:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                     style={{
                       background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                       border: `2px solid ${feature.color}30`
                     }}>
                  <div className="text-xl sm:text-2xl lg:text-3xl transition-transform duration-300 group-hover:scale-110" style={{color: feature.color}}>
                    {feature.icon}
                  </div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{background: `radial-gradient(circle, ${feature.color}15, transparent 70%)`}}>
                  </div>
                </div>

                {/* Content - Flexible height containers */}
                <div className="flex-1 flex flex-col">
                  {/* Title - Flexible height */}
                  <div className="mb-2 sm:mb-4">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold group-hover:text-[#FFC72C] transition-colors duration-300 leading-tight min-h-[2.5rem] sm:min-h-[3.5rem] flex items-start break-words hyphens-auto">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description - Flexible height */}
                  <div className="mb-3 sm:mb-6 flex-1">
                    <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm lg:text-base min-h-[3rem] sm:min-h-[5rem] break-words hyphens-auto">
                      {feature.description}
                    </p>
                  </div>

                  {/* Enhanced Benefits - Fixed at bottom */}
                  <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 mt-auto">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/benefit hover:translate-x-1 transition-transform duration-200">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722] flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span className="text-muted-foreground group-hover/benefit:text-foreground transition-colors duration-200 leading-relaxed break-words hyphens-auto flex-1">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- BALANCED ABOUT SECTION ---
const About = ({ language }: { language: Language }) => {
  const t = translations[language];
  
  return (
    <section id="about" className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Centered Section Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
            <LotusIcon className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium text-foreground">About GovLink</span>
          </div>
        </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Enhanced Left Content with Better Vertical Distribution */}
        <div className="animate-fade-in-up flex flex-col justify-between min-h-[600px] lg:min-h-[700px]">
          {/* Top Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 leading-tight">
              <span className="block text-foreground">{t.aboutTitle1}</span>
              <span className="block text-gradient">{t.aboutTitle2}</span>
            </h2>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-8 lg:mb-12 leading-relaxed">
              {t.aboutDescription}
            </p>
          </div>
          
          {/* Middle Section - Features */}
          <div className="space-y-6 lg:space-y-8 mb-8 lg:mb-12">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-base lg:text-lg block mb-2">{t.aboutFeatures.simplified.title}</span>
                <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                  {t.aboutFeatures.simplified.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-base lg:text-lg block mb-2">{t.aboutFeatures.availability.title}</span>
                <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                  {t.aboutFeatures.availability.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-base lg:text-lg block mb-2">{t.aboutFeatures.transparent.title}</span>
                <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                  {t.aboutFeatures.transparent.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Bottom Section - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-gradient-to-r from-[#FFC72C] via-[#FF5722] to-[#8D153A] hover:from-[#FF5722] hover:via-[#8D153A] hover:to-[#FFC72C] text-white px-6 py-3.5 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-105 shadow-lg">
              {t.aboutButtons.learnMore}
            </button>
            <button className="border-2 border-[#008060] text-[#008060] hover:bg-[#008060] hover:text-white px-6 py-3.5 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-105">
              {t.aboutButtons.mission}
            </button>
          </div>
        </div>
        
        {/* Enhanced Right Side with Better Proportions */}
        <div className="animate-fade-in-up flex flex-col min-h-[600px] lg:min-h-[700px]" style={{animationDelay: '0.2s'}}>
          {/* Hero Image - Increased height for balance */}
          <div className="mb-8 lg:mb-10 flex-1 flex items-center justify-center">
            <img 
              src="/4.png" 
              alt="GovLink Support Team" 
              className="w-full h-auto opacity-100 dark:opacity-60 max-w-md mx-auto lg:max-w-full block rounded-xl shadow-lg"
              style={{
                filter: 'saturate(1.1) brightness(1.05)',
                maxHeight: '400px',
                objectFit: 'contain'
              }}
            />
          </div>
          
          {/* Stats Grid with Better Spacing and Flexible Heights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="text-center p-3 sm:p-4 lg:p-5 bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/50 modern-card hover:shadow-lg transition-all duration-300 flex flex-col justify-center min-h-[100px] sm:min-h-[110px] lg:min-h-[130px]">
              <div className="text-lg sm:text-xl lg:text-xl font-bold text-gradient mb-2 flex-shrink-0">50K+</div>
              <div className="text-muted-foreground text-xs sm:text-xs lg:text-sm leading-tight break-words hyphens-auto px-1">{t.aboutStats.citizens}</div>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-5 bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/50 modern-card hover:shadow-lg transition-all duration-300 flex flex-col justify-center min-h-[100px] sm:min-h-[110px] lg:min-h-[130px]">
              <div className="text-lg sm:text-xl lg:text-xl font-bold text-gradient mb-2 flex-shrink-0">200+</div>
              <div className="text-muted-foreground text-xs sm:text-xs lg:text-sm leading-tight break-words hyphens-auto px-1">{t.aboutStats.forms}</div>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-5 bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/50 modern-card hover:shadow-lg transition-all duration-300 flex flex-col justify-center min-h-[100px] sm:min-h-[110px] lg:min-h-[130px]">
              <div className="text-lg sm:text-xl lg:text-xl font-bold text-gradient mb-2 flex-shrink-0">25</div>
              <div className="text-muted-foreground text-xs sm:text-xs lg:text-sm leading-tight break-words hyphens-auto px-1">{t.aboutStats.departments}</div>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-5 bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/50 modern-card hover:shadow-lg transition-all duration-300 flex flex-col justify-center min-h-[100px] sm:min-h-[110px] lg:min-h-[130px]">
              <div className="text-lg sm:text-xl lg:text-xl font-bold text-gradient mb-2 flex-shrink-0">99.8%</div>
              <div className="text-muted-foreground text-xs sm:text-xs lg:text-sm leading-tight break-words hyphens-auto px-1">{t.aboutStats.uptime}</div>
            </div>
          </div>
          
          {/* Additional Info Section for Balance */}
          <div className="mt-8 lg:mt-10 p-4 lg:p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl border border-border/30">
            <h4 className="font-semibold text-base lg:text-lg text-foreground mb-2">{t.aboutTrust.title}</h4>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              {t.aboutTrust.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

// --- CONTACT SECTION ---
const Contact = ({ language }: { language: Language }) => {
  const t = translations[language];
  
  return (
  <section id="contact" className="py-16 sm:py-20 relative">
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
            <LotusIcon className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Get in Touch</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block text-foreground mb-1">{t.contactTitle1}</span>
            <span className="block text-gradient">{t.contactTitle2}</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.contactDescription}
          </p>
        </div>
        
        {/* Enhanced Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
          {/* Phone */}
          <div className="group text-center p-6 sm:p-8 bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/50 hover:border-[#FFC72C]/70 hover:shadow-2xl transition-all duration-500 modern-card hover-lift">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#FFC72C] via-[#FF5722] to-[#8D153A] rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-[#FFC72C] transition-colors duration-300">{t.contactMethods.phone.title}</h3>
            <p className="text-muted-foreground mb-2 font-mono text-sm sm:text-base">{t.contactMethods.phone.number}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.contactMethods.phone.hours}</p>
          </div>
          
          {/* Email */}
          <div className="group text-center p-6 sm:p-8 bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/50 hover:border-[#008060]/70 hover:shadow-2xl transition-all duration-500 modern-card hover-lift">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#008060] via-[#FFC72C] to-[#FF5722] rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-[#008060] transition-colors duration-300">{t.contactMethods.email.title}</h3>
            <p className="text-muted-foreground mb-2 font-mono text-sm sm:text-base">{t.contactMethods.email.address}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.contactMethods.email.availability}</p>
          </div>
          
          {/* Location */}
          <div className="group text-center p-6 sm:p-8 bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-xl border border-border/50 hover:border-[#FF5722]/70 hover:shadow-2xl transition-all duration-500 modern-card hover-lift">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#FF5722] via-[#8D153A] to-[#FFC72C] rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-[#FF5722] transition-colors duration-300">{t.contactMethods.location.title}</h3>
            <p className="text-muted-foreground mb-2 text-sm sm:text-base">{t.contactMethods.location.address}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.contactMethods.location.description}</p>
          </div>
        </div>
        
        {/* Enhanced FAQ Section */}
        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border/50 modern-card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFC72C]/10 via-[#FF5722]/10 to-[#8D153A]/10 px-4 py-2 rounded-full border border-border/30 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5722]">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              <span className="text-xs sm:text-sm font-medium text-foreground">FAQ</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gradient">{t.faq.title}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="group p-4 sm:p-6 bg-background/50 dark:bg-background/30 rounded-xl border border-border/30 hover:border-[#FFC72C]/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">Q</span>
                </div>
                <h4 className="font-semibold text-sm sm:text-base group-hover:text-[#FFC72C] transition-colors duration-300">{t.faq.questions.forms.question}</h4>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.faq.questions.forms.answer}</p>
              </div>
            </div>
            
            <div className="group p-4 sm:p-6 bg-background/50 dark:bg-background/30 rounded-xl border border-border/30 hover:border-[#008060]/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">Q</span>
                </div>
                <h4 className="font-semibold text-sm sm:text-base group-hover:text-[#008060] transition-colors duration-300">{t.faq.questions.official.question}</h4>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.faq.questions.official.answer}</p>
              </div>
            </div>
            
            <div className="group p-4 sm:p-6 bg-background/50 dark:bg-background/30 rounded-xl border border-border/30 hover:border-[#FF5722]/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">Q</span>
                </div>
                <h4 className="font-semibold text-sm sm:text-base group-hover:text-[#FF5722] transition-colors duration-300">{t.faq.questions.tracking.question}</h4>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.faq.questions.tracking.answer}</p>
              </div>
            </div>
            
            <div className="group p-4 sm:p-6 bg-background/50 dark:bg-background/30 rounded-xl border border-border/30 hover:border-[#8D153A]/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">Q</span>
                </div>
                <h4 className="font-semibold text-sm sm:text-base group-hover:text-[#8D153A] transition-colors duration-300">{t.faq.questions.support.question}</h4>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.faq.questions.support.answer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

// --- ENHANCED PREMIUM FOOTER WITH ADAPTIVE BACKGROUND ---
const Footer = ({ language }: { language: Language }) => {
  const t = translations[language];
  
  return (
  <footer className="relative py-16 sm:py-20 mt-20">
    {/* Adaptive Background Layers */}
    <div className="absolute inset-0">
      {/* Base gradient - subtle and theme-aware */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 via-muted/10 to-transparent"></div>
      
      {/* Secondary gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent/10"></div>
      
      {/* Subtle accent dots - only visible on hover areas */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 dark:bg-primary/3 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl opacity-40"></div>
    </div>
    
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
        {/* Enhanced Brand Section */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <LotusIcon className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl animate-pulse opacity-50" style={{animationDuration: '4s'}}></div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gradient mb-1">GovLink</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Sri Lanka • ශ්‍රී ලංකා • இலங்கை</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Online & Serving</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-md text-sm sm:text-base">
            {t.footer.description}
          </p>
          
          {/* Enhanced Social Links */}
          <div className="flex gap-3 mb-6">
            <button className="group w-11 h-11 rounded-xl bg-card/80 dark:bg-card/60 border border-border/50 hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 flex items-center justify-center transition-all duration-300 hover:scale-110 modern-card" aria-label="Follow on Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground group-hover:text-[#1877F2] transition-colors duration-300">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.21 10.44 22v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.91h-2.33V22C18.34 21.21 22 17.08 22 12.06z"/>
              </svg>
            </button>
            <button className="group w-11 h-11 rounded-xl bg-card/80 dark:bg-card/60 border border-border/50 hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 flex items-center justify-center transition-all duration-300 hover:scale-110 modern-card" aria-label="Follow on X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground group-hover:text-[#1DA1F2] transition-colors duration-300">
                <path d="M18.244 2H21l-6.5 7.43L22 22h-6.828l-4.78-6.24L4.8 22H2l7.02-8.02L2 2h6.914l4.33 5.77L18.244 2Zm-1.196 18h1.884L7.07 4H5.092l11.956 16Z"/>
              </svg>
            </button>
            <button className="group w-11 h-11 rounded-xl bg-card/80 dark:bg-card/60 border border-border/50 hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 flex items-center justify-center transition-all duration-300 hover:scale-110 modern-card" aria-label="Connect on LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground group-hover:text-[#0A66C2] transition-colors duration-300">
                <path d="M20.447 20.452H17.2v-5.569c0-1.328-.027-3.036-1.85-3.036-1.853 0-2.136 1.445-2.136 2.94v5.665H9.07V9h3.116v1.561h.045c.435-.824 1.498-1.692 3.083-1.692 3.298 0 3.906 2.171 3.906 4.995v6.588zM5.337 7.433a1.81 1.81 0 1 1 0-3.62 1.81 1.81 0 0 1 0 3.62zM6.96 20.452H3.71V9h3.25v11.452z"/>
              </svg>
            </button>
          </div>
          
          {/* Quick Stats with Flexible Heights */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-2 sm:p-3 bg-card/60 dark:bg-card/40 rounded-lg border border-border/30 backdrop-blur-sm min-h-[60px] sm:min-h-[70px] flex flex-col justify-center">
              <div className="text-sm sm:text-base font-bold text-gradient mb-1 flex-shrink-0">50K+</div>
              <div className="text-xs text-muted-foreground leading-tight break-words hyphens-auto">{t.aboutStats.users}</div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-card/60 dark:bg-card/40 rounded-lg border border-border/30 backdrop-blur-sm min-h-[60px] sm:min-h-[70px] flex flex-col justify-center">
              <div className="text-sm sm:text-base font-bold text-gradient mb-1 flex-shrink-0">99.8%</div>
              <div className="text-xs text-muted-foreground leading-tight break-words hyphens-auto">{t.aboutStats.uptime}</div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-card/60 dark:bg-card/40 rounded-lg border border-border/30 backdrop-blur-sm min-h-[60px] sm:min-h-[70px] flex flex-col justify-center">
              <div className="text-sm sm:text-base font-bold text-gradient mb-1 flex-shrink-0">24/7</div>
              <div className="text-xs text-muted-foreground leading-tight break-words hyphens-auto">{t.aboutStats.support}</div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-primary to-accent rounded-full"></div>
            Quick Links
          </h4>
          <div className="space-y-2">
            <a href="#services" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 text-sm py-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span>{t.footer.quickLinks.services}</span>
            </a>
            <a href="#about" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 text-sm py-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span>{t.footer.quickLinks.about}</span>
            </a>
            <a href="#contact" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 text-sm py-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span>{t.footer.quickLinks.contact}</span>
            </a>
            <a href="#" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 text-sm py-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span>{t.footer.quickLinks.help}</span>
            </a>
          </div>
        </div>

        {/* Enhanced Legal Links */}
        <div>
          <h4 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-accent to-secondary rounded-full"></div>
            Legal & Policy
          </h4>
          <div className="space-y-2">
            <a href="#" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 text-sm py-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span>{t.footer.legal.privacy}</span>
            </a>
            <a href="#" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 text-sm py-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span>{t.footer.legal.terms}</span>
            </a>
            <a href="#" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 text-sm py-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span>{t.footer.legal.cookies}</span>
            </a>
            <a href="#" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 text-sm py-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span>{t.footer.legal.accessibility}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Footer Bottom */}
      <div className="pt-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} {t.footer.copyright}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {t.footer.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-muted-foreground">{t.footer.crafted}</span>
            <span className="text-red-500 animate-pulse text-base">♥</span>
            <span className="text-muted-foreground">for</span>
            <span className="font-semibold text-gradient">{t.footer.forSriLanka}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const [language, setLanguage] = useState<Language>('en');

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="bg-background text-foreground min-h-screen relative theme-transition-slow">
      {/* Sri Lankan Background */}
      <SriLankanBackground />
      
      {/* Content */}
      <div className="relative z-10 theme-transition-fast">
        <Header language={language} onLanguageChange={handleLanguageChange} />
        <main className="theme-transition-fast">
          <Hero language={language} onLanguageChange={handleLanguageChange} />
          <Features language={language} />
          <About language={language} />
          <Contact language={language} />
        </main>
        <Footer language={language} />
      </div>
    </div>
  );
}