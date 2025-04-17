// src/layouts/MainLayout.jsx
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import StudentSidebar from '../components/student/StudentSidebar';
import TutorSidebar from '../components/tutor/TutorSidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import StudentRightbar from '../components/student/StudentRightbar';
import TutorRightbar from '../components/tutor/TutorRightbar';
import AdminRightbar from '../components/admin/AdminRightbar';
import RoleToggle from '../components/shared/RoleToggle';

const MainLayout = () => {
  const { userRole } = useContext(AppContext);

  // Render appropriate sidebars based on user role
  const renderSidebars = () => {
    switch (userRole) {
      case 'student':
        return (
          <>
            <StudentSidebar />
            <div className="flex-grow overflow-auto p-4">
              <div className="mb-4">
                <RoleToggle />
              </div>
              <Outlet />
            </div>
            <StudentRightbar />
          </>
        );
      case 'tutor':
        return (
          <>
            <TutorSidebar />
            <div className="flex-grow overflow-auto p-4">
              <div className="mb-4">
                <RoleToggle />
              </div>
              <Outlet />
            </div>
            <TutorRightbar />
          </>
        );
      case 'admin':
        return (
          <>
            <AdminSidebar />
            <div className="flex-grow overflow-auto p-4">
              <div className="mb-4">
                <RoleToggle />
              </div>
              <Outlet />
            </div>
            <AdminRightbar />
          </>
        );
      default:
        return (
          <>
            <StudentSidebar />
            <div className="flex-grow overflow-auto p-4">
              <div className="mb-4">
                <RoleToggle />
              </div>
              <Outlet />
            </div>
            <StudentRightbar />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {renderSidebars()}
    </div>
  );
};

export default MainLayout;