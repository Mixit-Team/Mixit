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

  const menuDialog = useRef<HTMLDialogElement>(null);
  const [menuTargetId, setMenuTargetId] = useState<number | null>(null);

  const confirmDialog = useRef<HTMLDialogElement>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const deleteMutation = useApiMutation<{ success: boolean }, { reviewId: number }>(
    `/api/v1/posts/${postId}/reviews`,
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['comments', postId],
        });
        confirmDialog.current?.close();
      },
    }
  );

  const editMutation = useApiMutation<{ success: boolean }, { reviewId: number; content: string }>(
    `/api/v1/posts/${postId}/reviews`,
    'patch',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['comments', postId],
        });
        setEditingId(null);
        menuDialog.current?.close();
      },
    }
  );

  const openMenu = (id: number, existing: string) => {
    setMenuTargetId(id);
    setEditText(existing);
    menuDialog.current?.showModal();
  };

  const onChooseDelete = () => {
    menuDialog.current?.close();
    setDeleteTargetId(menuTargetId);
    confirmDialog.current?.showModal();
  };

  const onChooseEdit = () => {
    setEditingId(menuTargetId);
    menuDialog.current?.close();
  };

  if (!data?.comments) return null;
  console.log('data?.comments', data?.comments);
  return (
    <>
      <div className="flex flex-col gap-4">
        <div>댓글 {data.comments.length ?? 0}</div>
        {data.comments.length === 0 && (
          <div className="relative flex h-[80px] items-center justify-center rounded-lg p-4 text-center">
            첫 번째 댓글을 남겨주세요!
          </div>
        )}
        {data.comments.length > 0 &&
          data.comments.map(c => (
            <div key={c.id} className="relative flex flex-col rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Image
                  className="rounded"
                  alt="profile"
                  width={24}
                  height={24}
                  src={c?.userProfileImage ?? '/images/default_thumbnail.png'}
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
          

              {editingId === c.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    rows={3}
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full resize-none rounded p-2 focus:outline-none"
                  />
                  <div className="ml-auto flex w-64 gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 cursor-pointer rounded border border-[#FD7A19] py-2 text-[#FD7A19] hover:opacity-70"
                    >
                      취소
                    </button>
                    <button
                      onClick={() =>
                        editMutation.mutateAsync({ reviewId: c.id, content: editText.trim() })
                      }
                      disabled={!editText.trim()}
                      className="flex-1 cursor-pointer rounded bg-[#FD7A19] py-2 text-white hover:opacity-70 disabled:opacity-50"
                    >
                      댓글 수정
                    </button>
                  </div>
                </div>
              ) : (
                  <div>

                    <p className="mt-2 whitespace-pre-wrap text-gray-700">{c.content}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                {/* {data.hasLiked ? '❤️' : '🤍'} 좋아요 {data.likeCount} */}
                    </div>
                  </div>
              )}
              <div>
                {c.images && c.images.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {c.images.map((img, idx) => (
                      <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg">
                        <Image
                          src={img.src}
                          alt={`comment-image-${idx}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
          className="absolute top-2 right-2 cursor-pointer p-1 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="flex flex-col divide-y divide-gray-200">
          <button
            onClick={onChooseEdit}
            className="cursor-pointer py-3 text-center text-sm hover:bg-gray-100"
          >
            수정하기
          </button>
          <button
            onClick={onChooseDelete}
            className="cursor-pointer py-3 text-center text-sm hover:bg-gray-100"
          >
            삭제하기
          </button>
        </div>
      </dialog>

      <dialog
        ref={confirmDialog}
        className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
      >
        <p className="mb-4 text-center text-sm text-gray-700">정말 댓글을 삭제하시겠습니까?</p>
        <div className="flex gap-2">
          <button
            onClick={() => confirmDialog.current?.close()}
            className="flex-1 cursor-pointer rounded border border-[#FD7A19] py-2 text-[#FD7A19] hover:opacity-70"
          >
            취소
          </button>
          <button
            onClick={() => deleteMutation.mutateAsync({ reviewId: deleteTargetId! })}
            className="flex-1 cursor-pointer rounded bg-[#FD7A19] py-2 text-white hover:opacity-70 disabled:opacity-50"
          >
            확인
          </button>
        </div>
      </dialog>
    </>
  );
}
