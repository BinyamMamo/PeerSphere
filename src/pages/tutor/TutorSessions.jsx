import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const TutorSessions = () => {
  const { getUserSessions, students } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Get all tutor sessions
  const tutorSessions = getUserSessions();

  // Filter sessions based on active tab
  const filteredSessions = tutorSessions.filter(session => {
    if (activeTab === 'upcoming') return session.status === 'Upcoming';
    if (activeTab === 'completed') return session.status === 'Completed';
    if (activeTab === 'cancelled') return session.status === 'Cancelled';
    return true;
  });

  // Get student info by ID
  const getStudentInfo = (studentId) => {
    return students.find(student => student.id === studentId) || {
      firstName: 'Student',
      lastName: 'Name'
    };
  };

  // Tab component for cleaner rendering
  const Tab = ({ id, label, count }) => (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-md flex items-center justify-center ${activeTab === id
          ? 'bg-secondary-100 text-secondary-700'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
      onClick={() => setActiveTab(id)}
    >
      {label} {count > 0 && <span className="ml-1 text-xs">({count})</span>}
    </button>
  );

  // Session card component
  const SessionCard = ({ session }) => {
    const student = getStudentInfo(session.studentId);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <div className="p-5">
          {/* Session header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-lg">{session.subject}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${session.status === 'Upcoming'
                ? 'bg-green-100 text-green-800'
                : session.status === 'Completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
              {session.status}
            </span>
          </div>

          {/* Session details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendarAlt className="mr-2 text-gray-400 flex-shrink-0" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-gray-400 flex-shrink-0" />
              <span>{session.startTime}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" />
              <span>{session.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaUserGraduate className="mr-2 text-gray-400 flex-shrink-0" />
              <span>{student.firstName} {student.lastName}</span>
            </div>
          </div>

          {/* Session footer with price and actions */}
          <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-bold text-lg">{session.amount} AED</span>
            </div>

            {session.status === 'Upcoming' && (
              <div className="flex space-x-2 w-full sm:w-auto">
                <button className="px-3 py-1 bg-secondary-600 text-white rounded-md text-sm flex items-center justify-center">
                  <FaCheckCircle className="mr-1 flex-shrink-0" />
                  <span>Mark Complete</span>
                </button>
                <button className="px-3 py-1 bg-white border border-red-600 text-red-600 rounded-md text-sm flex items-center justify-center">
                  <FaTimesCircle className="mr-1 flex-shrink-0" />
                  <span>Cancel</span>
                </button>
              </div>
            )}

            {session.status === 'Completed' && session.rating && (
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg
                      key={star}
                      className={`h-4 w-4 ${star <= session.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {session.feedback || 'No feedback provided'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Count sessions by status
  const upcomingCount = tutorSessions.filter(s => s.status === 'Upcoming').length;
  const completedCount = tutorSessions.filter(s => s.status === 'Completed').length;
  const cancelledCount = tutorSessions.filter(s => s.status === 'Cancelled').length;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Sessions</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-2 flex flex-wrap gap-2">
          <Tab id="upcoming" label="Upcoming" count={upcomingCount} />
          <Tab id="completed" label="Completed" count={completedCount} />
          <Tab id="cancelled" label="Cancelled" count={cancelledCount} />
        </div>
      </div>

      {/* Sessions list */}
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming sessions."
                : activeTab === 'completed'
                  ? "You haven't completed any sessions yet."
                  : "You don't have any cancelled sessions."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSessions;