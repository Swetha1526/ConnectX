import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin.replace(':5173', ':5000');
      
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('[Socket] Connected to server with ID:', newSocket.id);
        newSocket.emit('user:join', user._id);
      });

      newSocket.on('users:online_list', (userIds) => {
        setOnlineUsers(new Set(userIds.map(String)));
      });

      newSocket.on('user:online', ({ userId }) => {
        setOnlineUsers((prev) => new Set([...prev, String(userId)]));
      });

      newSocket.on('user:offline', ({ userId }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(String(userId));
          return next;
        });
      });

      return () => {
        newSocket.disconnect();
        socketRef.current = null;
        setSocket(null);
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      setOnlineUsers(new Set());
    }
  }, [isAuthenticated, user?._id]);

  const isUserOnline = (userId) => {
    if (!userId) return false;
    return onlineUsers.has(String(userId));
  };

  const value = {
    socket,
    onlineUsers,
    isUserOnline,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
