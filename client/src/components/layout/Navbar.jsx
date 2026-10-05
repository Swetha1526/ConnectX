import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../common/Avatar';

export const Navbar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xl font-black brand-gradient-text tracking-tight font-heading">
          ConnectX
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/explore')}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full" />
          )}
        </button>

        {user && (
          <Avatar
            src={user.profilePicture}
            name={user.name}
            size="sm"
            onClick={() => navigate(`/profile/${user._id}`)}
          />
        )}
      </div>
    </header>
  );
};

export default Navbar;
