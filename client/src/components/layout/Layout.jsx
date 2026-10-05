import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import RightPanel from './RightPanel';

export const Layout = ({ hideRightPanel = false }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex justify-center text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-7xl flex relative">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Center Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-6">
          {/* Mobile Top Navbar */}
          <Navbar />

          <main className="flex-1 p-4 sm:p-6 max-w-3xl w-full mx-auto">
            <Outlet />
          </main>
        </div>

        {/* Right Desktop Widget Panel */}
        {!hideRightPanel && <RightPanel />}

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
