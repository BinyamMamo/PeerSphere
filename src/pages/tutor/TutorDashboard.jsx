import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  FaCalendarAlt,
  FaStar,
  FaUserGraduate,
  FaMoneyBillWave,
  FaClock
} from 'react-icons/fa';

const TutorDashboard = () => {
  const { getUserSessions, currentUser, tutors } = useContext(AppContext);

  // Get tutor data
  const tutorData = tutors.find(tutor =>
    tutor.firstName === currentUser?.firstName &&
    tutor.lastName === currentUser?.lastName
  ) || {};

  // Get user sessions as tutor
  const tutorSessions = getUserSessions();

  // Filter upcoming sessions
  const upcomingSessions = tutorSessions.filter(session => session.status === 'Upcoming');

  // Calculate stats
  const totalSessions = tutorData.totalSessions || 0;
  const totalEarnings = tutorSessions
    .filter(session => session.status === 'Completed')
    .reduce((sum, session) => sum + session.amount, 0);
  const averageRating = tutorData.rating || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tutor Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-800 mr-4">
              <FaUserGraduate />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <h3 className="text-xl font-bold">{totalSessions}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-800 mr-4">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <h3 className="text-xl font-bold">{totalEarnings} AED</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-800 mr-4">
              <FaStar />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-xl font-bold">{averageRating.toFixed(1)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-800 mr-4">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Sessions</p>
              <h3 className="text-xl font-bold">{upcomingSessions.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Upcoming Sessions</h2>
        </div>

        <div className="divide-y">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.slice(0, 5).map(session => {
              // Find student info
              const student = currentUser?.students?.find(s => s.id === session.studentId) || {
                firstName: 'Student',
                lastName: 'Name'
              };

              return (
                <div key={session.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{session.subject}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="mr-1 text-gray-400" />
                        {session.date}, {session.startTime}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <FaUserGraduate className="mr-1 text-gray-400" />
                        {student.firstName} {student.lastName}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {session.amount} AED
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No upcoming sessions</p>
            </div>
          )}
        </div>

        {upcomingSessions.length > 0 && (
          <div className="p-4 border-t">
            <Link
              to="/tutor/sessions"
              className="text-sm text-secondary-600 hover:text-secondary-800"
            >
              View all sessions
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Quick Actions</h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/tutor/calendar"
            className="block p-4 border rounded-lg hover:border-secondary-400 hover:bg-secondary-50"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-secondary-100 text-secondary-800">
                <FaCalendarAlt />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Manage Availability</h3>
                <p className="text-sm text-gray-600">Update your tutoring schedule</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tutor/sessions"
            className="block p-4 border rounded-lg hover:border-secondary-400 hover:bg-secondary-50"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-secondary-100 text-secondary-800">
                <FaClock />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Manage Sessions</h3>
                <p className="text-sm text-gray-600">View and manage your sessions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tutor/transactions"
            className="block p-4 border rounded-lg hover:border-secondary-400 hover:bg-secondary-50"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-secondary-100 text-secondary-800">
                <FaMoneyBillWave />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">View Earnings</h3>
                <p className="text-sm text-gray-600">Track your tutoring income</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
