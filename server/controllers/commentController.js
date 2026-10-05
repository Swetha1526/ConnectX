const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public (or Private)
const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .populate('author', '_id name username profilePicture');

    return res.status(200).json({
      success: true,
      data: {
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty',
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      '_id name username profilePicture'
    );

    // Create notification for post author if different from commenter
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'COMMENT',
        post: post._id,
        comment: comment._id,
        message: `${req.user.name} (@${req.user.username}) commented: "${text.trim().substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: populatedComment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const post = await Post.findById(comment.post);

    // Only comment author or post owner can delete
    const isCommentAuthor =
      comment.author.toString() === req.user._id.toString();
    const isPostOwner =
      post && post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment',
      });
    }

    await Comment.findByIdAndDelete(req.params.id);
    await Notification.deleteMany({ comment: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPostComments,
  createComment,
  deleteComment,
};
