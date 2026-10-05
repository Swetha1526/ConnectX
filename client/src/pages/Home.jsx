import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import PostList from '../components/posts/PostList';
import Avatar from '../components/common/Avatar';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFeed = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await postService.getFeedPosts(pageNum, 10);
      if (res.success && res.data) {
        if (pageNum === 1) {
          setPosts(res.data.posts || []);
        } else {
          setPosts((prev) => [...prev, ...(res.data.posts || [])]);
        }
        setTotalPages(res.data.pagination?.pages || 1);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('[Home] Error fetching feed posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Create Post Header Widget */}
      {user && (
        <div
          onClick={() => navigate('/create')}
          className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:border-brand-300 dark:hover:border-brand-800 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Avatar
              src={user.profilePicture}
              name={user.name}
              size="md"
              isOnline={true}
              showStatus={true}
            />
            <div className="flex-1 bg-gray-50 dark:bg-dark-surface rounded-full px-4 py-2.5 text-xs sm:text-sm text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-dark-hover transition-colors">
              What's on your mind, {user.name.split(' ')[0]}?
            </div>
            <div className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-full transition-colors">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Main Social Feed */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 font-heading">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Your Feed
          </h2>
        </div>

        <PostList
          posts={posts}
          loading={loading}
          hasMore={page < totalPages}
          loadingMore={loadingMore}
          onLoadMore={() => fetchFeed(page + 1)}
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
        />
      </section>
    </div>
  );
};

export default Home;
