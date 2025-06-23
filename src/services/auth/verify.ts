import { apiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

interface VerifyResponse {
  status: {
    code: string;
    message: string;
  };
  data: null;
}

interface VerifyError {
  status: number;
  message: string;
}

export const verifyUser = async (password: string): Promise<VerifyResponse> => {
  try {
    const response = await apiClient.post<VerifyResponse>('/users/my-page', { password });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data.message || '인증에 실패했습니다.',
      } as VerifyError;
    }
    throw {
      status: 500,
      message: '네트워크 오류가 발생했습니다.',
    } as VerifyError;
  }
};
