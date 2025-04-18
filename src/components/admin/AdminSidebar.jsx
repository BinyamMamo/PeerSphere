import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaUserGraduate,
  FaCalendarCheck,
  FaChartBar
} from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const AdminSidebar = () => {
  return (
    <div className="h-full w-64 flex flex-col">
      {/* Logo */}
      <div className="p-4 py-2 border-b">
        <div className="flex items-center border-0 border-neutral-700"> {/* Changed yellow to neutral */}
          <img src="/peersphere.png" className='h-16 p-3.5 pl-0' alt="" />
          <Link to="/" className="font-bold text-xl text-neutral-600">PeerSphere</Link>
        </div>
        {/* <div className="mt-2 mb-2 flex items-center px-2 py-1 rounded-md bg-accent-100 text-accent-800 text-xs font-medium">
          <span className='flex-grow'>Admin Mode</span>
          <MdOutlineAdminPanelSettings className='text-accent-800 rounded-md ' />
        </div> */}
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
      <div className="p-4 border-t-0">
        <p className="text-xs text-gray-500">© 2025 PeerSphere</p>
      </div>
    </div>
  );
};

export default AdminSidebar;