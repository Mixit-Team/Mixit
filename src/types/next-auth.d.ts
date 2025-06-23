import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    provider?: string;
    key?: string;
    birth?: string;
    accessToken?: string;
    expiresIn?: number;
    nickname?: string;
    emailNotify?: boolean;
    smsNotify?: boolean;
    postLikeAlarm?: boolean;
    postReviewAlarm?: boolean;
    popularPostAlarm?: boolean;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      provider?: string;
      key?: string;
      birth?: string;
      accessToken?: string;
      expiresIn?: number;
      nickname?: string;
      emailNotify?: boolean;
      smsNotify?: boolean;
      postLikeAlarm?: boolean;
      postReviewAlarm?: boolean;
      popularPostAlarm?: boolean;
    };
  }
}
