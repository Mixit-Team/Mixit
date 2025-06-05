// 파일 위치 예시: src/components/templates/PostEditTemplate.tsx
'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, Category } from '@/types/Home.type';
import RegisterCategory from '../organisms/Register/RegisterCategory';
import RegisterHeader from '../organisms/Register/RegisterHeader';
import RegisterTitle from '../organisms/Register/RegisterTitle';
import RegisterTags from '../organisms/Register/RegisterTags';
import RegisterDescriptions from '../organisms/Register/RegisterDescriptions';
import { useApiMutation } from '@/hooks/useApi';
import { withAuth } from '../withAuth';
import EditImages, { ExistingImage } from '../organisms/Edit/EditImages';

interface Params {
  category: Category;
  title: string;
  tags: string[];
  content: string;
  existingImages: ExistingImage[]; // 서버에서 받아온 이미지들
  newImages: File[];               // 새로 선택된 파일들
}

interface UpdatePostPayload {
  id: number;
  category: string;
  title: string;
  content: string;
  tags: string[];
  imageIds: number[];
}

const DEFAULT_CATEGORY: Category = 'CAFE';

const PostEditTemplate = ({ data }: { data: Card }) => {
  const router = useRouter();

  // 1) 상태 초기값 설정
  const [params, setParams] = useState<Params>({
    category: DEFAULT_CATEGORY,
    title: '',
    tags: [],
    content: '',
    existingImages: [],
    newImages: [],
  });

  useEffect(() => {
    if (data) {
      setParams({
        category: data.category,
        title: data.title,
        tags: data.tags,
        content: data.content ?? '',
        existingImages: data.images.map((img) => ({
          id: img.id,
          src: img.src,
        })),
        newImages: [],
      });
    }
  }, [data]);

  const removeExistingImage = (idToRemove: number) => {
    setParams((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img.id !== idToRemove),
    }));
  };

  const removeNewImage = (index: number) => {
    setParams((prev) => {
      const copy = [...prev.newImages];
      copy.splice(index, 1);
      return { ...prev, newImages: copy };
    });
  };

  const addNewImages = (files: File[]) => {
    setParams((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
  };

  // 4) 카테고리, 제목, 태그, 내용 변경 핸들러
  const handleChange =
    <K extends keyof Omit<Params, 'existingImages' | 'newImages'>>(key: K) =>
    (value: Params[K]) =>
      setParams((prev) => ({ ...prev, [key]: value }));

  // 5) 이미지 업로드용 Mutation (새로 선택된 파일들을 업로드)
  const imageUploadMutate = useApiMutation<{ id: number }, FormData>(
    '/api/v1/images',
    'post'
  );

  // 6) 게시글 수정용 Mutation
  const postUpdateMutate = useApiMutation<
      { success: boolean; data: string }, // 응답 타입
      UpdatePostPayload                  // 요청 바디 타입
    >(
      `/api/v1/posts/${data?.id}`, // 실제 엔드포인트
      'put',
      {
        onSuccess: () => {
          router.push(`/post/${data.id}`);
        },
        onError: (err) => {
          const msg =
            axios.isAxiosError(err) && err.response?.data?.error
              ? err.response.data.error
              : '게시글 수정에 실패했습니다. 다시 시도해주세요.';
          console.error('postUpdateMutate error:', err);
          alert(msg);
        },
      }
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const newImageIds: number[] = [];

      await Promise.all(
        params.newImages.map(async (file) => {
          const fd = new FormData();
          fd.append('image', file);

          try {
            const { id } = await imageUploadMutate.mutateAsync(fd);
            newImageIds.push(+id);
          } catch (err) {
            const msg =
              axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : '이미지 업로드에 실패했습니다. 다시 시도해주세요.';
            console.error('imageUpload error:', err);
            alert(msg);
            throw err;
          }
        })
      );

      /* -------- 2) 기존 이미지 ID와 새 이미지 ID 합치기 -------- */
      const existingIds = params.existingImages.map((img) => img.id);
      const allImageIds = [...existingIds, ...newImageIds];

      /* -------- 3) postUpdateMutate를 사용해 JSON 바디로 PUT 요청 -------- */
      const payload: UpdatePostPayload = {
        id: data.id,               
        category: params.category, 
        title: params.title,       
        content: params.content,   
        tags: params.tags,         
        imageIds: allImageIds,     
      };

      await postUpdateMutate.mutateAsync(payload);

    } catch (err) {
      if (!axios.isAxiosError(err)) {
        console.error('unknown error:', err);
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full space-y-6 rounded-lg bg-white p-6"
    >
      <RegisterHeader />

      <RegisterCategory
        category={params.category}
        onChange={handleChange('category')}
      />

      <RegisterTitle
        title={params.title}
        onChange={handleChange('title')}
      />

      <EditImages
        existingImages={params.existingImages}
        newImages={params.newImages}
        onExistingRemove={removeExistingImage}
        onNewRemove={removeNewImage}
        onNewAdd={addNewImages}
        maxImages={10}
      />

      <RegisterTags
        tags={params.tags}
        onChange={handleChange('tags')}
        maxTags={10}
        maxTagLength={10}
      />

      <RegisterDescriptions
        description={params.content}
        onChange={handleChange('content')}
        maxLength={5000}
      />

      <button
        type="submit"
        disabled={
          !params.category ||
          !params.title.trim() ||
          !params.content.trim() ||
          params.tags.length === 0
        }
        className="w-full rounded-lg bg-[#FD7A19] py-3 font-semibold text-white hover:bg-[#e06517] disabled:bg-[#F4F4F5] disabled:text-[#C2C4C8]"
      >
        수정하기
      </button>
    </form>
  );
};

export default withAuth(PostEditTemplate);
