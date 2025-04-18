import React from 'react';
import { FaUserCircle, FaBell, FaQuestion, FaCog } from 'react-icons/fa';

const AdminRightbar = () => {
  return (
    <div className="h-full w-80 flex flex-col p-4 overflow-auto">
      {/* Profile Section */}
      <div className="flex items-center mb-6 mt-3">
        <img
          src="https://i.pravatar.cc/150?img=1"
          alt="Admin Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-3">
          <h2 className="font-medium">Welcome, Admin</h2>
          <p className="text-sm text-gray-500">Program Manager</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Quick Stats</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-accent-50 p-3 rounded-lg">
            <p className="text-accent-700 text-xl font-semibold">25</p>
            <p className="text-xs text-gray-600">Active Tutors</p>
          </div>

          <div className="bg-accent-50 p-3 rounded-lg">
            <p className="text-accent-700 text-xl font-semibold">50</p>
            <p className="text-xs text-gray-600">Students</p>
          </div>

          <div className="bg-accent-50 p-3 rounded-lg">
            <p className="text-accent-700 text-xl font-semibold">5</p>
            <p className="text-xs text-gray-600">Pending Applications</p>
          </div>

          <div className="bg-accent-50 p-3 rounded-lg">
            <p className="text-accent-700 text-xl font-semibold">10</p>
            <p className="text-xs text-gray-600">Today's Sessions</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 flex items-center">
          <FaBell className="mr-2 text-accent-600" />
          Notifications
        </h3>

        <div className="space-y-3">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm font-medium">New Tutor Application</p>
            <p className="text-xs text-gray-600">Sara Al-Qubaisi has applied to become a tutor.</p>
            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm font-medium">Session Report</p>
            <p className="text-xs text-gray-600">Weekly session report is now available.</p>
            <p className="text-xs text-gray-400 mt-1">Yesterday</p>
          </div>
        </div>
      </div>

      {/* Admin Links */}
      <div>
        <h3 className="font-medium mb-3">Quick Links</h3>

        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-accent-600">
              <FaCog className="mr-2" />
              System Settings
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-accent-600">
              <FaUserCircle className="mr-2" />
              User Management
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-accent-600">
              <FaQuestion className="mr-2" />
              Help Center
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminRightbar;