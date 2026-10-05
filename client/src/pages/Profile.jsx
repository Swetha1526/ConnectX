import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfilePosts from '../components/profile/ProfilePosts';
import { PostSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { UserX } from 'lucide-react';

export const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingProfile(true);
      setError(null);
      const res = await userService.getUserProfile(id);
      if (res.success && res.data?.user) {
        setProfileUser(res.data.user);

        // Fetch user posts
        setLoadingPosts(true);
        const postsRes = await postService.getUserPosts(res.data.user._id);
        if (postsRes.success) {
          setUserPosts(postsRes.data.posts || []);
        }
      }
    } catch (err) {
      console.error('[Profile] Error loading user profile:', err);
      setError(err.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoadingProfile(false);
      setLoadingPosts(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loadingProfile) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse" />
        <PostSkeleton />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <EmptyState
        icon={UserX}
        title="User Not Found"
        description="The profile you are looking for does not exist or has been removed."
        actionText="Back to Feed"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        profileUser={profileUser}
        onFollowChange={(isNowFollowing) => {
          setProfileUser((prev) => ({
            ...prev,
            isFollowing: isNowFollowing,
            followers: isNowFollowing
              ? [...(prev.followers || []), {}]
              : (prev.followers || []).slice(0, -1),
          }));
        }}
      />

      {/* User's Posts Section */}
      <section className="space-y-4">
        <h3 className="text-base font-black text-gray-900 dark:text-white font-heading">
          Posts ({userPosts.length})
        </h3>

        <ProfilePosts
          posts={userPosts}
          loading={loadingPosts}
          onPostDeleted={(deletedId) => {
            setUserPosts((prev) => prev.filter((p) => p._id !== deletedId));
            setProfileUser((prev) => ({
              ...prev,
              postsCount: Math.max(0, (prev.postsCount || 1) - 1),
            }));
          }}
          onPostUpdated={(updated) => {
            setUserPosts((prev) =>
              prev.map((p) => (p._id === updated._id ? updated : p))
            );
          }}
        />
      </section>
    </div>
  );
};

export default Profile;
