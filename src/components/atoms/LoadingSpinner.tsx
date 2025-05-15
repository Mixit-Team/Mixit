'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-500 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:outline-none"
      aria-label={isLoading ? '로딩 중' : '완료'}
      disabled={isLoading}
    >
      <motion.div
        initial={false}
        animate={isLoading ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Check className="h-6 w-6 text-white" />
      </motion.div>
      <motion.div
        className="absolute"
        initial={false}
        animate={isLoading ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </motion.div>
    </button>
  );
}
