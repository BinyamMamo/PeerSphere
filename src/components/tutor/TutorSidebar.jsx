import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaListAlt, 
  FaMoneyBillWave,
  FaCaretLeft,
  FaExchangeAlt,
  FaStar,
  FaCalendarPlus,
  FaChalkboardTeacher,
  FaUserTie
} from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import AccountStatusIndicator from '../shared/AccountStatusIndicator';
import { TbCalendarCog } from 'react-icons/tb';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const TutorSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, tutors } = useContext(AppContext);
  const navigate = useNavigate();

  // Find tutor data (assuming currentUser has the same ID as a tutor)
  const tutorData = tutors?.find(tutor =>
    tutor.firstName === currentUser?.firstName &&
    tutor.lastName === currentUser?.lastName
  ) || {};

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Navigation handlers
  const handleAvailabilityClick = () => {
    navigate('/tutor/calendar');
  };

  const handleManageSubjectsClick = () => {
    navigate('/tutor/subjects');
  };

  // Handler for switching to student mode
  const handleSwitchToStudent = () => {
    navigate('/student');
  };

  return (
    <div className={`h-full bg-white/25 shadow-sm flex flex-col transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-80'}`}>
      {/* Logo */}
      <div className={`p-4 my-2 flex items-center justify-between ${isCollapsed ? 'px-2' : ''}`}>
        <div className="flex items-center">
          <img
            src="/peersphere.png"
            className={`${isCollapsed ? 'w-10 h-10 ml-2' : 'h-8 w-8 mx-2'}`}
            alt="TutorSphere Logo"
          />
          {!isCollapsed && (
            <Link to="/" className="font-bold text-xl text-neutral-700 ml-0.5">
              PeerSphere
            </Link>
          )}
        </div>
        <div
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-secondary-700 focus:outline-none cursor-pointer"
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
              to="/tutor"
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-secondary-900/5 text-secondary-800 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              end
              title={isCollapsed ? 'Dashboard' : ''}
            >
              <FaHome className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tutor/calendar"
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-secondary-900/5 text-secondary-800 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              title={isCollapsed ? 'Calendar' : ''}
            >
              <FaCalendarAlt className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>Calendar</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tutor/sessions"
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-secondary-900/5 text-secondary-800 font-bold'
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
              to="/tutor/transactions"
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-secondary-900/5 text-secondary-800 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              title={isCollapsed ? 'Earnings' : ''}
            >
              <FaMoneyBillWave className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>Earnings</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tutor/reviews"
              className={({ isActive }) =>
                `hidden flex items-center p-2 py-3 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-secondary-900/5 text-secondary-800 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              title={isCollapsed ? 'Reviews' : ''}
            >
              <FaStar className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>Reviews</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Quick Actions and Cards Section */}
      <div className={`${isCollapsed ? 'p-2' : 'px-6 py-4'} space-y-4 pt-0`}>
        {/* Set Availability */}
        {isCollapsed ? (
          <div
            onClick={handleAvailabilityClick}
            className="cursor-pointer group flex items-center justify-center rounded-lg p-3 transition-all duration-300"
            title="Set Availability"
          >
            <TbCalendarCog className="text-secondary-600 text-lg mx-auto group-hover:scale-110 transition-transform duration-300" />
          </div>
        ) : (
          <div className="group text-sm bg-gradient-to-r from-secondary-400 to-secondary-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <h3 className="font-medium text-white mb-4">Set Your Availability</h3>

              <DotLottieReact
                src="https://lottie.host/2c3958d2-ecf5-4d1e-9230-129fb8981a0d/KmfgtpWGdj.lottie"
                loop
                autoplay
                className='hidden md:flex -mt-2 -ml-2 mb-1'
              />

            <div
              onClick={handleAvailabilityClick}
                className="flex justify-center items-center bg-white text-neutral-600 px-4 py-2 rounded shadow hover:bg-neutral-100 transition duration-300 cursor-pointer"
            >
              <TbCalendarCog className="mr-2 text-sm" />
              Manage Availability
            </div>
          </div>
        )}

        {/* Manage Subjects
        {isCollapsed ? (
          <div
            onClick={handleManageSubjectsClick}
            className="cursor-pointer group flex items-center justify-center rounded p-3 transition-all duration-300"
            title="Manage Subjects"
          >
            <FaChalkboardTeacher className="text-accent-600 text-lg mx-auto group-hover:scale-110 transition-transform duration-300" />
          </div>
        ) : (
            <div className="group text-sm bg-gradient-to-r from-accent-400 to-accent-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <h3 className="font-medium text-white mb-4">Update Your Skills</h3>
            <div
              onClick={handleManageSubjectsClick}
                className="flex justify-center items-center border-0 bg-white text-neutral-600 px-4 py-2 rounded font-medium shadow hover:bg-slate-50 transition duration-300 cursor-pointer"
            >
              <FaChalkboardTeacher className="mr-2" />
              Manage Subjects
            </div>
          </div>
        )} */}
      </div>

      {/* User Mode Switch Section */}
      <div className={`mt-auto pt-3 border-t border-gray-200 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        {isCollapsed ? (
          <div
            className="flex flex-col items-center group cursor-pointer"
            onClick={handleSwitchToStudent}
            title="Switch to Student Mode"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || "https://i.pravatar.cc/150?img=1"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-secondary-300 transition duration-300"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-secondary-500 text-white w-4 h-4 flex items-center justify-center">
                <FaUserTie size={8} />
              </div>
            </div>
          </div>
        ) : (
          <div className="group transition-all duration-300 flex items-center">
            <div className="relative">
              <img
                src={currentUser?.avatar || "https://i.pravatar.cc/150?img=1"}
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-white opacity-90 text-neutral-700 border-2 border-accent-500 flex items-center justify-center p-[3px]">
                <FaChalkboardTeacher size={8} className="text-accent-600" />
              </div>
            </div>
            <div className="ml-4 flex-grow flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm text-gray-800">
                  {currentUser?.firstName || 'Tutor'} {currentUser?.lastName || ''}
                </h2>
              </div>
              {/* <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" size={10} />
                <span className="text-xs text-gray-600">{tutorData.rating?.toFixed(1) || '4.5'}</span>
                <AccountStatusIndicator />
              </div> */}
              <div
                className="text-xs flex items-center text-gray-500 hover:text-secondary-600 transition duration-200 mt-1 cursor-pointer"
                onClick={handleSwitchToStudent}
              >
                <FaExchangeAlt className="mr-1" size={10} />
                Switch to Student Mode
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSidebar;