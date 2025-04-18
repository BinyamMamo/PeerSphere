
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiStar, FiHome, FiCalendar, FiClock, FiBook, FiSend } from 'react-icons/fi';

const SessionFeedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tutorId, sessionDuration, subject } = location.state || {
    tutorId: null,
    sessionDuration: 0,
    subject: 'Unknown Subject'
  };

  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Format session duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please provide a rating before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call to submit feedback
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  // If no session data, show error
  if (!tutorId) {
    return (
      <div className="max-w-3xl mx-auto my-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Session Information Not Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find information about your tutoring session.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiHome className="mr-2" /> Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto my-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-900">Thank You for Your Feedback!</h3>
            <p className="mt-2 text-gray-600">
              Your feedback helps us improve our tutoring service and helps other students find great tutors.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/book-session')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiCalendar className="mr-2" /> Book Another Session
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiHome className="mr-2" /> Go to Home
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">How was your tutoring session?</h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <div className="flex items-center text-gray-700">
                  <FiBook className="mr-2 text-gray-500" />
                  <span className="font-medium">{subject}</span>
                </div>
                <div className="flex items-center mt-2 text-gray-700">
                  <FiClock className="mr-2 text-gray-500" />
                  <span>Duration: {formatDuration(sessionDuration)}</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-0">
                <button
                  onClick={() => navigate('/book-session')}
                  className="inline-flex items-center px-3 py-1.5 text-sm border border-primary-700 rounded text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FiCalendar className="mr-1" /> Book Again
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate your experience
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="text-2xl mr-1 focus:outline-none"
                  >
                    <FiStar
                      className={`h-8 w-8 ${(hoverRating !== 0 ? star <= hoverRating : star <= rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-700">
                  {rating > 0 ? (
                    <>
                      <span className="font-medium">{rating}</span>/5
                    </>
                  ) : (
                    'No rating'
                  )}
                </span>
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                Additional feedback (optional)
              </label>
              <textarea
                id="feedback"
                name="feedback"
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the session..."
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || rating === 0}
                className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${loading || rating === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  } transition ease-in-out duration-150`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" /> Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionFeedback;
