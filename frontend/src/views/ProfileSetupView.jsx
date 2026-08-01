import React, { useState, useEffect } from 'react';
import { Pencil, Check, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import { AVATARS, DEFAULT_AVATAR } from '../data/avatars';
import { AvatarSelectorModal } from '../components/AvatarSelectorModal';
import { checkUsernameApi, completeProfileApi } from '../services/authApi';

export function ProfileSetupView({ pendingSetupData, onCompleteSetup }) {
  const { idToken, googleData } = pendingSetupData;

  const [selectedAvatar, setSelectedAvatar] = useState(googleData.picture || DEFAULT_AVATAR);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  
  const [username, setUsername] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('prefer_not_to_say');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Debounced username check
  useEffect(() => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsCheckingUsername(true);
      const available = await checkUsernameApi(username);
      setUsernameAvailable(available);
      setIsCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || usernameAvailable === false) {
      setError('Please provide a valid, unique username.');
      return;
    }
    if (!phoneNumber) {
      setError('Phone number is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        idToken,
        username,
        phoneNumber,
        fullName: googleData.fullName,
        avatar: selectedAvatar.url || selectedAvatar, // url from AVATARS or string
        personalEmail,
        bio: bio.trim(),
        gender,
      };
      const res = await completeProfileApi(payload);
      if (res.success) {
        onCompleteSetup(res);
      }
    } catch (err) {
      setError(err.message || 'Profile setup failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const avatarUrl = selectedAvatar?.url || selectedAvatar;

  return (
    <div className="min-h-screen bg-[#1c120c] text-white flex flex-col items-center justify-center p-4 font-sans animate-fade-in py-10">
      <div className="w-full max-w-sm bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-white">Complete Your Profile</h1>
          <p className="text-xs text-stone-400">Set up your campus presence to continue</p>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
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
            <span className="text-[11px] text-stone-400 font-bold">Profile Picture</span>
          </div>

          {/* Read-only fields */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">Full Name</label>
              <input type="text" readOnly value={googleData.fullName} className="w-full bg-[#1c120c]/50 border border-[#3d2a20] rounded-xl p-3 text-xs text-stone-500 cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">College Email</label>
              <input type="email" readOnly value={googleData.email} className="w-full bg-[#1c120c]/50 border border-[#3d2a20] rounded-xl p-3 text-xs text-stone-500 cursor-not-allowed" />
            </div>
          </div>

          <div className="h-px bg-[#3d2a20] w-full my-4" />

          {/* Required Fields */}
          <div className="space-y-4">
            <div className="space-y-1 relative">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
                Username <span className="text-[#f47b31]">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="e.g. flames_user"
                  className={`w-full bg-[#1c120c] border ${usernameAvailable === false ? 'border-red-500' : usernameAvailable === true ? 'border-emerald-500' : 'border-[#3d2a20]'} rounded-xl p-3 text-xs text-white placeholder-stone-400 focus:outline-hidden transition`}
                  required
                  maxLength={20}
                />
                <div className="absolute right-3 flex items-center">
                  {isCheckingUsername && <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />}
                  {!isCheckingUsername && usernameAvailable === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {!isCheckingUsername && usernameAvailable === false && <XCircle className="w-4 h-4 text-red-500" />}
                </div>
              </div>
              {usernameAvailable === false && <p className="text-[10px] text-red-500 mt-1">Username is already taken.</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
                Phone Number <span className="text-[#f47b31]">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                className="w-full bg-[#1c120c] border border-[#3d2a20] rounded-xl p-3 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="h-px bg-[#3d2a20] w-full my-4" />

          {/* Optional Fields */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
                Personal Email (Optional)
              </label>
              <input
                type="email"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                placeholder="personal@gmail.com"
                className="w-full bg-[#1c120c] border border-[#3d2a20] rounded-xl p-3 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">Bio (Optional)</label>
                <span className="text-[10px] text-stone-400 font-mono">{bio.length}/120</span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= 120) setBio(e.target.value);
                }}
                rows={2}
                placeholder="Tell campus a bit about yourself..."
                className="w-full bg-[#1c120c] border border-[#3d2a20] rounded-xl p-3 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">Gender</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#1c120c] p-1 rounded-2xl border border-[#3d2a20]">
                {[
                  { id: 'male', label: 'Male' },
                  { id: 'female', label: 'Female' },
                  { id: 'other', label: 'Other' },
                  { id: 'prefer_not_to_say', label: 'Skip' },
                ].map((g) => {
                  const isActive = gender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer ${
                        isActive ? 'bg-[#f47b31] text-white shadow-xs' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || usernameAvailable === false}
            className="w-full py-3 rounded-2xl bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition cursor-pointer mt-4"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isSubmitting ? 'Creating Profile...' : 'Finish Setup'}
          </button>
        </form>
      </div>

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={selectedAvatar}
        onSelectAvatar={(avatar) => setSelectedAvatar(avatar)}
      />
    </div>
  );
}
