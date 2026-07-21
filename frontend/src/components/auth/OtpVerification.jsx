import React, { useState, useEffect, useRef } from 'react';
import { Mail, Check, RotateCcw, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { FoxMascot } from '../FoxMascot';

export function OtpVerification({ collegeEmail, onVerify, onResend, onChangeEmail, isLoading, error }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus first input box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      // User pasted full OTP
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, idx) => {
        newOtp[idx] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const pasted = pastedData.split('');
      const newOtp = ['', '', '', '', '', ''];
      pasted.forEach((char, idx) => {
        newOtp[idx] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResendClick = () => {
    if (canResend) {
      setTimer(30);
      setCanResend(false);
      onResend();
    }
  };

  const fullOtpCode = otp.join('');

  return (
    <div className="space-y-5 animate-fade-in font-sans">
      {/* Top Change Email Navigation */}
      <button
        onClick={onChangeEmail}
        className="text-xs font-bold text-stone-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#f47b31]" /> Change Email
      </button>

      {/* Header Info */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 bg-[#f47b31]/20 rounded-full flex items-center justify-center mx-auto mb-2 text-[#f47b31]">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-extrabold text-white">Verify your College Email</h2>
        <p className="text-xs text-stone-400">
          We sent a 6-digit verification code to <span className="font-extrabold text-[#f47b31]">{collegeEmail || 'your email'}</span>
        </p>
        <p className="text-[10px] text-stone-500">(Enter <span className="text-stone-300 font-mono font-bold">123456</span> for demo testing)</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-2xl flex items-center gap-2 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* 6-Digit OTP Boxes */}
        <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-12 bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl text-center text-lg font-extrabold text-white transition outline-hidden"
            />
          ))}
        </div>

        {/* Resend OTP & Countdown */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-stone-400 font-medium">
            Didn't receive code?
          </span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResendClick}
              className="text-[#f47b31] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Resend OTP
            </button>
          ) : (
            <span className="text-stone-400 font-mono font-bold">
              Resend in <span className="text-[#f47b31]">{timer}s</span>
            </span>
          )}
        </div>

        {/* Verify OTP Button */}
        <button
          type="submit"
          disabled={isLoading || fullOtpCode.length < 6}
          className="w-full py-3 px-4 bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Verifying Code...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Verify OTP & Log In
            </>
          )}
        </button>
      </form>
    </div>
  );
}
