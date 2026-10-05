# PROJECT REPORT
## GUVI Major Project 2 — Full-Stack Social Media Application

---

# ConnectX
### **A Full-Stack Real-Time Social Media Platform**

**Academic Submission & System Architecture Document**  
**Repository**: [https://github.com/Swetha1526/ConnectX](https://github.com/Swetha1526/ConnectX)  
**Author**: Swetha Ramesh  
**Date**: October 2026  

---

## 📑 Table of Contents

1. [Executive Summary / Abstract](#1-executive-summary--abstract)
2. [Introduction & Problem Statement](#2-introduction--problem-statement)
3. [System Objectives & Scope](#3-system-objectives--scope)
4. [Technology Stack & Architectural Rationale](#4-technology-stack--architectural-rationale)
5. [System Architecture & Data Flow](#5-system-architecture--data-flow)
6. [Database Schema & Data Modeling](#6-database-schema--data-modeling)
7. [Detailed Module Implementation](#7-detailed-module-implementation)
   - 7.1 Authentication & Authorization Module
   - 7.2 User Profile & Social Graph Module
   - 7.3 Media Upload & Post Feed Module
   - 7.4 Social Interaction Module (Likes & Comments)
   - 7.5 Real-Time Communication Engine (Socket.io)
   - 7.6 Push Notification Engine
   - 7.7 UI/UX Design System & Client Architecture
8. [REST API & WebSocket Protocol Specifications](#8-rest-api--websocket-protocol-specifications)
9. [Security, Error Handling & Data Integrity](#9-security-error-handling--data-integrity)
10. [Testing, Verification & Quality Assurance](#10-testing-verification--quality-assurance)
11. [Deployment, DevOps & Build Configuration](#11-deployment-devops--build-configuration)
12. [Conclusion & Future Roadmap](#12-conclusion--future-roadmap)

---

## 1. Executive Summary / Abstract

Modern web platforms demand a convergence of asynchronous content delivery, multimedia sharing, and sub-second real-time communication. **ConnectX** is an enterprise-grade, full-stack social media application engineered to deliver an interactive community experience. 

Built on the **MERN stack (MongoDB, Express.js, React 18, Node.js)** and enhanced with **Socket.io** WebSocket technology, ConnectX enables users to register, manage personalized profiles, broadcast media-rich stories, like and comment on community feeds, explore trending topics, follow creators, and converse via real-time 1-on-1 direct messaging with live typing indicators and online presence tracking.

The application adheres strictly to standard software engineering patterns: MVC pattern on the backend, atomic and compound component hierarchy on the frontend, centralized API interceptors, state management using React Context, and a zero-configuration embedded database fallback for frictionless evaluation. Automated integration testing via **Jest** and **Supertest** validates 100% of core operational endpoints (18/18 tests passed).

---

## 2. Introduction & Problem Statement

### 2.1 Background
The digital landscape relies heavily on social networking platforms for professional collaboration, community building, and creative sharing. However, developing a platform that seamlessly synchronizes real-time messaging, asynchronous media storage, and high-concurrency feeds presents significant software architecture challenges.

### 2.2 Problem Statement
Traditional web platforms often suffer from:
1. **Inefficient Polling**: High-latency chat implementations relying on continuous HTTP polling degrade server performance.
2. **Monolithic Complexity**: Tightly coupled frontend and backend logic that hinders scalability and independent deployments.
3. **Inconsistent Security**: Inadequate token validation, exposed credentials, or plain-text password persistence.
4. **Poor Responsiveness**: Cluttered interfaces that fail on mobile and tablet viewport viewports.

ConnectX addresses these challenges by employing an event-driven WebSocket layer alongside a stateless REST API, responsive Tailwind CSS styling, and standard cryptographic hashing.

---

## 3. System Objectives & Scope

### 3.1 Primary Objectives
- **Secure Identity Management**: Implement stateless JWT authentication with bcrypt password hashing and route guards.
- **Dynamic Content Feed**: Enable creation, pagination, editing, and deletion of multimedia posts.
- **Social Graph Engine**: Support bidirectional following/follower relationships and targeted user discovery.
- **Low-Latency Communication**: Provide instant WebSocket messaging with presence tracking and typing awareness.
- **Real-Time Notifications**: Alert users dynamically upon receiving likes, comments, follows, or messages.
- **Adaptive Cross-Platform UI**: Ensure responsive design spanning mobile (320px+), tablet (768px+), and desktop (1024px+) viewports.

---

## 4. Technology Stack & Architectural Rationale

| Layer | Technology | Version | Architectural Rationale |
|---|---|---|---|
| **Client UI** | React.js | 18.2.0 | Component-based declarative UI with Virtual DOM for fast re-rendering. |
| **Build Tool** | Vite | 5.4.21 | Hot Module Replacement (HMR) and optimized Rollup bundling. |
| **CSS Styling** | Tailwind CSS | 3.4.3 | Utility-first CSS framework enabling dark mode and glassmorphism. |
| **Icons** | Lucide React | 0.378.0 | Lightweight SVG icons matching modern design aesthetics. |
| **Client Network** | Axios | 1.6.8 | Promise-based HTTP client with request/response interceptors. |
| **Real-Time Client** | Socket.io-client | 4.7.5 | Bidirectional WebSocket abstraction with auto-reconnection. |
| **Server Framework** | Node.js / Express | 4.19.2 | Non-blocking, event-driven I/O model ideal for concurrent API operations. |
| **Real-Time Server** | Socket.io | 4.7.5 | Room-based message routing and presence broadcasting. |
| **Database** | MongoDB / Mongoose | 8.3.2 | Document database providing JSON-like schema flexibility and indexing. |
| **In-Memory DB** | MongoMemoryServer | 9.5.0 | Embedded fallback database for zero-config testing and evaluation. |
| **Authentication** | JWT & Bcryptjs | 9.0.2 / 2.4.3 | Industry standard stateless authorization and salted password hashing. |
| **Media Handling** | Multer & Cloudinary | 1.4.5 / 1.41.3 | Streamlined multipart upload processing with CDN cloud storage. |
| **Testing** | Jest & Supertest | 29.7.0 / 6.3.4 | Automated integration test runner and HTTP assertion library. |

---

## 5. System Architecture & Data Flow

### 5.1 Three-Tier Client-Server Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER (Client)                      │
│                                                                        │
│   [React 18 SPA] ──► [Context Providers: Auth, Socket, Notification]   │
│         │                                                              │
│         ▼                                                              │
│   [Tailwind UI Components] ──► [Axios Interceptors / Socket.io Client] │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ (HTTP REST / WebSocket Duplex)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION TIER (Server)                       │
│                                                                        │
│   [Express HTTP Gateway] ───────────────► [Socket.io Event Gateway]    │
│         │                                        │                     │
│   [Auth / Upload / Error Middleware]             │ (Presence / Rooms)  │
│         │                                        │                     │
│   [MVC Controllers: User, Post, Msg, Notif] ─────┴─────────────┐       │
└─────────────────────────────────┬──────────────────────────────┼───────┘
                                  │ (Mongoose ODM)               │ (Cloud CDN)
                                  ▼                              ▼
┌──────────────────────────────────────────────────┐ ┌──────────────────┐
│                 DATA STORAGE TIER                │ │ MEDIA STORAGE    │
│  [MongoDB / Mongoose Schemas]                    │ │ [Cloudinary /    │
│  • Users  • Posts  • Comments  • Msgs  • Notifs  │ │  Local Static]   │
└──────────────────────────────────────────────────┘ └──────────────────┘
```

### 5.2 Real-Time Message Flow
1. **User A** types a message in `ChatWindow.jsx`.
2. Socket emits `typing:start` $\rightarrow$ Server relays to `user:<recipientId>` room $\rightarrow$ **User B** sees animated typing dots.
3. **User A** clicks Send $\rightarrow$ `POST /api/messages` persists message to MongoDB $\rightarrow$ Server emits `message:send` over WebSocket $\rightarrow$ Delivered to **User B** in real time.
4. **User B** reads message $\rightarrow$ Socket emits `message:read` $\rightarrow$ Updates database $\rightarrow$ Server delivers read acknowledgment (`message:read_ack`) back to **User A** (double checkmarks).

---

## 6. Database Schema & Data Modeling

### 6.1 Entity-Relationship (ER) Overview
```text
  ┌──────────────┐          1:N           ┌──────────────┐
  │     USER     │───────────────────────<│     POST     │
  └──────┬───────┘                        └──────┬───────┘
         │                                       │
         │ 1:N                                   │ 1:N
         ▼                                       ▼
  ┌──────────────┐                        ┌──────────────┐
  │   MESSAGE    │                        │   COMMENT    │
  └──────────────┘                        └──────────────┘
         │                                       │
         │ 1:N                                   │ 1:N
         ▼                                       ▼
  ┌──────────────────────────────────────────────────────┐
  │                     NOTIFICATION                     │
  └──────────────────────────────────────────────────────┘
```

### 6.2 Data Schemas

#### User Schema (`User.js`)
- `username`: String, unique, required, indexed, lowercase.
- `email`: String, unique, required, indexed, validated regex.
- `password`: String, required, minlength 6, excluded by default (`select: false`).
- `name`: String, required, max 50 chars.
- `bio`: String, max 250 chars.
- `profilePicture`: String URL.
- `followers`: `[ObjectId -> User]`.
- `following`: `[ObjectId -> User]`.
- `isOnline`: Boolean, default false.
- `lastSeen`: Date, default `Date.now`.
- `timestamps`: true (`createdAt`, `updatedAt`).

#### Post Schema (`Post.js`)
- `author`: `ObjectId -> User`, required, indexed.
- `caption`: String, max 2200 chars.
- `image`: String URL (Cloudinary or local static path).
- `likes`: `[ObjectId -> User]`.
- Virtuals: `likeCount`, `comments` (`localField: _id, foreignField: post`).
- `timestamps`: true (`createdAt`, `updatedAt`).

#### Comment Schema (`Comment.js`)
- `post`: `ObjectId -> Post`, required, indexed.
- `author`: `ObjectId -> User`, required.
- `text`: String, required, max 1000 chars.
- `timestamps`: true.

#### Message Schema (`Message.js`)
- `sender`: `ObjectId -> User`, required, indexed.
- `receiver`: `ObjectId -> User`, required, indexed.
- `text`: String, required, max 4000 chars.
- `read`: Boolean, default false, indexed.
- `readAt`: Date, default null.
- `timestamps`: true.

#### Notification Schema (`Notification.js`)
- `recipient`: `ObjectId -> User`, required, indexed.
- `sender`: `ObjectId -> User`, required.
- `type`: Enum `['LIKE', 'COMMENT', 'FOLLOW', 'MESSAGE']`.
- `post`: `ObjectId -> Post`, optional.
- `message`: String.
- `read`: Boolean, default false, indexed.
- `timestamps`: true.

---

## 7. Detailed Module Implementation

### 7.1 Authentication & Authorization
- **Registration**: Captures `name`, `username`, `email`, `password`. Hashes password with `bcryptjs.genSalt(10)` in a pre-save hook.
- **Login**: Compares hashed credentials with `bcrypt.compare()`. Issues signed JWT token containing user ID with 30-day expiration.
- **Interceptors**: Axios interceptor extracts JWT from `localStorage` and injects `Authorization: Bearer <token>` on all outgoing HTTP requests.

### 7.2 User Profile & Social Graph
- **Profile Header**: Aggregates post count, follower count, and following count via database lookups.
- **Follow System**: Toggles following state atomically via `User.save()`, adding `currentUserId` to target's followers and `targetUserId` to current user's following. Automatically creates a `FOLLOW` notification.

### 7.3 Media Upload & Post Feed
- **Upload Pipeline**: Supports image uploading via `multer.memoryStorage()`. If Cloudinary credentials exist, streams directly to cloud CDN; otherwise writes securely to `server/uploads/` with unique hash names.
- **Feed Generation**: Query engine fetches posts from followed accounts plus own posts, sorted descending by `createdAt`. Includes populated author documents and calculated comment counts.

### 7.4 Social Interactions (Likes & Comments)
- **Optimistic Likes**: Toggling like updates frontend UI instantly while firing asynchronous `POST /api/posts/:id/like`. If the post author is different from the liker, a `LIKE` notification is dispatched.
- **Comments Drawer**: Expandable comment section below each post card with comment deletion permissions restricted to the comment author or post owner.

### 7.5 Real-Time Communication Engine (Socket.io)
- **Presence Engine**: On socket connection, user joins a unique room `user:<userId>`. User is marked `isOnline: true`, and a `user:online` event broadcasts to all clients.
- **1-on-1 Direct Messaging**: Direct message packets are routed specifically to the recipient's private room.
- **Typing Awareness**: Client debounces input keystrokes (1.5s timeout) and emits `typing:start` and `typing:stop` events.

### 7.6 Push Notification Engine
- Dispatches categorized alerts on likes, comments, follows, and direct messages.
- Real-time notification badge counts across the desktop sidebar and mobile navigation.
- One-click bulk read operation (`PUT /api/notifications/read-all`).

### 7.7 UI/UX Design System
- **Color Palette**: Brand purple (`#8b5cf6`) to vibrant pink (`#ec4899`) gradients with slate dark backgrounds (`#0B0F19`).
- **Responsive Layout**: Desktop navigation sidebar with collapse mechanisms on tablets, converting into a mobile bottom navigation bar on screens `< 768px`.
- **Micro-Interactions**: Subtle animations, glassmorphism cards (`backdrop-blur-md`), skeleton loaders, and floating toast notifications.

---

## 8. REST API & WebSocket Protocol Specifications

### 8.1 REST API Endpoints Summary

```text
AUTHENTICATION
  POST    /api/auth/register          Register new user account
  POST    /api/auth/login             Authenticate user & return JWT token
  GET     /api/auth/me                Fetch authenticated session profile

USER MANAGEMENT
  GET     /api/users/search?q=        Search users by name or @username
  GET     /api/users/suggested        Get recommended creators to follow
  GET     /api/users/:id              Get profile info by ID or username
  PUT     /api/users/:id              Update profile info & avatar image
  POST    /api/users/:id/follow       Follow user & create notification
  DELETE  /api/users/:id/follow       Unfollow user

POSTS & FEED
  GET     /api/posts                  Get feed posts with pagination
  POST    /api/posts                  Publish text/image post
  GET     /api/posts/explore          Get explore feed ranked by engagement
  GET     /api/posts/user/:userId     Get posts published by specific user
  GET     /api/posts/:id              Get single post with comments
  PUT     /api/posts/:id              Update post caption (author only)
  DELETE  /api/posts/:id              Delete post & cascade comments/likes
  POST    /api/posts/:id/like         Toggle like / unlike on post

COMMENTS
  GET     /api/posts/:postId/comments Get comments for post
  POST    /api/posts/:postId/comments Post comment & notify post owner
  DELETE  /api/comments/:id           Delete comment (author or post owner)

MESSAGES
  GET     /api/messages/conversations/list  Get active chat threads
  GET     /api/messages/:userId       Get message history with user
  POST    /api/messages               Send direct message

NOTIFICATIONS
  GET     /api/notifications          Get user notifications & unread count
  PUT     /api/notifications/:id/read Mark single notification as read
  PUT     /api/notifications/read-all Mark all notifications as read
```

### 8.2 WebSocket Events Protocol

| Event | Direction | Payload | Description |
|---|---|---|---|
| `user:join` | Client $\rightarrow$ Server | `userId` | Joins private user room and marks user online |
| `user:online` | Server $\rightarrow$ All | `{ userId, isOnline, lastSeen }` | Broadcasts online status |
| `user:offline` | Server $\rightarrow$ All | `{ userId, isOnline, lastSeen }` | Broadcasts offline status upon socket disconnect |
| `users:online_list` | Server $\rightarrow$ Client | `[userId1, userId2, ...]` | List of all currently connected users |
| `message:send` | Client $\rightarrow$ Server | `messageObject` | Relays message to target recipient's room |
| `message:receive` | Server $\rightarrow$ Client | `messageObject` | Delivers real-time message to recipient |
| `message:read` | Client $\rightarrow$ Server | `{ senderId, receiverId }` | Emits read acknowledgement |
| `message:read_ack` | Server $\rightarrow$ Client | `{ readerId }` | Updates checkmarks on sender UI |
| `typing:start` | Client $\rightarrow$ Server $\rightarrow$ Client | `{ receiverId, senderId, name }` | Displays live typing wave |
| `typing:stop` | Client $\rightarrow$ Server $\rightarrow$ Client | `{ receiverId, senderId }` | Hides typing wave |
| `notification:receive` | Server $\rightarrow$ Client | `notificationObject` | Pushes instant notification alert |

---

## 9. Security, Error Handling & Data Integrity

1. **Password Security**: Passwords are encrypted using salted bcrypt hashes (`10` salt rounds). Plaintext passwords are never stored or returned in query outputs.
2. **Stateless Authorization**: Private endpoints are secured using `authMiddleware.js`, rejecting unauthenticated or expired tokens with `401 Unauthorized`.
3. **Cascading Integrity**: Deleting a post automatically invokes cascading cleanups across child `Comment` and `Notification` collections.
4. **Sanitized Input & Error Formatting**: Express error handler catches CastErrors, Duplicate Key (code `11000`), and Mongoose ValidationErrors, formatting clean JSON responses `{ success: false, message: '...' }` without leaking stack traces.
5. **CORS & Environment Isolation**: Configurable CORS origin whitelist with credentials enabled. All sensitive configuration stored strictly in `.env`.

---

## 10. Testing, Verification & Quality Assurance

### 10.1 Automated Integration Test Suite
The backend was tested using **Jest** and **Supertest** running in-memory database instances:

```text
PASS server/tests/api.test.js
  === ConnectX REST API Test Suite ===
    1. Authentication Endpoints
      √ should register a new user successfully (386 ms)
      √ should prevent registering duplicate email or username (33 ms)
      √ should register a second test user (170 ms)
      √ should login an existing user with correct credentials (125 ms)
      √ should reject login with wrong password (132 ms)
      √ should fetch current authenticated user profile with token (29 ms)
      √ should reject access to protected route without token (14 ms)
    2. Posts and Feed Endpoints
      √ should create a new post when authenticated (56 ms)
      √ should get feed posts (71 ms)
      √ should like and unlike a post (69 ms)
    3. Comments Endpoints
      √ should add a comment to a post (76 ms)
      √ should retrieve comments for a post (23 ms)
      √ should delete a comment (34 ms)
    4. Social Interactions (Follow, Search, Messages, Notifications)
      √ should search users by query (21 ms)
      √ should follow and unfollow a user (87 ms)
      √ should send a direct message (57 ms)
      √ should fetch conversation between users (44 ms)
      √ should get notifications and mark all as read (63 ms)

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total (100% Pass Rate)
Snapshots:   0 total
Time:        8.097 s
```

### 10.2 Client Build Verification
The frontend was compiled with the Vite production bundler:
- `1635 modules transformed`
- `dist/index.html`: 1.10 kB (gzip: 0.58 kB)
- `dist/assets/index.css`: 45.89 kB (gzip: 8.12 kB)
- `dist/assets/index.js`: 365.98 kB (gzip: 110.25 kB)
- **0 errors / 0 broken imports**.

---

## 11. Deployment, DevOps & Build Configuration

### 11.1 Monorepo Commands
- `npm run install:all`: Installs root, server, and client dependencies.
- `npm run dev`: Boots Express/Socket.io backend (`:5000`) and Vite frontend (`:5173`) concurrently.
- `npm test`: Runs the automated Jest test suite.
- `npm run seed`: Seeds the database with realistic demo accounts.
- `npm run build`: Compiles optimized frontend production bundle.

### 11.2 Production Deployment Strategy
- **Backend (Render / Railway / AWS EC2)**: Runs `node server.js` connected to MongoDB Atlas.
- **Frontend (Vercel / Netlify)**: Builds SPA bundle from `client/` pointing `VITE_API_URL` and `VITE_SOCKET_URL` to the backend gateway.

---

## 12. Conclusion & Future Roadmap

### 12.1 Project Summary
**ConnectX** successfully satisfies all requirements established for **GUVI Major Project 2**. It demonstrates an enterprise-grade full-stack architecture combining asynchronous CRUD data management with low-latency WebSocket communication, complete with responsive visual styling, robust test coverage, and clear documentation.

### 12.2 Future Enhancements
- [ ] End-to-end encryption for 1-on-1 direct chat threads.
- [ ] Group channels and community audio spaces.
- [ ] Video upload and streaming transcoding pipeline.
- [ ] Native mobile wrapper using React Native / Capacitor.

---

*Report generated for GUVI Major Project 2 Evaluation.*
