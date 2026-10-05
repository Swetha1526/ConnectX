import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, UserPlus, Check } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

export const RightPanel = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await userService.getSuggestedUsers();
        if (res.success) {
          setSuggestedUsers(res.data.users || []);
        }
      } catch (err) {
        console.error('[RightPanel] Failed to fetch suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [user]);

  const handleFollowToggle = async (targetUser) => {
    const isCurrentlyFollowing = followingMap[targetUser._id];
    try {
      if (isCurrentlyFollowing) {
        await userService.unfollowUser(targetUser._id);
        setFollowingMap((prev) => ({ ...prev, [targetUser._id]: false }));
        success(`Unfollowed @${targetUser.username}`);
      } else {
        await userService.followUser(targetUser._id);
        setFollowingMap((prev) => ({ ...prev, [targetUser._id]: true }));
        success(`Following @${targetUser.username}`);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Action failed');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const trendingTopics = [
    { tag: '#MERNStack', posts: '1.2k posts' },
    { tag: '#RealTimeWeb', posts: '950 posts' },
    { tag: '#UIUXDesign', posts: '2.4k posts' },
    { tag: '#ConnectX', posts: '4.8k posts' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-80 2xl:w-96 h-screen sticky top-0 p-5 space-y-6 overflow-y-auto border-l border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-dark-card/40 backdrop-blur-md shrink-0">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search ConnectX..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-dark-card focus:outline-none transition-all"
        />
      </form>

      {/* Suggested Users */}
      {user && suggestedUsers.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 font-heading">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Suggested For You
            </h3>
            <span
              onClick={() => navigate('/explore')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            >
              See all
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {suggestedUsers.map((sUser) => {
              const isFollowing = followingMap[sUser._id];
              return (
                <div
                  key={sUser._id}
                  className="flex items-center justify-between gap-3 group"
                >
                  <div
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/profile/${sUser._id}`)}
                  >
                    <Avatar
                      src={sUser.profilePicture}
                      name={sUser.name}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
                        {sUser.name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        @{sUser.username}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isFollowing ? 'secondary' : 'primary'}
                    onClick={() => handleFollowToggle(sUser)}
                    className="!py-1 !px-2.5 !text-xs shrink-0"
                    icon={isFollowing ? Check : UserPlus}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trending Topics */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 font-heading">
          <TrendingUp className="w-4 h-4 text-pink-500" />
          Trending Topics
        </h3>

        <div className="space-y-2.5 pt-1">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => navigate(`/explore?q=${encodeURIComponent(topic.tag)}`)}
              className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-surface/60 cursor-pointer transition-colors"
            >
              <p className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {topic.tag}
              </p>
              <p className="text-[11px] text-gray-400">{topic.posts}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Copyright */}
      <div className="px-2 text-xs text-gray-400 dark:text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Help Center</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
        </div>
        <p>© 2026 ConnectX • GUVI Major Project</p>
      </div>
    </aside>
  );
};

export default RightPanel;
