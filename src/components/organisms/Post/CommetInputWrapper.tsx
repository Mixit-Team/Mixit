'use client';

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import CommentInput from '@/components/molecules/CommentInput';
import { useApiMutation } from '@/hooks/useApi';
import CommentList from '@/components/molecules/CommentList';
import { useQueryClient } from '@tanstack/react-query';

interface CommentInputWrapperProps {
  postId: number;
}

const MAX_IMAGES = 10;

type UploadResponse = { success: boolean; id: string };
type CommentVariables = { content: string; images: number[] };

export default function CommentInputWrapper({ postId }: CommentInputWrapperProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { mutateAsync: uploadImage } = useApiMutation<UploadResponse, FormData>(
    '/api/v1/images',
    'post'
  );

  const postComment = useApiMutation<{ success: boolean }, CommentVariables>(
    `/api/v1/posts/${postId}/reviews`,
    'post',
    {
      onSuccess: () => {
        setContent('');
        setFiles([]);
        console.log('refresh 한다');
        queryClient.invalidateQueries({
          queryKey: ['comments', postId],
        });

        router.refresh(); 
      },
    }
  );

  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const handleAddImages = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const selected = Array.from(e.target.files).slice(0, MAX_IMAGES - files.length);
      setFiles(prev => [...prev, ...selected]);
      e.target.value = '';
    },
    [files.length]
  );

  const handleRemove = useCallback((idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        const imageIds = await Promise.all(
          files.map(async file => {
            const form = new FormData();
            form.append('image', file);
            const { id } = await uploadImage(form);
            return Number(id);
          })
        );

        await postComment.mutateAsync({
          content,
          images: imageIds,
        });
      } catch (err) {
        console.error('댓글 등록 실패:', err);
      }
    },
    [content, files, uploadImage, postComment]
  );

  return (
    <div className="space-y-4">
      <CommentList postId={+postId} />

      <CommentInput
        value={content}
        onChange={setContent}
        onSubmit={handleSubmit}
        onAddImages={handleAddImages}
        placeholder="댓글을 남겨주세요."
        maxLength={1000}
      />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg">
              <Image src={src} alt={`preview-${idx}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 rounded-full bg-white p-1 shadow hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
