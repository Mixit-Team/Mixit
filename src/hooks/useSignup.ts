import { useMutation } from '@tanstack/react-query';
import { signup } from '@/services/auth/signup';
import { SignupFormData, SignupResponse, SignupError } from '@/types/auth';
import { useToast } from '@/hooks/useToast';

export const useSignup = () => {
  const { showToast } = useToast();

  return useMutation<SignupResponse, SignupError, SignupFormData>({
    mutationFn: signup,
    onSuccess: data => {
      showToast({
        type: 'success',
        message: data.message,
      });
    },
    onError: error => {
      showToast({
        type: 'error',
        message: error.message,
      });
    },
  });
};
