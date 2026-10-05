const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const { processImageUpload } = require('../middleware/uploadMiddleware');

// @desc    Get user profile by ID or username
// @route   GET /api/users/:id
// @access  Public (or Private)
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query;

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { username: id.toLowerCase() };
    }

    const user = await User.findOne(query)
      .populate('followers', '_id name username profilePicture isOnline')
      .populate('following', '_id name username profilePicture isOnline');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const postsCount = await Post.countDocuments({ author: user._id });

    const isFollowing = req.user
      ? user.followers.some(
          (follower) => follower._id.toString() === req.user._id.toString()
        )
      : false;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          postsCount,
          isFollowing,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this profile',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, username, bio, profilePicture } = req.body;

    if (username && username.trim().toLowerCase() !== user.username) {
      const cleanUsername = username.trim().toLowerCase();
      const existingUser = await User.findOne({ username: cleanUsername });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
      }
      user.username = cleanUsername;
    }

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();

    // Handle file upload if provided
    if (req.file) {
      const uploadedUrl = await processImageUpload(req.file, 'avatars');
      user.profilePicture = uploadedUrl;
    } else if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isAlreadyFollowing = currentUser.following.includes(targetUserId);

    if (isAlreadyFollowing) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user',
      });
    }

    // Add to following and followers
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    // Create Notification for target user
    await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'FOLLOW',
      message: `${currentUser.name} (@${currentUser.username}) started following you`,
    });

    return res.status(200).json({
      success: true,
      message: `You are now following ${targetUser.name}`,
      data: {
        isFollowing: true,
        followersCount: targetUser.followers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
const unfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot unfollow yourself',
      });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.status(200).json({
      success: true,
      message: `You unfollowed ${targetUser.name}`,
      data: {
        isFollowing: false,
        followersCount: targetUser.followers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users by name or username
// @route   GET /api/users/search
// @access  Public (or Private)
const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.status(200).json({
        success: true,
        data: { users: [] },
      });
    }

    const regex = new RegExp(query.trim(), 'i');

    const users = await User.find({
      $or: [{ username: regex }, { name: regex }],
    })
      .select('_id name username profilePicture bio followers following isOnline lastSeen')
      .limit(20);

    return res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested users
// @route   GET /api/users/suggested
// @access  Private
const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    const excludeIds = [currentUserId, ...(currentUser?.following || [])];

    const suggestedUsers = await User.find({
      _id: { $nin: excludeIds },
    })
      .select('_id name username profilePicture bio followers following isOnline')
      .sort({ followers: -1, createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      data: {
        users: suggestedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getSuggestedUsers,
};
