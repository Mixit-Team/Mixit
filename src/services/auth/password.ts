import { apiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

interface ChangePasswordRequest {
  oldPwd: string;
  newPwd: string;
}

interface ChangePasswordResponse {
  status: {
    code: string;
    message: string;
  };
  data: null;
}

interface ChangePasswordError {
  status: number;
  message: string;
  field?: string;
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await apiClient.put<ChangePasswordResponse>('/accounts/password', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string; field?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data.message || '알 수 없는 오류가 발생했습니다.',
        field: axiosError.response.data.field,
      } as ChangePasswordError;
    }
    throw {
      status: 500,
      message: '네트워크 오류가 발생했습니다.',
    } as ChangePasswordError;
  }
};
