import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 px-4 py-4 text-center">
      <div className="mx-auto max-w-sm text-gray-500">
        <p className="mb-2 text-lg font-bold text-gray-400">Mixit</p>
        <p className="text-xs">문의, 비즈니스 제안: aaaaaaa@aaaaa.com</p>
        <div className="mt-2 text-xs">
          <a href="#" className="hover:underline">
            이용약관
          </a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:underline">
            개인정보처리방침
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
