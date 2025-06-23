'use client';

import React from 'react';

export type SortFlag = { label: string; value: string };

interface SortToggleProps {
  flags: readonly SortFlag[];
  active: string;
  onChange: (value: string) => void;
}

export default function SortToggle({ flags, active, onChange }: SortToggleProps) {
  return (
    <div className="mt-2 flex justify-end gap-2">
      {flags.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`text-500 rounded border-none cursor-pointer px-2 py-1      hover:scale-105
 text-sm ${active === value ? 'text-black' : 'text-gray-700'} `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
