import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Textarea } from '../common/Input';
import { postService } from '../../services/postService';
import { useToast } from '../../context/ToastContext';

export const EditPostModal = ({ isOpen, onClose, post, onPostUpdated }) => {
  const { success, error: toastError } = useToast();
  const [caption, setCaption] = useState(post?.caption || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await postService.updatePost(post._id, { caption });
      if (res.success && res.data?.post) {
        success('Post updated successfully');
        if (onPostUpdated) {
          onPostUpdated(res.data.post);
        }
        onClose();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          placeholder="Update your post caption..."
        />

        {post?.image && (
          <div className="rounded-xl overflow-hidden max-h-48 border border-gray-200 dark:border-gray-800">
            <img
              src={post.image}
              alt="Post preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPostModal;
