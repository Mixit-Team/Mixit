'use client';

import React, { ChangeEvent } from 'react';

interface RegisterDescriptionsProps {
  description: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const RegisterDescriptions: React.FC<RegisterDescriptionsProps> = ({
  description,
  onChange,
  maxLength = 5000,
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
      <h2 className="text-lg font-semibold">설명</h2>
      <textarea
        value={description}
        onChange={handleChange}
        placeholder="설명을 입력해주세요"
        className="h-40 w-full resize-none rounded-lg border border-gray-200 p-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div className="text-right text-xs text-gray-500">
        {description.length}/{maxLength}
      </div>
    </div>
  );
};

export default RegisterDescriptions;
