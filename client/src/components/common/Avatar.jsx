import React from 'react';

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-semibold',
  xl: 'w-20 h-20 text-xl font-bold',
  '2xl': 'w-28 h-28 text-3xl font-extrabold',
};

const badgeSizeClasses = {
  xs: 'w-2 h-2 border',
  sm: 'w-2.5 h-2.5 border-[1.5px]',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-2',
  '2xl': 'w-5 h-5 border-2',
};

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  isOnline = false,
  showStatus = false,
  className = '',
  onClick,
}) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  // Convert name to deterministic gradient
  const getGradient = (str) => {
    const gradients = [
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-rose-600',
      'from-amber-500 to-orange-600',
      'from-emerald-500 to-teal-600',
      'from-cyan-500 to-blue-600',
      'from-violet-600 to-fuchsia-600',
    ];
    let hash = 0;
    for (let i = 0; i < (str || '').length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  return (
    <div
      className={`relative inline-flex shrink-0 select-none ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800`}
          onError={(e) => {
            // Fallback on broken image
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`${
            sizeClasses[size] || sizeClasses.md
          } rounded-full bg-gradient-to-br ${getGradient(
            name
          )} text-white flex items-center justify-center font-medium shadow-inner`}
        >
          {getInitials(name)}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${
            badgeSizeClasses[size] || badgeSizeClasses.md
          } ${
            isOnline
              ? 'bg-emerald-500 border-white dark:border-dark-card animate-pulse-subtle'
              : 'bg-gray-400 border-white dark:border-dark-card'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

export default Avatar;
