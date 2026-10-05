import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import CreatePost from '../pages/CreatePost';
import Chat from '../pages/Chat';
import Notifications from '../pages/Notifications';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Protected App Routes inside Main Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Chat Layout with dedicated full width / minimal right panel */}
      <Route
        element={
          <ProtectedRoute>
            <Layout hideRightPanel={true} />
          </ProtectedRoute>
        }
      >
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
