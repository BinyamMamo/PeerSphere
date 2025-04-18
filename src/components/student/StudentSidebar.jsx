import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaListAlt, FaStar, FaCaretLeft, FaChalkboardTeacher, FaCalendarPlus, FaExchangeAlt, FaUserGraduate } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import AccountStatusIndicator from '../shared/AccountStatusIndicator';

const StudentSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, sessions } = useContext(AppContext);
  const navigate = useNavigate();

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

  // Get upcoming sessions (first 3)
  const upcomingSessions = sessions
    .filter(session =>
      session.studentId === currentUser?.id &&
      session.status === 'Upcoming'
    )
    .slice(0, 3);

  return (
    <div className={`h-full bg-white/25 shadow-sm flex flex-col transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-80'}`}>
      {/* Logo */}
      <div className={`p-4 my-2 flex items-center justify-between ${isCollapsed ? 'px-2' : ''}`}>
        <div className="flex items-center">
          <img
            src="/peersphere.png"
            className={`${isCollapsed ? 'w-10 h-10 ml-2' : 'h-8 w-8 mx-2'}`}
            alt="PeerSphere Logo"
          />
          {!isCollapsed && (
            <Link to="/" className="font-bold text-xl text-neutral-700 ml-0.5">
              PeerSphere
            </Link>
          )}
        </div>
        <div
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-primary-700 focus:outline-none cursor-pointer"
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <FaCaretLeft className={`text-xl transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={`${isCollapsed ? 'p-2' : 'p-4 pt-0 pl-6'}`}>
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
              title={isCollapsed ? 'Find Tutors' : ''}
            >
              <FaHome className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>Find Tutors</span>}
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
              title={isCollapsed ? 'My Calendar' : ''}
            >
              <FaCalendarAlt className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>My Calendar</span>}
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
              title={isCollapsed ? 'My Sessions' : ''}
            >
              <FaListAlt className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>My Sessions</span>}
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
              title={isCollapsed ? 'Favorite Tutors' : ''}
            >
              <FaStar className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>Favorite Tutors</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Quick Actions and Cards Section */}
      <div className={`${isCollapsed ? 'p-2' : 'px-6 py-4'} space-y-4`}>
        {/* Instant Booking */}
        {isCollapsed ? (
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
              className="inline-flex items-center bg-white text-primary-600 px-4 py-2 rounded font-medium shadow hover:bg-neutral-100 transition duration-300 cursor-pointer"
            >
              <FaCalendarPlus className="mr-2" />
              Instant Booking
            </div>
          </div>
        )}

        {/* Become a Tutor */}
        {isCollapsed ? (
          <div
            onClick={handleApplyTutorClick}
            className="cursor-pointer group flex items-center justify-center rounded p-3 transition-all duration-300"
            title="Become a Tutor"
          >
            <FaChalkboardTeacher className="text-accent-600 text-lg mx-auto group-hover:scale-110 transition-transform duration-300" />
          </div>
        ) : (
          <div className="group text-sm bg-gradient-to-r from-accent-400 to-accent-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <h3 className="font-medium text-white mb-2">Share Your Knowledge</h3>
            <div
              onClick={handleApplyTutorClick}
              className="inline-flex items-center border-0 bg-white text-accent-600 px-4 py-2 rounded font-medium shadow hover:bg-slate-50 transition duration-300 cursor-pointer"
            >
              <FaChalkboardTeacher className="mr-2" />
              Apply for Tutoring
            </div>
          </div>
        )}
      </div>

      {/* User Mode Switch Section */}
      <div className={`mt-auto pt-3 border-t border-gray-200 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        {isCollapsed ? (
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
              {/* <AccountStatusIndicator /> */}
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