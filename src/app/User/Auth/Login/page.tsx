'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement your authentication logic (e.g., API call, NextAuth)
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] p-4 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 self-start">
          <Link href="/" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-gray-400">Sign in to your GovLink account.</p>
        </div>

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
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Link href="/User/Auth/ForgotPassword" className="text-sm text-yellow-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-black bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Do not have an account?{' '}
          <Link href="/User/Auth/Register" className="font-medium text-yellow-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;