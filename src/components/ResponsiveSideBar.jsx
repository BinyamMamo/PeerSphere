import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHome, FaCalendarAlt, FaListAlt, FaStar, FaChevronLeft } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';

const ResponsiveSidebar = ({ userRole = 'student' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Close mobile menu when resizing to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-md bg-primary-500 text-white shadow-lg"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* Overlay - only on mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Sidebar - always visible on desktop, conditionally on mobile */}
      <div
        className={`
          fixed md:static h-full z-30 bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isMobile ? (isOpen ? 'left-0' : '-left-64') : 'left-0'}
          ${isMobile ? 'w-64' : 'w-64 md:w-80'}
        `}
      >
        {/* Logo */}
        <div className="p-4 my-2 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/peersphere.png"
              className="h-8 w-8 mx-2"
              alt="PeerSphere Logo"
            />
            <Link to="/" className="font-bold text-xl text-neutral-700 ml-0.5">
              PeerSphere
            </Link>
          </div>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-primary-700 focus:outline-none"
            >
              <FaChevronLeft />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 pt-0 pl-6">
          <ul className="space-y-2">
            <li>
              <NavLink
                to={`/${userRole}`}
                className={({ isActive }) =>
                  `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                    ? 'bg-primary-900/5 text-primary-800 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                end
                onClick={() => isMobile && setIsOpen(false)}
              >
                <FaHome className="mr-3" />
                <span>Find Tutors</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${userRole}/calendar`}
                className={({ isActive }) =>
                  `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                    ? 'bg-primary-900/5 text-primary-800 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                <FaCalendarAlt className="mr-3" />
                <span>My Calendar</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${userRole}/sessions`}
                className={({ isActive }) =>
                  `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                    ? 'bg-primary-900/5 text-primary-800 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                <FaListAlt className="mr-3" />
                <span>My Sessions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${userRole}/favorites`}
                className={({ isActive }) =>
                  `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                    ? 'bg-primary-900/5 text-primary-800 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                <FaStar className="mr-3" />
                <span>Favorite Tutors</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ResponsiveSidebar;