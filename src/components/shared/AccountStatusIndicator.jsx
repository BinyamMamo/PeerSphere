import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { FaUserGraduate, FaChalkboardTeacher, FaCaretDown } from 'react-icons/fa';

const AccountStatusIndicator = () => {
  const { userRole, switchRole, currentUser } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    if (role === 'tutor' && !canSwitchToTutor) return;
    if (userRole !== role) {
      switchRole(role);
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center bg-gray-100/0 hover:bg-gray-100/75 rounded-md px-2 pl-1 py-0.5 text-xs text-gray-700"
      >
        {userRole === 'student' ? (
          <>
            <FaUserGraduate className="mr-1" size={10} />
            <span>Student</span>
          </>
        ) : (
          <>
            <FaChalkboardTeacher className="mr-1" size={10} />
            <span>Tutor</span>
          </>
        )}
        <FaCaretDown className="ml-1.5" size={10} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 w-24">
          <button
            className={`w-full text-left px-3 py-1.5 text-xs flex items-center ${userRole === 'student'
              ? 'text-primary-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
            onClick={() => handleRoleSwitch('student')}
          >
            <FaUserGraduate className="mr-2" size={10} />
            Student
          </button>

          <button
            className={`w-full text-left px-3 py-1.5 text-xs flex items-center ${!canSwitchToTutor
              ? 'text-gray-400 cursor-not-allowed'
              : userRole === 'tutor'
                ? 'text-secondary-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
            onClick={() => canSwitchToTutor && handleRoleSwitch('tutor')}
          >
            <FaChalkboardTeacher className="mr-2" size={10} />
            Tutor
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountStatusIndicator;
