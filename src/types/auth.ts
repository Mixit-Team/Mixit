export interface SignupFormData {
  loginId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birth: string;
  email: string;
  nickname: string;
  imageId?: string | number;
  terms: number[];
  emailNotify: boolean;
  smsNotify: boolean;
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
    emailNotify: boolean;
    smsNotify: boolean;
    postLikeAlarm: boolean;
    postReviewAlarm: boolean;
    popularPostAlarm: boolean;
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
  data: LoginResponse | PromiseLike<LoginResponse>;
  token: string;
  expiresIn: number;
  loginId: string;
  name: string;
  birth: string;
  email: string;
  nickname: string;
  imageSrc: string;
  emailNotify: boolean;
  smsNotify: boolean;
  postLikeAlarm: boolean;
  postReviewAlarm: boolean;
  popularPostAlarm: boolean;
}

export interface LoginError {
  status: number;
  message: string;
  field?: string;
}
