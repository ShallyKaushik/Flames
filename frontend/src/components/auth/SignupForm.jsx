import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function SignupForm({ formData, onChange, onSubmit, isLoading, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Client-side validations
  const adminEmails = [
    "shallykaushik00@gmail.com",
    "devansh.tripathi2004@gmail.com"
  ];

  const isCollegeEmailValid =
    !formData.collegeEmail ||
    formData.collegeEmail.endsWith('.edu') ||
    formData.collegeEmail.endsWith('.ac.in') ||
    formData.collegeEmail.includes('.edu.') ||
    formData.collegeEmail.includes('.ac.in.') ||
    adminEmails.includes(formData.collegeEmail.toLowerCase());

  const isPhoneValid =
    !formData.phoneNumber || /^[0-9+\-\s]{10,}$/.test(formData.phoneNumber);

  const isPasswordMatch =
    !formData.confirmPassword || formData.password === formData.confirmPassword;

  const isPasswordValid = !formData.password || formData.password.length >= 6;

  return (
    <form onSubmit={onSubmit} className="space-y-3.5 animate-fade-in font-sans">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-2xl flex items-center gap-2 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Full Name & Username Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            Full Name *
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={onChange}
              placeholder="John Doe"
              required
              className="w-full bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            Username *
          </label>
          <div className="relative flex items-center">
            <span className="text-stone-400 font-bold absolute left-3.5 pointer-events-none text-xs">@</span>
            <input
              type="text"
              name="username"
              value={formData.username || ''}
              onChange={onChange}
              placeholder="alexrivers"
              required
              className="w-full bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* College Email & Personal Email Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            College Email * (.edu / .ac.in)
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              name="collegeEmail"
              value={formData.collegeEmail || ''}
              onChange={onChange}
              placeholder="alex@campus.edu"
              required
              className={`w-full bg-[#1c120c] border rounded-2xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden ${
                !isCollegeEmailValid ? 'border-red-500' : 'border-[#3d2a20] focus:border-[#f47b31]'
              }`}
            />
          </div>
          {!isCollegeEmailValid && (
            <p className="text-[10px] text-red-400 font-semibold pl-1">
              Must end with .edu or .ac.in
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Personal Email (Optional)
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              name="personalEmail"
              value={formData.personalEmail || ''}
              onChange={onChange}
              placeholder="alex.personal@gmail.com"
              className="w-full bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
          Phone Number *
        </label>
        <div className="relative flex items-center">
          <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={onChange}
            placeholder="+1 555 123 4567"
            required
            className={`w-full bg-[#1c120c] border rounded-2xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden ${
              !isPhoneValid ? 'border-red-500' : 'border-[#3d2a20] focus:border-[#f47b31]'
            }`}
          />
        </div>
        {!isPhoneValid && (
          <p className="text-[10px] text-red-400 font-semibold pl-1">
            Please enter a valid phone number (at least 10 digits)
          </p>
        )}
      </div>

      {/* Password & Confirm Password Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            Password *
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password || ''}
              onChange={onChange}
              placeholder="Min 6 characters"
              required
              className={`w-full bg-[#1c120c] border rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden ${
                !isPasswordValid ? 'border-red-500' : 'border-[#3d2a20] focus:border-[#f47b31]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-stone-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            Confirm Password *
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={onChange}
              placeholder="Re-enter password"
              required
              className={`w-full bg-[#1c120c] border rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden ${
                !isPasswordMatch ? 'border-red-500' : 'border-[#3d2a20] focus:border-[#f47b31]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 p-1 text-stone-400 hover:text-white transition"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {!isPasswordMatch && (
            <p className="text-[10px] text-red-400 font-semibold pl-1">Passwords do not match</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          isLoading ||
          !formData.fullName ||
          !formData.username ||
          !formData.collegeEmail ||
          !formData.phoneNumber ||
          !formData.password ||
          !isPasswordMatch ||
          !isCollegeEmailValid
        }
        className="w-full py-3 px-4 bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Sending Verification Code...
          </>
        ) : (
          <>
            Create Account <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
