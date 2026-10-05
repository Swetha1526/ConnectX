import React from 'react';
import { formatTimeAgo } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';
import { useSocket } from '../../context/SocketContext';

export const ConversationList = ({
  conversations = [],
  activeUserId,
  onSelectConversation,
  loading = false,
}) => {
  const { isUserOnline } = useSocket();

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <div className="w-24 h-3.5 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-40 h-2.5 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-gray-400">
        No conversations yet. Start a chat from a user profile or search!
      </div>
    );
  }

  return (
    <div className="overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
      {conversations.map(({ user, lastMessage, unreadCount }) => {
        const isActive = activeUserId === user._id;
        const online = isUserOnline(user._id);

        return (
          <div
            key={user._id}
            onClick={() => onSelectConversation(user)}
            className={`flex items-center justify-between p-3.5 sm:p-4 cursor-pointer transition-all duration-150 ${
              isActive
                ? 'bg-brand-50 dark:bg-brand-950/40 border-l-4 border-brand-500'
                : 'hover:bg-gray-50 dark:hover:bg-dark-surface/50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                src={user.profilePicture}
                name={user.name}
                size="md"
                isOnline={online}
                showStatus={true}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </h5>
                  {lastMessage?.createdAt && (
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {formatTimeAgo(lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 max-w-[170px] sm:max-w-[200px]">
                  {lastMessage?.text || 'No messages yet'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-brand-600 text-white rounded-full shrink-0 ml-2">
                {unreadCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
