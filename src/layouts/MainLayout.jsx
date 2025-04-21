import React, { useContext, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import StudentSidebar from '../components/student/StudentSidebar';
import TutorSidebar from '../components/tutor/TutorSidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import RoleToggle from '../components/shared/RoleToggle';
import { FaBars, FaTimes } from 'react-icons/fa';
import { PiListStarDuotone } from 'react-icons/pi';
import JoinWaitlist from '../components/shared/JoinWaitlist';

const MainLayout = () => {
  const { userRole } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [pageTitle, setPageTitle] = useState('Home');
  const location = useLocation();

  // Update page title based on the current path
  useEffect(() => {
    const path = location.pathname;
    let title = 'PeerSphere';

    // Set title based on path
    if (path.includes('/student/calendar')) {
      title = 'My Calendar';
    } else if (path.includes('/student/sessions')) {
      title = 'My Sessions';
    } else if (path.includes('/student/favorites')) {
      title = 'Favorite Tutors';
    } else if (path.includes('/student/apply-tutor')) {
      title = 'Apply as Tutor';
    } else if (path.includes('/student')) {
      title = 'Find Tutors';
    } else if (path.includes('/tutor/calendar')) {
      title = 'My Calendar';
    } else if (path.includes('/tutor/sessions')) {
      title = 'My Sessions';
    } else if (path.includes('/tutor/transactions')) {
      title = 'Earnings';
    } else if (path.includes('/tutor')) {
      title = 'Tutor Dashboard';
    } else if (path.includes('/admin/applications')) {
      title = 'Tutor Applications';
    } else if (path.includes('/admin/tutors')) {
      title = 'Manage Tutors';
    } else if (path.includes('/admin/sessions')) {
      title = 'Manage Sessions';
    } else if (path.includes('/admin/analytics')) {
      title = 'Analytics';
    } else if (path.includes('/admin')) {
      title = 'Admin Dashboard';
    } else if (path.includes('/book-session')) {
      title = 'Book Session';
    } else if (path.includes('/available-tutors')) {
      title = 'Available Tutors';
    } else if (path.includes('/book-with-tutor')) {
      title = 'Book With Tutor';
    }

    setPageTitle(title);
  }, [location]);

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
  };

  // Render appropriate sidebar based on user role
  const renderSidebar = () => {
    switch (userRole) {
      case 'student':
        return <StudentSidebar closeMobileSidebar={() => setSidebarOpen(false)} />;
      case 'tutor':
        return <TutorSidebar closeMobileSidebar={() => setSidebarOpen(false)} />;
      case 'admin':
        return <AdminSidebar closeMobileSidebar={() => setSidebarOpen(false)} />;
      default:
        return <StudentSidebar closeMobileSidebar={() => setSidebarOpen(false)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile header - only shown on mobile */}
      {isMobile && (
        <header className="bg-white shadow py-4 px-4 flex items-center justify-between z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>
          <div className="flex items-center justify-center flex-1">
            <h1 className="font-bold text-xl text-gray-800">{pageTitle}</h1>
          </div>
          <button
            onClick={() => setWaitlistOpen(true)}
            className={`px-3 py-2 text-white text-sm rounded-md shadow-sm flex items-center
            ${userRole === 'admin' ? "bg-accent-600 hover:bg-accent-700 ring-accent-600/65" :
                userRole === 'tutor' ? "bg-secondary-600 hover:bg-secondary-700 ring-secondary-600/65" :
                  "bg-primary-600 hover:bg-primary-700 ring-primary-600/65"}`}
            aria-label="Join Waitlist"
          >
            <span className="">Join Waitlist</span>
          </button>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
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
            <div className="mb-4 flex justify-end">
              <RoleToggle />
            </div>
          )}
          <Outlet />
        </div>

        {/* Waitlist Modal */}
        {waitlistOpen && <JoinWaitlist onClose={() => setWaitlistOpen(false)} />}
      </div>

      {/* Mobile role toggle button - only shown on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-10">
          <RoleToggle isMobile={true} />
        </div>
      )}

      {/* Desktop floating waitlist button - only shown on desktop */}
      {!isMobile && (
        <div className="fixed bottom-16 mb-2 right-2 z-50">
          <button
            onClick={() => setWaitlistOpen(true)}
            className={`group flex items-center gap-2 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300
            ${userRole === 'admin' ? "bg-accent-600 hover:bg-accent-700 ring-1 ring-accent-600/65" :
                userRole === 'tutor' ? "bg-secondary-600 hover:bg-secondary-700 ring-1 ring-secondary-600/65" :
                  "bg-primary-600 hover:bg-primary-700 ring-1 ring-primary-600/65"}`}
          >
            <PiListStarDuotone className="text-xl" />
            <span className="font-medium">Join Waitlist</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MainLayout;