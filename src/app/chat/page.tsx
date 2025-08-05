"use client";
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle'; // Import ThemeToggle

// --- COLOR PALETTE (For brand accents, these can stay hardcoded) ---
// Maroon: #8D153A
// Gold:   #FFC72C

// --- SVG ICON COMPONENTS ---
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GovLinkBotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-[#FFC72C]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-4.3-7.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm8.6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
);


// --- UI COMPONENTS (Now Theme-Aware) ---

const Header = () => (
    <header className="sticky top-0 bg-background/80 backdrop-blur-lg z-50 border-b border-border">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#FFC72C]">
          GovLink
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-transparent border border-[#FFC72C] text-[#FFC72C] px-4 py-2 rounded-md hover:bg-[#FFC72C] hover:text-black transition-colors font-semibold">
            New Chat
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
);

const UserMessage = ({ text }: { text: string }) => (
    <div className="flex justify-end my-2">
        <div className="bg-[#8D153A] text-white p-4 rounded-lg rounded-br-none max-w-xl shadow-md">
            <p>{text}</p>
        </div>
    </div>
);

const BotMessage = ({ text }: { text: string }) => (
    <div className="flex justify-start my-2 gap-3">
        <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-full flex items-center justify-center">
            <GovLinkBotIcon className="h-7 w-7"/>
        </div>
        <div className="bg-muted text-muted-foreground p-4 rounded-lg rounded-bl-none max-w-xl shadow-md">
            <p>{text}</p>
        </div>
    </div>
);

const ChatInput = () => (
    <div className="bg-background p-4 border-t border-border">
        <div className="container mx-auto">
            <div className="relative">
                <textarea
                    className="w-full bg-input text-foreground placeholder-muted-foreground p-4 pr-16 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC72C] transition-all duration-300 shadow-lg"
                    placeholder="Ask a follow-up question..."
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[#FFC72C] hover:bg-yellow-400 rounded-lg transition-colors duration-200">
                    <ArrowRightIcon className="h-6 w-6 text-[#8D153A]" />
                </button>
            </div>
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---
export default function GovLinkChatPage() {
  return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header />

        {/* Chat history area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <Suspense fallback={<div className="text-muted-foreground">Loading chat…</div>}>
              <ChatContent />
            </Suspense>
          </div>
        </main>

        {/* Fixed input area at the bottom */}
        <ChatInput />
      </div>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? undefined;
  const userQuery = q || "You haven't asked a question yet.";

  // A hardcoded bot response for demonstration purposes
  const botResponse = `Of course! To renew your Sri Lankan passport, you will need to submit the 'K' form, along with your current passport, National Identity Card, and two recent passport-sized photos. You can download the form from the Department of Immigration and Emigration website or collect one from our head office. Would you like a direct link to the form?`;

  return (
    <>
      <UserMessage text={userQuery} />
      <BotMessage text={botResponse} />
    </>
  );
}