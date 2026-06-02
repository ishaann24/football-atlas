'use client';

import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const COMMON_TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST - UTC+5:30)' },
  { value: 'America/New_York', label: 'Eastern Standard Time (EST - UTC-5)' },
  { value: 'America/Chicago', label: 'Central Standard Time (CST - UTC-6)' },
  { value: 'America/Denver', label: 'Mountain Standard Time (MST - UTC-7)' },
  { value: 'America/Los_Angeles', label: 'Pacific Standard Time (PST - UTC-8)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT - UTC+0)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET - UTC+1)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST - UTC+9)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST - UTC+10)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC+0)' },
];

export default function TimezoneSelector({
  selectedTimezone,
  onTimezoneChange,
}: TimezoneSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-detect timezone
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected && detected !== selectedTimezone) {
        // Update to detected timezone if not already set manually
        onTimezoneChange(detected);
      }
    } catch (e) {
      console.error('Failed to auto-detect timezone:', e);
    }
  }, []);

  return (
    <div className="relative flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 text-white max-w-sm w-full transition-all duration-300 hover:border-emerald-500 shadow-lg">
      <Globe className="text-emerald-400 w-5 h-5 flex-shrink-0 animate-pulse" />
      <div className="flex-1">
        <label className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
          Match Timezone
        </label>
        {mounted ? (
          <select
            value={selectedTimezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
            className="bg-transparent border-none text-sm text-slate-100 font-medium w-full focus:outline-none focus:ring-0 cursor-pointer"
          >
            {/* If detected timezone is not in common list, prepend it */}
            {!COMMON_TIMEZONES.some((tz) => tz.value === selectedTimezone) && (
              <option value={selectedTimezone} className="bg-slate-950 text-slate-100">
                {selectedTimezone} (Detected)
              </option>
            )}
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-slate-950 text-slate-100">
                {tz.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm text-slate-300 font-medium">Asia/Kolkata (IST)</span>
        )}
      </div>
    </div>
  );
}
