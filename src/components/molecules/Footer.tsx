import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 px-4 py-4 text-center">
      <div className="mx-auto max-w-sm text-gray-500">
        <p className="mb-2 text-lg font-bold text-gray-400">Mixit</p>
        <p className="text-xs">문의, 비즈니스 제안: mixitofficialmixit@gmail.com</p>
        <div className="mt-2 text-xs">
          <Link href="/terms/service" target="_blank" className="hover:underline">
            이용약관
          </Link>
          <span className="mx-2">|</span>
          <Link href="/terms/privacy" target="_blank" className="hover:underline">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
