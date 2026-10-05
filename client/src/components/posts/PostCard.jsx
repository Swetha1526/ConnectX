import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Edit2,
  Trash2,
} from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import { postService } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../common/Avatar';
import CommentSection from './CommentSection';
import EditPostModal from './EditPostModal';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const PostCard = ({ post, onPostDeleted, onPostUpdated }) => {
  const { user } = useAuth();
  const { isUserOnline } = useSocket();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(
    user ? post.likes?.some((id) => (id._id || id) === user._id) : false
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(
    post.commentsCount !== undefined ? post.commentsCount : post.comments?.length || 0
  );
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isAuthor =
    user && post.author && (user._id === post.author._id || user._id === post.author);
  const authorOnline = isUserOnline(post.author?._id);

  const handleLikeToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (likeLoading) return;

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      setLikeLoading(true);
      const res = await postService.likePost(post._id);
      if (res.success && res.data) {
        setIsLiked(res.data.isLiked);
        setLikeCount(res.data.likeCount);
      }
    } catch (err) {
      // Revert optimistic update
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      toastError(err.response?.data?.message || 'Error updating like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      const res = await postService.deletePost(post._id);
      if (res.success) {
        success('Post deleted successfully');
        if (onPostDeleted) {
          onPostDeleted(post._id);
        }
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(postUrl);
    success('Post link copied to clipboard!');
  };

  // Format caption and highlight hashtags/mentions
  const renderFormattedCaption = (text) => {
    if (!text) return null;
    const words = text.split(/(\s+)/);
    return words.map((word, idx) => {
      if (word.startsWith('#')) {
        return (
          <span
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/explore?q=${encodeURIComponent(word)}`);
            }}
            className="text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
          >
            {word}
          </span>
        );
      }
      if (word.startsWith('@')) {
        const username = word.substring(1).replace(/[^a-zA-Z0-9_.]/g, '');
        return (
          <span
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${username}`);
            }}
            className="text-pink-600 dark:text-pink-400 font-semibold hover:underline cursor-pointer"
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  return (
    <article className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800/90 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div
          className="flex items-center gap-3 cursor-pointer group min-w-0"
          onClick={() => navigate(`/profile/${post.author?._id || post.author}`)}
        >
          <Avatar
            src={post.author?.profilePicture}
            name={post.author?.name || 'User'}
            size="md"
            isOnline={authorOnline}
            showStatus={true}
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
              {post.author?.name || 'User'}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="truncate">@{post.author?.username}</span>
              <span>•</span>
              <span className="shrink-0">{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options dropdown */}
        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
              aria-label="Post Options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-8 w-36 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-20 animate-scale-in"
                onClick={() => setShowMenu(false)}
              >
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Post
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Caption */}
      {post.caption && (
        <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-wrap leading-relaxed break-words">
          {renderFormattedCaption(post.caption)}
        </p>
      )}

      {/* Post Media */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3.5 bg-gray-100 dark:bg-dark-surface border border-gray-100 dark:border-gray-800/80 max-h-[500px] flex items-center justify-center">
          <img
            src={post.image}
            alt="Post media"
            loading="lazy"
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 text-xs font-semibold p-1.5 rounded-lg transition-colors group ${
              isLiked
                ? 'text-rose-600 dark:text-rose-500'
                : 'hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isLiked ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span>{likeCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-semibold p-1.5 rounded-lg hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
          >
            <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>{commentsCount}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-1.5 rounded-lg hover:text-gray-900 dark:hover:text-white transition-colors"
          title="Share Post"
          aria-label="Share Post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <div className="mt-3">
          <CommentSection
            postId={post._id}
            postAuthorId={post.author?._id || post.author}
            onCommentCountChange={(newCount) => setCommentsCount(newCount)}
          />
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <EditPostModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          post={post}
          onPostUpdated={(updated) => {
            if (onPostUpdated) onPostUpdated(updated);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Post"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this post? This action cannot be undone and will permanently delete the post and its comments.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeletePost}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </article>
  );
};

export default PostCard;
