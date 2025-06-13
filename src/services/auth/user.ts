import { apiClient } from '@/utils/apiClient';

export const fetchUserInfo = async () => {
  const response = await apiClient.post('/users/my-page', {});
  return response.data.data;
};
