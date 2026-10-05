import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Sparkles } from 'lucide-react';
import { messageService } from '../services/messageService';
import { userService } from '../services/userService';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

export const Chat = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch threads list
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await messageService.getConversationsList();
      if (res.success) {
        setConversations(res.data.conversations || []);
      }
    } catch (err) {
      console.error('[Chat] Error loading conversations list:', err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // If URL has :userId, fetch or set that user as active
  useEffect(() => {
    if (userId) {
      const existing = conversations.find(
        (c) => c.user?._id.toString() === userId.toString()
      );

      if (existing) {
        setActiveUser(existing.user);
      } else {
        // Fetch user profile to open new chat thread
        userService
          .getUserProfile(userId)
          .then((res) => {
            if (res.success && res.data?.user) {
              setActiveUser(res.data.user);
            }
          })
          .catch((err) => console.error('[Chat] Error loading active user:', err));
      }
    } else {
      // On desktop, auto-select first conversation if available
      if (window.innerWidth >= 768 && conversations.length > 0 && !activeUser) {
        setActiveUser(conversations[0].user);
      }
    }
  }, [userId, conversations]);

  // Socket listener to refresh conversations list on incoming message
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceive = (newMsg) => {
      fetchConversations();
    };

    socket.on('message:receive', handleMessageReceive);
    return () => {
      socket.off('message:receive', handleMessageReceive);
    };
  }, [socket, fetchConversations]);

  const handleSelectConversation = (user) => {
    setActiveUser(user);
    navigate(`/chat/${user._id}`);
  };

  const handleBackToList = () => {
    setActiveUser(null);
    navigate('/chat');
  };

  const filteredConversations = conversations.filter((c) =>
    c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] flex bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Left Panel: Conversation Threads List */}
      <div
        className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-100 dark:border-gray-800 ${
          activeUser && userId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header & Search */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 font-heading">
              <MessageSquare className="w-5 h-5 text-brand-500" />
              Messages
            </h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs rounded-xl pl-9 pr-3 py-2 border border-transparent focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={filteredConversations}
            activeUserId={activeUser?._id}
            onSelectConversation={handleSelectConversation}
            loading={loadingList}
          />
        </div>
      </div>

      {/* Right Panel: Active Chat Window or Empty State */}
      <div
        className={`flex-1 flex flex-col ${
          !activeUser && !userId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeUser ? (
          <ChatWindow
            targetUser={activeUser}
            onBack={handleBackToList}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 dark:bg-dark-bg/50">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
              Your Messages
            </h4>
            <p className="text-xs text-gray-400 max-w-sm mt-1">
              Select a conversation from the left or visit a user's profile to start chatting in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
