const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { initializeSocket } = require('./socket/socketHandler');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

initializeSocket(io);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static directory for uploaded images (local fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'ConnectX API',
    timestamp: new Date(),
    version: '1.0.0',
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server function for both standalone run and supertest
const startServer = async () => {
  await connectDB();

  // Auto-seed initial demo accounts and posts if empty
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[ConnectX] Database is empty. Auto-seeding initial demo accounts and posts...');
      const seedDatabase = require('./utils/seedData');
      // Run seed logic without process.exit
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const Post = require('./models/Post');
      const Comment = require('./models/Comment');
      const Message = require('./models/Message');
      const Notification = require('./models/Notification');
      
      const sampleUsers = [
        {
          name: 'Swetha Ramesh',
          username: 'swetha',
          email: 'swetha@connectx.com',
          password: 'password123',
          bio: '🎨 UI/UX Designer & Creative Frontend Developer. Loving gradients, glassmorphism, and seamless interfaces.',
          profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Adhithian',
          username: 'adhithian',
          email: 'adhithian@connectx.com',
          password: 'password123',
          bio: '🚀 Full-Stack Engineer building real-time scalable web platforms. MERN & Node.js enthusiast.',
          profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Alex Morgan',
          username: 'alex_tech',
          email: 'alex@connectx.com',
          password: 'password123',
          bio: '📸 Photographer & Tech Explorer. Catching sunsets, lines of code, and coffee moments ☕',
          profilePicture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Priya Sharma',
          username: 'priya_dev',
          email: 'priya@connectx.com',
          password: 'password123',
          bio: '☁️ Cloud Architect & Open Source contributor. Sharing insights on distributed systems & modern web.',
          profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Rohan Patel',
          username: 'rohan_travels',
          email: 'rohan@connectx.com',
          password: 'password123',
          bio: '🌍 Globe-trotter & Product Designer. Documenting journeys and designing experiences that matter.',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        },
      ];

      const createdUsers = await User.create(sampleUsers);
      const userMap = {};
      createdUsers.forEach((u) => { userMap[u.username] = u; });

      userMap['swetha'].following.push(userMap['adhithian']._id, userMap['alex_tech']._id, userMap['priya_dev']._id);
      userMap['adhithian'].followers.push(userMap['swetha']._id);
      userMap['alex_tech'].followers.push(userMap['swetha']._id);
      userMap['priya_dev'].followers.push(userMap['swetha']._id);

      userMap['adhithian'].following.push(userMap['swetha']._id, userMap['priya_dev']._id, userMap['rohan_travels']._id);
      userMap['swetha'].followers.push(userMap['adhithian']._id);
      userMap['priya_dev'].followers.push(userMap['adhithian']._id);
      userMap['rohan_travels'].followers.push(userMap['adhithian']._id);

      await Promise.all(Object.values(userMap).map((u) => u.save()));

      const samplePosts = [
        {
          author: userMap['swetha']._id,
          caption: '✨ Super excited to announce the launch of ConnectX! Built with clean UI, real-time messaging, and modern MERN architecture. What do you all think? 🚀 #MERNStack #ConnectX',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
          likes: [userMap['adhithian']._id, userMap['alex_tech']._id],
        },
        {
          author: userMap['adhithian']._id,
          caption: '💻 Late night coding sessions with Socket.io real-time engine and MongoDB aggregates. Real-time updates working smoothly! ⚡ #RealTimeWeb #buildinpublic',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
          likes: [userMap['swetha']._id, userMap['priya_dev']._id],
        },
        {
          author: userMap['alex_tech']._id,
          caption: '🌅 Golden hour in the mountains. Sometimes unplugging from screens gives the greatest clarity.',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
          likes: [userMap['swetha']._id],
        },
      ];

      const createdPosts = await Post.create(samplePosts);

      await Comment.create([
        {
          post: createdPosts[0]._id,
          author: userMap['adhithian']._id,
          text: 'Looks incredible Swetha! The UI aesthetics and real-time response are top notch 🔥',
        },
        {
          post: createdPosts[0]._id,
          author: userMap['priya_dev']._id,
          text: 'The color scheme and smooth animations look super clean! Great work 👏',
        },
      ]);

      await Message.create([
        {
          sender: userMap['swetha']._id,
          receiver: userMap['adhithian']._id,
          text: 'Hey Adhithian! Have you checked out the new ConnectX design?',
          read: true,
        },
        {
          sender: userMap['adhithian']._id,
          receiver: userMap['swetha']._id,
          text: 'Hey Swetha! Yes, I just saw it. The purple gradients and responsive navigation look amazing!',
          read: true,
        },
      ]);

      await Notification.create([
        {
          recipient: userMap['swetha']._id,
          sender: userMap['adhithian']._id,
          type: 'COMMENT',
          post: createdPosts[0]._id,
          message: 'Adhithian commented on your post',
          read: false,
        },
      ]);

      console.log('[ConnectX] ✅ Database auto-seeded successfully with demo accounts!');
    }
  } catch (err) {
    console.warn('[ConnectX] Seed check notice:', err.message);
  }

  return server.listen(PORT, () => {
    console.log(`[ConnectX Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, server, startServer };
