import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, UserPlus, MessageCircle } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';

export const NotificationItem = ({ notification, onMarkRead }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case 'LIKE':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'COMMENT':
        return <MessageSquare className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />;
      case 'FOLLOW':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-500" />;
      case 'MESSAGE':
        return <MessageCircle className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.read && onMarkRead) {
      onMarkRead(notification._id);
    }

    if (notification.type === 'MESSAGE') {
      navigate(`/chat/${notification.sender?._id}`);
    } else if (notification.type === 'FOLLOW') {
      navigate(`/profile/${notification.sender?._id}`);
    } else if (notification.post) {
      const postId = notification.post._id || notification.post;
      navigate(`/?post=${postId}`);
    } else if (notification.sender) {
      navigate(`/profile/${notification.sender._id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start justify-between gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-150 border ${
        !notification.read
          ? 'bg-brand-50/70 dark:bg-brand-950/30 border-brand-200/60 dark:border-brand-900/40 shadow-sm'
          : 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-800/80 hover:bg-gray-50 dark:hover:bg-dark-surface/60'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="relative">
          <Avatar
            src={notification.sender?.profilePicture}
            name={notification.sender?.name || 'User'}
            size="md"
          />
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-dark-card shadow">
            {getIcon()}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-snug break-words">
            <span className="font-bold text-gray-900 dark:text-white">
              {notification.sender?.name || 'Someone'}
            </span>{' '}
            {notification.message || 'interacted with your profile'}
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
      </div>

      {!notification.read && (
        <span className="w-2.5 h-2.5 bg-brand-600 rounded-full shrink-0 mt-1.5 ring-2 ring-brand-200 dark:ring-brand-900" />
      )}
    </div>
  );
};

export default NotificationItem;
