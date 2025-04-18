// src/components/shared/RoleToggle.jsx
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { FaUserGraduate, FaChalkboardTeacher, FaUserCog } from 'react-icons/fa';

const RoleToggle = () => {
  const { userRole, switchRole, currentUser } = useContext(AppContext);

  return (
    <div className="fixed bottom-4 right-3 flex items-center space-x-4 p-2 bg-orange-400/20 opacity-75 rounded-lg shadow px-5 py-2.5">
      {/* <span className="text-gray-700 text-sm font-medium">View as:</span> */}

      <button
        className={`flex items-center space-x-1 px-3 py-1 rounded-md ${userRole === 'student' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        onClick={() => switchRole('student')}
      >
        <FaUserGraduate />
        <span>Student</span>
      </button>

      {(currentUser?.isTutor || userRole === 'tutor') && (
        <button
          className={`flex items-center space-x-1 px-3 py-1 rounded-md ${userRole === 'tutor' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          onClick={() => switchRole('tutor')}
        >
          <FaChalkboardTeacher />
          <span>Tutor</span>
        </button>
      )}

      {/* For demo purposes, always show admin toggle */}
      <button
        className={`flex items-center space-x-1 px-3 py-1 rounded-md ${userRole === 'admin' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        onClick={() => switchRole('admin')}
      >
        <FaUserCog />
        <span>Admin</span>
      </button>
    </div>
  );
};

export default RoleToggle;