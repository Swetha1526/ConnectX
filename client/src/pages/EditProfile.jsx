import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Save, User, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Input, { Textarea } from '../components/common/Input';

export const EditProfile = () => {
  const { user, updateCurrentUser } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastError('Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      setError('Name and username are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const submissionData = new FormData();
      submissionData.append('name', formData.name.trim());
      submissionData.append('username', formData.username.trim().toLowerCase());
      submissionData.append('bio', formData.bio.trim());

      if (selectedFile) {
        submissionData.append('profilePicture', selectedFile);
      }

      const res = await userService.updateUserProfile(user._id, submissionData);
      if (res.success && res.data?.user) {
        updateCurrentUser(res.data.user);
        success('Profile updated successfully!');
        navigate(`/profile/${res.data.user._id}`);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to update profile';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white font-heading">
            Edit Profile
          </h2>
          <p className="text-xs text-gray-400">
            Customize your public presence on ConnectX
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* Profile Picture Upload & Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar
                src={previewUrl}
                name={formData.name || 'User'}
                size="xl"
                className="ring-4 ring-brand-100 dark:ring-brand-950/40"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Camera}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
              <p className="text-[11px] text-gray-400">
                JPG, PNG, WEBP up to 5MB. Square recommended.
              </p>
            </div>
          </div>

          {/* Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Username"
              type="text"
              name="username"
              icon={AtSign}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Bio */}
          <Textarea
            label="Bio (Max 250 characters)"
            name="bio"
            rows={4}
            maxLength={250}
            placeholder="Tell the community about yourself, your interests, and your projects..."
            value={formData.bio}
            onChange={handleChange}
          />
          <div className="text-right text-[11px] text-gray-400 -mt-4">
            {formData.bio.length} / 250 characters
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              icon={Save}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
