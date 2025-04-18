import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { FaStar, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaChalkboardTeacher } from 'react-icons/fa';

const StudentSessions = () => {
  const { getUserSessions, tutors } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'

  // Get user sessions
  const userSessions = getUserSessions();

  // Filter sessions based on active tab
  const filteredSessions = userSessions.filter(session => {
    if (activeTab === 'upcoming') return session.status === 'Upcoming';
    if (activeTab === 'completed') return session.status === 'Completed';
    if (activeTab === 'cancelled') return session.status === 'Cancelled';
    return true;
  });

  // Get tutor info by ID
  const getTutorInfo = (tutorId) => {
    return tutors.find(tutor => tutor.id === tutorId) || {};
  };

  // Tab component for cleaner rendering
  const Tab = ({ id, label, count }) => (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-md ${activeTab === id
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
      onClick={() => setActiveTab(id)}
    >
      {label} {count > 0 && <span className="ml-1 text-xs">({count})</span>}
    </button>
  );

  // Session card component for cleaner rendering
  const SessionCard = ({ session }) => {
    const tutor = getTutorInfo(session.tutorId);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <div className="p-4">
          {/* Session header */}
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{session.subject}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === 'Upcoming'
                ? 'bg-green-100 text-green-800'
                : session.status === 'Completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
              {session.status}
            </span>
          </div>

          {/* Session details */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              {session.date}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-gray-400" />
              {session.startTime}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              {session.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaUser className="mr-2 text-gray-400" />
              {tutor.firstName} {tutor.lastName}
            </div>
          </div>

          {/* Session footer with teaching style and actions */}
          <div className="mt-5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaChalkboardTeacher className="text-primary-600" />
              <span className="text-sm text-gray-600">
                {tutor.teachingStyle || 'Interactive, hands-on approach'}
              </span>
            </div>

            {session.status === 'Upcoming' && (
              <div className="space-x-2">
                <button className="px-3 py-1 bg-white border border-primary-600 text-primary-600 rounded-md text-sm">
                  Reschedule
                </button>
                <button className="px-3 py-1 bg-white border border-red-600 text-red-600 rounded-md text-sm">
                  Cancel
                </button>
              </div>
            )}

            {session.status === 'Completed' && !session.rating && (
              <button className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm">
                Leave Feedback
              </button>
            )}

            {session.status === 'Completed' && session.rating && (
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      className={`${star <= session.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {session.feedback ? `"${session.feedback}"` : 'No feedback provided'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Count sessions by status
  const upcomingCount = userSessions.filter(s => s.status === 'Upcoming').length;
  const completedCount = userSessions.filter(s => s.status === 'Completed').length;
  const cancelledCount = userSessions.filter(s => s.status === 'Cancelled').length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Sessions</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-2 flex space-x-2">
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
                ? "You don't have any upcoming sessions. Book a session to get started!"
                : activeTab === 'completed'
                  ? "You haven't completed any sessions yet."
                  : "You don't have any cancelled sessions."}
            </p>

            {activeTab === 'upcoming' && (
              <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md font-medium">
                Book a Session
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSessions;