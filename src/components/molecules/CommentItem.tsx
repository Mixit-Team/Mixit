import React from 'react';
import Image from '../atoms/Image';
import { timeAgo } from '@/utils/timeAgo';

export interface CommentItemProps {
  id: string;
  postImage: string;
  postTitle: string;
  comment: string;
  createdAt: Date;
}

const CommentItem: React.FC<{ item: CommentItemProps }> = React.memo(({ item }) => (
  <li className="flex items-center gap-3 border-b px-2 py-4 last:border-b-0">
    <div className="ml-2 h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-200">
      <Image src={item.postImage} alt="게시글 이미지" className="h-full w-full object-cover" />
    </div>
    <div className="ml-10 min-w-0 flex-1">
      <div className="text-md text-sm font-semibold text-gray-600">{item.postTitle}</div>
      <div className="mt-1 truncate text-sm text-gray-700">{item.comment}</div>
      <div className="mt-1 text-xs text-gray-400">{timeAgo(item.createdAt)}</div>
    </div>
  </li>
));
CommentItem.displayName = 'CommentItem';

export default CommentItem;
