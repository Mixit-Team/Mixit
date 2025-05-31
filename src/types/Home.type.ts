export type Category = 'CAFE' | 'RESTAURANT' | 'CONVENIENCE' | 'OTHER';
export const categories: Category[] = ['CAFE', 'RESTAURANT', 'CONVENIENCE', 'OTHER'];

export interface ImageType {
  src: string;
  id: number;
}

export interface Card {
  id: number;
  title: string;
  userId: string;
  category: Category;
  description?: string;
  content?: string;
  images: ImageType[];
  rating: {
    averageRating: number;
    ratingCount: number;
  };
  likes: number;
  tags: string[];
  bookmarkCount: number;
  defaultImage?: string;
  viewCount: number;
  likeCount: number;
  hasLiked: boolean;
  hasBookmarked?: boolean;
  isAuthor: boolean;
  authorProfileImage: string | null;
  comments: {
    id: string;
    content: string;
  };
}

export interface Comment {
  id: number;
  userId: number;
  userNickname: string;
  content: string;
  createdAt: string;
  modifiedAt: string;
  images: ImageType[];
  isAuthor: boolean;
  userProfileImage?: string | null;
}
