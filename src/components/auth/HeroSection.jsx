import React from 'react';
import { FoxMascot } from '../FoxMascot';

export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 md:p-10 lg:p-12 text-white relative z-10 my-auto max-w-xl">
      {/* Top Brand Logo */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <img
          src="/assets/logo.png"
          alt="Flames Logo"
          className="w-10 h-10 object-contain drop-shadow-[0_2px_10px_rgba(244,123,49,0.5)]"
        />
        <span className="font-heading font-extrabold text-2xl tracking-tight text-white font-serif italic drop-shadow-md">
          Flames
        </span>
      </div>

      {/* Hero Body */}
      <div className="space-y-6">
        {/* Verified Tag */}
        <div className="inline-flex items-center gap-2 bg-[#2b1d16]/90 border border-[#f47b31]/40 px-4 py-1.5 rounded-full text-xs font-bold text-[#f47b31] shadow-md backdrop-blur-xs">
          <FoxMascot variant="generaluse" className="w-5 h-5 shrink-0" />
          <span>Verified College Community</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
          Your Campus Social Network.{' '}
          <span className="text-[#f47b31]">All in One Place.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-stone-200 text-xs sm:text-sm leading-relaxed font-medium drop-shadow-sm">
          Connect with verified students, discover campus events, find teammates, ask anonymously, buy and sell, join clubs, and stay updated with everything happening around your campus—all in one place.
        </p>
      </div>

      {/* Footer copyright */}
      <div className="text-xs text-stone-400 font-medium pt-8">
        © 2026 Flames Campus Social Inc. All rights reserved.
      </div>
    </div>
  );
}
