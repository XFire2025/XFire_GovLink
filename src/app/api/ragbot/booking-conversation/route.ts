// src/app/api/ragbot/booking-conversation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Booking conversation state schema
const BookingConversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  userId: { type: String, default: null },
  currentStep: { type: String, default: 'start' },
  collectedData: {
    department: { type: String, default: '' },
    service: { type: String, default: '' },
    agentType: { type: String, default: '' },
    preferredDate: { type: String, default: '' },
    preferredTime: { type: String, default: '' },
    additionalNotes: { type: String, default: '' }
  },
  conversationHistory: [{ 
    message: String, 
    response: String, 
    timestamp: { type: Date, default: Date.now } 
  }],
  createdAt: { type: Date, default: Date.now }
});

// Add TTL index to auto-delete after 24 hours
BookingConversationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const BookingConversation = mongoose.models.BookingConversation || 
  mongoose.model('BookingConversation', BookingConversationSchema);

interface BookingStep {
  step: string;
  question: string;
  nextStep: string;
  dataField: keyof BookingConversationState['collectedData'];
}

interface BookingConversationState {
  sessionId: string;
  userId: string | null;
  currentStep: string;
  collectedData: {
    department: string;
    service: string;
    agentType: string;
    preferredDate: string;
    preferredTime: string;
    additionalNotes: string;
  };
  conversationHistory: Array<{
    message: string;
    response: string;
    timestamp: Date;
  }>;
}

const bookingSteps: Record<string, BookingStep> = {
  start: {
    step: 'start',
    question: "I'd be happy to help you book an appointment! First, which government department do you need assistance with? (e.g., Immigration, Business Registration, Health Services, Education, etc.)",
    nextStep: 'department',
    dataField: 'department'
  },
  department: {
    step: 'department',
    question: "Great! Now, what specific service do you need from this department? (e.g., passport renewal, license application, certificate request, etc.)",
    nextStep: 'service',
    dataField: 'service'
  },
  service: {
    step: 'service',
    question: "Perfect! What type of government official would you like to meet with? (e.g., Senior Officer, Customer Service Agent, Technical Specialist, etc.)",
    nextStep: 'agentType',
    dataField: 'agentType'
  },
  agentType: {
    step: 'agentType',
    question: "Excellent! What's your preferred date for the appointment? (Please provide in YYYY-MM-DD format or describe like 'next Monday', 'this Friday', etc.)",
    nextStep: 'preferredDate',
    dataField: 'preferredDate'
  },
  preferredDate: {
    step: 'preferredDate',
    question: "Got it! What time would work best for you? (e.g., 9:00 AM, 2:00 PM, morning, afternoon, etc.)",
    nextStep: 'preferredTime',
    dataField: 'preferredTime'
  },
  preferredTime: {
    step: 'preferredTime',
    question: "Almost done! Is there anything specific you'd like to mention or any additional requirements for your appointment? (Optional - you can say 'none' or provide any special notes)",
    nextStep: 'additionalNotes',
    dataField: 'additionalNotes'
  },
  additionalNotes: {
    step: 'additionalNotes',
    question: "Perfect! I've collected all your information. You can now proceed to complete your booking by clicking the 'Open Booking Form' button that will appear below. Your information has been saved and will be automatically filled in the form.",
    nextStep: 'complete',
    dataField: 'additionalNotes'
  }
};

const translations = {
  en: {
    steps: bookingSteps,
    complete: "Perfect! I've collected all your booking information:\n\n📋 **Booking Summary:**\n• Department: {department}\n• Service: {service}\n• Agent Type: {agentType}\n• Preferred Date: {preferredDate}\n• Preferred Time: {preferredTime}\n• Additional Notes: {additionalNotes}\n\n✅ You can now click the **'Open Booking Form'** button below to complete your appointment booking. All your information will be automatically filled in!",
    authRequired: "To save your booking information and proceed, you'll need to log in to your account. Please click the 'Login to Continue' button below.",
    error: "I encountered an error processing your booking request. Please try again."
  },
  si: {
    steps: {
      start: {
        step: 'start',
        question: "ඔබගේ හමුවීම වෙන්කරවීමට මම සතුටුයි! මුලින්ම, ඔබට කුමන රජයේ දෙපාර්තමේන්තුවේ සහාය අවශ්‍යද? (උදා: ගිණුම්කරණ, ව්‍යාපාර ලියාපදිංචිය, සෞඛ්‍ය සේවා, අධ්‍යාපනය)",
        nextStep: 'department',
        dataField: 'department'
      },
      department: {
        step: 'department',
        question: "ගොඩක් හොඳයි! දැන්, ඔබට මෙම දෙපාර්තමේන්තුවෙන් කුමන නිශ්චිත සේවාව අවශ්‍යද? (උදා: විදේශ ගමන් බලපත්‍ර අලුත් කිරීම, බලපත්‍ර අයදුම්, සහතික ඉල්ලීම)",
        nextStep: 'service',
        dataField: 'service'
      },
      service: {
        step: 'service',
        question: "පරිපූර්ණයි! ඔබට කුමන වර්ගයේ රජයේ නිලධාරියෙකු හමුවීමට අවශ්‍යද? (උදා: ජ්‍යෙෂ්ඨ නිලධාරී, පාරිභෝගික සේවා නියෝජිතයා, තාක්ෂණික විශේෂඥයා)",
        nextStep: 'agentType',
        dataField: 'agentType'
      }
    },
    complete: "පරිපූර්ණයි! මම ඔබගේ සියලුම වෙන්කරවීම් තොරතුරු එකතු කර ගත්තෙමි:\n\n📋 **වෙන්කරවීම් සාරාංශය:**\n• දෙපාර්තමේන්තුව: {department}\n• සේවාව: {service}\n• නියෝජිත වර්ගය: {agentType}\n• කැමති දිනය: {preferredDate}\n• කැමති වේලාව: {preferredTime}\n• අමතර සටහන්: {additionalNotes}\n\n✅ ඔබගේ හමුවීම් වෙන්කරවීම සම්පූර්ණ කිරීමට දැන් **'වෙන්කරවීම් ෆෝරමය විවෘත කරන්න'** බොත්තම ක්ලික් කරන්න. ඔබගේ සියලුම තොරතුරු ස්වයංක්‍රීයව පුරවනු ඇත!",
    authRequired: "ඔබගේ වෙන්කරවීම් තොරතුරු සුරැකීමට සහ ඉදිරියට යාමට, ඔබගේ ගිණුමට ලොග් වීම අවශ්‍ය වේ.",
    error: "ඔබගේ වෙන්කරවීම් ඉල්ලීම සැකසීමේදී දෝෂයක් ඇති විය."
  },
  ta: {
    steps: {
      start: {
        step: 'start',
        question: "உங்கள் சந்திப்பை முன்பதிவு செய்ய நான் மகிழ்ச்சியடைகிறேன்! முதலில், எந்த அரசாங்க துறையின் உதவி உங்களுக்கு தேவை? (எ.கா: குடியேற்றம், வணிக பதிவு, சுகாதார சேவைகள், கல்வி)",
        nextStep: 'department',
        dataField: 'department'
      },
      department: {
        step: 'department',
        question: "அருமை! இப்போது, இந்த துறையிலிருந்து எந்த குறிப்பிட்ட சேவை உங்களுக்கு தேவை? (எ.கா: கடவுச்சீட்டு புதுப்பித்தல், உரிமம் விண்ணப்பம், சான்றிதழ் கோரிக்கை)",
        nextStep: 'service',
        dataField: 'service'
      },
      service: {
        step: 'service',
        question: "சரியானது! எந்த வகையான அரசாங்க அதிகாரியை சந்திக்க விரும்புகிறீர்கள்? (எ.கா: மூத்த அதிகாரி, வாடிக்கையாளர் சேவை பிரதிநிதி, தொழில்நுட்ப நிபுணர்)",
        nextStep: 'agentType',
        dataField: 'agentType'
      }
    },
    complete: "சரியானது! உங்கள் அனைத்து முன்பதிவு தகவலையும் நான் சேகரித்துவிட்டேன்:\n\n📋 **முன்பதிவு சுருக்கம்:**\n• துறை: {department}\n• சேவை: {service}\n• முகவர் வகை: {agentType}\n• விருப்பமான தேதி: {preferredDate}\n• விருப்பமான நேரம்: {preferredTime}\n• கூடுதல் குறிப்புகள்: {additionalNotes}\n\n✅ உங்கள் சந்திப்பு முன்பதிவை முடிக்க கீழே உள்ள **'முன்பதிவு படிவத்தை திற'** பொத்தானை கிளிக் செய்யலாம். உங்கள் அனைத்து தகவல்களும் தானாகவே நிரப்பப்படும்!",
    authRequired: "உங்கள் முன்பதிவு தகவலை சேமிக்க மற்றும் தொடர, உங்கள் கணக்கில் உள்நுழைய வேண்டும்.",
    error: "உங்கள் முன்பதிவு கோரிக்கையை செயலாக்குவதில் பிழை ஏற்பட்டது."
  }
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { message, sessionId, language = 'en' } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Get or create conversation state
    let conversation = await BookingConversation.findOne({ sessionId });
    
    if (!conversation) {
      conversation = new BookingConversation({
        sessionId,
        currentStep: 'start',
        collectedData: {
          department: '',
          service: '',
          agentType: '',
          preferredDate: '',
          preferredTime: '',
          additionalNotes: ''
        },
        conversationHistory: []
      });
    }

    const t = translations[language as keyof typeof translations] || translations.en;
    let response = '';

    // If this is the first message and it's a booking intent, start the flow
    if (conversation.currentStep === 'start') {
      response = t.steps.start.question;
      conversation.currentStep = 'department';
    } else {
      // Process the user's response based on current step
      const currentStepData = t.steps[conversation.currentStep as keyof typeof t.steps];
      
      if (currentStepData && conversation.currentStep !== 'complete') {
        // Save the user's response to the appropriate field
        const dataField = currentStepData.dataField;
        if (dataField && conversation.collectedData) {
          conversation.collectedData[dataField] = message.trim();
        }

        // Move to next step
        if (currentStepData.nextStep === 'complete') {
          // All data collected, show summary
          const summary = t.complete
            .replace('{department}', conversation.collectedData.department || 'Not specified')
            .replace('{service}', conversation.collectedData.service || 'Not specified')
            .replace('{agentType}', conversation.collectedData.agentType || 'Not specified')
            .replace('{preferredDate}', conversation.collectedData.preferredDate || 'Not specified')
            .replace('{preferredTime}', conversation.collectedData.preferredTime || 'Not specified')
            .replace('{additionalNotes}', conversation.collectedData.additionalNotes || 'None');
          
          response = summary;
          conversation.currentStep = 'complete';
        } else {
          // Ask next question
          const nextStep = t.steps[currentStepData.nextStep as keyof typeof t.steps];
          if (nextStep) {
            response = nextStep.question;
            conversation.currentStep = currentStepData.nextStep;
          }
        }
      } else if (conversation.currentStep === 'complete') {
        response = "Your booking information is ready! Please use the 'Open Booking Form' button to complete your appointment.";
      }
    }

    // Add to conversation history
    conversation.conversationHistory.push({
      message,
      response,
      timestamp: new Date()
    });

    // Save conversation state
    await conversation.save();

    // Also save to the booking data collection for form pre-fill
    if (conversation.currentStep === 'complete') {
      try {
        await fetch(`${request.nextUrl.origin}/api/user/booking-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            bookingData: conversation.collectedData
          })
        });
      } catch (error) {
        console.error('Error saving booking data:', error);
      }
    }

    return NextResponse.json({ 
      response,
      currentStep: conversation.currentStep,
      collectedData: conversation.collectedData,
      isComplete: conversation.currentStep === 'complete'
    });

  } catch (error) {
    console.error('Error in booking conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
