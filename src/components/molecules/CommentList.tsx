'use client';

import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import { Comment } from '@/types/Home.type';
import dayjs from 'dayjs';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function CommentList({ postId }: { postId: number }) {
  const queryClient = useQueryClient();
  const { data } = useApiQuery<{ comments: Comment[] }>(
    ['comments', postId],
    `/api/v1/posts/${postId}/reviews`
  );

  // 1) 메뉴용 다이얼로그
  const menuDialog = useRef<HTMLDialogElement>(null);
  const [menuTargetId, setMenuTargetId] = useState<number | null>(null);

  // 2) 삭제 확인 다이얼로그
  const confirmDialog = useRef<HTMLDialogElement>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 수정 모드
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const deleteMutation = useApiMutation<{ success: boolean }, { reviewId: number }>(
    `/api/v1/posts/${postId}/reviews`,
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
        confirmDialog.current?.close();
      },
    }
  );

  const editMutation = useApiMutation<{ success: boolean }, { reviewId: number; content: string }>(
    `/api/v1/posts/${postId}/reviews`,
    'patch',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
        setEditingId(null);
        menuDialog.current?.close();
      },
    }
  );

  // ⋮ 버튼 눌렀을 때 메뉴 다이얼로그 열기
  const openMenu = (id: number, existing: string) => {
    setMenuTargetId(id);
    setEditText(existing);
    menuDialog.current?.showModal();
  };

  // 메뉴에서 “삭제하기” 선택
  const onChooseDelete = () => {
    menuDialog.current?.close();
    setDeleteTargetId(menuTargetId);
    confirmDialog.current?.showModal();
  };

  // 메뉴에서 “수정하기” 선택 → 인라인 모드로
  const onChooseEdit = () => {
    setEditingId(menuTargetId);
    menuDialog.current?.close();
  };

  if (!data?.comments) return null;
  console.log('data?.comments', data?.comments);
  return (
    <>
      <div className="flex flex-col gap-4">
        {data.comments.map(c => (
          <div key={c.id} className="relative flex flex-col rounded-lg bg-gray-50 p-4">
            {/* 상단 정보 */}
            <div className="mb-2 flex items-center gap-2">
              <Image
                className="rounded"
                alt="profile"
                width={24}
                height={24}
                src={c.images[0] || '/images/default_thumbnail.png'}
              />
              <span className="font-medium text-gray-800">{c.userNickname}</span>
              {c.createdAt && (
                <span className="ml-auto text-xs text-gray-500">
                  {dayjs(c.createdAt).format('YYYY-MM-DD')}
                </span>
              )}
              {c.isAuthor && (
                <button
                  onClick={() => openMenu(c.id, c.content)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <EllipsisVertical size={16} />
                </button>
              )}
            </div>

            {/* 내용 or 편집폼 */}
            {editingId === c.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  rows={3}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className="w-full resize-none rounded p-2 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(null)} className="flex-1 rounded border py-2">
                    취소
                  </button>
                  <button
                    onClick={() =>
                      editMutation.mutateAsync({ reviewId: c.id, content: editText.trim() })
                    }
                    disabled={!editText.trim()}
                    className="flex-1 rounded bg-blue-600 py-2 text-white disabled:opacity-50"
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap text-gray-700">{c.content}</p>
            )}
          </div>
        ))}
      </div>

      {/* 1) 메뉴 다이얼로그 */}
      <dialog
        ref={menuDialog}
        className="fixed top-1/2 left-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg"
      >
        <button
          onClick={() => menuDialog.current?.close()}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="flex flex-col divide-y divide-gray-200">
          <button onClick={onChooseEdit} className="py-3 text-center text-sm hover:bg-gray-100">
            수정하기
          </button>
          <button
            onClick={onChooseDelete}
            className="py-3 text-center text-sm text-red-600 hover:bg-gray-100"
          >
            삭제하기
          </button>
        </div>
      </dialog>

      {/* 2) 삭제 확인 다이얼로그 */}
      <dialog
        ref={confirmDialog}
        className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
      >
        <p className="mb-4 text-center text-sm text-gray-700">정말 댓글을 삭제하시겠습니까?</p>
        <div className="flex gap-2">
          <button
            onClick={() => confirmDialog.current?.close()}
            className="flex-1 rounded border border-gray-300 py-2"
          >
            취소
          </button>
          <button
            onClick={() => deleteMutation.mutateAsync({ reviewId: deleteTargetId! })}
            className="flex-1 rounded bg-red-500 py-2 text-white"
          >
            삭제
          </button>
        </div>
      </dialog>
    </>
  );
}
