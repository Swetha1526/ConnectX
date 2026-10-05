import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import { PostSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

export const PostList = ({
  posts = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  onPostDeleted,
  onPostUpdated,
  emptyTitle = 'No posts in your feed yet',
  emptyDescription = 'Follow creators, share your thoughts, or create your first post!',
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title={emptyTitle}
        description={emptyDescription}
        actionText="Create a Post"
        actionIcon={PlusCircle}
        onAction={() => navigate('/create')}
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onPostDeleted={onPostDeleted}
          onPostUpdated={onPostUpdated}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4 pb-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onLoadMore}
            isLoading={loadingMore}
          >
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostList;
