import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { formatMessageTime } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';

export const MessageItem = ({ message, isOwnMessage, showAvatar = true }) => {
  return (
    <div
      className={`flex items-end gap-2.5 my-1.5 ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isOwnMessage && showAvatar && (
        <Avatar
          src={message.sender?.profilePicture}
          name={message.sender?.name || 'User'}
          size="xs"
          className="mb-1"
        />
      )}

      <div
        className={`max-w-[75%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm break-words shadow-sm ${
          isOwnMessage
            ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-800 rounded-bl-sm'
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div
          className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
            isOwnMessage ? 'text-brand-100' : 'text-gray-400'
          }`}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          {isOwnMessage && (
            <span>
              {message.read ? (
                <CheckCheck className="w-3.5 h-3.5 text-brand-200 inline" />
              ) : (
                <Check className="w-3.5 h-3.5 inline" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
