import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Loader2, Edit3 } from 'lucide-react';
import { fetchAnnouncements, createAnnouncement, deleteAnnouncement, updateAnnouncement } from '../services/backendStubs';

export function AdminDashboardView() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;
    setIsSubmitting(true);
    try {
      if (editId) {
        await updateAnnouncement(editId, formData);
      } else {
        await createAnnouncement(formData);
      }
      setFormData({ title: '', description: '', priority: 'medium' });
      setShowForm(false);
      setEditId(null);
      await loadAnnouncements();
    } catch (err) {
      alert('Failed to save announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a._id !== id && a.id !== id));
    } catch (err) {
      alert('Failed to delete announcement.');
    }
  };

  const openEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      priority: announcement.priority || 'medium',
    });
    setEditId(announcement._id || announcement.id);
    setShowForm(true);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'medium': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'low': return 'text-stone-400 border-stone-500/30 bg-stone-500/10';
      default: return 'text-stone-400 border-stone-500/30 bg-stone-500/10';
    }
  };

  return (
    <div className="pb-24 px-4 py-6 max-w-2xl mx-auto space-y-6 animate-fade-in text-white">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-emerald-400" />
        <h1 className="text-2xl font-extrabold text-stone-100">Admin Dashboard</h1>
      </div>

      <div className="bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-[#3d2a20] pb-4">
          <h2 className="text-lg font-bold">Announcements</h2>
          {!showForm && (
            <button 
              onClick={() => {
                setFormData({ title: '', description: '', priority: 'medium' });
                setEditId(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f47b31] hover:bg-[#e0661c] text-white text-xs font-bold rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#231711] border border-[#3d2a20] p-4 rounded-2xl mb-6 space-y-3">
            <h3 className="text-sm font-bold text-stone-200">{editId ? 'Edit Announcement' : 'Create Announcement'}</h3>
            <input 
              type="text" 
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData(prev => ({...prev, title: e.target.value}))}
              className="w-full bg-[#1c120c] border border-[#3d2a20] text-sm text-white rounded-xl px-4 py-2.5 focus:border-[#f47b31] focus:outline-hidden"
              required
            />
            <textarea 
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
              className="w-full bg-[#1c120c] border border-[#3d2a20] text-sm text-white rounded-xl px-4 py-2.5 focus:border-[#f47b31] focus:outline-hidden min-h-[100px]"
              required
            />
            <select 
              value={formData.priority}
              onChange={e => setFormData(prev => ({...prev, priority: e.target.value}))}
              className="w-full bg-[#1c120c] border border-[#3d2a20] text-sm text-white rounded-xl px-4 py-2.5 focus:border-[#f47b31] focus:outline-hidden"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-bold text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editId ? 'Save Changes' : 'Publish'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-[#f47b31]" />
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-stone-500 text-sm text-center py-4">No active announcements.</p>
          ) : (
            announcements.map(a => (
              <div key={a._id || a.id} className="bg-[#231711] border border-[#3d2a20] rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-100">{a.title}</h3>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getPriorityColor(a.priority)}`}>
                      {a.priority || 'medium'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => openEdit(a)}
                      className="p-1.5 text-stone-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(a._id || a.id)}
                      className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">{a.description}</p>
                <div className="text-xs text-stone-500 font-medium">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
