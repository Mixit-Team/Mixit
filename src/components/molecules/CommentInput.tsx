'use client';

import React, { ChangeEvent, FormEvent, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

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
  const { status } = useSession();
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) onChange(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="relative h-[135px] rounded-lg border border-gray-200 p-2">
        <textarea
          className="h-[80px] w-full resize-none placeholder-gray-400 focus:outline-none"
          value={value}
          disabled={status === 'unauthenticated'}
          onChange={handleTextChange}
          placeholder={placeholder}
        />

        <input
          disabled={status === 'unauthenticated'}
          ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onAddImages} />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={status === 'unauthenticated'}
          className="absolute bottom-2 left-2 cursor-pointer p-2 cursor-pointer rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon className="h-5 w-5 text-gray-500" />
        </button>

        <button
          type="submit"
          disabled={status==='unauthenticated' || !value.trim()}
          className="absolute right-2 bottom-2 cursor-pointer rounded bg-transparent px-4 py-1 text-[#FD7A19] disabled:text-gray-400 disabled:opacity-50"
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
