import { atom } from 'recoil';
import { SignupFormData } from '@/types/auth';

export const signupFormState = atom<SignupFormData>({
  key: 'signupFormState',
  default: {
    loginId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    birth: '',
    email: '',
    nickname: '',
    agreements: {
      all: false,
      service: false,
      privacy: false,
      marketing: {
        email: false,
        sms: false,
      },
    },
  },
});

export const signupStepState = atom<number>({
  key: 'signupStepState',
  default: 1,
});
