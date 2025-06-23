import { useMutation } from '@tanstack/react-query';
import { SignupFormData } from '@/types/auth';

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await fetch('/api/v1/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '회원가입에 실패했습니다.');
      }

      return result;
    },
  });
};
