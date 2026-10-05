const dotenv = require('dotenv');
dotenv.config();

const { connectDB, closeDB } = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

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

const samplePostsData = [
  {
    authorUsername: 'swetha',
    caption: '✨ Super excited to announce the launch of ConnectX! Built with clean UI, real-time messaging, and modern MERN architecture. What do you all think? 🚀',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
  {
    authorUsername: 'adhithian',
    caption: '💻 Late night coding sessions with Socket.io real-time engine and MongoDB aggregates. Real-time updates working smoothly! ⚡ #buildinpublic #mern',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    authorUsername: 'alex_tech',
    caption: '🌅 Golden hour in the mountains. Sometimes unplugging from screens gives the greatest clarity.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  },
  {
    authorUsername: 'priya_dev',
    caption: '💡 Architecture tip: decoupling services with event-driven websockets creates resilient, responsive user experiences! Who else loves Socket.io?',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  },
  {
    authorUsername: 'rohan_travels',
    caption: '☕ Cozy workspace vibes for today. Great coffee and great code make the best combo.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
  },
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('[Seed] Creating demo users...');
    const createdUsers = await User.create(sampleUsers);
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.username] = u;
    });

    console.log('[Seed] Setting up follow relationships...');
    // Swetha follows Adhithian, Alex, Priya
    userMap['swetha'].following.push(userMap['adhithian']._id, userMap['alex_tech']._id, userMap['priya_dev']._id);
    userMap['adhithian'].followers.push(userMap['swetha']._id);
    userMap['alex_tech'].followers.push(userMap['swetha']._id);
    userMap['priya_dev'].followers.push(userMap['swetha']._id);

    // Adhithian follows Swetha, Priya, Rohan
    userMap['adhithian'].following.push(userMap['swetha']._id, userMap['priya_dev']._id, userMap['rohan_travels']._id);
    userMap['swetha'].followers.push(userMap['adhithian']._id);
    userMap['priya_dev'].followers.push(userMap['adhithian']._id);
    userMap['rohan_travels'].followers.push(userMap['adhithian']._id);

    // Priya follows Swetha and Adhithian
    userMap['priya_dev'].following.push(userMap['swetha']._id, userMap['adhithian']._id);
    userMap['swetha'].followers.push(userMap['priya_dev']._id);
    userMap['adhithian'].followers.push(userMap['priya_dev']._id);

    await Promise.all(Object.values(userMap).map((u) => u.save()));

    console.log('[Seed] Creating demo posts...');
    const createdPosts = [];
    for (const p of samplePostsData) {
      const author = userMap[p.authorUsername];
      const post = await Post.create({
        author: author._id,
        caption: p.caption,
        image: p.image,
        likes: [
          userMap['swetha']._id,
          userMap['adhithian']._id,
          userMap['alex_tech']._id,
        ].filter((id) => id.toString() !== author._id.toString()),
      });
      createdPosts.push(post);
    }

    console.log('[Seed] Adding sample comments...');
    const firstPost = createdPosts[0];
    const secondPost = createdPosts[1];

    await Comment.create([
      {
        post: firstPost._id,
        author: userMap['adhithian']._id,
        text: 'Looks incredible Swetha! The UI aesthetics and real-time response are top notch 🔥',
      },
      {
        post: firstPost._id,
        author: userMap['priya_dev']._id,
        text: 'The color scheme and smooth animations look super clean! Great work 👏',
      },
      {
        post: secondPost._id,
        author: userMap['swetha']._id,
        text: 'Socket.io works like magic! Love seeing the instant live message updates ⚡',
      },
      {
        post: secondPost._id,
        author: userMap['alex_tech']._id,
        text: 'Keep it up! Amazing engineering progress 🚀',
      },
    ]);

    console.log('[Seed] Adding sample direct messages...');
    await Message.create([
      {
        sender: userMap['swetha']._id,
        receiver: userMap['adhithian']._id,
        text: 'Hey Adhithian! Have you checked out the new ConnectX dark mode design?',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        sender: userMap['adhithian']._id,
        receiver: userMap['swetha']._id,
        text: 'Hey Swetha! Yes, I just saw it. The purple gradients and responsive navigation look amazing!',
        read: true,
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        sender: userMap['swetha']._id,
        receiver: userMap['adhithian']._id,
        text: 'Awesome! Real-time typing indicators and online statuses are synced perfectly too! 🎉',
        read: false,
        createdAt: new Date(Date.now() - 600000),
      },
      {
        sender: userMap['priya_dev']._id,
        receiver: userMap['swetha']._id,
        text: 'Hi Swetha! Loved your latest post about ConnectX architecture!',
        read: false,
        createdAt: new Date(Date.now() - 1200000),
      },
    ]);

    console.log('[Seed] Adding sample notifications...');
    await Notification.create([
      {
        recipient: userMap['swetha']._id,
        sender: userMap['adhithian']._id,
        type: 'COMMENT',
        post: firstPost._id,
        message: 'Adhithian commented on your post: "Looks incredible Swetha!..."',
        read: false,
      },
      {
        recipient: userMap['swetha']._id,
        sender: userMap['priya_dev']._id,
        type: 'FOLLOW',
        message: 'Priya Sharma (@priya_dev) started following you',
        read: false,
      },
      {
        recipient: userMap['swetha']._id,
        sender: userMap['alex_tech']._id,
        type: 'LIKE',
        post: firstPost._id,
        message: 'Alex Morgan (@alex_tech) liked your post',
        read: true,
      },
      {
        recipient: userMap['adhithian']._id,
        sender: userMap['swetha']._id,
        type: 'COMMENT',
        post: secondPost._id,
        message: 'Swetha Ramesh (@swetha) commented on your post',
        read: false,
      },
    ]);

    console.log('---------------------------------------------------------');
    console.log('✅ ConnectX Database successfully seeded with demo accounts:');
    console.log('1. swetha@connectx.com / password123 (@swetha)');
    console.log('2. adhithian@connectx.com / password123 (@adhithian)');
    console.log('3. alex@connectx.com / password123 (@alex_tech)');
    console.log('4. priya@connectx.com / password123 (@priya_dev)');
    console.log('5. rohan@connectx.com / password123 (@rohan_travels)');
    console.log('---------------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
