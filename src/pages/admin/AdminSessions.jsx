import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaMoneyBillWave
} from 'react-icons/fa';

const AdminSessions = () => {
  const { sessions, students, tutors } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewSession, setViewSession] = useState(null);

  // Filter sessions based on active tab and search query
  const filteredSessions = sessions.filter(session => {
    // Filter by status
    if (activeTab !== 'all' && session.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }

    // Apply search filter if provided
    if (searchQuery) {
      // Get student and tutor info
      const student = getStudentInfo(session.studentId);
      const tutor = getTutorInfo(session.tutorId);

      const studentName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const tutorName = `${tutor.firstName} ${tutor.lastName}`.toLowerCase();
      const subject = session.subject.toLowerCase();

      return studentName.includes(searchQuery.toLowerCase()) ||
        tutorName.includes(searchQuery.toLowerCase()) ||
        subject.includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Get student info by ID
  const getStudentInfo = (studentId) => {
    return students.find(student => student.id === studentId) || {
      firstName: 'Unknown',
      lastName: 'Student'
    };
  };

  // Get tutor info by ID
  const getTutorInfo = (tutorId) => {
    return tutors.find(tutor => tutor.id === tutorId) || {
      firstName: 'Unknown',
      lastName: 'Tutor'
    };
  };

  // Tab component for cleaner rendering
  const Tab = ({ id, label, count }) => (
    <button
      className={`px-3 py-2 font-medium text-sm rounded-md whitespace-nowrap ${activeTab === id
          ? 'bg-accent-100 text-accent-700'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
      onClick={() => setActiveTab(id)}
    >
      {label} {count > 0 && <span className="ml-1 text-xs">({count})</span>}
    </button>
  );

  // Count sessions by status
  const upcomingCount = sessions.filter(s => s.status === 'Upcoming').length;
  const completedCount = sessions.filter(s => s.status === 'Completed').length;
  const cancelledCount = sessions.filter(s => s.status === 'Cancelled').length;

  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sessions Management</h1>

      {/* Search & Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 sm:gap-3">
          <Tab id="all" label="All" count={sessions.length} />
          <Tab id="upcoming" label="Upcoming" count={upcomingCount} />
          <Tab id="completed" label="Completed" count={completedCount} />
          <Tab id="cancelled" label="Cancelled" count={cancelledCount} />
        </div>
        <div className="flex items-center w-full sm:w-auto sm:ml-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredSessions.length > 0 ? (
          <>
            {/* Table Header - Hidden on Mobile */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-600">
              <div className="col-span-3">Subject & Date</div>
              <div className="col-span-3">Student</div>
              <div className="col-span-3">Tutor</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {filteredSessions.map(session => {
                const student = getStudentInfo(session.studentId);
                const tutor = getTutorInfo(session.tutorId);

                return (
                  <div
                    key={session.id}
                    className="p-4 hover:bg-gray-50"
                  >
                    {/* Mobile View */}
                    <div className="block sm:hidden">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{session.subject}</h3>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaCalendarAlt className="mr-1 text-gray-400" />
                            {session.date}, {session.startTime}
                          </div>
                        </div>
                        <div className="flex items-center">
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

                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="flex items-center">
                          <img
                            src={student.avatar || "https://i.pravatar.cc/150?img=1"}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                          <div>
                            <h4 className="font-medium text-sm">{student.firstName} {student.lastName}</h4>
                            <p className="text-xs text-gray-500">Student</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <img
                            src={tutor.avatar || "https://i.pravatar.cc/150?img=2"}
                            alt={`${tutor.firstName} ${tutor.lastName}`}
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                          <div>
                            <h4 className="font-medium text-sm">{tutor.firstName} {tutor.lastName}</h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <svg
                                    key={star}
                                    className={`h-3 w-3 ${star <= (tutor.rating || 4.5) ? 'text-yellow-500' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => setViewSession(session)}
                          className="p-2 text-gray-500 hover:text-accent-600 rounded"
                          title="View Session Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                        <h3 className="font-medium">{session.subject}</h3>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaCalendarAlt className="mr-1 text-gray-400" />
                          {session.date}, {session.startTime}
                        </div>
                      </div>

                      <div className="col-span-3 flex items-center">
                        <img
                          src={student.avatar || "https://i.pravatar.cc/150?img=1"}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <h4 className="font-medium text-sm">{student.firstName} {student.lastName}</h4>
                          <p className="text-xs text-gray-500">Year {student.yearOfStudy}</p>
                        </div>
                      </div>

                      <div className="col-span-3 flex items-center">
                        <img
                          src={tutor.avatar || "https://i.pravatar.cc/150?img=2"}
                          alt={`${tutor.firstName} ${tutor.lastName}`}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <h4 className="font-medium text-sm">{tutor.firstName} {tutor.lastName}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <svg
                                  key={star}
                                  className={`h-3 w-3 ${star <= (tutor.rating || 4.5) ? 'text-yellow-500' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${session.status === 'Upcoming'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {session.status}
                        </span>
                        {session.status === 'Completed' && session.rating && (
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <svg
                                  key={star}
                                  className={`h-3 w-3 ${star <= session.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => setViewSession(session)}
                          className="p-2 text-gray-500 hover:text-accent-600 rounded"
                          title="View Session Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No sessions found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {viewSession && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Session Details
              </h2>
              <button
                onClick={() => setViewSession(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Session header */}
            <div className="border-b pb-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h3 className="text-xl font-medium">{viewSession.subject}</h3>
                  <p className="text-gray-600">
                    {viewSession.date}, {viewSession.startTime} ({viewSession.duration} min)
                  </p>
                </div>
                <span className={`self-start px-3 py-1 rounded-full text-sm ${viewSession.status === 'Upcoming'
                    ? 'bg-green-100 text-green-800'
                    : viewSession.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {viewSession.status}
                </span>
              </div>
            </div>

            {/* Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <h4 className="font-medium flex items-center mb-3">
                  <FaUserGraduate className="text-accent-600 mr-2" />
                  Student
                </h4>
                <div className="flex items-center">
                  <img
                    src={getStudentInfo(viewSession.studentId).avatar || "https://i.pravatar.cc/150?img=1"}
                    alt={`${getStudentInfo(viewSession.studentId).firstName} ${getStudentInfo(viewSession.studentId).lastName}`}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h5 className="font-medium">
                      {getStudentInfo(viewSession.studentId).firstName} {getStudentInfo(viewSession.studentId).lastName}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Year {getStudentInfo(viewSession.studentId).yearOfStudy} Student
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium flex items-center mb-3">
                  <FaChalkboardTeacher className="text-accent-600 mr-2" />
                  Tutor
                </h4>
                <div className="flex items-center">
                  <img
                    src={getTutorInfo(viewSession.tutorId).avatar || "https://i.pravatar.cc/150?img=2"}
                    alt={`${getTutorInfo(viewSession.tutorId).firstName} ${getTutorInfo(viewSession.tutorId).lastName}`}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h5 className="font-medium">
                      {getTutorInfo(viewSession.tutorId).firstName} {getTutorInfo(viewSession.tutorId).lastName}
                    </h5>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="flex mr-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${star <= (getTutorInfo(viewSession.tutorId).rating || 4.5) ? 'text-yellow-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      ({getTutorInfo(viewSession.tutorId).rating || 4.5})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <FaCalendarAlt className="text-accent-600 mr-2" />
                  Date & Time
                </h4>
                <p className="text-gray-800">
                  {viewSession.date}<br />
                  {viewSession.startTime} ({viewSession.duration} minutes)
                </p>
              </div>

              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <FaMapMarkerAlt className="text-accent-600 mr-2" />
                  Location
                </h4>
                <p className="text-gray-800">
                  {viewSession.location}
                </p>
              </div>

              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <FaMoneyBillWave className="text-accent-600 mr-2" />
                  Payment
                </h4>
                <p className="text-gray-800">
                  {viewSession.amount} AED
                </p>
              </div>
            </div>

            {/* Feedback section (if completed) */}
            {viewSession.status === 'Completed' && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Student Feedback</h4>
                {viewSession.rating ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`h-5 w-5 ${star <= viewSession.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600">({viewSession.rating}/5)</span>
                    </div>
                    {viewSession.feedback && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{viewSession.feedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No feedback provided yet.</p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setViewSession(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessions;