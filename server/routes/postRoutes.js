const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeedPosts,
  getExplorePosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
} = require('../controllers/postController');
const {
  getPostComments,
  createComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Optional auth helper
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .get(optionalAuth, getFeedPosts)
  .post(protect, upload.single('image'), createPost);

router.get('/explore', optionalAuth, getExplorePosts);
router.get('/user/:userId', optionalAuth, getUserPosts);

router.route('/:id')
  .get(optionalAuth, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/like', protect, likePost);

// Nested comment routes on post
router.route('/:postId/comments')
  .get(optionalAuth, getPostComments)
  .post(protect, createComment);

module.exports = router;
