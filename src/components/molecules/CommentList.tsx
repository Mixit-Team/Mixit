'use client';

import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { Comment } from '@/types/Home.type';
import dayjs from 'dayjs';
import Image from 'next/image';
import { EllipsisVertical, ImageIcon, X } from 'lucide-react';
import {  useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const MAX_EDIT_IMAGES = 10;

export default function CommentList({ postId }: { postId: number }) {
  const queryClient = useQueryClient();
  const { status } = useSession();  

  // 댓글 목록 가져오기
  const { data } = useApiQuery<{ comments: Comment[] }>(
    ['comments', postId],
    `/api/v1/posts/${postId}/reviews`
  );

  // 메뉴 다이얼로그(UI)
  const menuDialog = useRef<HTMLDialogElement>(null);
  const [menuTargetId, setMenuTargetId] = useState<number | null>(null);

  // 삭제 확인 다이얼로그(UI)
  const confirmDialog = useRef<HTMLDialogElement>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // “수정 모드” 진입한 댓글 ID
  const [editingId, setEditingId] = useState<number | null>(null);
  // 수정하는 텍스트
  const [editText, setEditText] = useState<string>('');

  // 수정 모드에서 “기존 이미지” 목록 (Comment.images 형식으로 내려온다고 가정)
  // 실제 Comment.type에서 images의 구조를 { id: number; src: string } 형태라고 가정합니다.
  const [existingImages, setExistingImages] = useState<{ id: number; src: string }[]>([]);

  // 수정 모드에서 “새롭게 첨부할 파일(File[])” 및 “미리보기 URL”
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // 댓글 삭제 API (DELETE /api/v1/posts/{postId}/reviews?reviewId=XXX)
  const deleteMutation = useApiMutation<{ success: boolean }, { reviewId: number }>(
    `/api/v1/posts/${postId}/reviews`,
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        confirmDialog.current?.close();
      },
    }
  );

  const editMutation = useApiMutation<{ success: boolean }, { reviewId: number; content: string; images: number[] }>(
    `/api/v1/posts/${postId}/reviews`,
    'patch',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        setEditingId(null);
        menuDialog.current?.close();
      },
    }
  );

  const { mutateAsync: uploadImage } = useApiMutation<{ success: boolean; id: string }, FormData>(
    '/api/v1/images',
    'post'
  );

  const likeMutation = useApiMutation<void, { reviewId: number }>(
    `/api/v1/posts/${postId}/reviews/like`,
    'post',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
      },
    }
  );

  // unlike: DELETE /api/v1/posts/{postId}/reviews/like?reviewId={reviewId}
  const unlikeMutation = useApiMutation<void, { reviewId: number }>(
    `/api/v1/posts/${postId}/reviews/like`,
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
      },
    }
  );
  const openMenu = (id: number, existingContent: string, existingImgs: { id: number; src: string }[]) => {
    setMenuTargetId(id);
    setEditText(existingContent);
    setExistingImages(existingImgs);
    setEditingId(null); 
    menuDialog.current?.showModal();
  };

  const onChooseEdit = () => {
    setEditingId(menuTargetId);
    menuDialog.current?.close();
  };

  const onChooseDelete = () => {
    menuDialog.current?.close();
    setDeleteTargetId(menuTargetId);
    confirmDialog.current?.showModal();
  };

  const onConfirmDelete = () => {
    if (deleteTargetId == null) return;
    deleteMutation.mutateAsync({ reviewId: deleteTargetId });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
    setExistingImages([]);
    setNewFiles([]);
    setNewPreviews([]);
  };

  const removeExistingImage = (imgId: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== imgId));
  };

  const handleNewFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArr = Array.from(e.target.files);
    const allowedCount = MAX_EDIT_IMAGES - existingImages.length - newFiles.length;
    if (allowedCount <= 0) {
      // 더 추가 불가
      return;
    }
    const sliced = filesArr.slice(0, allowedCount);
    setNewFiles(prev => [...prev, ...sliced]);
    e.target.value = '';
  };

  // newFiles가 바뀔 때마다 미리보기 URL 생성/해제
  useEffect(() => {
    const urls = newFiles.map(file => URL.createObjectURL(file));
    setNewPreviews(urls);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newFiles]);


  //  const handleClickLike = async () => {
  //   if (status === 'unauthenticated') {
  //     alert('로그인이 필요합니다.');
  //     return;
  //   }


   


  // 수정 완료 버튼: 이미지 업로드 → editMutation 호출
  const submitEdit = async (reviewId: number) => {
    try {
      // 1) 새로 추가한 파일(newFiles)을 서버에 업로드하고, ID 배열 받아오기
      const newImageIds: number[] = [];
      for (const file of newFiles) {
        const form = new FormData();
        form.append('image', file);
        const res = await uploadImage(form); // { id: string }
        newImageIds.push(Number(res.id));
      }

      // 2) 최종적으로 남을 이미지 ID 배열 = 기존(existingImages)의 ID + 새로 업로드된 ID
      const remainingImageIds = existingImages.map(img => img.id).concat(newImageIds);

      // 3) editMutation 호출
      await editMutation.mutateAsync({
        reviewId,
        content: editText.trim(),
        images: remainingImageIds,
      });

      // 4) 내부 상태 초기화 (onSuccess 콜백에서도 일부 처리)
      setEditText('');
      setExistingImages([]);
      setNewFiles([]);
      setNewPreviews([]);
    } catch (error) {
      console.error('댓글 수정 중 에러:', error);
    }
  };

  if (!data?.comments) return null;

  console.log('댓글 목록:', data.comments);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>댓글 {data.comments.length}</div>

        {data.comments.length === 0 && (
          <div className="relative flex h-[80px] items-center justify-center rounded-lg p-4 text-center">
            첫 번째 댓글을 남겨주세요!
          </div>
        )}

        {data.comments.length > 0 &&
          data.comments.map((c) => {
            const isEditing = editingId === c.id;
            return (
              <div key={c.id} className="relative flex flex-col rounded-lg bg-gray-50 p-4">
                {/* 댓글 헤더: 프로필, 닉네임, 날짜, 메뉴 버튼 */}
                <div className="mb-2 flex items-center gap-2">
                  <Image
                    className="rounded"
                    alt="profile"
                    width={24}
                    height={24}
                    src={c.userProfileImage ?? '/images/default_thumbnail.png'}
                  />
                  <span className="font-medium text-gray-800">{c.userNickname}</span>
                  {c.createdAt && (
                    <span className="ml-auto text-xs text-gray-500">
                      {dayjs(c.createdAt).format('YYYY-MM-DD')}
                    </span>
                  )}
                  {c.isAuthor && !isEditing && (
                    <button
                      onClick={() => openMenu(c.id, c.content, c.images)}
                      className="rounded p-1 cursor-pointer hover:bg-gray-100"
                    >
                      <EllipsisVertical size={16} />
                    </button>
                  )}
          
                </div>

                {/* 수정 모드인지 일반 모드인지 분기 */}
                {isEditing ? (
                  // ───── 수정 모드 UI ─────
                  <div className="flex flex-col gap-4">
                    {/* 1) 수정할 텍스트 영역 */}
                    <textarea
                      rows={3}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full resize-none rounded border p-2 focus:outline-none"
                    />

                    {/* 2) 기존 이미지 목록 (기존 이미지 삭제 가능) */}
                    {existingImages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {existingImages.map((img) => (
                          <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-lg">
                            <Image src={img.src} alt={`edit-prev-${img.id}`} fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(img.id)}
                              className="absolute top-1 right-1 rounded-full bg-white p-1 shadow hover:bg-gray-100"
                            >
                              <X className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer rounded border px-3 py-1 text-sm hover:bg-gray-100">
                        <ImageIcon className="h-5 w-5 text-gray-500" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleNewFileChange}
                        />
                      </label>
                      <span className="text-sm text-gray-500">
                        총 {existingImages.length + newFiles.length}/{MAX_EDIT_IMAGES}개
                      </span>
                    </div>

                    {newPreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newPreviews.map((src, idx) => (
                          <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg">
                            <Image src={src} alt={`new-preview-${idx}`} fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() =>
                                setNewFiles((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="absolute top-1 right-1 rounded-full bg-white p-1 shadow hover:bg-gray-100"
                            >
                              <X className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="ml-auto flex w-64 gap-2">
                      <button
                        onClick={cancelEditing}
                        className="flex-1 cursor-pointer rounded border border-[#FD7A19] py-2 text-[#FD7A19] hover:opacity-70"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => submitEdit(c.id)}
                        disabled={!editText.trim()}
                        className="flex-1 cursor-pointer rounded bg-[#FD7A19] py-2 text-white hover:opacity-70 disabled:opacity-50"
                      >
                        댓글 수정
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col gap-2'>
                    <p className="mt-2 whitespace-pre-wrap text-gray-700">{c.content}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                    </div>

                    {c.images && c.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
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
                    <div className='ml-auto  flex items-center gap-1 text-sm text-gray-500'>
                        <span onClick={async () => {
                          if (status === 'unauthenticated') {
                            alert('로그인이 필요합니다.');
                            return;
                          }
                          
                          if (c.hasLiked) {
                            unlikeMutation.mutateAsync({ reviewId: c.id });
                          } else {
                            likeMutation.mutateAsync({ reviewId: c.id });
                          }
                        }} className='text-xs text-gray-400 cursor-pointer'>
                          {c.hasLiked ? '❤️' : '🤍'} 좋아요
                        </span>
                        {c.likeCount}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

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
        <p className="mb-4 text-center text-sm text-gray-700">
          정말 댓글을 삭제하시겠습니까?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => confirmDialog.current?.close()}
            className="flex-1 cursor-pointer rounded border border-[#FD7A19] py-2 text-[#FD7A19] hover:opacity-70"
          >
            취소
          </button>
          <button
            onClick={onConfirmDelete}
            className="flex-1 cursor-pointer rounded bg-[#FD7A19] py-2 text-white hover:opacity-70 disabled:opacity-50"
          >
            확인
          </button>
        </div>
      </dialog>
    </>
  );
}
