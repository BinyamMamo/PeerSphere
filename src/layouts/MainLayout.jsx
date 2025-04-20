// src/layouts/MainLayout.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import StudentSidebar from '../components/student/StudentSidebar';
import TutorSidebar from '../components/tutor/TutorSidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import StudentRightbar from '../components/student/StudentRightbar';
import TutorRightbar from '../components/tutor/TutorRightbar';
import AdminRightbar from '../components/admin/AdminRightbar';
import RoleToggle from '../components/shared/RoleToggle';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

const MainLayout = () => {
  const { userRole } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightbarOpen, setRightbarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        // Close mobile menus when resizing to desktop
        setSidebarOpen(false);
        setRightbarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar/rightbar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
    if (rightbarOpen) setRightbarOpen(false);
  };

  // Render appropriate sidebar based on user role
  const renderSidebar = () => {
    switch (userRole) {
      case 'student':
        return <StudentSidebar />;
      case 'tutor':
        return <TutorSidebar />;
      case 'admin':
        return <AdminSidebar />;
      default:
        return <StudentSidebar />;
    }
  };

  // Render appropriate rightbar based on user role
  const renderRightbar = () => {
    switch (userRole) {
      case 'student':
        return <StudentRightbar />;
      case 'tutor':
        return <TutorRightbar />;
      case 'admin':
        return <AdminRightbar />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile header - only shown on mobile */}
      {isMobile && (
        <header className="bg-white shadow py-5 px-4 flex items-center justify-between z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>
          <div className="flex items-center -ml-5">
            <img src="/peersphere.png" className="h-7 w-7" alt="PeerSphere" />
            <h1 className="font-bold text-xl text-gray-800 ml-2">PeerSphere</h1>
            {/* <h1 className="font-bold text-lg text-gray-800">Find the best Tutors</h1> */}
          </div>
          <button
            onClick={() => setRightbarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open profile menu"
          >
            <FaUser />
          </button>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Overlay for mobile when sidebar/rightbar is open */}
        {isMobile && (sidebarOpen || rightbarOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={handleOverlayClick}
          ></div>
        )}

        {/* Sidebar - always visible on desktop, slide in/out on mobile */}
        <div className={`
          ${isMobile ? 'fixed z-30 top-0 h-full bg-white' : 'h-full'} 
          ${isMobile ? (sidebarOpen ? 'left-0' : '-left-80') : ''} 
          transition-all duration-300 ease-in-out
        `}>
          {/* {isMobile && sidebarOpen && (
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full bg-gray-200 text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
          )} */}
          {renderSidebar()}
        </div>

        {/* Main content area - takes full width on mobile, partial width on desktop */}
        <div className="flex-1 overflow-auto p-4">
          {!isMobile && (
            <div className="mb-4">
              <RoleToggle />
            </div>
          )}
          <Outlet />
        </div>

        {/* Rightbar - always visible on desktop for tutor/admin, hidden by default on mobile
        {(isMobile || userRole !== 'student') && (
          <div className={`
            ${isMobile ? 'fixed z-30 h-full bg-white right-0 w-80' : 'h-full'}
            ${isMobile ? (rightbarOpen ? 'right-0' : '-right-80') : ''}
            transition-all duration-300 ease-in-out
          `}>
            {isMobile && rightbarOpen && (
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => setRightbarOpen(false)}
                  className="p-2 rounded-full bg-gray-200 text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            )}
            {renderRightbar()}
          </div>
        )} */}
      </div>

      {/* Mobile role toggle button - only shown on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-10">
          <RoleToggle isMobile={true} />
        </div>
      )}
    </div>
  );
};

export default MainLayout;