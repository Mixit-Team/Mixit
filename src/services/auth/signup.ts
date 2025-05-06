import { SignupFormData, SignupResponse, SignupError } from '@/types/auth';
import { apiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

interface DuplicateCheckPayload {
  loginId: string | null;
  nickname: string | null;
  email: string | null;
}

interface DuplicateCheckResponse {
  status: {
    code: string;
    message: string;
  };
  data: boolean;
}

interface DuplicateCheckErrorResponse {
  status: {
    code: string;
    message: string;
  };
  data: {
    loginId?: string;
    nickname?: string;
  };
}

export const checkDuplicate = async (
  field: 'loginId' | 'nickname',
  value: string
): Promise<boolean> => {
  try {
    const payload: DuplicateCheckPayload = {
      loginId: field === 'loginId' ? value : null,
      nickname: field === 'nickname' ? value : null,
      email: null,
    };

    const response = await apiClient.post<DuplicateCheckResponse>('/accounts/duplicate', payload);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<DuplicateCheckErrorResponse>;
    if (axiosError.response) {
      const errorData = axiosError.response.data;
      const fieldError = errorData.data[field];

      throw {
        status: parseInt(errorData.status.code),
        message: fieldError || errorData.status.message || '알 수 없는 오류가 발생했습니다.',
        field: field,
      } as SignupError;
    }
    throw {
      status: 500,
      message: '네트워크 오류가 발생했습니다.',
    } as SignupError;
  }
};

export const signup = async (formData: SignupFormData): Promise<SignupResponse> => {
  try {
    const requestData = {
      loginId: formData.loginId,
      password: formData.password,
      name: formData.name,
      birth: formData.birth,
      email: formData.email,
      nickname: formData.nickname,
      imageId: formData.imageId || null,
      terms: [],
    };

    const response = await apiClient.post<SignupResponse>('/accounts', requestData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string; field?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data.message || '알 수 없는 오류가 발생했습니다.',
        field: axiosError.response.data.field,
      } as SignupError;
    }
    throw {
      status: 500,
      message: '네트워크 오류가 발생했습니다.',
    } as SignupError;
  }
};
