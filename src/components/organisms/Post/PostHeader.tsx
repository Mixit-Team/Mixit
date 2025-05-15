'use client';

import React from 'react';
import Link from 'next/link';
import Title from '@/components/atoms/Title';

interface PostHeaderProps {
  title: string;
  backHref: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ title, backHref }) => {
  return (
    <div className="relative flex w-full items-center justify-center border-b border-gray-200 bg-white px-0 py-4">
      <Link href={backHref} className="absolute top-1/2 left-4 -translate-y-1/2 transform">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>
      <Title label={title} />
    </div>
  );
};

export default PostHeader;
