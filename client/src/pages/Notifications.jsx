import React from 'react';
import { Bell, CheckCheck, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from '../components/notifications/NotificationItem';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 font-heading">
            <Bell className="w-6 h-6 text-brand-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 font-bold rounded-full bg-rose-500 text-white shadow-sm">
                {unreadCount} new
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Stay updated with likes, comments, mentions, and follows
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={CheckCheck}
            onClick={markAllAsRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {loading && notifications.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No notifications yet"
            description="When people like your posts, comment, or start following you, you'll see them right here!"
          />
        )}
      </div>
    </div>
  );
};

export default Notifications;
