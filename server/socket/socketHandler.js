const User = require('../models/User');

// Track online users in memory: userId -> Set of socket IDs (to support multiple tabs/devices)
const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    let currentUserId = null;

    // User joins with their userId
    socket.on('user:join', async (userId) => {
      if (!userId) return;
      currentUserId = userId.toString();

      // Add socket ID to user's set
      if (!onlineUsers.has(currentUserId)) {
        onlineUsers.set(currentUserId, new Set());
      }
      onlineUsers.get(currentUserId).add(socket.id);

      // Associate socket with a room for targeted messages
      socket.join(`user:${currentUserId}`);

      try {
        await User.findByIdAndUpdate(currentUserId, {
          isOnline: true,
          lastSeen: new Date(),
        });

        // Broadcast to all clients that this user is online
        io.emit('user:online', {
          userId: currentUserId,
          isOnline: true,
          lastSeen: new Date(),
        });

        // Send current list of online user IDs to the connected user
        const onlineUserIds = Array.from(onlineUsers.keys());
        socket.emit('users:online_list', onlineUserIds);
      } catch (err) {
        console.error('[Socket] Error updating online status:', err.message);
      }
    });

    // Real-time message relay
    socket.on('message:send', (messageData) => {
      if (!messageData || !messageData.receiver) return;
      const receiverId = messageData.receiver._id
        ? messageData.receiver._id.toString()
        : messageData.receiver.toString();

      // Emit to receiver's room
      io.to(`user:${receiverId}`).emit('message:receive', messageData);
    });

    // Real-time message read acknowledgement
    socket.on('message:read', ({ senderId, receiverId }) => {
      if (senderId) {
        io.to(`user:${senderId}`).emit('message:read_ack', {
          readerId: receiverId || currentUserId,
        });
      }
    });

    // Typing indicators
    socket.on('typing:start', ({ receiverId, senderId, username, name }) => {
      if (receiverId) {
        io.to(`user:${receiverId}`).emit('typing:start', {
          senderId: senderId || currentUserId,
          username,
          name,
        });
      }
    });

    socket.on('typing:stop', ({ receiverId, senderId }) => {
      if (receiverId) {
        io.to(`user:${receiverId}`).emit('typing:stop', {
          senderId: senderId || currentUserId,
        });
      }
    });

    // Real-time notification dispatch
    socket.on('notification:send', ({ recipientId, notification }) => {
      if (recipientId) {
        io.to(`user:${recipientId}`).emit('notification:receive', notification);
      }
    });

    // Disconnect handling
    socket.on('disconnect', async () => {
      if (currentUserId && onlineUsers.has(currentUserId)) {
        const userSockets = onlineUsers.get(currentUserId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(currentUserId);

          try {
            const lastSeen = new Date();
            await User.findByIdAndUpdate(currentUserId, {
              isOnline: false,
              lastSeen,
            });

            io.emit('user:offline', {
              userId: currentUserId,
              isOnline: false,
              lastSeen,
            });
          } catch (err) {
            console.error('[Socket] Error updating offline status:', err.message);
          }
        }
      }
    });
  });
};

module.exports = { initializeSocket, onlineUsers };
