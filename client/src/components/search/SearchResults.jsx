import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { UserCardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { Search } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

export const SearchResults = ({ users = [], loading = false, query = '' }) => {
  const navigate = useNavigate();
  const { isUserOnline } = useSocket();

  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        <UserCardSkeleton />
        <UserCardSkeleton />
        <UserCardSkeleton />
      </div>
    );
  }

  if (query && users.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No users found"
        description={`We couldn't find any users matching "${query}". Try searching with a different name or username.`}
      />
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {users.map((user) => {
        const online = isUserOnline(user._id);
        return (
          <div
            key={user._id}
            onClick={() => navigate(`/profile/${user._id}`)}
            className="flex items-center justify-between p-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-800 cursor-pointer transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <Avatar
                src={user.profilePicture}
                name={user.name}
                size="md"
                isOnline={online}
                showStatus={true}
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                  {user.name}
                </h4>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium truncate">
                  @{user.username}
                </p>
                {user.bio && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1 max-w-sm">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right text-xs text-gray-400 shrink-0">
              <span>{user.followers?.length || 0} followers</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;
