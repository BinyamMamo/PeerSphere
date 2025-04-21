import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaListAlt,
  FaStar,
  FaCaretLeft,
  FaChalkboardTeacher,
  FaCalendarPlus,
  FaExchangeAlt,
  FaUserGraduate,
  FaTimes
} from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const StudentSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, sessions } = useContext(AppContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768);
      if (width >= 768) {
        setIsCollapsed(false); // Reset collapse state on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Navigation handlers
  const handleInstantBookingClick = () => {
    navigate('/book-session');
  };

  const handleApplyTutorClick = () => {
    navigate('/student/apply-tutor');
  };

  // Handler for switching to tutor mode
  const handleSwitchToTutor = () => {
    navigate('/tutor');
  };

  // Determine Lottie sizing based on screen width
  const getLottieSize = () => {
    if (windowWidth < 350) return { width: 60, height: 60 };
    if (windowWidth < 500) return { width: 100, height: 100 };
    return { width: 150, height: 150 };
  };

  const lottieSize = getLottieSize();

  return (
    <div className={`h-full bg-white/25 shadow-sm flex flex-col transition-all duration-300 ${isCollapsed && !isMobile ? 'w-24' : (isMobile ? 'w-full' : 'w-80')}`}>
      {/* Logo */}
      <div className={`p-4 my-2 flex items-center justify-between ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
        <div className="flex items-center">
          <img
            src="/peersphere.png"
            className={`${isCollapsed && !isMobile ? 'w-10 h-10 ml-2' : 'h-8 w-8 mx-2'}`}
            alt="PeerSphere Logo"
          />
          {(!isCollapsed || isMobile) && (
            <Link to="/" className="font-bold text-xl text-neutral-700 ml-0.5">
              PeerSphere
            </Link>
          )}
        </div>
        {!isMobile && (
          <div
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-primary-700 focus:outline-none cursor-pointer"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <FaCaretLeft className={`text-xl transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className={`${isCollapsed && !isMobile ? 'p-2' : 'p-4 pt-0 pl-6'}`}>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/student"
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary-900/5 text-primary-800 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              end
              title={isCollapsed && !isMobile ? 'Find Tutors' : ''}
            >
              <FaHome className={`${isCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}`} />
              {(!isCollapsed || isMobile) && <span>Find Tutors</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/calendar"
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary-900/5 text-primary-800 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              title={isCollapsed && !isMobile ? 'My Calendar' : ''}
            >
              <FaCalendarAlt className={`${isCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}`} />
              {(!isCollapsed || isMobile) && <span>My Calendar</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/sessions"
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary-900/5 text-primary-800 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              title={isCollapsed && !isMobile ? 'My Sessions' : ''}
            >
              <FaListAlt className={`${isCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}`} />
              {(!isCollapsed || isMobile) && <span>My Sessions</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/favorites"
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-primary-900/5 text-primary-800 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              title={isCollapsed && !isMobile ? 'Favorite Tutors' : ''}
            >
              <FaStar className={`${isCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}`} />
              {(!isCollapsed || isMobile) && <span>Favorite Tutors</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Quick Actions and Cards Section */}
      <div className={`${isCollapsed && !isMobile ? 'p-2' : 'px-6 py-4'} space-y-4 pt-0`}>
        {/* Instant Booking */}
        {isCollapsed && !isMobile ? (
          <div
            onClick={handleInstantBookingClick}
            className="cursor-pointer group flex items-center justify-center rounded-lg p-3 transition-all duration-300"
            title="Instant Booking"
          >
            <FaCalendarPlus className="text-primary-600 text-lg mx-auto group-hover:scale-110 transition-transform duration-300" />
          </div>
        ) : (
            <div className="group text-sm bg-gradient-to-r from-primary-400 to-primary-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <h3 className="font-medium text-white mb-4">Find Your Perfect Tutor</h3>

            <div
              onClick={handleInstantBookingClick}
                className="flex justify-center items-center bg-white text-neutral-600 px-4 py-2 rounded font-medium shadow hover:bg-neutral-100 transition duration-300 cursor-pointer"
            >
              <FaCalendarPlus className="mr-2" />
              Instant Booking
            </div>
          </div>
        )}

        {/* Become a Tutor */}
        {isCollapsed && !isMobile ? (
          <div
            onClick={handleApplyTutorClick}
            className="cursor-pointer group flex items-center justify-center rounded p-3 transition-all duration-300"
            title="Become a Tutor"
          >
            <FaChalkboardTeacher className="text-accent-600 text-lg mx-auto group-hover:scale-110 transition-transform duration-300" />
          </div>
        ) : (
          <div className="group text-sm bg-gradient-to-r from-accent-400 to-accent-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
              <div className="flex-1 flex-col items-center">
                <h3 className="font-medium text-white mb-2">Share Your Knowledge</h3>

                {/* Lottie animation with responsive sizing */}
                <div className="md:flex justify-center flex-1 my-2 sm:mt-0 hidden">
                  <DotLottieReact
                    src="https://lottie.host/6dad63ba-1cf5-4078-8d30-20d2b8a856e4/5cAjPbg9tH.lottie"
                    loop
                    autoplay
                    style={lottieSize}
                    className="mx-auto"
                  />
                </div>
                <div
                  onClick={handleApplyTutorClick}
                  className="mt-2 flex justify-center items-center border-0 bg-white text-neutral-600 px-4 py-2 rounded font-medium shadow hover:bg-slate-50 transition duration-300 cursor-pointer"
                >
                  <FaChalkboardTeacher className="mr-2" />
                  Apply for Tutoring
                </div>
            </div>
          </div>
        )}
      </div>

      {/* User Mode Switch Section */}
      <div className={`mt-auto pt-3 border-t border-gray-200 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
        {isCollapsed && !isMobile ? (
          <div
            className="flex flex-col items-center group cursor-pointer"
            onClick={handleSwitchToTutor}
            title="Switch to Tutor Mode"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || "https://i.pravatar.cc/150?img=4"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-primary-300 transition duration-300"
              />
              <div className="absolute -bottom-5 -right-5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
          </div>
        ) : (
          <div className="group transition-all duration-300 flex items-center">
            <div className="relative">
              <img
                src={currentUser?.avatar || "https://i.pravatar.cc/150?img=4"}
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-white opacity-90 text-neutral-700 border-2 border-neutral-700 flex items-center justify-center p-[3px]"><FaUserGraduate size={8} className='' /></div>
            </div>
            <div className="ml-4 flex-grow flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm text-gray-800">
                  {currentUser?.firstName || 'Student'} {currentUser?.lastName || ''}
                </h2>
                </div>
              <div
                className="text-xs flex items-center text-gray-500 hover:text-primary-600 transition duration-200 mt-1 cursor-pointer"
                onClick={handleSwitchToTutor}
              >
                <FaExchangeAlt className="mr-1" size={10} />
                Switch to Tutor Mode
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSidebar;