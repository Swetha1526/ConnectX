import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';

export const UserFollowModal = ({ isOpen, onClose, title, users = [] }) => {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    onClose();
    navigate(`/profile/${userId}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-surface cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.profilePicture}
                  name={user.name}
                  size="sm"
                  isOnline={user.isOnline}
                  showStatus={true}
                />
                <div>
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h5>
                  <p className="text-[11px] text-gray-400">@{user.username}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-gray-400 py-6">
            No users in this list yet.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default UserFollowModal;
