
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiClock, FiStar, FiCalendar, FiArrowLeft, FiHeart } from 'react-icons/fi';
import { FaGraduationCap, FaRegClock, FaHeart } from 'react-icons/fa';

const SuggestedTutors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, suggestedTutors } = location.state || {
    formData: {},
    suggestedTutors: []
  };

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]); // In a real app, this would come from your backend

  const handleBookWithTutor = async (tutorId) => {
    setSelectedTutor(tutorId);
    setLoading(true);

    try {
      // Simulate API call to book session
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to booking page with this specific tutor
      navigate('/book-with-tutor', {
        state: {
          formData,
          tutorId,
          tutor: suggestedTutors.find(t => t.id === tutorId)
        }
      });
    } catch (error) {
      console.error('Error scheduling with tutor:', error);
      setLoading(false);
    }
  };

  const toggleFavorite = (tutorId) => {
    if (favorites.includes(tutorId)) {
      setFavorites(favorites.filter(id => id !== tutorId));
    } else {
      setFavorites([...favorites, tutorId]);
    }
    // In a real app, you would make an API call to save this preference
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  // Group tutors by next available time (today, tomorrow, this week)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateStr) => {
    const date = new Date(dateStr);
    return date.toDateString() === tomorrow.toDateString();
  };

  const groups = {
    today: suggestedTutors.filter(tutor => isToday(tutor.nextAvailable)),
    tomorrow: suggestedTutors.filter(tutor => isTomorrow(tutor.nextAvailable)),
    later: suggestedTutors.filter(tutor => !isToday(tutor.nextAvailable) && !isTomorrow(tutor.nextAvailable))
  };

  // If no tutors are available or state is missing, show error
  if (!location.state || !suggestedTutors || suggestedTutors.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Tutors Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any tutors for your subject. Please try a different subject or come back later.
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
            Suggested Tutors
          </h2>
          <button
            onClick={goBack}
            className="flex items-center text-sm text-primary-600 hover:text-primary-800"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-6 rounded-r-md">
          <div className="text-sm text-primary-800">
            <p>
              <span className="font-medium">Subject:</span> {formData.subject}
            </p>
            <p className="mt-1">
              No tutors are available right now, but you can schedule a session with one of our recommended tutors below.
            </p>
          </div>
        </div>

        {/* Today's Availability */}
        {groups.today.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Available Today</span>
            </h3>
            <div className="space-y-4">
              {groups.today.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  formData={formData}
                  isFavorite={favorites.includes(tutor.id)}
                  onToggleFavorite={toggleFavorite}
                  onBook={handleBookWithTutor}
                  loading={loading && selectedTutor === tutor.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tomorrow's Availability */}
        {groups.tomorrow.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Available Tomorrow</span>
            </h3>
            <div className="space-y-4">
              {groups.tomorrow.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  formData={formData}
                  isFavorite={favorites.includes(tutor.id)}
                  onToggleFavorite={toggleFavorite}
                  onBook={handleBookWithTutor}
                  loading={loading && selectedTutor === tutor.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Later Availability */}
        {groups.later.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <span className="bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Available Later</span>
            </h3>
            <div className="space-y-4">
              {groups.later.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  formData={formData}
                  isFavorite={favorites.includes(tutor.id)}
                  onToggleFavorite={toggleFavorite}
                  onBook={handleBookWithTutor}
                  loading={loading && selectedTutor === tutor.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Tutor Card Component
const TutorCard = ({ tutor, formData, isFavorite, onToggleFavorite, onBook, loading }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-150">
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900">{tutor.name}</h3>
            <button
              onClick={() => onToggleFavorite(tutor.id)}
              className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <FaHeart className="h-4 w-4 text-red-500" />
              ) : (
                <FiHeart className="h-4 w-4" />
              )}
            </button>
          </div>
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
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <FaRegClock className="mr-1.5 h-4 w-4 text-gray-400" />
            <span className="font-medium">Next available:</span>
            <span className="ml-1">
              {new Date(tutor.nextAvailable).toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:justify-center">
          <button
            onClick={() => onBook(tutor.id)}
            disabled={loading}
            className={`w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              } transition-colors duration-150`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Booking...
              </>
            ) : (
              <>
                <FiCalendar className="mr-2" /> Schedule
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedTutors;
