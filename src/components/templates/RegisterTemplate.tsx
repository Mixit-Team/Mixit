'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/Home.type';
import RegisterCategory from '../organisms/Register/RegisterCategory';
import RegisterHeader from '../organisms/Register/RegisterHeader';
import RegisterTitle from '../organisms/Register/RegisterTitle';
import RegisterImages from '../organisms/Register/RegisterImages';
import RegisterTags from '../organisms/Register/RegisterTags';
import RegisterDescriptions from '../organisms/Register/RegisterDescriptions';
import { useApiMutation } from '@/hooks/useApi';

interface Params {
  category: Category;
  title: string;
  tags: string[];
  content: string;
  images: File[];
}

const DEFAULT_CATEGORY: Category = 'CAFE';

export default function RegisterTemplate() {
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

  const imageUploadMutate = useApiMutation<{ id: number }, FormData>('/api/v1/images', 'post');

  const postMutate = useApiMutation<{ success: boolean; data: string }, FormData>(
    '/api/v1/posts',
    'post',
    {
      onSuccess: data => {
        router.push(`/post/${data?.data}`);
        console.log('postMutate data', data);
      },
    }
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const imageIds: number[] = [];
      for (const img of params.images) {
        const fdImg = new FormData();
        fdImg.append('image', img);
        const { id } = await imageUploadMutate.mutateAsync(fdImg);
        imageIds.push(+id);
      }

      const fd = new FormData();
      fd.append('category', params.category);
      fd.append('title', params.title);
      params.tags.forEach(t => fd.append('tags', t));
      fd.append('content', params.content);
      imageIds.forEach(id => fd.append('imageIds', id.toString()));

      await postMutate.mutateAsync(fd);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full space-y-6 rounded-lg bg-white p-6">
      <RegisterHeader />
      <RegisterCategory category={params.category} onChange={handleChange('category')} />
      <RegisterTitle title={params.title} onChange={handleChange('title')} />
      <RegisterImages images={params.images} onChange={handleChange('images')} maxImages={10} />
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

      {/* {isError && (
        <p className="text-red-500 text-center">
          {(error as Error).message || '등록 중 오류가 발생했습니다.'}
        </p>
      )} */}

      <button
        type="submit"
        disabled={!params.category || !params.title || !params.content || params.tags.length === 0}
        className="w-full rounded-lg bg-[#FD7A19] py-3 font-semibold text-white hover:bg-[#e06517] disabled:bg-[#F4F4F5] disabled:text-[#C2C4C8]"
      >
        등록하기
      </button>
    </form>
  );
}
