import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { FoxMascot } from '../FoxMascot';

export function LoginForm({ formData, onChange, onSubmit, isLoading, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-fade-in font-sans">
      {/* Error Alert with Mascot 10 */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-2xl flex items-center gap-3 text-red-300 text-xs">
          <FoxMascot variant="10" className="w-8 h-8 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* College Email or Username */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
          College Email or Username *
        </label>
        <div className="relative flex items-center">
          <User className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            name="identifier"
            value={formData.identifier || ''}
            onChange={onChange}
            placeholder="alex.rivers@jiit.ac.in or alexrivers"
            required
            className="w-full bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            Password *
          </label>
          <button
            type="button"
            onClick={() => alert('Password reset link sent to your college email!')}
            className="text-[11px] font-bold text-[#f47b31] hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <div className="relative flex items-center">
          <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password || ''}
            onChange={onChange}
            placeholder="••••••••••••"
            required
            className="w-full bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden"
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

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-[#f47b31] rounded cursor-pointer"
          />
          <span className="text-xs text-stone-300 font-medium">Remember me on this device</span>
        </label>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading || !formData.identifier || !formData.password}
        className="w-full py-3 px-4 bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
          </>
        ) : (
          <>
            Login to Flames <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Demo Credentials Hint */}
      <div className="bg-[#231711] p-3 rounded-2xl border border-[#3d2a20] text-[11px] text-stone-400 space-y-0.5 text-center mt-2">
        <p className="font-semibold text-stone-300">Demo Credentials:</p>
        <p><span className="text-[#f47b31]">Email/Username:</span> alexrivers or alex.rivers@jiit.ac.in</p>
        <p><span className="text-[#f47b31]">Password:</span> Password123</p>
      </div>
    </form>
  );
}
