import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

export const CommentItem = ({ comment, postAuthorId, onDelete }) => {
  const { user } = useAuth();

  const isCommentAuthor =
    user && comment.author && user._id === comment.author._id;
  const isPostOwner =
    user && postAuthorId && user._id === postAuthorId;
  const canDelete = isCommentAuthor || isPostOwner;

  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800/60 last:border-0 group">
      <div className="flex items-start gap-2.5 min-w-0">
        <Avatar
          src={comment.author?.profilePicture}
          name={comment.author?.name || 'User'}
          size="sm"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {comment.author?.name}
            </span>
            <span className="text-[11px] text-gray-400">
              @{comment.author?.username}
            </span>
            <span className="text-[10px] text-gray-400">• {formatTimeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 whitespace-pre-wrap break-words">
            {comment.text}
          </p>
        </div>
      </div>

      {canDelete && (
        <button
          onClick={() => onDelete(comment._id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 rounded transition-all shrink-0"
          title="Delete Comment"
          aria-label="Delete Comment"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default CommentItem;
