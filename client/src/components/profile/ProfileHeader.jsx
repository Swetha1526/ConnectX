import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3,
  UserPlus,
  UserCheck,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import UserFollowModal from './UserFollowModal';

export const ProfileHeader = ({ profileUser, onFollowChange }) => {
  const { user: currentUser } = useAuth();
  const { isUserOnline } = useSocket();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(profileUser.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(
    profileUser.followers?.length || 0
  );
  const [followLoading, setFollowLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'followers' | 'following' | null

  const isOwnProfile =
    currentUser &&
    (currentUser._id === profileUser._id ||
      currentUser.username === profileUser.username);

  const onlineStatus = isUserOnline(profileUser._id);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (followLoading) return;

    try {
      setFollowLoading(true);
      if (isFollowing) {
        await userService.unfollowUser(profileUser._id);
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
        success(`Unfollowed @${profileUser.username}`);
        if (onFollowChange) onFollowChange(false);
      } else {
        await userService.followUser(profileUser._id);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        success(`Following @${profileUser.username}`);
        if (onFollowChange) onFollowChange(true);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error updating follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleStartChat = () => {
    navigate(`/chat/${profileUser._id}`);
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Banner / Avatar & Actions */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar
            src={profileUser.profilePicture}
            name={profileUser.name}
            size="xl"
            isOnline={onlineStatus}
            showStatus={true}
            className="ring-4 ring-brand-50 dark:ring-brand-950/40"
          />

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white font-heading">
                {profileUser.name}
              </h2>
              {onlineStatus ? (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Online
                </span>
              ) : (
                <span className="text-[11px] text-gray-400">
                  {profileUser.lastSeen
                    ? `Active ${formatTimeAgo(profileUser.lastSeen)}`
                    : 'Offline'}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              @{profileUser.username}
            </p>

            {profileUser.createdAt && (
              <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-gray-400 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {formatTimeAgo(profileUser.createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isOwnProfile ? (
            <Button
              variant="outline"
              size="md"
              icon={Edit3}
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant={isFollowing ? 'secondary' : 'primary'}
                size="md"
                icon={isFollowing ? UserCheck : UserPlus}
                onClick={handleFollowToggle}
                isLoading={followLoading}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>

              <Button
                variant="outline"
                size="md"
                icon={MessageSquare}
                onClick={handleStartChat}
              >
                Message
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bio */}
      {profileUser.bio && (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl text-center sm:text-left">
          {profileUser.bio}
        </p>
      )}

      {/* Social Stats Row */}
      <div className="flex items-center justify-around sm:justify-start gap-8 sm:gap-12 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
        <div>
          <span className="block text-xl font-black text-gray-900 dark:text-white font-heading">
            {profileUser.postsCount !== undefined ? profileUser.postsCount : 0}
          </span>
          <span className="text-xs font-medium text-gray-400">Posts</span>
        </div>

        <button
          onClick={() => setModalType('followers')}
          className="hover:opacity-80 transition-opacity text-center cursor-pointer"
        >
          <span className="block text-xl font-black text-gray-900 dark:text-white font-heading">
            {followersCount}
          </span>
          <span className="text-xs font-medium text-gray-400">Followers</span>
        </button>

        <button
          onClick={() => setModalType('following')}
          className="hover:opacity-80 transition-opacity text-center cursor-pointer"
        >
          <span className="block text-xl font-black text-gray-900 dark:text-white font-heading">
            {profileUser.following?.length || 0}
          </span>
          <span className="text-xs font-medium text-gray-400">Following</span>
        </button>
      </div>

      {/* Followers / Following Modal */}
      {modalType && (
        <UserFollowModal
          isOpen={Boolean(modalType)}
          onClose={() => setModalType(null)}
          title={modalType === 'followers' ? 'Followers' : 'Following'}
          users={
            modalType === 'followers'
              ? profileUser.followers || []
              : profileUser.following || []
          }
        />
      )}
    </div>
  );
};

export default ProfileHeader;
