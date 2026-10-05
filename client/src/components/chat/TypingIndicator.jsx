import React from 'react';

export const TypingIndicator = ({ typingUser }) => {
  if (!typingUser) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 italic animate-fade-in">
      <span>{typingUser.name || typingUser.username || 'User'} is typing</span>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default TypingIndicator;
