# ConnectX — A Full-Stack Real-Time Social Media Platform

> **GUVI Major Project 2**  
> Built by: Senior Full-Stack Engineering Team  
> Tech Stack: **MongoDB, Express.js, React 18, Node.js (MERN), Socket.io, Tailwind CSS, Cloudinary**

---

## 🌟 Overview

**ConnectX** is a modern, production-ready, full-stack real-time social media platform designed to connect people seamlessly. It combines the visual fluidity and media-sharing engagement of Instagram and Facebook with the instant, low-latency communication capabilities of modern messaging apps.

Every layer of ConnectX is fully functional:
- **Backend**: Express.js REST API with Mongoose ORM, JWT authentication, and event-driven Socket.io engine.
- **Database**: MongoDB with relationships, compound indices, and virtual populations (with seamless auto-memory fallback for local environments).
- **Frontend**: React 18 single-page application powered by Vite, Tailwind CSS, Context API, responsive desktop sidebar & mobile bottom navigation, and Lucide React icons.
- **Real-Time Communication**: WebSocket duplex communication for 1-on-1 direct chat, typing indicators, live online/offline presence tracking, and instant push notifications.

---

## 🚀 Key Features

### 1. 🔐 Authentication & Security
- Secure registration and login with client-side form validation.
- Password hashing with salt rounds using **bcryptjs**.
- Stateless session management with signed **JSON Web Tokens (JWT)**.
- JWT verification middleware protecting private REST endpoints.
- Auto-redirects, token expiration handling, and Axios authorization interceptors.
- **1-Click Quick Demo Login** buttons for instant reviewer/evaluator access.

### 2. 👤 User Profiles & Network
- View personal and other users' rich profile headers with live online status indicators.
- Profile editing (Name, Username, Bio up to 250 characters).
- Profile picture uploads with live local image preview and Cloudinary streaming.
- Follow and Unfollow system with follower/following count tracking and modal inspection.
- Fast user search by name or `@username` with debounce and query highlights.

### 3. 📝 Posts & Dynamic Social Feed
- Create multimedia posts (captions, images, or combined).
- Drag-and-drop image upload with live preview and removal.
- Home Feed prioritizing posts from followed creators, personal stories, and community updates with pagination / load-more support.
- Explore page showcasing trending posts ranked by popularity score (`likes * 2 + comments`) and recency.
- Hashtag (`#tag`) and mention (`@user`) auto-formatting and click navigation.
- Post editing (caption update) and deletion with confirmation modals.

### 4. ❤️ Social Engagement & Interactions
- Instant, optimistic **Like / Unlike** toggling with heart animations.
- Comment system with real-time add, delete, and author permissions.
- Share button with one-click clipboard link copying.
- Notification dispatching on likes, comments, and new followers.

### 5. 💬 Real-Time 1-on-1 Chat (Socket.io)
- Responsive two-panel desktop layout and mobile conversation switcher.
- Instant, sub-second message delivery without page reloads.
- Message history persistence in MongoDB with compound indexing.
- Live **typing indicators** (*"User is typing..."* with animated wave dots).
- Real-time **Online / Offline status** and last-seen timestamps synced over WebSockets.
- Read receipt checkmarks (single check for sent, double checks for read).

### 6. 🔔 Notifications & Activity Center
- Real-time notification badge counts across desktop sidebar and mobile navigation.
- Categorized notifications for:
  - `LIKE`: Someone liked your post.
  - `COMMENT`: Someone commented on your post.
  - `FOLLOW`: Someone started following you.
  - `MESSAGE`: You received a direct message.
- Mark individual notifications as read or one-click "Mark all as read".

### 7. 🎨 UI/UX & Responsive Design
- Custom brand styling with purple-to-pink gradients and dark mode glassmorphism.
- Responsive layout adapting seamlessly from 320px mobile screens to 2560px ultra-wide displays.
- Floating toast alert system for non-intrusive feedback.
- Skeleton loaders for asynchronous loading states.

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Socket.io-client, Lucide React |
| **Backend** | Node.js, Express.js, Socket.io, Mongoose, JWT (jsonwebtoken), bcryptjs, Multer |
| **Database** | MongoDB / MongoDB Atlas (with embedded MongoMemoryServer fallback for zero-config testing) |
| **Media Storage** | Cloudinary SDK + Local Static Disk Fallback |
| **Testing** | Jest, Supertest |
| **Dev Tools** | Nodemon, Concurrently, Dotenv |

---

## 📂 Project Structure

```text
Social_App/
│
├── client/                     # Frontend React + Vite Application
│   ├── public/
│   │   └── logo.svg            # ConnectX brand SVG logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # ProtectedRoute, AuthLayout
│   │   │   ├── chat/           # ChatWindow, ConversationList, MessageItem, TypingIndicator
│   │   │   ├── common/         # Avatar, Button, Input, Modal, Skeleton, Toast, EmptyState
│   │   │   ├── layout/         # Sidebar, Navbar, BottomNav, RightPanel, Layout
│   │   │   ├── notifications/  # NotificationItem
│   │   │   ├── posts/          # PostCard, PostList, CommentSection, CommentItem, EditPostModal
│   │   │   ├── profile/        # ProfileHeader, ProfilePosts, UserFollowModal
│   │   │   └── search/         # SearchBar, SearchResults
│   │   ├── context/            # AuthContext, SocketContext, NotificationContext, ToastContext
│   │   ├── hooks/              # useAuth, useSocket, useNotifications, useToast
│   │   ├── pages/              # Login, Register, Home, Explore, Profile, EditProfile, CreatePost, Chat, Notifications, NotFound
│   │   ├── routes/             # AppRoutes (React Router)
│   │   ├── services/           # Axios API services (auth, user, post, comment, message, notification)
│   │   ├── utils/              # dateUtils, helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind base, utilities, glassmorphism
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Backend Node.js + Express + Socket.io
│   ├── config/
│   │   ├── db.js               # MongoDB connection with auto-memory fallback
│   │   └── cloudinary.js       # Cloudinary media configuration
│   ├── controllers/            # auth, user, post, comment, message, notification controllers
│   ├── middleware/             # authMiddleware, errorMiddleware, uploadMiddleware
│   ├── models/                 # User, Post, Comment, Message, Notification (Mongoose)
│   ├── routes/                 # Express API routes
│   ├── socket/
│   │   └── socketHandler.js    # Socket.io connection, room routing, typing, presence
│   ├── tests/
│   │   └── api.test.js         # Jest & Supertest API automated test suite
│   ├── utils/
│   │   ├── generateToken.js    # JWT generation helper
│   │   └── seedData.js         # Database seeder with 5 demo accounts, posts & messages
│   ├── server.js               # Express + Socket.io server entry point
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package configuration (concurrent scripts)
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; tested on v24)
- [npm](https://www.npmjs.com/) (v9+)
- (Optional) MongoDB running locally or a MongoDB Atlas connection string.

---

### Step 1: Clone or Navigate to the Repository
```bash
cd d:/Social_App
```

---

### Step 2: Install All Dependencies
Install root, backend, and frontend packages with a single command:
```bash
npm run install:all
```
*Or install individually:*
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

---

### Step 3: Configure Environment Variables
Copy `.env.example` in the `server` directory to `.env`:
```bash
cp server/.env.example server/.env
```

**`server/.env` format:**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/connectx
JWT_SECRET=connectx_super_secret_jwt_key_2026_guvi_major_project

# Cloudinary (Optional - falls back to local uploads if omitted)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> **Note:** If `MONGO_URI` is left default or local MongoDB is unavailable, ConnectX will automatically start an embedded in-memory database instance so you can test immediately with zero additional setup!

---

### Step 4: Seed Demo Data
Populate the database with realistic sample creators, posts, comments, follow relationships, and chat threads:
```bash
npm run seed
```

---

### Step 5: Start Development Servers
Start both the Express/Socket.io backend and Vite frontend concurrently:
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 👥 Demo Accounts

Use these pre-configured accounts to test real-time interactions across multiple browser tabs:

| Name | Email | Password | Username | Role / Bio |
|---|---|---|---|---|
| **Swetha Ramesh** | `swetha@connectx.com` | `password123` | `@swetha` | UI/UX Designer & Frontend Dev |
| **Adhithian** | `adhithian@connectx.com` | `password123` | `@adhithian` | Full-Stack Engineer |
| **Alex Morgan** | `alex@connectx.com` | `password123` | `@alex_tech` | Photographer & Tech Explorer |
| **Priya Sharma** | `priya@connectx.com` | `password123` | `@priya_dev` | Cloud Architect |
| **Rohan Patel** | `rohan@connectx.com` | `password123` | `@rohan_travels` | Product Designer |

> **Tip:** You can also click the **"Quick Demo Login"** buttons directly on the Login screen!

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated user profile |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/search?q=` | Public | Search users by name or username |
| `GET` | `/api/users/suggested` | Private | Get recommended creators to follow |
| `GET` | `/api/users/:id` | Public | Get user profile details by ID or username |
| `PUT` | `/api/users/:id` | Private | Update profile info & upload avatar |
| `POST` | `/api/users/:id/follow` | Private | Follow target user |
| `DELETE` | `/api/users/:id/follow` | Private | Unfollow target user |

### Posts (`/api/posts`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/posts?page=1&limit=10` | Public | Get feed posts with pagination |
| `POST` | `/api/posts` | Private | Create new post (caption and/or image) |
| `GET` | `/api/posts/explore` | Public | Get explore feed ranked by engagement |
| `GET` | `/api/posts/user/:userId` | Public | Get all posts published by specific user |
| `GET` | `/api/posts/:id` | Public | Get single post with comments |
| `PUT` | `/api/posts/:id` | Private | Update post caption (author only) |
| `DELETE` | `/api/posts/:id` | Private | Delete post and related comments/likes |
| `POST` | `/api/posts/:id/like` | Private | Toggle like / unlike on post |

### Comments (`/api/posts/:postId/comments` & `/api/comments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/posts/:postId/comments` | Public | Get comments for a post |
| `POST` | `/api/posts/:postId/comments` | Private | Post a comment on a post |
| `DELETE` | `/api/comments/:id` | Private | Delete comment (author or post owner) |

### Real-Time Messages (`/api/messages`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/messages/conversations/list` | Private | Get all active conversation threads |
| `GET` | `/api/messages/:userId` | Private | Get message history with user & mark read |
| `POST` | `/api/messages` | Private | Send a direct message |

### Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Private | Get user notifications & unread count |
| `PUT` | `/api/notifications/:id/read` | Private | Mark single notification as read |
| `PUT` | `/api/notifications/read-all` | Private | Mark all notifications as read |

---

## ⚡ Real-Time Socket Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `user:join` | Client ➔ Server | `userId` | Registers client socket and marks user online |
| `user:online` | Server ➔ All | `{ userId, isOnline, lastSeen }` | Broadcasts user online presence |
| `user:offline` | Server ➔ All | `{ userId, isOnline, lastSeen }` | Broadcasts user offline status |
| `users:online_list` | Server ➔ Client | `[userId1, userId2, ...]` | Initial list of currently online users |
| `message:send` | Client ➔ Server | `messageObject` | Relays direct message to recipient's room |
| `message:receive` | Server ➔ Client | `messageObject` | Delivers incoming message to recipient |
| `message:read` | Client ➔ Server | `{ senderId, receiverId }` | Sends read acknowledgement |
| `message:read_ack` | Server ➔ Client | `{ readerId }` | Updates message read status ticks |
| `typing:start` | Client ➔ Server ➔ Recipient | `{ receiverId, senderId, name }` | Displays live typing wave |
| `typing:stop` | Client ➔ Server ➔ Recipient | `{ receiverId, senderId }` | Clears typing indicator |
| `notification:receive` | Server ➔ Client | `notificationObject` | Pushes instant live notification badge/toast |

---

## 🧪 Automated Testing

Run the automated backend test suite using Jest and Supertest:
```bash
npm test
```

The test suite covers:
- User registration (validations, uniqueness, password hashing)
- User login (JWT issuance, wrong password handling)
- Protected route verification (`401 Unauthorized` without token)
- Post CRUD operations (creation, editing, deletion)
- Like and unlike toggling
- Comment creation and deletion permissions
- Search query filtering
- Follow / unfollow social graph updates
- Message dispatching and conversation history
- Notification retrieval and bulk read updates

---

## 🚀 Deployment Guide

### Deploying to Render / Vercel / Railway:
1. **Backend (Render / Railway)**:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Set environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `CLOUDINARY_*`.
2. **Frontend (Vercel / Netlify / Render Static)**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set `VITE_API_URL` to your backend URL (e.g., `https://connectx-api.onrender.com/api`).
   - Set `VITE_SOCKET_URL` to your backend URL.

---

## 📄 License
Developed for **GUVI Major Project 2**. All rights reserved.
