const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversationsList,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All message routes require authentication

router.post('/', sendMessage);
router.get('/conversations/list', getConversationsList);
router.get('/:userId', getConversation);

module.exports = router;
