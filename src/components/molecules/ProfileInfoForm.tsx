'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import InputField from './InputField';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';
import { toast } from 'react-hot-toast';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

// Validation constants
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 10;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface ProfileInfoFormData {
  userId: string;
  oldPwd: string;
  newPwd: string;
  name: string;
  birthdate: string;
  email: string;
  nickname: string;
  imageId: string | number | null;
  emailNotify: boolean;
  smsNotify: boolean;
  postLikeAlarm: boolean;
  postReviewAlarm: boolean;
  popularPostAlarm: boolean;
}

interface ProfileInfoFormProps {
  initialData: Partial<ProfileInfoFormData> & { imageSrc?: string };
  onSave: (data: ProfileInfoFormData) => void;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ initialData, onSave }) => {
  const router = useRouter();
  const { update } = useSession();
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(initialData.imageSrc || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalType, setModalType] = useState<'duplicate' | 'delete'>('duplicate');

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
    setValue,
  } = useForm<ProfileInfoFormData>({
    mode: 'onChange',
    defaultValues: {
      userId: initialData.userId || '',
      oldPwd: '',
      newPwd: '',
      name: initialData.name || '',
      birthdate: initialData.birthdate || '',
      email: initialData.email || '',
      nickname: initialData.nickname || '',
      imageId: initialData.imageSrc || null,
      emailNotify: initialData.emailNotify || false,
      smsNotify: initialData.smsNotify || false,
      postLikeAlarm: initialData.postLikeAlarm || false,
      postReviewAlarm: initialData.postReviewAlarm || false,
      popularPostAlarm: initialData.popularPostAlarm || false,
    },
  });

  const watchedUserId = watch('userId');
  const watchedNickname = watch('nickname');
  const watchedOldPwd = watch('oldPwd');

  const handleCheckDuplicate = useCallback(
    async (field: 'userId' | 'nickname') => {
      const value = field === 'userId' ? watchedUserId : watchedNickname;
      if (!value) return;

      if (field === 'nickname') {
        setIsCheckingNickname(true);
        clearErrors(field);

        try {
          const response = await fetch('/api/v1/accounts/duplicate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nickname: value,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw {
              status: data.status,
              message: data.message,
              field: data.field,
            };
          }

          setModalType('duplicate');
          if (data.data) {
            setError(field, {
              type: 'duplicate',
              message: '이미 사용중인 닉네임입니다.',
            });
            setModalContent({
              title: '중복 확인',
              message: '이미 사용중인 닉네임입니다.',
            });
            setIsModalOpen(true);
          } else {
            setModalContent({
              title: '중복 확인',
              message: '사용 가능한 닉네임입니다.',
            });
            setIsModalOpen(true);
          }
        } catch (error) {
          console.error(`Error checking ${field}:`, error);
          const err = error as { message: string };
          setError(field, {
            type: 'validate',
            message: err.message || '확인 중 오류가 발생했습니다.',
          });
          toast.error(err.message || '확인 중 오류가 발생했습니다.');
        } finally {
          setIsCheckingNickname(false);
        }
      }
    },
    [watchedUserId, watchedNickname, setError, clearErrors]
  );

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일 타입 확인
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WEBP만 가능)');
      setError('imageId', { type: 'manual', message: '지원하지 않는 이미지 형식입니다.' });
      return;
    }

    // 파일 크기 제한
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`);
      setError('imageId', {
        type: 'manual',
        message: `파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`,
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/v1/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();

      // 이미지 ID 설정 및 폼 상태 업데이트
      setValue('imageId', data.id, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      clearErrors('imageId');

      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      toast.error(error instanceof Error ? error.message : '프로필 이미지 업로드에 실패했습니다.');
      setError('imageId', { type: 'manual', message: '프로필 이미지 업로드에 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setValue('imageId', null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearErrors('imageId');
  };

  const onSubmit = useCallback(
    async (data: ProfileInfoFormData) => {
      setIsLoading(true);
      try {
        // 비밀번호가 변경된 경우에만 비밀번호 변경 API 호출
        if (data.oldPwd && data.newPwd) {
          const passwordResponse = await fetch('/api/v1/accounts/password', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              oldPwd: data.oldPwd,
              newPwd: data.newPwd,
            }),
          });

          if (!passwordResponse.ok) {
            const errorData = await passwordResponse.json();
            throw new Error(errorData.error || '비밀번호 변경에 실패했습니다.');
          }

          toast.success('비밀번호가 성공적으로 변경되었습니다.');
        }

        // 프로필 정보 업데이트
        const profileResponse = await fetch('/api/v1/users/my-page', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nickname: data.nickname,
            imageId: data.imageId,
            emailNotify: data.emailNotify,
            smsNotify: data.smsNotify,
            postLikeAlarm: data.postLikeAlarm,
            postReviewAlarm: data.postReviewAlarm,
            popularPostAlarm: data.popularPostAlarm,
          }),
        });

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.error || '프로필 수정에 실패했습니다.');
        }

        const responseData = await profileResponse.json();

        // 응답 데이터 검증
        if (!responseData.data || !responseData.data.nickname) {
          throw new Error('프로필 정보가 올바르게 반환되지 않았습니다.');
        }

        toast.success('프로필이 성공적으로 업데이트되었습니다.');

        // 세션 정보 갱신
        if (update) {
          await update({
            user: {
              nickname: responseData.data.nickname,
              emailNotify: responseData.data.emailNotify ?? false,
              smsNotify: responseData.data.smsNotify ?? false,
              postLikeAlarm: responseData.data.postLikeAlarm ?? false,
              postReviewAlarm: responseData.data.postReviewAlarm ?? false,
              popularPostAlarm: responseData.data.popularPostAlarm ?? false,
              image: profileImage || '', // 이미지가 없는 경우 빈 문자열로 설정
            },
          });
        }

        await onSave(data);
      } catch (error) {
        console.error('Error saving profile:', error);
        const err = error as { message: string };
        toast.error(err.message || '프로필 저장 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [onSave, update, profileImage]
  );

  const handleDeleteAccount = async () => {
    setModalType('delete');
    setModalContent({
      title: '회원 탈퇴',
      message: '정말로 탈퇴하시겠습니까?\n탈퇴한 계정은 복구할 수 없습니다.',
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch('/api/v1/accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '회원 탈퇴에 실패했습니다.');
      }

      toast.success('회원 탈퇴가 완료되었습니다.');

      // 로그아웃 처리
      await signOut({ redirect: false });

      // 홈으로 리다이렉트
      router.push('/home');
    } catch (error) {
      console.error('회원 탈퇴 오류:', error);
      toast.error(
        error instanceof Error ? error.message : '회원 탈퇴 처리 중 오류가 발생했습니다.'
      );
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const isOldPwdFilled = !!watch('oldPwd');
  const isNewPwdFilled = !!watch('newPwd');
  const hasFieldError =
    !!errors.oldPwd ||
    !!errors.newPwd ||
    !!errors.nickname ||
    !!errors.imageId ||
    (isOldPwdFilled && !isNewPwdFilled);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col space-y-5 pb-[80px]">
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
          id="oldPwd"
          type="password"
          placeholder="현재 비밀번호 확인"
          registration={register('oldPwd', {
            validate: value => {
              if (value === '') return true;
              if (!PASSWORD_REGEX.test(value)) return '영문/숫자 조합 8-12자로 입력해주세요.';
              return true;
            },
          })}
          error={errors.oldPwd}
          onChange={e => {
            register('oldPwd').onChange(e);
            if (e.target.value === '') {
              clearErrors('oldPwd');
            }
          }}
        />

        {/* New password field */}
        <InputField
          label="비밀번호 변경"
          id="newPwd"
          type="password"
          placeholder="새 비밀번호"
          registration={register('newPwd', {
            pattern: {
              value: PASSWORD_REGEX,
              message: '영문/숫자 조합 8-12자로 입력해주세요.',
            },
            validate: value => {
              if (!value) return true;
              if (value === watchedOldPwd) {
                return '현재 비밀번호와 다른 비밀번호를 입력해주세요';
              }
              return true;
            },
          })}
          error={errors.newPwd}
        />

        {/* Name */}
        <InputField
          label="이름"
          id="name"
          placeholder="이름을 입력해주세요"
          registration={register('name', { required: '이름을 입력해주세요' })}
          error={errors.name}
          readOnly
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
          readOnly
        />

        {/* Email */}
        <InputField
          label="이메일"
          id="email"
          type="email"
          placeholder="이메일 입력"
          readOnly
          registration={register('email', {
            required: '이메일을 입력해주세요',
            pattern: {
              value: EMAIL_REGEX,
              message: '올바른 이메일 형식이 아닙니다',
            },
          })}
        />

        {/* Nickname with duplicate check */}
        <InputField
          label="닉네임"
          id="nickname"
          placeholder="닉네임"
          registration={register('nickname', {
            required: '닉네임을 입력해주세요',
            minLength: {
              value: NICKNAME_MIN_LENGTH,
              message: `닉네임은 최소 ${NICKNAME_MIN_LENGTH}자 이상이어야 합니다`,
            },
            maxLength: {
              value: NICKNAME_MAX_LENGTH,
              message: `닉네임은 최대 ${NICKNAME_MAX_LENGTH}자까지 가능합니다`,
            },
          })}
          error={errors.nickname}
          button={
            <Button
              type="button"
              onClick={() => handleCheckDuplicate('nickname')}
              disabled={
                isCheckingNickname ||
                !watchedNickname ||
                watchedNickname.length < NICKNAME_MIN_LENGTH ||
                watchedNickname.length > NICKNAME_MAX_LENGTH
              }
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
          <div className="mt-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="relative inline-block">
              <button
                type="button"
                className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-md bg-gray-200 transition-colors hover:bg-gray-300 ${
                  errors.imageId ? 'border border-red-500' : ''
                }`}
                onClick={handleProfileImageClick}
                disabled={isLoading}
              >
                {profileImage ? (
                  <NextImage
                    src={profileImage}
                    alt="프로필 이미지"
                    fill
                    sizes="96px"
                    className="object-cover"
                    priority
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <ImageIcon size={32} className="text-gray-400" />
                )}
                {isLoading && (
                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </button>
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            {errors.imageId && (
              <p className="mt-1 text-sm text-red-600">{errors.imageId.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              * 사진 용량 {MAX_FILE_SIZE_MB}MB 이하 (jpg, png, gif, webp)
            </p>
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
                {...register('emailNotify')}
              />
              <span className="ml-2 text-sm text-gray-700">이메일</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                {...register('smsNotify')}
              />
              <span className="ml-2 text-sm text-gray-700">SNS</span>
            </label>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-medium text-gray-700">게시물 알림 설정</h3>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                {...register('postLikeAlarm')}
              />
              <span className="ml-2 text-sm text-gray-700">좋아요</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                {...register('postReviewAlarm')}
              />
              <span className="ml-2 text-sm text-gray-700">댓글</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                {...register('popularPostAlarm')}
              />
              <span className="ml-2 text-sm text-gray-700">인기게시물 추천</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleDeleteAccount}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            회원탈퇴
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={hasFieldError || !isValid || isLoading}
          >
            등록
          </Button>
        </div>
      </form>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        message={modalContent.message}
        buttonText={modalType === 'duplicate' ? '확인' : '탈퇴하기'}
        onConfirm={modalType === 'duplicate' ? closeModal : handleConfirmDelete}
        cancelText={modalType === 'delete' ? '취소' : undefined}
        isLoading={isDeleting}
      />
    </>
  );
};

export default ProfileInfoForm;
