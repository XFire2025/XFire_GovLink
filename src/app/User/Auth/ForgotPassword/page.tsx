'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement your password reset logic (API call to send email)
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] p-4 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 self-start">
          <Link href="/User/Auth/Login" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-gray-400">
            {submitted 
              ? "Check your inbox for the next steps." 
              : "No problem. We'll send a password reset link to your email."}
          </p>
        </div>

        {submitted ? (
          <div className="text-center bg-[#1e1e1e] border border-green-500/30 rounded-lg p-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-xl font-semibold">Request Sent</h3>
            <p className="mt-2 text-gray-400">
              If an account with the email <span className="font-bold text-yellow-500">{email}</span> exists, you will receive a reset link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 font-semibold text-black bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;