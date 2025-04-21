import React, { useContext, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import StudentSidebar from '../components/student/StudentSidebar';
import TutorSidebar from '../components/tutor/TutorSidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import RoleToggle from '../components/shared/RoleToggle';
import { FaBars, FaTimes } from 'react-icons/fa';
import { PiListStarDuotone } from 'react-icons/pi';

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
    if (waitlistOpen) setWaitlistOpen(false);
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
            className="px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 shadow-sm flex items-center"
            aria-label="Join Waitlist"
          >
            <span className="hidden sm:inline mr-1">Join</span>
            <span>List</span>
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
            <div className="mb-4 flex justify-end">
              <RoleToggle />
            </div>
          )}
          <Outlet />
        </div>

        {/* Waitlist Modal */}
        {waitlistOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Join Our Waitlist</h2>
                <button
                  onClick={() => setWaitlistOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <p className="mb-4 text-gray-600">
                Get early access to PeerSphere and connect with peer tutors at your university.
              </p>

              <form>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="your@university.edu"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <input
                    type="text"
                    id="university"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your University"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200"
                >
                  Join Waitlist
                </button>
              </form>
            </div>
          </div>
        )}
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
            className="group flex items-center gap-2 bg-primary-600 text-white px-5 py-3 rounded-full hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
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