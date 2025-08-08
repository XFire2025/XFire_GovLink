'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: Implement your registration logic (API call to create user)
    console.log('Registering user:', { name, email, password });
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
          <h1 className="text-4xl font-bold mb-2">Create an Account</h1>
          <p className="text-gray-400">Join GovLink to access public services instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all" placeholder="Enter your full name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all" placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all" placeholder="••••••••" />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full py-3 mt-2 font-semibold text-black bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all transform hover:scale-105">
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/User/Auth/Login" className="font-medium text-yellow-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;