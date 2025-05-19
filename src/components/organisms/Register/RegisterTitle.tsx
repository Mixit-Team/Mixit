'use client';

import React from 'react';

interface RegisterTitleProps {
  title: string;
  onChange: (value: string) => void;
}

const RegisterTitle: React.FC<RegisterTitleProps> = ({ title, onChange }) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
      <label htmlFor="title" className="text-lg font-semibold">
        제목
      </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={e => onChange(e.target.value)}
        placeholder="제목을 입력해주세요"
        className="h-[48px] w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default RegisterTitle;
