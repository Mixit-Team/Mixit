'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export interface ExistingImage {
  id: number;
  src: string;
}

interface EditImagesProps {
  // server-side images we got from data.images
  existingImages: ExistingImage[];

  // new Files picked by the user
  newImages: File[];

  onExistingRemove: (id: number) => void;
  onNewRemove: (index: number) => void;
  onNewAdd: (files: File[]) => void;

  maxImages?: number;
}

const EditImages: React.FC<EditImagesProps> = ({
  existingImages,
  newImages,
  onExistingRemove,
  onNewRemove,
  onNewAdd,
  maxImages = 10,
}) => {
  // We want to preview every existingImages.src (string URL),
  // plus every newImages[i] (convert File → objectURL).

  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // As soon as newImages changes, regenerate object URLs:
  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setNewPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  // Handler for <input type="file">:
  const handleAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const validTypes = ["image/jpeg", "image/png"];
    const selected = Array.from(e.target.files);

    // Filter invalid types / sizes
    const accepted: File[] = selected.filter((f) => {
      if (!validTypes.includes(f.type)) {
        alert("JPG 또는 PNG 파일만 업로드 가능합니다!");
        return false;
      }
      if (f.size > MAX_SIZE) {
        alert("10MB 이하 이미지만 업로드 가능합니다!");
        return false;
      }
      return true;
    });

    if (accepted.length === 0) {
      e.target.value = "";
      return;
    }

    // Concat existing newImages, then slice to maxImages
    // But remember: total allowed images = existingImages.length + newImages.length
    const totalCount = existingImages.length + newImages.length + accepted.length;
    if (totalCount > maxImages) {
      alert(`최대 ${maxImages}개 이미지만 업로드 가능합니다.`);
      e.target.value = "";
      return;
    }

    onNewAdd(accepted);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4">
      <h2 className="text-lg font-semibold">사진 (선택)</h2>

      {/* 1) Upload button (only if we haven’t exceeded maxImages) */}
      <div className="flex flex-wrap gap-2">
        {existingImages.length + newImages.length < maxImages && (
          <label className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
            <ImageIcon className="h-6 w-6 text-gray-500" />
            <span className="absolute bottom-1 text-xs text-gray-500">
              {existingImages.length + newImages.length}/{maxImages}
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

        {/* 2) Render thumbnails for existingImages */}
        {existingImages.map((img) => (
          <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-lg">
            {/* show the URL as preview */}
            <Image
              src={img.src}
              alt={`existing-${img.id}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              className="absolute top-1 right-1 rounded-full bg-white p-1 shadow hover:bg-gray-100"
              onClick={() => onExistingRemove(img.id)}
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ))}

        {/* 3) Render thumbnails for newImages */}
        {newPreviews.map((src, idx) => (
          <div key={`new-${idx}`} className="relative h-20 w-20 overflow-hidden rounded-lg">
            <Image src={src} alt={`new-${idx}`} fill className="object-cover" />
            <button
              type="button"
              className="absolute top-1 right-1 rounded-full bg-white p-1 shadow hover:bg-gray-100"
              onClick={() => onNewRemove(idx)}
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditImages;
