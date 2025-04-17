import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { FaEdit, FaStar, FaGraduationCap, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const TutorRightbar = () => {
  const { currentUser, tutors } = useContext(AppContext);

  // Find tutor data (assuming currentUser has the same ID as a tutor)
  const tutorData = tutors.find(tutor =>
    tutor.firstName === currentUser?.firstName &&
    tutor.lastName === currentUser?.lastName
  ) || {};

  return (
    <div className="h-full w-80 bg-white shadow-md flex flex-col p-4 overflow-auto">
      {/* Profile Section */}
      <div className="flex items-center mb-4">
        <img
          src={currentUser?.avatar || "https://i.pravatar.cc/150?img=4"}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-3">
          <h2 className="font-medium">Welcome, {currentUser?.firstName || 'Tutor'}</h2>
          <div className="flex items-center">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="text-sm">{tutorData.rating || 4.5}</span>
          </div>
        </div>
        <button className="ml-auto text-gray-500 hover:text-secondary-600">
          <FaEdit />
        </button>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Bio</h3>
        <p className="text-sm text-gray-800">
          {tutorData.bio || "Experienced tutor helping students master complex subjects through personalized learning approaches."}
        </p>
        <button className="text-xs text-secondary-600 mt-1">Edit</button>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-gray-600">Availability</h3>
          <button className="text-xs text-secondary-600">Edit</button>
        </div>

        {tutorData.availability && tutorData.availability.length > 0 ? (
          <div className="space-y-2">
            {tutorData.availability.slice(0, 3).map((slot, index) => (
              <div key={index} className="flex items-center text-sm">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <span>{slot.date}, {slot.startTime}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No availability set</p>
        )}
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-gray-600">Subjects</h3>
          <button className="text-xs text-secondary-600">Add Subject</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tutorData.subjects?.map((subject, index) => (
            <span key={index} className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded-md text-xs">
              {subject}
            </span>
          )) || (
              <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded-md text-xs">
                No subjects added
              </span>
            )}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-gray-600">Experience</h3>
          <button className="text-xs text-secondary-600">Edit</button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <FaGraduationCap className="text-gray-400 mr-2" />
            <span>Year {tutorData.yearOfStudy || currentUser?.yearOfStudy || '3'} Student</span>
          </div>
          <div className="flex items-center text-sm">
            <FaMoneyBillWave className="text-gray-400 mr-2" />
            <span>{tutorData.hourlyRate || 120} AED/hour</span>
          </div>
          <div className="flex items-center text-sm">
            <FaStar className="text-gray-400 mr-2" />
            <span>{tutorData.totalSessions || 0} sessions completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorRightbar;

