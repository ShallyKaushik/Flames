import React, { useRef, useState } from 'react';

export default function OtpInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take last entered character
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Call onComplete when filled
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // Auto-focus next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(data)) return;

    const pastedDigits = data.slice(0, length).split('');
    const newOtp = [...otp];
    pastedDigits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });
    setOtp(newOtp);

    if (pastedDigits.length === length) {
      onComplete(pastedDigits.join(''));
    }
  };

  return (
    <div className="flex justify-between items-center gap-1.5 sm:gap-2 my-4" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 sm:w-12 h-12 sm:h-14 text-center font-extrabold text-lg sm:text-xl text-[#1C1C1A] bg-[#F5F0EB] rounded-2xl border-2 border-transparent focus:bg-white focus:border-[#FF6B4A] focus:ring-4 focus:ring-[#FF6B4A]/10 outline-none transition-all"
        />
      ))}
    </div>
  );
}
