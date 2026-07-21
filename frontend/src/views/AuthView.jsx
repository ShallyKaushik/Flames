import React, { useState } from 'react';
import HeroSection from '../components/auth/HeroSection';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { OtpVerification } from '../components/auth/OtpVerification';
import { loginApi, signupApi, verifyOtpApi, resendOtpApi } from '../services/authApi';
import backdropPng from '../avatars/backdrop.png';

export function AuthView({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Data persistence across tab switches
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    fullName: '',
    username: '',
    collegeEmail: '',
    personalEmail: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Login Submit Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) return;

    setIsLoading(true);
    setError('');

    try {
      // TODO: connect to backend - POST /api/v1/auth/login { identifier, password }
      const res = await loginApi(loginData.identifier, loginData.password);
      if (res.success) {
        onLoginSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Submit Handler -> Triggers OTP step
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: connect to backend - POST /api/v1/auth/signup { fullName, username, collegeEmail, personalEmail, phoneNumber, password }
      const res = await signupApi(signupData);
      if (res.success) {
        setIsVerifyingOtp(true);
      }
    } catch (err) {
      setError(err.message || 'Sign Up failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Verification Submit Handler
  const handleVerifyOtp = async (otpCode) => {
    setIsLoading(true);
    setError('');

    try {
      // TODO: connect to backend - POST /api/v1/auth/verify-otp { collegeEmail, otp }
      const res = await verifyOtpApi(signupData.collegeEmail, otpCode);
      if (res.success) {
        onLoginSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    try {
      // TODO: connect to backend - POST /api/v1/auth/resend-otp { collegeEmail }
      await resendOtpApi(signupData.collegeEmail);
    } catch (err) {
      setError('Failed to resend OTP.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans text-stone-100 overflow-hidden bg-[#1c120c]">
      {/* Full Screen Uploaded Backdrop Image */}
      <img
        src={backdropPng}
        alt="Flames Campus Backdrop"
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90"
      />

      {/* Dark Gradient & Blur Overlay (65% opacity) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/85 backdrop-brightness-75 z-0" />

      {/* Content Layout: Responsive Left Hero Text + Right Floating Glass Card */}
      <div className="relative z-10 w-full max-w-6xl mx-auto min-h-screen flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 lg:p-12 gap-8">
        {/* Left Hero Content */}
        <HeroSection />

        {/* Right Floating Glassmorphism Auth Card */}
        <div className="w-full max-w-md backdrop-blur-md bg-[#2b1d16]/90 border border-[#3d2a20] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 shrink-0 my-auto">
          {/* Header Brand for Mobile */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-2">
            <img src="/assets/logo.png" alt="Flames Logo" className="w-8 h-8 object-contain" />
            <span className="font-heading font-extrabold text-xl tracking-tight text-white font-serif italic">
              Flames
            </span>
          </div>

          {/* Render OTP Verification Screen IF verifying OTP */}
          {isVerifyingOtp ? (
            <OtpVerification
              collegeEmail={signupData.collegeEmail}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onChangeEmail={() => setIsVerifyingOtp(false)}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <>
              {/* Tab Selector Switch: Login vs Sign Up */}
              <div className="bg-[#1c120c]/80 p-1 rounded-2xl border border-[#3d2a20] flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-[#f47b31] text-white shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-[#f47b31] text-white shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Views */}
              {activeTab === 'login' ? (
                <LoginForm
                  formData={loginData}
                  onChange={handleLoginChange}
                  onSubmit={handleLoginSubmit}
                  isLoading={isLoading}
                  error={error}
                />
              ) : (
                <SignupForm
                  formData={signupData}
                  onChange={handleSignupChange}
                  onSubmit={handleSignupSubmit}
                  isLoading={isLoading}
                  error={error}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
