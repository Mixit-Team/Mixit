import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signup } from '@/services/auth/signup';
import { SignupFormData, SignupResponse, SignupError } from '@/types/auth';
import { useToast } from '@/hooks/useToast';

export const useSignup = () => {
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation<SignupResponse, SignupError, SignupFormData>({
    mutationFn: signup,
    onSuccess: data => {
      showToast({
        type: 'success',
        message: data.message,
      });
      router.push('/login');
    },
    onError: error => {
      showToast({
        type: 'error',
        message: error.message,
      });
    },
  });
};
