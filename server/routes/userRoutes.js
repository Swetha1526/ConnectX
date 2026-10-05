const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getSuggestedUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Optional auth helper to attach req.user if token is sent
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return protect(req, res, next);
  }
  next();
};

router.get('/search', searchUsers);
router.get('/suggested', protect, getSuggestedUsers);
router.get('/:id', optionalAuth, getUserProfile);
router.put('/:id', protect, upload.single('profilePicture'), updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;
