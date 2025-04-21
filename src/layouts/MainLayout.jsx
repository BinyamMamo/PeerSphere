import React, { useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import StudentSidebar from '../components/student/StudentSidebar';
import TutorSidebar from '../components/tutor/TutorSidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import RoleToggle from '../components/shared/RoleToggle';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import JoinWaitlist from '../components/shared/JoinWaitlist';
import { PiListStarDuotone, PiListStarLight } from 'react-icons/pi';

const MainLayout = () => {
  const { userRole } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        // Close mobile menus when resizing to desktop
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar/waitlist when clicking outside on mobile
  const handleOverlayClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
    if (waitlistOpen) setWaitlistOpen(false);
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
          </div>
          <button
            onClick={() => setWaitlistOpen(true)}
            className="px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 shadow-sm"
            aria-label="Join Waitlist"
          >
            Join Waitlist
          </button>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Overlay for mobile when sidebar/waitlist is open */}
        {isMobile && (sidebarOpen || waitlistOpen) && (
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
          {renderSidebar()}
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-4">
          {!isMobile && (
            <div className="mb-4 flex justify-between items-center">
              <RoleToggle />
            </div>
          )}
          <Outlet />
        </div>

        {/* Waitlist Modal */}
        {waitlistOpen && (
          <JoinWaitlist onClose={() => setWaitlistOpen(false)} />
        )}
      </div>

      {/* Mobile role toggle button - only shown on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-10">
          <RoleToggle isMobile={true} />
        </div>
      )}

      {/* Desktop floating waitlist button - only shown on desktop when scrolling */}
      {!isMobile && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setWaitlistOpen(true)}
            className="group ring-4 px-4 py-3 bg-primary-600/95 text-white rounded-3xl hover:ring-2 active:scale-95 transition-all duration-300 transform flex items-center gap-1.5"
          >
            <PiListStarDuotone className='text-xl' />
            <span className='leading-none'>Join Waitlist</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MainLayout;