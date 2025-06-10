'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getProviders, signIn, ClientSafeProvider } from 'next-auth/react';
import Modal from '../atoms/Modal';
import { useRouter } from 'next/navigation';
const loginSchema = z.object({
  loginId: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  saveId: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      saveId: false,
    },
  });

  // 페이지 진입 시 폼 초기화
  useEffect(() => {
    reset();
  }, [reset]);

  // 저장된 아이디 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem('savedId');
    if (savedId) {
      setValue('loginId', savedId);
      setValue('saveId', true);
    }
  }, [setValue]);

  useEffect(() => {
    getProviders().then(prov => {
      setProviders(prov);
    });
  }, []);

  const handleKakaoLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      window.location.href = 'http://54.180.33.96:8080/api/v1/auth/kakao';
    } catch (error) {
      console.error('Kakao login error:', error);
      setErrorMessage('카카오 로그인 중 오류가 발생했습니다.');
      setIsModalOpen(true);
      setIsLoading(false);
    } finally {
      router.push('/home');
    }
  }, [router]);

  const onSubmit: SubmitHandler<LoginFormData> = useCallback(
    async data => {
      try {
        setIsLoading(true);
        const { saveId, ...loginData } = data;

        // 아이디 저장 처리
        if (saveId) {
          localStorage.setItem('savedId', loginData.loginId);
        } else {
          localStorage.removeItem('savedId');
        }
        if (!providers) {
          throw new Error('Authentication providers not available');
        }
        const result = await signIn(providers.credentialProvider.id, {
          redirect: false,
          id: loginData.loginId,
          password: loginData.password,
          callbackUrl: '/home',
        });

        if (result?.error) {
          setErrorMessage(result.error);
          setIsModalOpen(true);
          return;
        }

        if (result?.ok) {
          toast.success('로그인에 성공했습니다!');
          reset(); // 로그인 성공 시 폼 초기화
          window.location.href = '/home';
        }
      } catch (error) {
        // NextAuth 에러가 아닌 다른 에러(예: 네트워크 오류) 처리
        console.error('Unexpected error:', error);
        setErrorMessage('서버 연결에 실패했습니다.\n잠시 후 다시 시도해주세요.');
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [providers, reset]
  );

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="contents-center flex min-h-screen flex-col items-center justify-start gap-6 pt-50"
      >
        {/* Logo */}
        <div className="text-5xl font-bold">
          <span className="text-black">mix</span>
          <span className="text-orange-500">i</span>
          <span className="text-pink-500">t</span>
        </div>
        <p className="text-md pb-10 text-center text-gray-600">
          요즘 뜨는 꿀조합부터
          <br />
          나만의 비밀 조합까지 믹스잇!
        </p>

        {/* Form Fields */}
        <div className="w-full space-y-4 pt-20">
          <div>
            <input
              type="text"
              placeholder="아이디"
              maxLength={12}
              className="w-full rounded border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
              {...register('loginId')}
            />
            {errors.loginId && (
              <p className="mt-1 text-sm text-red-500">{errors.loginId.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              maxLength={12}
              className="w-full rounded border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Save ID Checkbox */}
        <div className="flex w-full items-center justify-start">
          <input
            type="checkbox"
            id="saveId"
            className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            {...register('saveId')}
          />
          <label htmlFor="saveId" className="ml-2 text-sm text-gray-600">
            아이디 저장
          </label>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-md bg-orange-500 py-3.5 font-semibold text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '로그인 중...' : '로그인하기'}
        </button>

        {/* Links */}
        <div className="text-center text-sm text-gray-500">
          <a href="/find-account" className="hover:underline">
            아이디 / 비밀번호 찾기
          </a>
          <span className="mx-2">|</span>
          <a href="/signup" className="hover:underline">
            회원가입
          </a>
        </div>

        {/* Kakao Login Button */}
        <button
          type="button"
          className="mt-4 w-full cursor-pointer rounded-md border border-white bg-yellow-400 py-3.5 text-white hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:outline-none"
          onClick={handleKakaoLogin}
        >
          카카오로 로그인하기
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="로그인 오류"
        message={errorMessage}
      />
    </>
  );
};

export default LoginForm;
