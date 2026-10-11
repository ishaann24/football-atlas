'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Heart, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_TEAMS = [
  'USA',
  'Mexico',
  'Canada',
  'Argentina',
  'Brazil',
  'France',
  'Spain',
  'England',
  'Portugal',
  'Germany',
  'Netherlands',
  'Morocco',
  'Croatia',
  'Italy',
  'Senegal',
  'Japan',
  'South Korea',
  'Colombia',
  'Uruguay',
  'Ecuador',
];

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    favouriteTeam: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    if (!formData.name || !formData.email || !formData.whatsapp || !formData.favouriteTeam) {
      setStatus({ type: 'error', message: 'All fields are required!' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus({
        type: 'success',
        message: 'Successfully registered! You are now subscribed to live goal alerts.',
      });

      // Trigger Confetti explosion
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669', '#3b82f6', '#ffffff'],
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        favouriteTeam: '',
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Server error. Please verify your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden w-full max-w-lg mx-auto">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

      <h2 className="text-xl md:text-2xl font-extrabold text-white text-center mb-1">
        Subscribe to Goal Alerts
      </h2>
      <p className="text-xs md:text-sm text-slate-400 text-center mb-6">
        Receive instant WhatsApp and Email notifications the second your favourite team scores!
      </p>

      {status.type && (
        <div
          className={`flex items-start space-x-3 p-4 rounded-xl border mb-6 text-sm transition-all duration-300 ${
            status.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form space-y-4 md:space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Lionel Messi"
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 text-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium transition-colors outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="lionel@messi.com"
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 text-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium transition-colors outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            WhatsApp Number (With Country Code)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+919876543210"
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 text-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium transition-colors outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* Favorite Team */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Favourite Team
          </label>
          <div className="relative">
            <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              name="favouriteTeam"
              value={formData.favouriteTeam}
              onChange={handleChange}
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 text-white rounded-xl py-3 pl-11 pr-4 text-sm font-medium transition-colors outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none"
              required
            >
              <option value="" disabled className="bg-slate-950 text-slate-500">
                Select Your Team
              </option>
              {POPULAR_TEAMS.map((team) => (
                <option key={team} value={team} className="bg-slate-950 text-slate-200">
                  {team}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <span>Activate Goal Alerts</span>
          )}
        </button>
      </form>
    </div>
  );
}
