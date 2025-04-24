'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = React.memo(
  ({ icon: Icon, label, className = '', ...rest }) => {
    return (
      <button
        type="button"
        className={`flex flex-col items-center justify-center space-y-2 rounded-lg p-4 text-center transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:outline-none ${className}`}
        aria-label={label} // Accessibility
        {...rest}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <Icon size={24} />
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
