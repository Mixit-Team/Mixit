'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface RegisterImagesProps {
  images: File[];
  onChange: (files: File[]) => void;
  maxImages?: number;
}

const RegisterImages: React.FC<RegisterImagesProps> = ({ images, onChange, maxImages = 10 }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = images.map(file => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(e.target.files?.[0].type)) {
      alert('JPG 또는 PNG 파일만 업로드 가능합니다!');
      e.target.value = '';
      return;
    }
    const selected = Array.from(e.target.files);
    const combined = [...images, ...selected].slice(0, maxImages);
    onChange(combined);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const filtered = images.filter((_, i) => i !== index);
    onChange(filtered);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
      <h2 className="text-lg font-semibold">사진 (선택)</h2>
      <div className="flex flex-wrap gap-2">
        {images.length < maxImages && (
          <label className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
            <ImageIcon className="h-6 w-6 text-gray-500" />
            <span className="absolute bottom-1 text-xs text-gray-500">
              {images.length}/{maxImages}
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleAddImages}
            />
          </label>
        )}

        {previews.map((src, idx) => (
          <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg">
            <Image src={src} alt={`preview-${idx}`} fill className="object-cover" />
            <button
              type="button"
              className="absolute top-1 right-1 rounded-full bg-white p-1 shadow hover:bg-gray-100"
              onClick={() => handleRemove(idx)}
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterImages;
