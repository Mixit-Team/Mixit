import React from 'react';
import CommentItem, { CommentItemProps } from '../molecules/CommentItem';

interface CommentListProps {
  comments: CommentItemProps[];
}

const CommentList: React.FC<CommentListProps> = React.memo(({ comments }) => (
  <ul className="divide-y divide-gray-100 rounded-lg bg-white shadow-sm">
    {comments.map(item => (
      <CommentItem key={item.id} item={item} />
    ))}
  </ul>
));
CommentList.displayName = 'CommentList';

export default CommentList;
