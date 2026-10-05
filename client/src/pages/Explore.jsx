import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Users, Sparkles, Flame } from 'lucide-react';
import { postService } from '../services/postService';
import { userService } from '../services/userService';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import PostList from '../components/posts/PostList';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialQuery ? 'users' : 'trending');

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch explore / popular posts
  useEffect(() => {
    const fetchExplore = async () => {
      try {
        setPostsLoading(true);
        const res = await postService.getExplorePosts(1, 20);
        if (res.success && res.data) {
          setPosts(res.data.posts || []);
        }
      } catch (err) {
        console.error('[Explore] Error fetching explore posts:', err);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchExplore();
  }, []);

  // Search users with debounce
  const executeSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchedUsers([]);
      return;
    }
    try {
      setUsersLoading(true);
      const res = await userService.searchUsers(query.trim());
      if (res.success && res.data) {
        setSearchedUsers(res.data.users || []);
      }
    } catch (err) {
      console.error('[Explore] Search error:', err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        executeSearch(searchQuery);
        setSearchParams({ q: searchQuery.trim() });
        setActiveTab('users');
      } else {
        setSearchedUsers([]);
        setSearchParams({});
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery, executeSearch, setSearchParams]);

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 font-heading">
            <Compass className="w-6 h-6 text-brand-500" />
            Explore ConnectX
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Discover popular posts, tech creators, and emerging topics
          </p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'trending'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          Trending Posts
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Find People {searchedUsers.length > 0 && `(${searchedUsers.length})`}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'trending' ? (
        <PostList
          posts={posts}
          loading={postsLoading}
          emptyTitle="No trending posts yet"
          emptyDescription="Check back soon as new stories get shared!"
        />
      ) : (
        <SearchResults
          users={searchedUsers}
          loading={usersLoading}
          query={searchQuery}
        />
      )}
    </div>
  );
};

export default Explore;
