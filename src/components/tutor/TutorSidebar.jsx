import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaListAlt, 
  FaMoneyBillWave
} from 'react-icons/fa';

const TutorSidebar = () => {
  return (
    <div className="h-full w-64 bg-white shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-secondary-600 flex items-center">
          <span className="bg-secondary-600 text-white rounded-md p-1 mr-2">PS</span>
          PeerSphere
        </h1>
        <div className="mt-2 inline-block px-2 py-1 rounded-md bg-secondary-100 text-secondary-800 text-xs font-medium">
          Tutor Mode
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/tutor" 
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${
                isActive ? 'bg-secondary-100 text-secondary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              end
            >
              <FaHome className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/tutor/calendar" 
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${
                isActive ? 'bg-secondary-100 text-secondary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaCalendarAlt className="mr-3" />
              <span>Calendar</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/tutor/sessions" 
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${
                isActive ? 'bg-secondary-100 text-secondary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaListAlt className="mr-3" />
              <span>My Sessions</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/tutor/transactions" 
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${
                isActive ? 'bg-secondary-100 text-secondary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaMoneyBillWave className="mr-3" />
              <span>Transactions</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500">© 2025 PeerSphere</p>
      </div>
    </div>
  );
};

export default TutorSidebar;

