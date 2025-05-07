'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '@/services/auth/login';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  loginId: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  saveId: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { handleLoginSuccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      saveId: false,
    },
  });

  // 저장된 아이디 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem('savedId');
    if (savedId) {
      setValue('loginId', savedId);
      setValue('saveId', true);
    }
  }, [setValue]);

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

        const response = await login(loginData);
        handleLoginSuccess(response);
        toast.success('로그인에 성공했습니다!');
        router.push('/');
      } catch (error) {
        const err = error as { message: string };
        toast.error(err.message || '로그인에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [router, handleLoginSuccess]
  );

  return (
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
            className="w-full rounded border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            {...register('loginId')}
          />
          {errors.loginId && <p className="mt-1 text-sm text-red-500">{errors.loginId.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
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
        <a href="#" className="hover:underline">
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
      >
        카카오로 로그인하기
      </button>
    </form>
  );
};

export default LoginForm;
