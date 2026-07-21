import React, { useState } from 'react';
import { X, Image as ImageIcon, BarChart3, HelpCircle, EyeOff, Plus, Check, Upload, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { FoxMascot } from './FoxMascot';
import { createPost } from '../services/backendStubs';
import defaultPng from '../avatars/default.png';

export function CreatePostModal({ isOpen, onClose, onSubmitPost, initialType = 'text' }) {
  const [postType, setPostType] = useState(
    ['text', 'image', 'poll'].includes(initialType) ? initialType : 'text'
  );
  const [category, setCategory] = useState(CATEGORIES[0]?.id || 'general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Text & Image fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Image Upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Poll fields (min 2, max 7)
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 7) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  const handlePollOptionChange = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const catObj = CATEGORIES.find((c) => c.id === category);

    const postData = {
      id: `post_${Date.now()}`,
      type: postType,
      category,
      categoryLabel: catObj ? catObj.label.toUpperCase() : 'GENERAL',
      timeAgo: 'Just now',
      author: {
        name: isAnonymous ? 'Anonymous' : 'Alex Rivers',
        verified: !isAnonymous,
        sub: isAnonymous ? 'Campus Voice' : "CS '25",
        isAnonymous,
        avatar: isAnonymous ? null : defaultPng,
      },
      title: title.trim(),
      description: description.trim(),
      content: description.trim(),
      image: imagePreview || null,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isBookmarked: false,
    };

    if (postType === 'poll') {
      postData.question = title.trim();
      postData.options = pollOptions.map((optText, idx) => ({
        id: `opt_${idx + 1}`,
        text: optText.trim() || `Option ${idx + 1}`,
        count: 0,
        percentage: Math.round(100 / pollOptions.length),
      }));
      postData.totalVotes = 0;
      postData.userVotedOptionId = null;
    }

    // TODO: connect to backend
    await createPost(postData);
    onSubmitPost(postData);
    onClose();

    // Reset Form
    setTitle('');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setPollOptions(['Option 1', 'Option 2']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-5 shadow-2xl space-y-4 my-8 animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#3d2a20] pb-3">
          <div className="flex items-center gap-2">
            <FoxMascot variant={isAnonymous ? 'comingsoon' : 'generaluse'} className="w-8 h-8" />
            <div>
              <h3 className="text-sm font-extrabold text-white">Create Campus Post</h3>
              <p className="text-[11px] text-stone-400">Share with verified students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Tabs */}
          <div>
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Post Type
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#1c120c] p-1 rounded-2xl border border-[#3d2a20]">
              {[
                { id: 'text', label: 'Text Post', icon: HelpCircle },
                { id: 'image', label: 'Image Post', icon: ImageIcon },
                { id: 'poll', label: 'Poll Post', icon: BarChart3 },
              ].map((type) => {
                const IconComponent = type.icon;
                const isActive = postType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPostType(type.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      isActive
                        ? 'bg-[#f47b31] text-white shadow-sm'
                        : 'text-stone-400 hover:text-white hover:bg-[#2b1d16]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls: Category Dropdown & Identity Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1c120c] border border-[#3d2a20] rounded-xl px-3 py-2 text-xs text-white focus:border-[#f47b31] focus:outline-hidden"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Identity
              </label>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  isAnonymous
                    ? 'bg-purple-900/60 text-purple-200 border-purple-500'
                    : 'bg-[#1c120c] text-stone-300 border-[#3d2a20]'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAnonymous ? 'Post Anonymously' : 'Post as Me'}</span>
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              {postType === 'poll' ? 'Poll Title *' : 'Post Title *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === 'poll'
                  ? 'Ask a question (e.g. Library 24/7 during finals?)'
                  : 'Title or subject of your post...'
              }
              required
              className="w-full bg-[#1c120c] border border-[#3d2a20] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              {postType === 'poll' ? 'Poll Description (Optional)' : 'Description'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details or context..."
              rows={3}
              required={postType !== 'poll'}
              className="w-full bg-[#1c120c] border border-[#3d2a20] rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden resize-none"
            />
          </div>

          {/* Image Upload Field */}
          {postType === 'image' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Upload Image
              </label>
              {!imagePreview ? (
                <label className="w-full border-2 border-dashed border-[#3d2a20] hover:border-[#f47b31] bg-[#1c120c] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                  <Upload className="w-6 h-6 text-[#f47b31]" />
                  <span className="text-xs font-bold text-white">Choose Image File</span>
                  <span className="text-[10px] text-stone-400">
                    Supports JPG, JPEG, PNG, WEBP, GIF
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-[#3d2a20] max-h-48 group">
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Poll Options Fields */}
          {postType === 'poll' && (
            <div className="space-y-2.5 bg-[#1c120c] p-3.5 rounded-2xl border border-[#3d2a20]">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-300">
                  Poll Options ({pollOptions.length} / 7)
                </label>
                <span className="text-[10px] text-stone-400">Min 2 options</span>
              </div>

              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    required
                    className="flex-1 bg-[#2b1d16] border border-[#3d2a20] rounded-xl px-3 py-2 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(idx)}
                      className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg transition"
                      title="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {pollOptions.length < 7 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs text-[#f47b31] hover:underline font-bold flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Option
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3d2a20]">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-stone-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#f47b31] hover:bg-[#e0661c] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
            >
              <Check className="w-4 h-4" /> Post to Campus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
