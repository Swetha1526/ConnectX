import React from 'react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'There is nothing to display here right now.',
  actionText,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white/50 dark:bg-dark-card/50 border border-dashed border-gray-200 dark:border-gray-800 ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 ring-8 ring-brand-50/50 dark:ring-brand-950/20">
          <Icon className="w-8 h-8" />
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
        {title}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1 mb-6">
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction} icon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
