'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import InputField from './InputField';
import Button from '../atoms/Button';

interface ProfileAuthFormData {
  userId: string;
  password: string;
}

interface ProfileAuthFormProps {
  onAuthenticated: () => void;
  userId?: string; // Pre-filled user ID (optional)
}

const ProfileAuthForm: React.FC<ProfileAuthFormProps> = ({ onAuthenticated, userId = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileAuthFormData>({
    mode: 'onChange',
    defaultValues: {
      userId,
      password: '',
    },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: ProfileAuthFormData) => {
      setIsLoading(true);
      setAuthError(null);

      try {
        // Simulate API call to verify credentials
        console.log('Verifying credentials:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate successful authentication (in real app, you'd check the response)
        if (Math.random() > 0.2) {
          onAuthenticated();
        } else {
          // Simulate authentication failure
          setAuthError('비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setAuthError('인증 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    },
    [onAuthenticated]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col space-y-5">
      <InputField
        label="아이디"
        id="userId"
        registration={register('userId', { required: '아이디를 입력해주세요' })}
        error={errors.userId}
        readOnly={!!userId}
      />

      <InputField
        label="비밀번호"
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호를 입력해주세요"
        registration={register('password', { required: '비밀번호를 입력해주세요' })}
        error={errors.password}
        icon={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      {authError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          <p>{authError}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        disabled={!isValid || isLoading}
        className="mt-6"
      >
        인증하기
      </Button>
    </form>
  );
};

export default ProfileAuthForm;
