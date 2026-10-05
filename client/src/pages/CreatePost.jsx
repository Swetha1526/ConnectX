import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, Send, Image as ImageIcon } from 'lucide-react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { Textarea } from '../components/common/Input';

export const CreatePost = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file (JPEG, PNG, WEBP, GIF)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toastError('Image file size exceeds 10MB limit');
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !imageFile) {
      toastError('Post must contain either a caption or an image');
      return;
    }

    try {
      setLoading(true);

      const postData = new FormData();
      if (caption.trim()) {
        postData.append('caption', caption.trim());
      }
      if (imageFile) {
        postData.append('image', imageFile);
      }

      const res = await postService.createPost(postData);
      if (res.success) {
        success('Post published successfully!');
        navigate('/');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-heading">
          Create a New Post
        </h2>
        <p className="text-xs text-gray-400">
          Share your updates, photos, or insights with the ConnectX community
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Header */}
          {user && (
            <div className="flex items-center gap-3">
              <Avatar
                src={user.profilePicture}
                name={user.name}
                size="md"
                isOnline={true}
                showStatus={true}
              />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h4>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                  @{user.username}
                </p>
              </div>
            </div>
          )}

          {/* Caption Input */}
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            maxLength={2200}
            placeholder="What's happening? Write your story, share code tips, or add hashtags..."
            className="!border-none !bg-gray-50/70 dark:!bg-dark-surface/50 !p-4 !rounded-2xl"
          />
          <div className="text-right text-[11px] text-gray-400 -mt-3">
            {caption.length} / 2200
          </div>

          {/* Image Upload Area / Preview */}
          {previewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-dark-surface max-h-96 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-auto max-h-96 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors shadow-lg"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-brand-400 bg-gray-50/50 dark:bg-dark-surface/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Click or drag & drop an image here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP, or GIF (up to 10MB)
              </p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{previewUrl ? 'Change Image' : 'Attach Image'}</span>
            </button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={!caption.trim() && !imageFile}
                icon={Send}
              >
                Publish Post
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
