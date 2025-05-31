'use client';

import PostHeader from '../organisms/Post/PostHeader';
import TagContainer from '../organisms/Post/TagContainer';
import ImageSlider from '../organisms/Post/ImageSlider';
import StarRating from '../organisms/Post/StarRating';
import { useApiMutation } from '@/hooks/useApi';
import CommentInputWrapper from '../organisms/Post/CommetInputWrapper';
import { useRouter } from 'next/navigation';
import { Card } from '@/types/Home.type';
import { useSession } from 'next-auth/react';

const PostTemplate = ({ data }: { data: Card }) => {
  console.log('PostTemplate data:', data);
  const router = useRouter();
  const { status } = useSession();

  const postLikeMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${data.id}/like`,
    'post',
    {
      onSuccess: () => {
        console.log('좋아요 성공');
        router.refresh();
      },
    }
  );

  const postLikeDeleteMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${data.id}/like`,
    'delete',
    {
      onSuccess: () => {
        console.log('좋아요 취소 성공');
        router.refresh();
      },
    }
  );

  const postBookmarkMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${data.id}/bookmark`,
    'post',
    {
      onSuccess: () => {
        console.log('북마크 성공');
        router.refresh();
      },
    }
  );

  const postBookmarkDeleteMutate = useApiMutation<{ success: boolean }, void>(
    `/api/v1/posts/${data.id}/bookmark`,
    'delete',
    {
      onSuccess: () => {
        console.log('북마크 취소 성공');
        router.refresh();
      },
    }
  );

  const handleClickLike = async () => {
    if (status === 'unauthenticated') {
      alert('로그인이 필요합니다.');
      return;
    }


    if (data.hasLiked) {
      await postLikeDeleteMutate.mutateAsync();
    } else {
      await postLikeMutate.mutateAsync();
    }
  };

  const handleClickBookmark = async () => {

    if (status === 'unauthenticated') {
      alert('로그인이 필요합니다.');
      return;
    }


    if (data.hasBookmarked) {
      await postBookmarkDeleteMutate.mutateAsync();
    } else {
      await postBookmarkMutate.mutateAsync();
    }
  };

  return (
    <div className="mx-auto w-full space-y-6 rounded-lg bg-white p-6">
      <PostHeader title="게시물 상세" backHref="/home" />
      <ImageSlider images={data.images} />

      <h1 className="text-2xl font-bold">{data.title}</h1>

      <p className="whitespace-pre-wrap text-gray-700">{data.content}</p>

      <TagContainer tags={data.tags} />
      <div className="flex space-x-6 text-gray-600">
        <button
          type="button"
          className="flex items-center gap-1 transition hover:text-red-500"
          onClick={handleClickLike}
        >
          {data.hasLiked ? '❤️' : '🤍'} 좋아요 {data.likeCount}
        </button>
        <button
          type="button"
          className="flex items-center gap-1 transition hover:text-indigo-500"
          onClick={handleClickBookmark}
        >
          {data?.hasBookmarked ? '📌' : '📍'} 북마크 {data.bookmarkCount}
        </button>
      </div>
      <div className="divider" />
      <StarRating postId={+data.id} rating={data?.rating} />
      <CommentInputWrapper postId={data.id} />
    </div>
  );
};

export default PostTemplate;
