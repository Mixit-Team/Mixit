import { apiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

interface UploadImageResponse {
  status: {
    code: string;
    message: string;
  };
  data: {
    id: string | number;
    url: string;
  };
}

interface UploadImageError {
  status: number;
  message: string;
}

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post<UploadImageResponse>('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data.message || '이미지 업로드 중 오류가 발생했습니다.',
      } as UploadImageError;
    }
    throw {
      status: 500,
      message: '네트워크 오류가 발생했습니다.',
    } as UploadImageError;
  }
};
