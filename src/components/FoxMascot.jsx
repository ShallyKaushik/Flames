import React from 'react';
import defaultPng from '../avatars/default.png';
import generalusePng from '../avatars/generaluse.png';
import comingsoonPng from '../avatars/comingsoon.png';
import errorPng from '../avatars/error.png';

/**
 * Official Flames Mascot Component utilizing uploaded mascot assets:
 * - 'default' / '8' / 'happy': default.png
 * - 'general' / 'generaluse' / '11' / 'notify': generaluse.png
 * - 'comingsoon' / '9' / 'empty' / 'sleeping' / 'placeholder': comingsoon.png
 * - 'error' / '10' / 'surprised' / 'alert': error.png
 */
export function FoxMascot({ variant = 'default', className = 'w-10 h-10', showOnlineStatus = false, onClick }) {
  const normVariant = String(variant).toLowerCase();

  let imgSrc = defaultPng;
  if (normVariant === 'general' || normVariant === 'generaluse' || normVariant === '11' || normVariant === 'notify' || normVariant === 'phone') {
    imgSrc = generalusePng;
  } else if (normVariant === 'comingsoon' || normVariant === '9' || normVariant === 'empty' || normVariant === 'sleeping' || normVariant === 'placeholder') {
    imgSrc = comingsoonPng;
  } else if (normVariant === 'error' || normVariant === '10' || normVariant === 'surprised' || normVariant === 'alert') {
    imgSrc = errorPng;
  }

  return (
    <div className={`relative inline-block ${className}`} onClick={onClick}>
      <img src={imgSrc} alt="Flames Mascot" className="w-full h-full object-contain" />
      {showOnlineStatus && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1c120c] rounded-full" />
      )}
    </div>
  );
}
