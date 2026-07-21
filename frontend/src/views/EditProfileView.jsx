import React, { useState } from 'react';
import { ChevronLeft, Pencil, Check } from 'lucide-react';
import { getAvatarObj, getAvatarUrl } from '../data/avatars';
import { AvatarSelectorModal } from '../components/AvatarSelectorModal';
import { updateProfile } from '../services/backendStubs';

export function EditProfileView({ currentUser, onSaveProfile, onBack }) {
  const [selectedAvatar, setSelectedAvatar] = useState(
    getAvatarObj(currentUser?.avatar)
  );
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [gender, setGender] = useState(currentUser?.gender || 'prefer-not-to-say');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      fullName: fullName.trim(),
      username: username.trim().replace(/^@/, ''),
      bio: bio.trim(),
      gender,
      avatar: selectedAvatar.id || 'av_4',
    };
    try {
      const response = await updateProfile({
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        bio: updatedUser.bio,
        gender: updatedUser.gender,
        avatar: updatedUser.avatar,
      });
      onSaveProfile(response || updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const avatarUrl = selectedAvatar?.url || getAvatarUrl(currentUser?.avatar);

  return (
    <div className="bg-[#1c120c] text-white min-h-screen pb-28 animate-fade-in px-4 py-4 space-y-5">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-[#3d2a20] pb-3">
        <button
          onClick={onBack}
          className="p-1 text-stone-400 hover:text-white rounded-lg flex items-center gap-1 text-xs font-bold transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-[#f47b31]" /> Back
        </button>
        <h1 className="text-base font-extrabold tracking-tight text-white">Edit Profile</h1>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Circle with Pencil Button */}
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="w-24 h-24 rounded-full bg-[#2b1d16] border-2 border-[#f47b31] p-1 flex items-center justify-center overflow-hidden shadow-lg transition cursor-pointer"
            >
              <img src={avatarUrl} alt={fullName} className="w-full h-full rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#f47b31] hover:bg-[#e0661c] text-white rounded-full flex items-center justify-center border-2 border-[#1c120c] shadow-md transition">
                <Pencil className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
          <span className="text-[11px] text-stone-400 font-bold">Avatar</span>
        </div>

        {/* Full Name Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-[#2b1d16] border border-[#3d2a20] rounded-2xl px-4 py-2.5 text-xs text-white focus:border-[#f47b31] focus:outline-hidden transition"
          />
        </div>

        {/* Username Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-[#2b1d16] border border-[#3d2a20] rounded-2xl px-4 py-2.5 text-xs text-white focus:border-[#f47b31] focus:outline-hidden transition"
          />
        </div>

        {/* Bio Input with counter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
              Bio
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
            className="w-full bg-[#2b1d16] border border-[#3d2a20] rounded-2xl p-3 text-xs text-white focus:border-[#f47b31] focus:outline-hidden transition resize-none"
          />
        </div>

        {/* Gender Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
            Gender
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#2b1d16] p-1.5 rounded-2xl border border-[#3d2a20]">
            {[
              { id: 'male', label: '♂ Male' },
              { id: 'female', label: '♀ Female' },
              { id: 'prefer-not-to-say', label: 'Prefer not to say' },
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

        {/* Read-Only Info Card */}
        <div className="bg-[#231711] p-3 rounded-2xl border border-[#3d2a20] space-y-1.5 text-xs text-stone-400">
          <p>
            <span className="font-semibold text-stone-300">College Email:</span>{' '}
            {currentUser?.collegeEmail || currentUser?.email || '—'}
          </p>
          <p>
            <span className="font-semibold text-stone-300">Joined On:</span>{' '}
            {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
          </p>
        </div>

        {/* Save Changes Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-[#f47b31] hover:bg-[#e0661c] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition cursor-pointer pt-3"
        >
          <Check className="w-4 h-4" /> Save Changes
        </button>
      </form>

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
