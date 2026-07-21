import React, { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import { AVATARS, DEFAULT_AVATAR } from '../data/avatars';
import { AvatarSelectorModal } from '../components/AvatarSelectorModal';

export function ProfileSetupView({ user, onCompleteSetup }) {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [gender, setGender] = useState('Male');
  const [bio, setBio] = useState('UI/UX Designer\nHackathon Enthusiast\nBuilding Flames 🔥');

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      avatarObj: selectedAvatar,
      avatar: selectedAvatar.url || DEFAULT_AVATAR,
      gender,
      bio: bio.trim(),
      hasCompletedSetup: true,
    };
    onCompleteSetup(updatedUser);
  };

  const avatarUrl = selectedAvatar?.url || DEFAULT_AVATAR;

  return (
    <div className="min-h-screen bg-[#1c120c] text-white flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-sm bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-white">Complete Your Profile</h1>
          <p className="text-xs text-stone-400">Set up your campus presence to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Selection Circle with Pencil Icon */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="w-24 h-24 rounded-full bg-[#1c120c] border-2 border-[#f47b31] p-1 flex items-center justify-center overflow-hidden shadow-lg group transition cursor-pointer"
              >
                <img src={avatarUrl} alt="Selected Avatar" className="w-full h-full rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#f47b31] hover:bg-[#e0661c] text-white rounded-full flex items-center justify-center border-2 border-[#2b1d16] shadow-md transition">
                  <Pencil className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
            <span className="text-[11px] text-stone-400 font-bold">Select Profile Avatar</span>
          </div>

          {/* Bio Field (Optional, Max 120 chars) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                Bio (Optional)
              </label>
              <span className="text-[10px] text-stone-400 font-mono">
                {bio.length}/120
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= 120) setBio(e.target.value);
              }}
              rows={3}
              placeholder="Tell campus a bit about yourself..."
              className="w-full bg-[#1c120c] border border-[#3d2a20] rounded-2xl p-3 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden resize-none"
            />
          </div>

          {/* Gender Pills Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#1c120c] p-1 rounded-2xl border border-[#3d2a20]">
              {[
                { id: 'Male', label: '♂ Male' },
                { id: 'Female', label: '♀ Female' },
                { id: 'Other', label: 'Prefer not to say' },
              ].map((g) => {
                const isActive = gender === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGender(g.id)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold text-center transition cursor-pointer ${
                      isActive
                        ? 'bg-[#f47b31] text-white shadow-xs'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#f47b31] hover:bg-[#e0661c] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Check className="w-4 h-4" /> Save & Continue
          </button>
        </form>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={selectedAvatar}
        onSelectAvatar={(avatar) => setSelectedAvatar(avatar)}
      />
    </div>
  );
}
