'use client';

import React, { ChangeEvent, FormEvent, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onAddImages: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
}

const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onSubmit,
  onAddImages,
  placeholder = '댓글을 입력해주세요',
  maxLength = 1000,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) onChange(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="relative h-[135px] rounded-lg border border-gray-200 p-2">
        <textarea
          className="h-[80px] w-full resize-none placeholder-gray-400 focus:outline-none"
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
        />

        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onAddImages} />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute bottom-2 left-2 cursor-pointer p-2"
        >
          <ImageIcon className="h-5 w-5 text-gray-500" />
        </button>

        <button
          type="submit"
          disabled={!value.trim()}
          className="absolute right-2 bottom-2 cursor-pointer rounded bg-blue-600 px-4 py-1 text-sm text-white disabled:opacity-50"
        >
          댓글 등록
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {value.length}/{maxLength}
        </span>
      </div>
    </form>
  );
};

export default CommentInput;
