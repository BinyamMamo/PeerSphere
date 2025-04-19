import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaEdit,
  FaStar,
  FaGraduationCap,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCheck,
  FaClipboardList
} from 'react-icons/fa';
import AccountStatusIndicator from '../shared/AccountStatusIndicator';

const TutorRightbar = () => {
  const { currentUser, tutors, sessions } = useContext(AppContext);

  // Find tutor data (assuming currentUser has the same ID as a tutor)
  const tutorData = tutors?.find(tutor =>
    tutor.firstName === currentUser?.firstName &&
    tutor.lastName === currentUser?.lastName
  ) || {};

  // Get upcoming sessions (first 3)
  const upcomingSessions = sessions
    ?.filter(session =>
      session.tutorId === currentUser?.id &&
      session.status === 'Upcoming'
    )
    .slice(0, 3) || [];

  // Calculate earnings stats
  const totalEarnings = tutorData.earnings || 0;
  const pendingEarnings = tutorData.pendingEarnings || 0;
  const completedSessions = tutorData.totalSessions || 0;

  return (
    <div className="h-full w-80 bg-transparent shadow-none flex flex-col p-4 overflow-auto">
      {/* Profile Stats Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center">
          <img
            src={currentUser?.avatar || "https://i.pravatar.cc/150?img=1"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3 flex-grow">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Welcome, {currentUser?.firstName || 'Tutor'}</h2>
              {/* <button className="text-gray-500 hover:text-secondary-600">
                <FaEdit size={14} />
              </button> */}
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" size={12} />
                <span className="text-sm text-gray-600">{tutorData.rating?.toFixed(1) || '4.5'}</span>
              </div>
              {/* <AccountStatusIndicator /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
        <div className="py-1 grid grid-cols-2 divide-x divide-gray-100">
          <div className="p-3 text-center">
            <p className="text-xs text-gray-500">Earnings</p>
            <p className="font-semibold text-secondary-700">{totalEarnings} AED</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-xs text-gray-500">Sessions</p>
            <p className="font-semibold text-secondary-700">{completedSessions}</p>
          </div>
        </div>
        <div className=" border-gray-100 px-3 py-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Pending earnings</span>
            <span className="font-medium text-secondary-600">{pendingEarnings} AED</span>
          </div>
        </div>
      </div>

      {/* Next Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">Upcoming Sessions</h3>
          <button className="text-xs text-secondary-600">View All</button>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors duration-200">
                <div className="w-8 h-8 bg-secondary-50 rounded-full flex items-center justify-center text-secondary-600 mr-3">
                  <FaUserGraduate size={12} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium">{session.studentName || "Student"}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <FaCalendarAlt className="mr-1" size={10} />
                    <span>{session.date}, {session.startTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-secondary-50/25 rounded-lg p-3 text-sm text-gray-500">
              No upcoming sessions
          </div>
        )}
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <FaChalkboardTeacher className="text-secondary-600 mr-2" size={14} />
            <h3 className="text-sm font-medium text-gray-700">My Subjects</h3>
          </div>
          <button className="text-xs text-secondary-600">Edit</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tutorData.subjects?.map((subject, index) => (
            <span key={index} className="px-2 py-1 bg-secondary-50 text-secondary-700 rounded-md text-xs">
              {subject}
            </span>
          )) || (
              <div className="bg-secondary-50/25 rounded-lg p-3 text-sm text-gray-500 w-full">
                No subjects added yet
              </div>
            )}
        </div>
      </div>

      {/* Availability Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <FaCalendarAlt className="text-secondary-600 mr-2" size={14} />
            <h3 className="text-sm font-medium text-gray-700">Availability</h3>
          </div>
          <button className="text-xs text-secondary-600">Edit</button>
        </div>

        {tutorData.availability && tutorData.availability.length > 0 ? (
          <div className="space-y-2">
            {tutorData.availability.slice(0, 3).map((slot, index) => (
              <div key={index} className="flex items-center bg-secondary-50/50 p-2 rounded-md">
                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 mr-2">
                  <FaCheck size={10} />
                </div>
                <span className="text-sm">{slot.date}, {slot.startTime}</span>
              </div>
            ))}
            {tutorData.availability.length > 3 && (
              <button className="text-xs text-secondary-600 w-full text-center mt-1">
                +{tutorData.availability.length - 3} more times
              </button>
            )}
          </div>
        ) : (
          <div className="bg-secondary-50/25 rounded-lg p-3 text-sm text-gray-500">
            No availability set
          </div>
        )}
      </div>

      {/* Tutor Profile Completion */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <FaClipboardList className="text-secondary-600 mr-2" size={14} />
            <h3 className="text-sm font-medium text-gray-700">Profile Completion</h3>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-secondary-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm">
            <div className="w-5 h-5 mr-2 flex items-center justify-center">
              {tutorData.bio ? (
                <FaCheck className="text-green-500" size={12} />
              ) : (
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              )}
            </div>
            <span className={tutorData.bio ? "text-gray-700" : "text-gray-400"}>Add bio</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-5 h-5 mr-2 flex items-center justify-center">
              {(tutorData.subjects && tutorData.subjects.length > 0) ? (
                <FaCheck className="text-green-500" size={12} />
              ) : (
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              )}
            </div>
            <span className={(tutorData.subjects && tutorData.subjects.length > 0) ? "text-gray-700" : "text-gray-400"}>Add subjects</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-5 h-5 mr-2 flex items-center justify-center">
              {(tutorData.availability && tutorData.availability.length > 0) ? (
                <FaCheck className="text-green-500" size={12} />
              ) : (
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              )}
            </div>
            <span className={(tutorData.availability && tutorData.availability.length > 0) ? "text-gray-700" : "text-gray-400"}>Set availability</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorRightbar;