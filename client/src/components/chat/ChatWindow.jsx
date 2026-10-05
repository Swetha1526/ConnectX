import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import { formatTimeAgo } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

export const ChatWindow = ({ targetUser, onBack }) => {
  const { user: currentUser } = useAuth();
  const { socket, isUserOnline } = useSocket();
  const { error: toastError } = useToast();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isOnline = isUserOnline(targetUser?._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversation messages
  useEffect(() => {
    if (!targetUser?._id) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await messageService.getConversation(targetUser._id);
        if (res.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error('[ChatWindow] Failed to load messages:', err);
        toastError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [targetUser?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Socket real-time event listeners
  useEffect(() => {
    if (!socket || !targetUser?._id) return;

    const handleIncomingMessage = (newMsg) => {
      const senderId = newMsg.sender?._id || newMsg.sender;
      if (senderId.toString() === targetUser._id.toString()) {
        setMessages((prev) => [...prev, newMsg]);
        socket.emit('message:read', {
          senderId: targetUser._id,
          receiverId: currentUser._id,
        });
      }
    };

    const handleTypingStart = ({ senderId, username, name }) => {
      if (senderId.toString() === targetUser._id.toString()) {
        setIsTyping({ username, name });
      }
    };

    const handleTypingStop = ({ senderId }) => {
      if (senderId.toString() === targetUser._id.toString()) {
        setIsTyping(null);
      }
    };

    const handleReadAck = ({ readerId }) => {
      if (readerId.toString() === targetUser._id.toString()) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender?._id === currentUser._id || msg.sender === currentUser._id
              ? { ...msg, read: true }
              : msg
          )
        );
      }
    };

    socket.on('message:receive', handleIncomingMessage);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('message:read_ack', handleReadAck);

    return () => {
      socket.off('message:receive', handleIncomingMessage);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('message:read_ack', handleReadAck);
    };
  }, [socket, targetUser?._id, currentUser?._id]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socket && targetUser?._id) {
      socket.emit('typing:start', {
        receiverId: targetUser._id,
        senderId: currentUser._id,
        username: currentUser.username,
        name: currentUser.name,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing:stop', {
          receiverId: targetUser._id,
          senderId: currentUser._id,
        });
      }, 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (socket) {
      socket.emit('typing:stop', {
        receiverId: targetUser._id,
        senderId: currentUser._id,
      });
    }

    try {
      setSending(true);
      const res = await messageService.sendMessage(targetUser._id, textToSend);
      if (res.success && res.data?.message) {
        const createdMsg = res.data.message;
        setMessages((prev) => [...prev, createdMsg]);

        // Dispatch via Socket.io
        if (socket) {
          socket.emit('message:send', createdMsg);
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send message');
      setInputText(textToSend); // restore on error
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Avatar
            src={targetUser.profilePicture}
            name={targetUser.name}
            size="md"
            isOnline={isOnline}
            showStatus={true}
            onClick={() => navigate(`/profile/${targetUser._id}`)}
          />

          <div
            className="cursor-pointer"
            onClick={() => navigate(`/profile/${targetUser._id}`)}
          >
            <h4 className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-500 transition-colors">
              {targetUser.name}
            </h4>
            <p className="text-[11px] text-gray-400">
              {isOnline
                ? '🟢 Online'
                : targetUser.lastSeen
                ? `Last seen ${formatTimeAgo(targetUser.lastSeen)}`
                : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1 bg-gray-50/50 dark:bg-dark-bg/50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const isOwn =
              msg.sender?._id === currentUser._id || msg.sender === currentUser._id;
            return (
              <MessageItem
                key={msg._id}
                message={msg}
                isOwnMessage={isOwn}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-gray-900 dark:text-white font-heading">
              Say Hello to {targetUser.name}!
            </h5>
            <p className="text-xs text-gray-400 max-w-xs">
              Send your first message to start this real-time conversation.
            </p>
          </div>
        )}

        <TypingIndicator typingUser={isTyping} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-gray-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={`Message ${targetUser.name}...`}
          className="flex-1 bg-gray-100 dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm rounded-xl px-4 py-2.5 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-dark-card focus:outline-none transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-500/20"
          aria-label="Send Message"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
