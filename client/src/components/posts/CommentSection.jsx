import React, { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../common/Avatar';
import CommentItem from './CommentItem';

export const CommentSection = ({ postId, postAuthorId, onCommentCountChange }) => {
  const { user } = useAuth();
  const { error: toastError, success } = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await commentService.getPostComments(postId);
        if (res.success) {
          setComments(res.data.comments || []);
        }
      } catch (err) {
        console.error('[CommentSection] Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await commentService.createComment(postId, commentText.trim());
      if (res.success && res.data?.comment) {
        const newComments = [...comments, res.data.comment];
        setComments(newComments);
        setCommentText('');
        if (onCommentCountChange) {
          onCommentCountChange(newComments.length);
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await commentService.deleteComment(commentId);
      if (res.success) {
        const updated = comments.filter((c) => c._id !== commentId);
        setComments(updated);
        if (onCommentCountChange) {
          onCommentCountChange(updated.length);
        }
        success('Comment deleted');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
      {/* Comments List */}
      <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postAuthorId={postAuthorId}
              onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <p className="text-center text-xs text-gray-400 py-3">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Add Comment Input */}
      {user && (
        <form
          onSubmit={handleAddComment}
          className="flex items-center gap-2 pt-1"
        >
          <Avatar
            src={user.profilePicture}
            name={user.name}
            size="sm"
          />
          <div className="relative flex-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs rounded-full pl-3.5 pr-10 py-2 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-brand-600 dark:text-brand-400 disabled:opacity-40 hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-full transition-colors"
              aria-label="Submit comment"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
