import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaUserGraduate,
  FaCalendarCheck,
  FaChartBar
} from 'react-icons/fa';

const AdminSidebar = () => {
  return (
    <div className="h-full w-64 bg-white shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-accent-600 flex items-center">
          <span className="bg-accent-600 text-white rounded-md p-1 mr-2">PS</span>
          PeerSphere
        </h1>
        <div className="mt-2 inline-block px-2 py-1 rounded-md bg-accent-100 text-accent-800 text-xs font-medium">
          Admin Mode
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'bg-accent-100 text-accent-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              end
            >
              <FaHome className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/applications"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'bg-accent-100 text-accent-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <FaClipboardList className="mr-3" />
              <span>Applications</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/tutors"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'bg-accent-100 text-accent-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <FaUserGraduate className="mr-3" />
              <span>Peer Tutors</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/sessions"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'bg-accent-100 text-accent-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <FaCalendarCheck className="mr-3" />
              <span>Sessions</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'bg-accent-100 text-accent-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <FaChartBar className="mr-3" />
              <span>Analytics</span>
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

export default AdminSidebar;