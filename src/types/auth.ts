export interface SignupFormData {
  loginId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birth: string;
  email: string;
  nickname: string;
  imageId?: string | number;
  agreements:
    | {
        all: boolean;
        service: boolean;
        privacy: boolean;
        marketing: {
          email: boolean;
          sms: boolean;
        };
      }
    | number[];
}

export interface SignupResponse {
  status: number;
  message: string;
  data: {
    id: number;
    loginId: string;
    nickname: string;
    email: string;
    createdAt: string;
  };
}

export interface SignupError {
  status: number;
  message: string;
  field?: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  loginId: string;
  name: string;
  birth: string;
  email: string;
  nickname: string;
  imageSrc: string;
}

export interface LoginError {
  status: number;
  message: string;
  field?: string;
}
