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
      className={`px-2 py-2 font-medium text-xs sm:text-sm rounded-md ${activeTab === id
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
        <div className="p-3 sm:p-4">
          {/* Session header */}
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm sm:text-base">{session.subject}</h3>
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
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <FaCalendarAlt className="mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{session.date}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <FaClock className="mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{session.startTime}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{session.location}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <FaUser className="mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{tutor.firstName} {tutor.lastName}</span>
            </div>
          </div>

          {/* Session footer with teaching style and actions */}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <FaChalkboardTeacher className="text-primary-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {tutor.teachingStyle || 'Interactive, hands-on approach'}
              </span>
            </div>

            {session.status === 'Upcoming' && (
              <div className="flex space-x-2">
                <button className="px-2 sm:px-3 py-1 bg-white border border-primary-600 text-primary-600 rounded-md text-xs sm:text-sm">
                  Reschedule
                </button>
                <button className="px-2 sm:px-3 py-1 bg-white border border-red-600 text-red-600 rounded-md text-xs sm:text-sm">
                  Cancel
                </button>
              </div>
            )}

            {session.status === 'Completed' && !session.rating && (
              <button className="px-2 sm:px-3 py-1 bg-primary-600 text-white rounded-md text-xs sm:text-sm w-full sm:w-auto">
                Leave Feedback
              </button>
            )}

            {session.status === 'Completed' && session.rating && (
              <div className="flex items-center flex-wrap">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      className={`${star <= session.rating ? 'text-yellow-500' : 'text-gray-300'} text-sm`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs sm:text-sm text-gray-600 line-clamp-1">
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
    <div className="max-w-screen-lg mx-auto px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Sessions</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 overflow-x-auto">
        <div className="p-1 sm:p-2 flex space-x-1 sm:space-x-2 min-w-max">
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
            <div className="bg-white rounded-lg shadow p-4 sm:p-8 text-center">
              <p className="text-gray-500 text-sm sm:text-base">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming sessions. Book a session to get started!"
                : activeTab === 'completed'
                  ? "You haven't completed any sessions yet."
                  : "You don't have any cancelled sessions."}
            </p>

            {activeTab === 'upcoming' && (
                <button className="mt-4 px-3 sm:px-4 py-1 sm:py-2 bg-primary-600 text-white rounded-md font-medium text-sm sm:text-base">
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