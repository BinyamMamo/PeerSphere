import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaStar,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserGraduate
} from 'react-icons/fa';

const AdminTutors = () => {
  const { tutors, sessions } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'high-rating', 'low-rating'
  const [viewTutor, setViewTutor] = useState(null);

  // Filter tutors based on search and active filter
  const filteredTutors = tutors.filter(tutor => {
    // Apply search filter if provided
    if (searchQuery) {
      const fullName = `${tutor.firstName} ${tutor.lastName}`.toLowerCase();
      const subjects = tutor.subjects.join(' ').toLowerCase();

      return fullName.includes(searchQuery.toLowerCase()) ||
        subjects.includes(searchQuery.toLowerCase());
    }

    // Apply filter
    if (activeFilter === 'high-rating') {
      return tutor.rating >= 4.5;
    } else if (activeFilter === 'low-rating') {
      return tutor.rating < 4.0;
    }

    return true;
  });

  // Get tutor sessions
  const getTutorSessions = (tutorId) => {
    return sessions.filter(session => session.tutorId === tutorId);
  };

  // Get tutor earnings
  const getTutorEarnings = (tutorId) => {
    return sessions
      .filter(session => session.tutorId === tutorId && session.status === 'Completed')
      .reduce((total, session) => total + session.amount, 0);
  };

  // Filter component for cleaner rendering
  const FilterButton = ({ id, label }) => (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-md ${activeFilter === id
          ? 'bg-accent-100 text-accent-700'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
      onClick={() => setActiveFilter(id)}
    >
      {label}
    </button>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tutors Management</h1>

      {/* Search & Filters */}
      <div className="hidden bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center mb-4">
          <div className="flex items-center mr-4 w-full md:w-auto mb-2 md:mb-0">
            <div className="relative flex-grow">
              <input
                type="text"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="Search tutors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <FaFilter className="text-accent-600 mr-2" />
            <h2 className="font-medium">Filters</h2>
          </div>
        </div>

        <div className="flex space-x-2">
          <FilterButton id="all" label="All Tutors" />
          <FilterButton id="high-rating" label="High Rating (4.5+)" />
          <FilterButton id="low-rating" label="Low Rating (<4.0)" />
        </div>
      </div>

      {/* Tutors List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredTutors.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-600">
              <div className="col-span-3">Tutor</div>
              <div className="col-span-3">Subjects</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-2">Sessions</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {filteredTutors.map(tutor => (
                <div
                  key={tutor.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
                >
                  <div className="col-span-3 flex items-center">
                    <img
                      src={tutor.avatar}
                      alt={`${tutor.firstName} ${tutor.lastName}`}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{tutor.firstName} {tutor.lastName}</h3>
                      <p className="text-xs text-gray-500">Year {tutor.yearOfStudy} Student</p>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-1">
                      {tutor.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent-50 text-accent-700 rounded-md text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${star <= tutor.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm">{tutor.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-500">{tutor.reviews} reviews</p>
                  </div>

                  <div className="col-span-2">
                    <p className="font-medium">{tutor.totalSessions} total</p>
                    <p className="text-xs text-gray-500">{getTutorEarnings(tutor.id)} AED earned</p>
                  </div>

                  <div className="col-span-2 flex justify-end space-x-2">
                    <button
                      onClick={() => setViewTutor(tutor)}
                      className="p-2 text-gray-500 hover:text-accent-600 rounded"
                      title="View Tutor Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-accent-600 rounded"
                      title="Edit Tutor"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No tutors found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Tutor Details Modal */}
      {viewTutor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Tutor Details
              </h2>
              <button
                onClick={() => setViewTutor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            {/* Tutor header */}
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center">
                <img
                  src={viewTutor.avatar}
                  alt={`${viewTutor.firstName} ${viewTutor.lastName}`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-medium">{viewTutor.firstName} {viewTutor.lastName}</h3>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg
                          key={star}
                          className={`h-4 w-4 ${star <= viewTutor.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">{viewTutor.rating.toFixed(1)} ({viewTutor.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Year {viewTutor.yearOfStudy} Student
                  </p>
                </div>
              </div>
            </div>

            {/* Tutor details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {viewTutor.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent-50 text-accent-700 rounded-md text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                <h4 className="font-medium mt-4 mb-2">Bio</h4>
                <p className="text-gray-700">{viewTutor.bio}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Performance</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Sessions</span>
                    <span className="font-medium">{viewTutor.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Earnings</span>
                    <span className="font-medium">{getTutorEarnings(viewTutor.id)} AED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-medium">{viewTutor.hourlyRate} AED</span>
                  </div>
                </div>

                <h4 className="font-medium mt-4 mb-2">Availability</h4>
                {viewTutor.availability && viewTutor.availability.length > 0 ? (
                  <div className="space-y-2">
                    {viewTutor.availability.map((slot, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span>{slot.date}, {slot.startTime}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No availability set</p>
                )}
              </div>
            </div>

            {/* Recent sessions */}
            <div>
              <h4 className="font-medium mb-3">Recent Sessions</h4>
              {getTutorSessions(viewTutor.id).length > 0 ? (
                <div className="border rounded-lg divide-y">
                  {getTutorSessions(viewTutor.id).slice(0, 5).map(session => (
                    <div key={session.id} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <h5 className="font-medium">{session.subject}</h5>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaCalendarAlt className="mr-1 text-xs" />
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No sessions found</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setViewTutor(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTutors;
