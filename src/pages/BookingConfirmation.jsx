
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiBook, FiCheckCircle, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, tutorId, tutor, bookingTime } = location.state || {
    formData: {},
    tutorId: null,
    tutor: null,
    bookingTime: null
  };

  // Calculate price
  const calculatePrice = (duration) => {
    const baseRate = 25; // $25 per hour
    return (baseRate * parseInt(duration) / 60).toFixed(2);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewBookings = () => {
    navigate('/my-bookings');
  };

  // If booking data is missing, show error
  if (!formData || !tutor || !bookingTime) {
    return (
      <div className="max-w-3xl mx-auto my-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Booking Information Not Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find information about your booking. Please try again.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/book-session')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiArrowLeft className="mr-2" /> Back to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <FiCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="mt-2 text-base text-gray-600">
              Your tutoring session has been successfully booked.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Session Details</h3>

            <div className="space-y-3">
              <div className="flex items-start">
                <FiCalendar className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Date & Time</p>
                  <p className="text-sm text-gray-600">{bookingTime}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiClock className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">{formData.duration} minutes</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiBook className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Subject</p>
                  <p className="text-sm text-gray-600">{formData.subject}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiUser className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Tutor</p>
                  <div className="text-sm text-gray-600">
                    <p>{tutor.name}</p>
                    <div className="flex items-center mt-1">
                      <FaGraduationCap className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{tutor.academicYear}</span>
                    </div>
                  </div>
                </div>
              </div>

              {formData.explanation && (
                <div className="flex items-start">
                  <FiMessageCircle className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Your Message</p>
                    <p className="text-sm text-gray-600">{formData.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Tutoring ({formData.duration} minutes)</p>
                <p className="text-sm font-medium text-gray-900">${calculatePrice(formData.duration)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Platform fee</p>
                <p className="text-sm font-medium text-gray-900">$1.00</p>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                <p className="text-base font-medium text-gray-900">Total</p>
                <p className="text-base font-medium text-gray-900">
                  ${(parseFloat(calculatePrice(formData.duration)) + 1).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Please join the session 5 minutes before the start time. Make sure your microphone and camera are working properly.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewBookings}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-primary-700 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View My Bookings
              </button>
              <button
                onClick={handleGoHome}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
