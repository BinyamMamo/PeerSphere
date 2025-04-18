// src/pages/AvailableTutors.jsx

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiClock, FiStar, FiVideo, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const AvailableTutors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, availableTutors, immediate } = location.state || {
    formData: {},
    availableTutors: [],
    immediate: false
  };

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStartSession = async (tutorId) => {
    setSelectedTutor(tutorId);
    setLoading(true);

    try {
      // Simulate API call to start session
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to session room (in a real app)
      navigate(`/session-room/${tutorId}`, {
        state: {
          formData,
          tutorId
        }
      });
    } catch (error) {
      console.error('Error starting session:', error);
      setLoading(false);
    }
  };

  const handleBookSession = async (tutorId) => {
    setSelectedTutor(tutorId);
    setLoading(true);

    try {
      // Simulate API call to book session
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: {
          formData,
          tutorId,
          bookingTime: formData.scheduledDate && formData.scheduledTime ?
            `${formData.scheduledDate} at ${formData.scheduledTime}` :
            'To be determined'
        }
      });
    } catch (error) {
      console.error('Error booking session:', error);
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // If no tutors are available or state is missing, show error
  if (!location.state || !availableTutors || availableTutors.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Available Tutors</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any tutors available for your request.
            </p>
            <div className="mt-6">
              <button
                onClick={goBack}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiArrowLeft className="mr-2" /> Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {immediate ? 'Available Tutors' : 'Schedule with a Tutor'}
          </h2>
          <button
            onClick={goBack}
            className="flex items-center text-sm text-primary-600 hover:text-primary-800"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-6 rounded-r-md">
          <p className="text-sm text-primary-800">
            <span className="font-medium">Subject:</span> {formData.subject} &nbsp;•&nbsp;
            <span className="font-medium">Duration:</span> {formData.duration} minutes
            {formData.sessionType === 'scheduled' && (
              <> &nbsp;•&nbsp;
                <span className="font-medium">Scheduled for:</span> {formData.scheduledDate} at {formData.scheduledTime}
              </>
            )}
          </p>
        </div>

        <div className="space-y-4">
          {availableTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-150"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{tutor.name}</h3>
                  <div className="mt-1 flex items-center">
                    <FiStar className="text-yellow-400 h-4 w-4" />
                    <span className="ml-1 text-sm text-gray-600">{tutor.rating}/5.0</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tutor.subjects.map((subject) => (
                      <span
                        key={subject}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subject === formData.subject
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FaGraduationCap className="mr-1.5 h-4 w-4 text-gray-400" />
                    {tutor.academicYear}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={() => immediate ? handleStartSession(tutor.id) : handleBookSession(tutor.id)}
                    disabled={loading && selectedTutor === tutor.id}
                    className={`w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                      ${loading && selectedTutor === tutor.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                      } transition-colors duration-150`}
                  >
                    {loading && selectedTutor === tutor.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {immediate ? 'Connecting...' : 'Booking...'}
                      </>
                    ) : immediate ? (
                      <>
                        <FiVideo className="mr-2" /> Start Session
                      </>
                    ) : (
                      <>
                        <FiCalendar className="mr-2" /> Book Session
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableTutors;