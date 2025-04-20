// src/components/shared/RoleToggle.jsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaUserGraduate, FaChalkboardTeacher, FaUserCog, FaCaretDown, FaCaretUp } from 'react-icons/fa';

const RoleToggle = ({ isMobile = false }) => {
  const { userRole, switchRole, currentUser } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Only enable tutor option if user has tutor permissions
  const canSwitchToTutor = currentUser?.isTutor || userRole === 'tutor';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle role switch
  const handleRoleSwitch = (role) => {
    if (userRole !== role) {
      switchRole(role);
      localStorage.setItem('userRole', role);
    }
    setDropdownOpen(false);
  };

  // Mobile styles for the floating role toggle
  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center justify-center p-5 rounded-full ${userRole === 'admin' ? "bg-accent-600" : userRole === 'tutor' ? "bg-emerald-600" : "bg-primary-600"} text-white shadow-xl ring-2 active:ring  transition ease-in-out`}
          aria-label="Switch role"
        >
          {userRole === 'student' ? (
            <FaUserGraduate size={20} />
          ) : userRole === 'tutor' ? (
            <FaChalkboardTeacher size={20} />
          ) : (
            <FaUserCog size={20} />
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-14 right-0 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 w-32">
            <button
              className={`w-full text-left px-4 py-2 text-sm flex items-center ${userRole === 'student'
                ? 'text-primary-700 font-medium bg-primary-50'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => handleRoleSwitch('student')}
            >
              <FaUserGraduate className="mr-2" />
              Student
            </button>

            <button
              className={`w-full text-left px-4 py-2 text-sm flex items-center ${userRole === 'tutor'
                ? 'text-secondary-700 font-medium bg-secondary-50'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => handleRoleSwitch('tutor')}
            >
              <FaChalkboardTeacher className="mr-2" />
              Tutor
            </button>

            <button
              className={`w-full text-left px-4 py-2 text-sm flex items-center ${userRole === 'admin'
                ? 'text-accent-700 font-medium bg-accent-50'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => handleRoleSwitch('admin')}
            >
              <FaUserCog className="mr-2" />
              Admin
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="z-30 fixed bottom-3 right-3 flex items-center space-x-4 p-2 bg-orange-200 opacity-75 rounded-lg shadow px-4 py-2.5" ref={dropdownRef}>
      <button
        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${userRole === 'student' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        onClick={() => handleRoleSwitch('student')}
      >
        <FaUserGraduate />
      </button>

      {(canSwitchToTutor || userRole === 'tutor') && (
        <button
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${userRole === 'tutor' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          onClick={() => handleRoleSwitch('tutor')}
        >
          <FaChalkboardTeacher />
        </button>
      )}

      {/* For demo purposes, always show admin toggle */}
      <button
        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${userRole === 'admin' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        onClick={() => handleRoleSwitch('admin')}
      >
        <FaUserCog />
      </button>
    </div>
  );
};

export default RoleToggle;