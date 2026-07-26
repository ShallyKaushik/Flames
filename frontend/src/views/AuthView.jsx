import React, { useState } from 'react';
import HeroSection from '../components/auth/HeroSection';
import { googleLoginApi } from '../services/authApi';
import backdropPng from '../avatars/backdrop.png';
import { GoogleLogin } from '@react-oauth/google';

export function AuthView({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await googleLoginApi(credentialResponse.credential);
      if (res.success) {
        onLoginSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Google Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Login failed. Please try again.');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans text-stone-100 overflow-hidden bg-[#1c120c]">
      <img
        src={backdropPng}
        alt="Flames Campus Backdrop"
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/85 backdrop-brightness-75 z-0" />

      <div className="relative z-10 w-full max-w-6xl mx-auto min-h-screen flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 lg:p-12 gap-8">
        <HeroSection />

        <div className="w-full max-w-md backdrop-blur-md bg-[#2b1d16]/90 border border-[#3d2a20] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 shrink-0 my-auto text-center flex flex-col items-center">
          <div className="flex md:hidden items-center justify-center gap-2 mb-2">
            <img src="/assets/logo.png" alt="Flames Logo" className="w-8 h-8 object-contain" />
            <span className="font-heading font-extrabold text-xl tracking-tight text-white font-serif italic">
              Flames
            </span>
          </div>

          <div className="space-y-2 mb-6 text-center w-full">
            <h2 className="text-2xl font-extrabold text-white">Welcome</h2>
            <p className="text-stone-400 text-sm">Sign in to continue to Flames</p>
          </div>

          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="w-full text-stone-400 text-sm p-3 text-center">
              Signing in...
            </div>
          )}

          <div className="w-full flex justify-center py-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="continue_with"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
