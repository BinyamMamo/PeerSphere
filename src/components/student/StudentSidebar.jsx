import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaListAlt,
  FaStar
} from 'react-icons/fa';

const StudentSidebar = () => {
  return (
    <div className="h-full w-64 overflow-hidden bg-transparent shadow-none flex flex-col">
      {/* Logo */}
      <div className="p-4 py-2 border-b-0">
        <div className="flex items-center border-0 border-neutral-700"> {/* Changed yellow to neutral */}
          <img src="/peersphere.png" className='h-16 p-3.5 pl-0' alt="" />
          <Link to="/" className="font-bold text-xl text-neutral-600">PeerSphere</Link>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 pt-0 pl-6">
        <ul className="space-y-2 divider-y-2 divider-neutral-700"> {/* Changed yellow to neutral */}
          <li>
            <NavLink
              to="/student"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'font-bold text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              end
            >
              <FaHome className="mr-3" />
              <span>Find Tutors</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/calendar"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'font-bold text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <FaCalendarAlt className="mr-3" />
              <span>My Calendar</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/sessions"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'font-bold text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <FaListAlt className="mr-3" />
              <span>My Sessions</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/favorites"
              className={({ isActive }) => `flex items-center p-2 rounded-lg ${isActive ? 'font-bold text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <FaStar className="mr-3" />
              <span>Favorite Tutors</span>
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

export default StudentSidebar;

