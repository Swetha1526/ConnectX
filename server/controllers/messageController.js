const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Send a direct message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and message text are required',
      });
    }

    if (receiverId === senderId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot message yourself',
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found',
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
      read: false,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', '_id name username profilePicture isOnline lastSeen')
      .populate('receiver', '_id name username profilePicture isOnline lastSeen');

    // Create a MESSAGE notification
    await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: 'MESSAGE',
      message: `${req.user.name}: ${text.trim().substring(0, 45)}${text.length > 45 ? '...' : ''}`,
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: populatedMessage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation with a specific user
// @route   GET /api/messages/:userId
// @access  Private
const getConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { userId: otherUserId } = req.params;

    const otherUser = await User.findById(otherUserId).select(
      '_id name username profilePicture isOnline lastSeen bio'
    );

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Retrieve conversation history
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', '_id name username profilePicture')
      .populate('receiver', '_id name username profilePicture');

    // Mark unread messages sent by otherUser to current user as read
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false,
      },
      {
        $set: { read: true, readAt: new Date() },
      }
    );

    return res.status(200).json({
      success: true,
      data: {
        otherUser,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent conversation threads list
// @route   GET /api/messages/conversations/list
// @access  Private
const getConversationsList = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', '_id name username profilePicture isOnline lastSeen')
      .populate('receiver', '_id name username profilePicture isOnline lastSeen');

    // Group by the other user's ID to build conversation list
    const conversationMap = new Map();

    for (const msg of messages) {
      const isSender = msg.sender._id.toString() === currentUserId.toString();
      const otherUser = isSender ? msg.receiver : msg.sender;
      const otherUserId = otherUser._id.toString();

      if (!conversationMap.has(otherUserId)) {
        const unreadCount = await Message.countDocuments({
          sender: otherUserId,
          receiver: currentUserId,
          read: false,
        });

        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: {
            _id: msg._id,
            text: msg.text,
            sender: msg.sender._id,
            createdAt: msg.createdAt,
            read: msg.read,
          },
          unreadCount,
        });
      }
    }

    const conversations = Array.from(conversationMap.values());

    return res.status(200).json({
      success: true,
      data: {
        conversations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversationsList,
};
