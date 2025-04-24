'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Image as ImageIcon } from 'lucide-react';
import InputField from './InputField';
import Button from '../atoms/Button';

interface ProfileInfoFormData {
  userId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthdate: string;
  email: string;
  nickname: string;
  preferences: {
    notifications: {
      email: boolean;
      sns: boolean;
    };
    gameSettings: {
      autoLogin: boolean;
      friendsOnly: boolean;
      inGameMessageAllow: boolean;
    };
  };
}

interface ProfileInfoFormProps {
  initialData: Partial<ProfileInfoFormData>;
  onSave: (data: ProfileInfoFormData) => void;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ initialData, onSave }) => {
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kakaoToken, setKakaoToken] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid, isDirty },
  } = useForm<ProfileInfoFormData>({
    mode: 'onChange',
    defaultValues: {
      userId: initialData.userId || '',
      password: '',
      passwordConfirm: '',
      name: initialData.name || '',
      birthdate: initialData.birthdate || '',
      email: initialData.email || '',
      nickname: initialData.nickname || '',
      preferences: {
        notifications: {
          email: false,
          sns: false,
        },
        gameSettings: {
          autoLogin: false,
          friendsOnly: false,
          inGameMessageAllow: false,
        },
      },
    },
  });

  const watchedUserId = watch('userId');
  const watchedNickname = watch('nickname');
  const watchedPassword = watch('password');

  const handleCheckDuplicate = useCallback(
    async (field: 'userId' | 'nickname') => {
      const value = field === 'userId' ? watchedUserId : watchedNickname;
      if (!value) return;

      if (field === 'nickname') {
        setIsCheckingNickname(true);
        clearErrors(field);

        try {
          await new Promise(resolve => setTimeout(resolve, 800));

          const isDuplicate = Math.random() > 0.7;

          if (isDuplicate) {
            setError(field, {
              type: 'duplicate',
              message: '이미 사용중인 닉네임입니다.',
            });
          } else {
            console.log(`${field} is available`);
          }
        } catch (error) {
          console.error(`Error checking ${field}:`, error);
          setError(field, {
            type: 'validate',
            message: '확인 중 오류가 발생했습니다.',
          });
        } finally {
          setIsCheckingNickname(false);
        }
      }
    },
    [watchedUserId, watchedNickname, setError, clearErrors]
  );

  const handleConnectionToggle = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      if (kakaoToken) {
        setKakaoToken('');
        console.log('Disconnected SNS account');
      } else {
        setKakaoToken('sample-token-' + Math.random().toString(36).substring(2, 10));
        console.log('Connected SNS account');
      }
    } catch (error) {
      console.error('Error toggling connection:', error);
    } finally {
      setIsLoading(false);
    }
  }, [kakaoToken]);

  const onSubmit = useCallback(
    async (data: ProfileInfoFormData) => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSave(data);
      } catch (error) {
        console.error('Error saving profile:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [onSave]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col space-y-5 pb-4">
      {/* User Id (readOnly가 되어야할듯) */}
      <InputField
        label="아이디"
        id="userId"
        registration={register('userId')}
        error={errors.userId}
        readOnly
      />

      {/* Current password check field */}
      <InputField
        label="현재 비밀번호"
        id="currentPassword"
        type="password"
        placeholder="현재 비밀번호 확인"
        registration={register('password', {
          required: '현재 비밀번호를 입력해주세요',
        })}
        error={errors.password}
      />

      {/* New password field */}
      <InputField
        label="비밀번호 변경"
        id="newPassword"
        type="password"
        placeholder="비밀번호 변경"
        registration={register('passwordConfirm', {
          validate: value => !value || value === watchedPassword || '비밀번호가 일치하지 않습니다',
        })}
        error={errors.passwordConfirm}
      />

      {/* Name */}
      <InputField
        label="이름"
        id="name"
        placeholder="이름을 입력해주세요"
        registration={register('name', { required: '이름을 입력해주세요' })}
        error={errors.name}
      />

      {/* Birthdate */}
      <InputField
        label="생년월일"
        id="birthdate"
        placeholder="생년월일 6자리 (940101)"
        registration={register('birthdate', {
          required: '생년월일을 입력해주세요',
          pattern: {
            value: /^\d{6}$/,
            message: '생년월일 6자리를 입력해주세요',
          },
        })}
        error={errors.birthdate}
      />

      {/* Email */}
      <InputField
        label="이메일"
        id="email"
        type="email"
        placeholder="이메일 입력"
        registration={register('email', {
          required: '이메일을 입력해주세요',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: '올바른 이메일 형식이 아닙니다',
          },
        })}
        error={errors.email}
      />

      {/* Nickname with duplicate check */}
      <InputField
        label="닉네임"
        id="nickname"
        placeholder="닉네임"
        registration={register('nickname', {
          required: '닉네임을 입력해주세요',
          minLength: {
            value: 2,
            message: '닉네임은 최소 2자 이상이어야 합니다',
          },
        })}
        error={errors.nickname}
        button={
          <Button
            type="button"
            onClick={() => handleCheckDuplicate('nickname')}
            disabled={isCheckingNickname || !watchedNickname || watchedNickname.length < 2}
            isLoading={isCheckingNickname}
            variant="primary"
            className="whitespace-nowrap"
          >
            중복확인
          </Button>
        }
      />

      {/* Profile Image upload (optional) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">프로필 사진</label>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <ImageIcon size={20} className="text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">프로필 이미지</span>
          </div>
          <Button type="button" variant="secondary" size="sm">
            수정하기
          </Button>
        </div>
      </div>

      {/* SNS Account Connection */}
      <div className="pt-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">SNS 계정 연결 관리</h3>
        <div className="flex w-full items-center">
          <input
            type="text"
            className="mr-2 flex-grow rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-400"
            placeholder="카카오톡"
            readOnly
            value={kakaoToken ? '연결됨' : ''}
          />
          <Button
            type="button"
            variant={kakaoToken ? 'outline' : 'primary'}
            size="sm"
            onClick={handleConnectionToggle}
            className={kakaoToken ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}
          >
            {kakaoToken ? '해제/연결' : '연결하기'}
          </Button>
        </div>
      </div>

      {/* 약관 알림 */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-medium text-gray-700">이벤트 및 정보 수신 (선택)</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              {...register('preferences.notifications.email')}
            />
            <span className="ml-2 text-sm text-gray-700">이메일</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              {...register('preferences.notifications.sns')}
            />
            <span className="ml-2 text-sm text-gray-700">SNS</span>
          </label>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-medium text-gray-700">게시물 알림 설정</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              {...register('preferences.gameSettings.autoLogin')}
            />
            <span className="ml-2 text-sm text-gray-700">좋아요</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              {...register('preferences.gameSettings.friendsOnly')}
            />
            <span className="ml-2 text-sm text-gray-700">댓글</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              {...register('preferences.gameSettings.inGameMessageAllow')}
            />
            <span className="ml-2 text-sm text-gray-700">인기게시물 추천</span>
          </label>
        </div>
      </div>

      <div className="flex justify-between space-x-4 pt-6">
        <Button type="button" variant="outline" fullWidth onClick={() => window.history.back()}>
          회원탈퇴
        </Button>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!isDirty || !isValid || isLoading}
        >
          등록
        </Button>
      </div>
    </form>
  );
};

export default ProfileInfoForm;
