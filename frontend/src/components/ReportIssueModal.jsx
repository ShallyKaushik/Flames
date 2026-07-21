import React, { useState } from 'react';
import { X, Flag, Check, Loader2 } from 'lucide-react';
import { reportIssue } from '../services/backendStubs';

const ISSUE_CATEGORIES = [
  'Bug Report',
  'UI/Design Issue',
  'Feature Request',
  'Login/Authentication',
  'Report User',
  'Report Post',
  'Performance Issue',
  'Other',
];

export function ReportIssueModal({ isOpen, onClose, onSuccessToast }) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !category || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const reportData = {
      id: `report_${Date.now()}`,
      topic: topic.trim(),
      category,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      // TODO: connect to backend - POST /api/v1/reports
      await reportIssue(reportData);
      onSuccessToast('Thank you! Your report has been submitted.');
      setTopic('');
      setCategory(ISSUE_CATEGORIES[0]);
      setDescription('');
      onClose();
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto font-sans">
      <div className="w-full max-w-md bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-5 shadow-2xl space-y-4 my-8 animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#3d2a20] pb-3">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-[#f47b31]" />
            <h3 className="text-sm font-extrabold text-white">Report an Issue</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-2.5 rounded-2xl text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Input (Required) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
              Topic *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (error) setError('');
              }}
              placeholder="Short topic or subject..."
              required
              className="w-full bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-stone-400 transition outline-hidden"
            />
          </div>

          {/* Category Dropdown (Required) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl px-3.5 py-2.5 text-xs text-white transition outline-hidden"
            >
              {ISSUE_CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description Textarea (Required) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError('');
              }}
              placeholder="Describe the issue in detail..."
              rows={4}
              required
              className="w-full bg-[#1c120c] border border-[#3d2a20] focus:border-[#f47b31] rounded-2xl p-3.5 text-xs text-white placeholder-stone-400 transition outline-hidden resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3d2a20]">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-stone-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !topic.trim() || !description.trim()}
              className="py-2.5 px-5 bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
