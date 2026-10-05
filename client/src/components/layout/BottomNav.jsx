import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, MessageSquare, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const BottomNav = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-dark-card/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-3 py-2 flex items-center justify-around shadow-lg">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `p-2 rounded-xl flex flex-col items-center transition-colors ${
            isActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`
        }
        aria-label="Home"
      >
        <Home className="w-5 h-5" />
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) =>
          `p-2 rounded-xl flex flex-col items-center transition-colors ${
            isActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`
        }
        aria-label="Explore"
      >
        <Compass className="w-5 h-5" />
      </NavLink>

      <NavLink
        to="/create"
        className="p-1.5 -mt-4 rounded-full bg-gradient-to-r from-brand-600 to-pink-500 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Create Post"
      >
        <PlusCircle className="w-7 h-7" />
      </NavLink>

      <NavLink
        to="/chat"
        className={({ isActive }) =>
          `relative p-2 rounded-xl flex flex-col items-center transition-colors ${
            isActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`
        }
        aria-label="Messages"
      >
        <MessageSquare className="w-5 h-5" />
      </NavLink>

      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `relative p-2 rounded-xl flex flex-col items-center transition-colors ${
            isActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`
        }
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-dark-card" />
        )}
      </NavLink>

      {user && (
        <NavLink
          to={`/profile/${user._id}`}
          className={({ isActive }) =>
            `p-2 rounded-xl flex flex-col items-center transition-colors ${
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
            }`
          }
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
        </NavLink>
      )}
    </nav>
  );
};

export default BottomNav;
