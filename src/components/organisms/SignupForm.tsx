'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import InputField from '../molecules/InputField';
import CheckboxField from '../molecules/CheckboxField';

const USER_ID_MIN_LENGTH = 4;
const NICKNAME_MIN_LENGTH = 2;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
const BIRTH_DATE_REGEX = /^\d{6}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Form Data Interface
interface SignupFormData {
  userId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthDate: string;
  email: string;
  nickname: string;
  profileImage?: FileList;
  agreements: {
    all: boolean;
    service: boolean;
    privacy: boolean;
    marketing: {
      email: boolean;
      sms: boolean;
    };
  };
}

// Validation
const validateFile = (fileList: FileList | undefined | null): string | boolean => {
  if (!fileList || fileList.length === 0) {
    return true;
  }
  const file = fileList[0];
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return '지원하지 않는 이미지 형식입니다 (jpg, png, gif, webp).';
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`;
  }
  return true;
};

// Simulate API call function
const simulateApiCheck = async (
  field: string,
  value: string
): Promise<{ isDuplicate: boolean }> => {
  console.log(`API Check Sim: Checking ${field} = ${value}`);
  await new Promise(resolve => setTimeout(resolve, 700));
  if (Math.random() < 0.1) {
    // Simulate API error
    throw new Error(`Simulated API Error for ${field}`);
  }
  return { isDuplicate: value.includes('duplicate') || Math.random() > 0.6 };
};

const SignupForm = () => {
  const router = useRouter();
  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    isSuccess?: boolean;
  }>({ title: '', message: '', isSuccess: false });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // react hook form setup
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormData>({
    mode: 'onBlur',
    defaultValues: {
      userId: '',
      password: '',
      passwordConfirm: '',
      name: '',
      birthDate: '',
      email: '',
      nickname: '',
      agreements: {
        all: false,
        service: false,
        privacy: false,
        marketing: { email: false, sms: false },
      },
    },
  });

  // --- Watched values ---
  const watchedUserId = watch('userId');
  const watchedNickname = watch('nickname');
  const profileImageFileList = watch('profileImage');
  const watchedAgreeAll = watch('agreements.all');
  const watchedAgreeService = watch('agreements.service');
  const watchedAgreePrivacy = watch('agreements.privacy');

  // Image Preview & Validation Effect
  useEffect(() => {
    let objectUrl: string | null = null;
    setImageError(null);
    clearErrors('profileImage'); // Clear form error on file change initially

    if (profileImageFileList && profileImageFileList.length > 0) {
      const file = profileImageFileList[0];
      const validationResult = validateFile(profileImageFileList);

      if (typeof validationResult === 'string') {
        setImageError(validationResult);
        setImagePreview(null);
        setError('profileImage', { type: 'manual', message: validationResult });
      } else {
        try {
          objectUrl = URL.createObjectURL(file);
          setImagePreview(objectUrl);
        } catch (error) {
          console.error('Error creating object URL:', error);
          setImageError('이미지 미리보기를 생성할 수 없습니다.');
          setImagePreview(null);
          setError('profileImage', { type: 'manual', message: '이미지 미리보기 생성 오류' });
        }
      }
    } else {
      setImagePreview(null);
    }

    // Cleanup
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profileImageFileList, setError, clearErrors]); // Removed setValue as it wasn't used here

  // Agreement Synchronization Effect
  useEffect(() => {
    const allRequiredChecked = watchedAgreeService && watchedAgreePrivacy;
    if (watchedAgreeAll !== allRequiredChecked) {
      setValue('agreements.all', allRequiredChecked, { shouldValidate: false, shouldDirty: false });
    }
  }, [watchedAgreeService, watchedAgreePrivacy, watchedAgreeAll, setValue]);

  // --- Handlers ---

  const showModal = useCallback((title: string, message: string) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // New handler for signup success confirmation
  const handleSignupSuccessConfirm = useCallback(() => {
    setIsModalOpen(false);
    router.push('/login');
  }, [router]);

  const handleCheckDuplicate = useCallback(
    async (fieldType: 'userId' | 'nickname') => {
      const value = getValues(fieldType);
      const setIsLoading = fieldType === 'userId' ? setIsCheckingUserId : setIsCheckingNickname;
      const fieldLabel = fieldType === 'userId' ? '아이디' : '닉네임';

      setIsLoading(true);
      clearErrors(fieldType);

      try {
        const { isDuplicate } = await simulateApiCheck(fieldType, value);
        if (isDuplicate) {
          const message = `사용중인 ${fieldLabel} 입니다. 다른 ${fieldLabel}를 입력해 주세요.`;
          showModal('알림', message);
          setError(fieldType, { type: 'duplicate', message: `이미 사용중인 ${fieldLabel}입니다.` });
        } else {
          showModal('알림', `사용 가능한 ${fieldLabel} 입니다.`);
          // Clear only duplicate/api errors, not length/required errors
          if (errors[fieldType]?.type === 'duplicate' || errors[fieldType]?.type === 'apiError') {
            clearErrors(fieldType);
          }
        }
      } catch (error) {
        console.error(`Error checking ${fieldType}:`, error);
        const message = `${fieldLabel} 중복 확인 중 오류가 발생했습니다.`;
        showModal('오류', message);
        setError(fieldType, { type: 'apiError', message: '중복 확인 중 오류 발생' });
      } finally {
        setIsLoading(false);
      }
    },
    [getValues, setError, clearErrors, errors, showModal]
  );

  const handleAgreeAllChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setValue('agreements.service', isChecked, { shouldValidate: true });
      setValue('agreements.privacy', isChecked, { shouldValidate: true });
      setValue('agreements.marketing.email', isChecked, { shouldValidate: false });
      setValue('agreements.marketing.sms', isChecked, { shouldValidate: false });
      setValue('agreements.all', isChecked, { shouldValidate: false });
    },
    [setValue]
  );

  const handleImageUploadClick = useCallback(() => {
    document.getElementById('profileImageInput')?.click();
  }, []);

  // password Toggle
  const togglePasswordVisibility = useCallback(() => setShowPassword(prev => !prev), []);
  const togglePasswordConfirmVisibility = useCallback(
    () => setShowPasswordConfirm(prev => !prev),
    []
  );

  // Form Submit
  const onSubmit = (data: SignupFormData) => {
    console.log('Form Submitted:', data);
    // TODO: Implement actual API submission logic here

    // Simulate success and show the modal
    setModalContent({
      title: '알림',
      message: '회원가입에 성공했습니다.\n가입한 정보로 로그인 해주세요.',
      isSuccess: true, // Mark this as the success modal
    });
    setIsModalOpen(true);
  };

  // --- Derived State for Disabling Buttons ---
  const isUserIdCheckDisabled =
    isCheckingUserId ||
    !watchedUserId ||
    watchedUserId.length < USER_ID_MIN_LENGTH ||
    !!errors.userId;
  const isNicknameCheckDisabled =
    isCheckingNickname ||
    !watchedNickname ||
    watchedNickname.length < NICKNAME_MIN_LENGTH ||
    !!errors.nickname;
  const isSubmitDisabled = isSubmitting || !isValid || !watchedAgreeService || !watchedAgreePrivacy;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5">
        {/* --- Form Fields using InputField --- */}
        <InputField
          label="아이디"
          id="userId"
          placeholder="아이디를 입력해주세요"
          registration={register('userId', {
            required: '아이디를 입력해주세요',
            minLength: {
              value: USER_ID_MIN_LENGTH,
              message: `최소 ${USER_ID_MIN_LENGTH}자 이상 입력해주세요`,
            },
          })}
          error={errors.userId}
          button={
            <Button
              type="button"
              onClick={() => handleCheckDuplicate('userId')}
              disabled={isUserIdCheckDisabled}
              isLoading={isCheckingUserId}
              variant="primary"
              className="whitespace-nowrap"
            >
              중복확인
            </Button>
          }
        />

        <InputField
          label="비밀번호"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="영문/숫자 조합 8-12자"
          registration={register('password', {
            required: '비밀번호를 입력해주세요',
            pattern: { value: PASSWORD_REGEX, message: '영문/숫자 조합 8-12자로 입력해주세요' },
          })}
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

        <InputField
          label="비밀번호 확인"
          id="passwordConfirm"
          type={showPasswordConfirm ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          registration={register('passwordConfirm', {
            required: '비밀번호를 다시 입력해주세요',
            validate: value => value === watch('password') || '비밀번호가 일치하지 않습니다',
          })}
          error={errors.passwordConfirm}
          icon={
            <button
              type="button"
              onClick={togglePasswordConfirmVisibility}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <InputField
          label="이름"
          id="name"
          placeholder="이름을 입력해 주세요"
          registration={register('name', { required: '이름을 입력해주세요' })}
          error={errors.name}
        />

        <InputField
          label="생년월일"
          id="birthDate"
          placeholder="생년월일 6자리 (940101)"
          registration={register('birthDate', {
            required: '생년월일을 입력해주세요',
            pattern: { value: BIRTH_DATE_REGEX, message: '생년월일 6자리를 입력해주세요' },
          })}
          error={errors.birthDate}
        />

        <InputField
          label="이메일"
          id="email"
          type="email"
          placeholder="이메일 입력"
          registration={register('email', {
            required: '이메일을 입력해주세요',
            pattern: { value: EMAIL_REGEX, message: '올바른 이메일 형식이 아닙니다' },
          })}
          error={errors.email}
        />

        <InputField
          label="닉네임"
          id="nickname"
          placeholder="닉네임"
          registration={register('nickname', {
            required: '닉네임을 입력해주세요',
            minLength: {
              value: NICKNAME_MIN_LENGTH,
              message: `최소 ${NICKNAME_MIN_LENGTH}자 이상 입력해주세요`,
            },
          })}
          error={errors.nickname}
          button={
            <Button
              type="button"
              onClick={() => handleCheckDuplicate('nickname')}
              disabled={isNicknameCheckDisabled}
              isLoading={isCheckingNickname}
              variant="primary"
              className="whitespace-nowrap"
            >
              중복확인
            </Button>
          }
        />

        {/* --- Profile Image Upload --- */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">프로필 사진 (선택)</label>
          <div className="mt-1 flex items-center space-x-4">
            <div
              className={`relative h-24 w-24 overflow-hidden rounded-md bg-gray-100 ${imageError || errors.profileImage ? 'border border-red-500' : ''}`}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Profile Preview" layout="fill" objectFit="cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <input
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              className="hidden"
              id="profileImageInput"
              {...register('profileImage', { validate: validateFile })}
            />
            <Button type="button" variant="secondary" onClick={handleImageUploadClick}>
              이미지 업로드
            </Button>
          </div>
          {(errors.profileImage || imageError) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.profileImage?.message || imageError}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            * 사진 용량 {MAX_FILE_SIZE_MB}MB 이하 (jpg, png, gif, webp)
          </p>
        </div>

        {/* --- Agreements using CheckboxField --- */}
        <div className="space-y-3 border-t border-gray-200 pt-6">
          <CheckboxField
            label="모든 약관에 동의합니다."
            id="agreement-all"
            checked={watchedAgreeAll}
            onChange={handleAgreeAllChange}
            labelClassName="ml-2 text-sm font-medium text-gray-900"
          />
          <div className="space-y-2 pl-6">
            <CheckboxField
              label="서비스 이용 약관 동의 (필수)"
              id="agreement-service"
              registration={register('agreements.service', { required: true })}
              error={errors.agreements?.service}
              checked={watchedAgreeService}
            />
            <CheckboxField
              label="개인정보수집 및 이용동의 (필수)"
              id="agreement-privacy"
              registration={register('agreements.privacy', { required: true })}
              error={errors.agreements?.privacy}
              checked={watchedAgreePrivacy}
            />
            <div className="pt-2">
              <label className="text-sm font-medium text-gray-700">
                이벤트 및 정보 수신 (선택)
              </label>
              <div className="mt-2 flex space-x-6 pl-0">
                <CheckboxField
                  label="이메일"
                  id="agreement-marketing-email"
                  registration={register('agreements.marketing.email')}
                />
                <CheckboxField
                  label="SMS"
                  id="agreement-marketing-sms"
                  registration={register('agreements.marketing.sms')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Display Root/Server Errors */}
        {errors.root?.serverError && (
          <p className="mt-1 text-center text-sm text-red-600">{errors.root.serverError.message}</p>
        )}

        {/* --- Submit Button --- */}
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
          className="mt-6 w-full"
          variant="primary"
        >
          회원가입
        </Button>
      </form>

      {/* --- Modal --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={modalContent.isSuccess ? handleSignupSuccessConfirm : closeModal}
        title={modalContent.title}
        message={<div className="whitespace-pre-line">{modalContent.message}</div>}
        buttonText="확인"
      />
    </>
  );
};

export default SignupForm;
