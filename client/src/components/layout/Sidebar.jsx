import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  PlusSquare,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../common/Avatar';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Create Post', path: '/create', icon: PlusSquare },
    { label: 'Messages', path: '/chat', icon: MessageSquare },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      label: 'Profile',
      path: user ? `/profile/${user._id}` : '/login',
      icon: User,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-800 p-5 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div
        className="flex items-center gap-3 px-2 py-3 mb-6 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black brand-gradient-text tracking-tight font-heading">
            ConnectX
          </h1>
          <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 -mt-1">
            Real-Time Social Media
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-200/50 dark:border-brand-800/40 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full shadow-sm animate-pulse">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      {user && (
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-dark-surface/50 border border-gray-100 dark:border-gray-800">
            <div
              className="flex items-center gap-3 cursor-pointer overflow-hidden flex-1 mr-2"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              <Avatar
                src={user.profilePicture}
                name={user.name}
                size="sm"
                isOnline={true}
                showStatus={true}
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  @{user.username}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
