import React from 'react';
import PostCard from '../posts/PostCard';
import EmptyState from '../common/EmptyState';
import { PostSkeleton } from '../common/Skeleton';
import { Image as ImageIcon } from 'lucide-react';

export const ProfilePosts = ({
  posts = [],
  loading = false,
  onPostDeleted,
  onPostUpdated,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No posts published yet"
        description="This user hasn't posted anything to ConnectX yet."
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
    </div>
  );
};

export default ProfilePosts;
