// src/components/shared/RoleToggle.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaUserGraduate, FaChalkboardTeacher, FaUserCog } from 'react-icons/fa';

const RoleToggle = () => {
  const { userRole, currentUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Updated function to switch role by navigating to the appropriate path
  const handleRoleSwitch = (role) => {
    // Preserve the subpath when switching roles
    const currentPath = window.location.pathname;
    const currentPathParts = currentPath.split('/');

    // If we're in a deep path like /student/calendar
    if (currentPathParts.length > 2) {
      // Extract the subpath (everything after the role)
      const subPath = currentPathParts.slice(2).join('/');
      navigate(`/${role}/${subPath}`);
    } else {
      // Just navigate to the role's root
      navigate(`/${role}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-3 flex items-center space-x-4 p-2 bg-orange-200 opacity-75 rounded-lg shadow px-4 py-2.5">
      {/* <span className="text-gray-700 text-sm font-medium">View as:</span> */}

      <button
        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${userRole === 'student' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        onClick={() => handleRoleSwitch('student')}
      >
        <FaUserGraduate />
        {/* <span>Student</span> */}
      </button>

      {(currentUser?.isTutor || userRole === 'tutor') && (
        <button
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${userRole === 'tutor' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          onClick={() => handleRoleSwitch('tutor')}
        >
          <FaChalkboardTeacher />
          {/* <span>Tutor</span> */}
        </button>
      )}

      {/* For demo purposes, always show admin toggle */}
      <button
        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${userRole === 'admin' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        onClick={() => handleRoleSwitch('admin')}
      >
        <FaUserCog />
        {/* <span>Admin</span> */}
      </button>
    </div>
  );
};

export default RoleToggle;