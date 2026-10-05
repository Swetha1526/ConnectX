import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={`w-full bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl border transition-all duration-200 text-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20'
          } ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-xs font-medium text-rose-500 mt-0.5">{error}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  className = '',
  rows = 3,
  id,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        className={`w-full bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl border transition-all duration-200 text-sm p-3.5 focus:outline-none focus:ring-2 resize-none ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20'
        } ${className}`}
        {...props}
      />

      {error && <p className="text-xs font-medium text-rose-500 mt-0.5">{error}</p>}
    </div>
  );
};

export default Input;
