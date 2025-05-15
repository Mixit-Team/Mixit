'use client';

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import CommentInput from '@/components/molecules/CommentInput';
import { useApiMutation } from '@/hooks/useApi';
import CommentList from '@/components/molecules/CommentList';

interface CommentInputWrapperProps {
  postId: number;
}

const MAX_IMAGES = 10;

type UploadResponse = { success: boolean; id: string };
type CommentVariables = { content: string; imageIds: number[] };

export default function CommentInputWrapper({ postId }: CommentInputWrapperProps) {
  const router = useRouter();

  /** 텍스트, 파일, 미리보기 상태 */
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  /* ────────────────────  이미지 업로드  ──────────────────── */
  const { mutateAsync: uploadImage } = useApiMutation<UploadResponse, FormData>(
    '/api/v1/images',
    'post'
  );

  /* ────────────────────  댓글 등록  ──────────────────── */
  const postComment = useApiMutation<{ success: boolean }, CommentVariables>(
    `/api/v1/posts/${postId}/reviews`,
    'post',
    {
      onSuccess: () => {
        setContent('');
        setFiles([]);
        router.refresh(); // 댓글 목록 새로고침
      },
    }
  );

  /* ─────────────────  files → previews 동기화  ───────────────── */
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  /* ─────────────────────  핸들러  ───────────────────── */
  /** 파일 추가 */
  const handleAddImages = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const selected = Array.from(e.target.files).slice(0, MAX_IMAGES - files.length);
      setFiles(prev => [...prev, ...selected]);
      e.target.value = ''; // 같은 파일 다시 선택 가능하게 초기화
    },
    [files.length]
  );

  /** 파일 제거 */
  const handleRemove = useCallback((idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  /** 폼 제출 */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault(); // 🔑 기본 form submit 방지

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
          imageIds,
        });
      } catch (err) {
        console.error('댓글 등록 실패:', err);
      }
    },
    [content, files, uploadImage, postComment]
  );

  /* ─────────────────────  UI  ───────────────────── */
  return (
    <div className="space-y-4">
      <CommentList postId={+postId} />

      <CommentInput
        value={content}
        onChange={setContent}
        onSubmit={handleSubmit}
        onAddImages={handleAddImages}
        placeholder="댓글을 입력해주세요 (최대 100자)"
        maxLength={100}
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
