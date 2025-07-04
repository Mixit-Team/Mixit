'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
  const router = useRouter();

  return (
    <button onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      router.back() 
      
    }} className={` ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default BackButton;
