import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaClipboardList,
  FaChartBar
} from 'react-icons/fa';

// Simple line chart component
const LineChart = ({ data, xKey, yKey, title }) => {
  const maxValue = Math.max(...data.map(item => item[yKey])) * 1.2;

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="h-40 relative">
        <div className="absolute inset-0 flex items-end">
          {data.map((item, index) => {
            const height = (item[yKey] / maxValue) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-2/3 bg-accent-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-gray-600 mt-1 truncate">{item[xKey]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const {
    tutors,
    students,
    sessions,
    applications,
    analytics
  } = useContext(AppContext);

  // Calculate key metrics
  const totalStudents = students.length;
  const totalTutors = tutors.length;
  const totalSessions = sessions.length;
  const pendingApplications = applications.filter(app => app.status === 'Pending').length;
  const completedSessions = sessions.filter(session => session.status === 'Completed').length;
  const totalRevenue = sessions.reduce((sum, session) => sum + session.amount, 0);

  // Get top subjects
  const topSubjects = analytics.subjectPopularity.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaUserGraduate />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h3 className="text-xl font-bold">{totalStudents}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaChalkboardTeacher />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tutors</p>
              <h3 className="text-xl font-bold">{totalTutors}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaCalendarCheck />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <h3 className="text-xl font-bold">{totalSessions}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue and Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Revenue Overview</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold">{totalRevenue} AED</h3>
              </div>
              <div>
                <p className="text-gray-500">Completed Sessions</p>
                <h3 className="text-2xl font-bold">{completedSessions}</h3>
              </div>
            </div>

            <LineChart
              data={analytics.revenueByMonth}
              xKey="month"
              yKey="amount"
              title="Revenue by Month (AED)"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Pending Applications</h2>
            <Link
              to="/admin/applications"
              className="text-sm text-accent-600 hover:text-accent-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y">
            {applications.filter(app => app.status === 'Pending').slice(0, 4).map(application => {
              const student = students.find(s => s.id === application.studentId) || {};

              return (
                <div key={application.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{student.firstName} {student.lastName}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {application.subjects?.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Applied: {application.dateApplied}
                      </div>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {applications.filter(app => app.status === 'Pending').length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No pending applications</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Subjects and Recent Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Popular Subjects</h2>
          </div>

          <div className="p-4">
            {topSubjects.map((subject, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex justify-between text-sm mb-1">
                  <span>{subject.subject}</span>
                  <span>{subject.sessions} sessions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent-500 h-2 rounded-full"
                    style={{
                      width: `${(subject.sessions / Math.max(...topSubjects.map(s => s.sessions))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Recent Sessions</h2>
            <Link
              to="/admin/sessions"
              className="text-sm text-accent-600 hover:text-accent-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y">
            {sessions.slice(0, 5).map(session => {
              const student = students.find(s => s.id === session.studentId) || {};
              const tutor = tutors.find(t => t.id === session.tutorId) || {};

              return (
                <div key={session.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{session.subject}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {student.firstName} {student.lastName} • {tutor.firstName} {tutor.lastName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {session.date}, {session.startTime}
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${session.status === 'Upcoming'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Quick Actions</h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/applications"
            className="block p-4 border rounded-lg hover:border-accent-400 hover:bg-accent-50"
          >
            <div className="flex">
              <div className="p-2 rounded-md bg-accent-100 text-accent-800">
                <FaClipboardList />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Review Applications</h3>
                <p className="text-sm text-gray-600">
                  {pendingApplications} pending {pendingApplications === 1 ? 'application' : 'applications'}
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/sessions"
            className="block p-4 border rounded-lg hover:border-accent-400 hover:bg-accent-50"
          >
            <div className="flex">
              <div className="p-2 rounded-md bg-accent-100 text-accent-800">
                <FaCalendarCheck />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Manage Sessions</h3>
                <p className="text-sm text-gray-600">View and manage all sessions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="block p-4 border rounded-lg hover:border-accent-400 hover:bg-accent-50"
          >
            <div className="flex">
              <div className="p-2 rounded-md bg-accent-100 text-accent-800">
                <FaChartBar />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">View Analytics</h3>
                <p className="text-sm text-gray-600">Detailed performance reports</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
