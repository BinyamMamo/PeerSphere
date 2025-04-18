import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { FaEdit, FaStar, FaGraduationCap, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import AccountStatusIndicator from '../shared/AccountStatusIndicator';

const TutorRightbar = () => {
  const { currentUser, tutors } = useContext(AppContext);

  // Find tutor data (assuming currentUser has the same ID as a tutor)
  const tutorData = tutors.find(tutor =>
    tutor.firstName === currentUser?.firstName &&
    tutor.lastName === currentUser?.lastName
  ) || {};

  return (
    <div className="h-full w-80 bg-transparent shadow-none flex flex-col p-4 overflow-auto">
      {/* Profile Section with Account Status */}
      <div className="flex flex-col mb-4 mt-3.5">
        <div className="flex items-center">
          <img
            src={currentUser?.avatar || "https://i.pravatar.cc/150?img=1"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3 flex-grow">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Welcome, {currentUser?.firstName || 'Tutor'}</h2>
              <button className="text-gray-500 hover:text-secondary-600">
                <FaEdit size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" size={12} />
                <span className="text-sm text-gray-600">{tutorData.rating?.toFixed(1) || '4.5'}</span>
              </div>
              <AccountStatusIndicator />
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-1">Bio</h3>
        <p className="text-sm text-gray-800">
          {tutorData.bio || "Experienced tutor helping students master complex subjects through personalized learning approaches."}
        </p>
        <button className="text-xs text-secondary-600 mt-1">Edit</button>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-gray-700">Availability</h3>
          <button className="text-xs text-secondary-600">Edit</button>
        </div>

        {tutorData.availability && tutorData.availability.length > 0 ? (
          <div className="space-y-2">
            {tutorData.availability.slice(0, 3).map((slot, index) => (
              <div key={index} className="flex items-center text-sm">
                <FaCalendarAlt className="mr-2 text-gray-400" />
                <span>{slot.date}, {slot.startTime}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-secondary-50/25 rounded-lg p-3 text-sm text-gray-500">
            No availability set
          </div>
        )}
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-gray-700">Subjects</h3>
          <button className="text-xs text-secondary-600">Add Subject</button>
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

      {/* Experience */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-gray-700">Experience</h3>
          <button className="text-xs text-secondary-600">Edit</button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FaGraduationCap className="mr-2 text-gray-400" />
            <span>Year {tutorData.yearOfStudy || currentUser?.yearOfStudy || '3'} Student</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaMoneyBillWave className="mr-2 text-gray-400" />
            <span>{tutorData.hourlyRate || 120} AED/hour</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaStar className="mr-2 text-gray-400" />
            <span>{tutorData.totalSessions || 0} sessions completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorRightbar;
