const request = require('supertest');
const { app } = require('../server');
const { connectDB, closeDB } = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

let serverInstance;
let user1Token;
let user1Id;
let user2Token;
let user2Id;
let createdPostId;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_connectx';
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

describe('=== ConnectX REST API Test Suite ===', () => {
  describe('1. Authentication Endpoints', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User One',
          username: 'testuser1',
          email: 'testuser1@connectx.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.username).toBe('testuser1');

      user1Token = res.body.data.token;
      user1Id = res.body.data.user._id;
    });

    it('should prevent registering duplicate email or username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate User',
          username: 'testuser1',
          email: 'testuser1@connectx.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should register a second test user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User Two',
          username: 'testuser2',
          email: 'testuser2@connectx.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      user2Token = res.body.data.token;
      user2Id = res.body.data.user._id;
    });

    it('should login an existing user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser1@connectx.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser1@connectx.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fetch current authenticated user profile with token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('testuser1');
    });

    it('should reject access to protected route without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Posts and Feed Endpoints', () => {
    it('should create a new post when authenticated', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          caption: 'Hello World from ConnectX test suite!',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.post.caption).toBe('Hello World from ConnectX test suite!');
      createdPostId = res.body.data.post._id;
    });

    it('should get feed posts', async () => {
      const res = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBeGreaterThan(0);
    });

    it('should like and unlike a post', async () => {
      // User 2 likes User 1's post
      const likeRes = await request(app)
        .post(`/api/posts/${createdPostId}/like`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(likeRes.statusCode).toBe(200);
      expect(likeRes.body.data.isLiked).toBe(true);
      expect(likeRes.body.data.likeCount).toBe(1);

      // User 2 unlikes
      const unlikeRes = await request(app)
        .post(`/api/posts/${createdPostId}/like`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(unlikeRes.statusCode).toBe(200);
      expect(unlikeRes.body.data.isLiked).toBe(false);
      expect(unlikeRes.body.data.likeCount).toBe(0);
    });
  });

  describe('3. Comments Endpoints', () => {
    let commentId;

    it('should add a comment to a post', async () => {
      const res = await request(app)
        .post(`/api/posts/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          text: 'Great first post on ConnectX!',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.comment.text).toBe('Great first post on ConnectX!');
      commentId = res.body.data.comment._id;
    });

    it('should retrieve comments for a post', async () => {
      const res = await request(app).get(`/api/posts/${createdPostId}/comments`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comments.length).toBe(1);
    });

    it('should delete a comment', async () => {
      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('4. Social Interactions (Follow, Search, Messages, Notifications)', () => {
    it('should search users by query', async () => {
      const res = await request(app).get('/api/users/search?q=testuser');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users.length).toBeGreaterThanOrEqual(2);
    });

    it('should follow and unfollow a user', async () => {
      // User 1 follows User 2
      const followRes = await request(app)
        .post(`/api/users/${user2Id}/follow`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(followRes.statusCode).toBe(200);
      expect(followRes.body.data.isFollowing).toBe(true);

      // User 1 unfollows User 2
      const unfollowRes = await request(app)
        .delete(`/api/users/${user2Id}/follow`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(unfollowRes.statusCode).toBe(200);
      expect(unfollowRes.body.data.isFollowing).toBe(false);
    });

    it('should send a direct message', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          receiverId: user2Id,
          text: 'Hello User 2! Testing Socket.io chat flow.',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.message.text).toBe('Hello User 2! Testing Socket.io chat flow.');
    });

    it('should fetch conversation between users', async () => {
      const res = await request(app)
        .get(`/api/messages/${user2Id}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.messages.length).toBeGreaterThan(0);
    });

    it('should get notifications and mark all as read', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${user2Token}`); // Check notifications for user2

      expect(res.statusCode).toBe(200);

      const readAllRes = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${user2Token}`);

      expect(readAllRes.statusCode).toBe(200);
      expect(readAllRes.body.data.unreadCount).toBe(0);
    });
  });
});
