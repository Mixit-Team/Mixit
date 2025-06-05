// src/components/PostHeader.tsx
'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Title from '@/components/atoms/Title';
import { EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/useApi';
import axios from 'axios';
import ShareModal from '../ShareModal';


interface PostHeaderProps {
  title: string;
  backHref: string;
  isAuthor: boolean;
  id: number;
}

const PostHeader: React.FC<PostHeaderProps> = ({ title, backHref, isAuthor, id }) => {
  const menuDialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [isShareOpen, setIsShareOpen] = useState(false);

  // 삭제 뮤테이션 (생략)
  const postDeleteMutate = useApiMutation<{ success: boolean }, { id: number }>(
    `/api/v1/posts/${id}`,
    'delete',
    {
      onSuccess: () => {
        router.back();
      },
      onError: (err) => {
        const msg =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : '게시글 삭제에 실패했습니다. 다시 시도해주세요.';
        console.error('postDeleteMutate error:', err);
        alert(msg);
      },
    }
  );

  const openMenu = () => {
    menuDialog.current?.showModal();
  };
  const onChooseEdit = () => {
    router.push(`/post/${id}/edit`);
    menuDialog.current?.close();
  };
  const onChooseDelete = async () => {
    await postDeleteMutate.mutateAsync({ id });
    menuDialog.current?.close();
  };

  // 공유하기 메뉴 클릭
  const onChooseShare = () => {
    setIsShareOpen(true);
    menuDialog.current?.close();
  };

  return (
    <>
      {/* ▶ (1) 기존 메뉴 다이얼로그 */}
      <dialog
        ref={menuDialog}
        className="fixed top-1/2 left-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg"
      >
        <button
          onClick={() => menuDialog.current?.close()}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="flex flex-col divide-y divide-gray-200">
          <button
            onClick={onChooseShare}
            className="py-3 text-center text-sm hover:bg-gray-100"
          >
            공유하기
          </button>
          <button
            onClick={onChooseEdit}
            className="py-3 text-center text-sm hover:bg-gray-100"
          >
            수정하기
          </button>
          <button
            onClick={onChooseDelete}
            className="py-3 text-center text-sm hover:bg-gray-100"
          >
            삭제하기
          </button>
        </div>
      </dialog>

      {/* ▶ (2) ShareModal: isShareOpen이 true일 때만 렌더 */}
      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
          shareText={title}
        />
      )}

      {/* ▶ (3) 헤더 바 */}
      <div className="relative flex w-full items-center justify-center border-b border-gray-200 bg-white px-0 py-4">
        <Link href={backHref} className="absolute top-1/2 left-4 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <Title label={title} />

        {isAuthor && (
          <button
            onClick={openMenu}
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded p-1 hover:bg-gray-100"
          >
            <EllipsisVertical size={16} />
          </button>
        )}
      </div>
    </>
  );
};

export default PostHeader;
