const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { processImageUpload } = require('../middleware/uploadMiddleware');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { caption } = req.body;
    let imageUrl = req.body.image || '';

    if (req.file) {
      imageUrl = await processImageUpload(req.file, 'posts');
    }

    if (!caption && !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Post must contain either a caption or an image',
      });
    }

    const post = await Post.create({
      author: req.user._id,
      caption: caption || '',
      image: imageUrl,
      likes: [],
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      '_id name username profilePicture'
    );

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post: {
          ...populatedPost.toObject(),
          commentsCount: 0,
          isLiked: false,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get home feed posts (with pagination)
// @route   GET /api/posts
// @access  Private (or Public)
const getFeedPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // If user is authenticated, prioritize feed from followed users + own + top global
    if (req.user) {
      const user = await User.findById(req.user._id);
      const followingIds = user?.following || [];
      // Include own posts and following posts, fallback to all posts if feed is small
      const feedUserIds = [req.user._id, ...followingIds];
      
      const feedCount = await Post.countDocuments({ author: { $in: feedUserIds } });
      if (feedCount > 0) {
        query = { author: { $in: feedUserIds } };
      }
    }

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', '_id name username profilePicture');

    // Attach comments count & like status for current user
    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const isLiked = req.user
          ? post.likes.some((id) => id.toString() === req.user._id.toString())
          : false;

        return {
          ...post.toObject(),
          commentsCount,
          isLiked,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        posts: postsWithMeta,
        pagination: {
          total: totalPosts,
          page,
          pages: Math.ceil(totalPosts / limit) || 1,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get explore / popular posts
// @route   GET /api/posts/explore
// @access  Public (or Private)
const getExplorePosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', '_id name username profilePicture');

    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const isLiked = req.user
          ? post.likes.some((id) => id.toString() === req.user._id.toString())
          : false;

        return {
          ...post.toObject(),
          commentsCount,
          isLiked,
        };
      })
    );

    // Simple explore ranking: Sort by popularity score (likes + comments)
    postsWithMeta.sort(
      (a, b) =>
        (b.likes.length * 2 + b.commentsCount) -
        (a.likes.length * 2 + a.commentsCount)
    );

    return res.status(200).json({
      success: true,
      data: {
        posts: postsWithMeta,
        pagination: {
          total: totalPosts,
          page,
          pages: Math.ceil(totalPosts / limit) || 1,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:userId
// @access  Public (or Private)
const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', '_id name username profilePicture');

    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const isLiked = req.user
          ? post.likes.some((id) => id.toString() === req.user._id.toString())
          : false;

        return {
          ...post.toObject(),
          commentsCount,
          isLiked,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        posts: postsWithMeta,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public (or Private)
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      '_id name username profilePicture'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comments = await Comment.find({ post: post._id })
      .sort({ createdAt: 1 })
      .populate('author', '_id name username profilePicture');

    const isLiked = req.user
      ? post.likes.some((id) => id.toString() === req.user._id.toString())
      : false;

    return res.status(200).json({
      success: true,
      data: {
        post: {
          ...post.toObject(),
          comments,
          commentsCount: comments.length,
          isLiked,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post caption
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this post',
      });
    }

    const { caption } = req.body;
    if (caption !== undefined) {
      post.caption = caption;
    }

    await post.save();
    const updatedPost = await Post.findById(post._id).populate(
      'author',
      '_id name username profilePicture'
    );

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    // Remove associated comments and notifications
    await Promise.all([
      Post.findByIdAndDelete(req.params.id),
      Comment.deleteMany({ post: req.params.id }),
      Notification.deleteMany({ post: req.params.id }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const currentUserId = req.user._id.toString();
    const isLiked = post.likes.some((id) => id.toString() === currentUserId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== currentUserId);
      await post.save();

      return res.status(200).json({
        success: true,
        message: 'Post unliked',
        data: {
          isLiked: false,
          likeCount: post.likes.length,
        },
      });
    } else {
      // Like
      post.likes.push(req.user._id);
      await post.save();

      // Create notification for author if not liking own post
      if (post.author.toString() !== currentUserId) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'LIKE',
          post: post._id,
          message: `${req.user.name} (@${req.user.username}) liked your post`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Post liked',
        data: {
          isLiked: true,
          likeCount: post.likes.length,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getExplorePosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
};
