'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Category } from '@/types/Home.type';
import RegisterCategory from '../organisms/Register/RegisterCategory';
import RegisterHeader from '../organisms/Register/RegisterHeader';
import RegisterTitle from '../organisms/Register/RegisterTitle';
import RegisterImages from '../organisms/Register/RegisterImages';
import RegisterTags from '../organisms/Register/RegisterTags';
import RegisterDescriptions from '../organisms/Register/RegisterDescriptions';
import { useApiMutation } from '@/hooks/useApi';
import { withAuth } from '../withAuth';

interface Params {
  category: Category;
  title: string;
  tags: string[];
  content: string;
  images: File[];
}

const DEFAULT_CATEGORY: Category = 'CAFE';

const RegisterTemplate = () => {
  const router = useRouter();
  const [params, setParams] = useState<Params>({
    category: DEFAULT_CATEGORY,
    title: '',
    images: [],
    tags: [],
    content: '',
  });

  const handleChange =
    <K extends keyof Params>(key: K) =>
    (value: Params[K]) =>
      setParams(prev => ({ ...prev, [key]: value }));

  /** 이미지 업로드 */
  const imageUploadMutate = useApiMutation<{ id: number }, FormData>('/api/v1/images', 'post');

  /** 게시글 등록 */
  const postMutate = useApiMutation<{ success: boolean; data: string }, FormData>(
    '/api/v1/posts',
    'post',
    {
      onSuccess: data => {
        router.push(`/post/${data.data}`);
      },
      onError: err => {
        // axios 에러라면 서버 메시지를, 아니면 공통 메시지를 노출
        const msg =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : '게시글 등록에 실패했습니다. 다시 시도해주세요.';
        console.error('postMutate error:', err);
        alert(msg);
      },
    },
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      /* -------- 1) 이미지 업로드 -------- */
      const imageIds: number[] = [];

      // 여러 이미지를 동시에 업로드하고, 하나라도 실패하면 곧바로 catch 로 이동
      await Promise.all(
        params.images.map(async img => {
          const fdImg = new FormData();
          fdImg.append('image', img);

          try {
            const { id } = await imageUploadMutate.mutateAsync(fdImg);
            imageIds.push(+id);
          } catch (err) {
            const msg =
              axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : '이미지 업로드에 실패했습니다. 다시 시도해주세요.';
            console.error('imageUpload error:', err);
            alert(msg);
            throw err; // 게시글 등록까지 진행하지 않도록 중단
          }
        }),
      );

      /* -------- 2) 게시글 등록 -------- */
      const fd = new FormData();
      fd.append('category', params.category);
      fd.append('title', params.title);
      params.tags.forEach(t => fd.append('tags', t));
      fd.append('content', params.content);
      imageIds.forEach(id => fd.append('imageIds', id.toString()));

      await postMutate.mutateAsync(fd);
    } catch (err) {
      // 위에서 이미 alert를 띄웠으면 여기서는 공통 예외 처리만
      if (!axios.isAxiosError(err)) {
        console.error('unknown error:', err);
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
     className="mx-auto w-full space-y-6 rounded-lg bg-white p-6 pb-[40px] md:pb-0">

    
      <RegisterHeader />
      <RegisterCategory category={params.category} onChange={handleChange('category')} />
      <RegisterTitle title={params.title} onChange={handleChange('title')} />
      <RegisterImages
        images={params.images}
        onChange={handleChange('images')}
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
        className="w-full rounded-lg bg-[#FD7A19] cursor-pointer  py-3 font-semibold text-white hover:bg-[#e06517] disabled:bg-[#F4F4F5]  disabled:text-[#C2C4C8]"
      >
        등록하기
      </button>
    </form>
  );
};

export default withAuth(RegisterTemplate);
