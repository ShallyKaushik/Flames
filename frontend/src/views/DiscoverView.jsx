import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';
import { Sparkles, TrendingUp, Users, ArrowRight, Megaphone, Loader2 } from 'lucide-react';
import { FoxMascot } from '../components/FoxMascot';
import { fetchAnnouncements } from '../services/backendStubs';

export function DiscoverView({ onSelectCategory }) {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);

  useEffect(() => {
    fetchAnnouncements()
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setIsLoadingAnnouncements(false));
  }, []);
  return (
    <div className="bg-[#fcf8f3] text-[#2c1a11] min-h-screen pb-24 animate-fade-in font-sans">
      {/* Light Theme Discover Header with Mascot 8 */}
      <div className="bg-gradient-to-b from-[#ffebd9] to-[#fcf8f3] px-4 pt-6 pb-4 border-b border-[#f47b31]/20">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-[#f47b31] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Campus Explore
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight">Discover Channels</h1>
          </div>
          <FoxMascot variant="8" className="w-12 h-12" />
        </div>
        <p className="text-xs text-stone-600">Browse categories, trending campus topics, and registered student clubs.</p>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Categories Grid (Exact 9 Categories in Order) */}
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 mb-3">
            Campus Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="bg-white hover:bg-[#fff6ed] p-3 rounded-2xl border border-[#ebdccf] text-left shadow-xs hover:border-[#f47b31] transition group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-extrabold text-[#2c1a11] group-hover:text-[#f47b31] transition block">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-stone-400">Explore channel</span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#f47b31] group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Section */}
        <div className="bg-white p-5 rounded-3xl border border-[#ebdccf] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#f47b31]" />
            <h2 className="text-sm font-extrabold text-[#2c1a11]">Announcements</h2>
          </div>

          {isLoadingAnnouncements ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 text-[#f47b31] animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-4">No announcements right now.</p>
          ) : (
            <div className="space-y-2">
              {announcements.map((a) => (
                <div key={a._id || a.id} className="bg-[#fcf8f3] border border-[#ebdccf] rounded-2xl p-3 space-y-1">
                  <h3 className="text-xs font-extrabold text-[#2c1a11]">{a.title}</h3>
                  {a.content && <p className="text-xs text-stone-600 leading-relaxed">{a.content}</p>}
                  {a.createdAt && (
                    <span className="text-[10px] text-stone-400">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trending Campus Topics Section (Coming Soon with Sleeping Fox Mascot 9) */}
        <div className="bg-white p-5 rounded-3xl border border-[#ebdccf] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-[#f47b31]" />
            <h2 className="text-sm font-extrabold text-[#2c1a11]">Trending on Campus</h2>
          </div>

          <div className="bg-[#fcf8f3] border border-[#ebdccf] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <FoxMascot variant="9" className="w-20 h-20 object-contain" />
            <span className="text-xs font-extrabold text-[#f47b31] uppercase tracking-wider">
              Coming Soon
            </span>
            <p className="text-xs text-stone-500 max-w-xs">
              Real-time campus trending hashtags and topics are currently under development.
            </p>
          </div>
        </div>

        {/* Featured Student Organizations Section (Coming Soon with Sleeping Fox Mascot 9) */}
        <div className="bg-white p-5 rounded-3xl border border-[#ebdccf] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-[#f47b31]" />
            <h2 className="text-sm font-extrabold text-[#2c1a11]">Featured Student Organizations</h2>
          </div>

          <div className="bg-[#fcf8f3] border border-[#ebdccf] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <FoxMascot variant="9" className="w-20 h-20 object-contain" />
            <span className="text-xs font-extrabold text-[#f47b31] uppercase tracking-wider">
              Coming Soon
            </span>
            <p className="text-xs text-stone-500 max-w-xs">
              Official student club profiles and society directories are coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
