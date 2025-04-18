
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiClock, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { MdOutlineBookmark, MdOutlineBookmarkAdd } from 'react-icons/md';

const AvailableTutors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, availableTutors, immediate } = location.state || {
    formData: {},
    availableTutors: [],
    immediate: false
  };

  // For demo purposes, we'll use the provided tutor data
  // In a real app, this would come from the API based on availability
  const [tutors, setTutors] = useState([
    {
      "id": 1,
      "firstName": "Ahmed",
      "lastName": "Al-Mansoori",
      "gender": "Male",
      "email": "ahmed.almansoori@peersphere.ae",
      "subjects": [
        "Calculus I",
        "Physics I"
      ],
      "availability": [
        {
          "date": "2025-04-20",
          "startTime": "2:00 PM",
          "duration": 60
        },
        {
          "date": "2025-04-21",
          "startTime": "4:30 PM",
          "duration": 60
        },
        {
          "date": "2025-04-23",
          "startTime": "10:00 AM",
          "duration": 60
        }
      ],
      "rating": 4.8,
      "hourlyRate": 120,
      "bio": "Senior engineering student with a passion for mathematics and physics. I've been tutoring for 2 years.",
      "yearOfStudy": 4,
      "totalSessions": 24,
      "reviews": 18,
      "avatar": "https://i.pravatar.cc/150?img=1",
      "status": "Approved"
    },
    {
      "id": 2,
      "firstName": "Fatima",
      "lastName": "Al-Hashimi",
      "gender": "Female",
      "email": "fatima.alhashimi@peersphere.ae",
      "subjects": [
        "Computer Science 101",
        "Data Structures",
        "Algorithms"
      ],
      "availability": [
        {
          "date": "2025-04-22",
          "startTime": "3:00 PM",
          "duration": 60
        },
        {
          "date": "2025-04-24",
          "startTime": "5:30 PM",
          "duration": 60
        },
        {
          "date": "2025-04-26",
          "startTime": "11:00 AM",
          "duration": 60
        }
      ],
      "rating": 4.9,
      "hourlyRate": 150,
      "bio": "Computer Science graduate student specializing in algorithms and data structures.",
      "yearOfStudy": 5,
      "totalSessions": 32,
      "reviews": 26,
      "avatar": "https://i.pravatar.cc/150?img=28",
      "status": "Approved"
    },
    {
      "id": 6,
      "firstName": "Priya",
      "lastName": "Sharma",
      "gender": "Female",
      "email": "priya.sharma@peersphere.ae",
      "subjects": [
        "Linear Algebra",
        "Statistics",
        "Calculus II"
      ],
      "availability": [
        {
          "date": "2025-04-19",
          "startTime": "4:00 PM",
          "duration": 60
        },
        {
          "date": "2025-04-22",
          "startTime": "10:30 AM",
          "duration": 60
        },
        {
          "date": "2025-04-24",
          "startTime": "1:00 PM",
          "duration": 60
        }
      ],
      "rating": 4.9,
      "hourlyRate": 160,
      "bio": "Mathematics graduate student with extensive tutoring experience in various math subjects.",
      "yearOfStudy": 5,
      "totalSessions": 35,
      "reviews": 29,
      "avatar": "https://i.pravatar.cc/150?img=10",
      "status": "Approved"
    }
  ]);

  // Filter tutors based on subject if provided in formData
  const filteredTutors = formData.subject ?
    tutors.filter(tutor => tutor.subjects.some(s => s.toLowerCase().includes(formData.subject.toLowerCase()))) :
    tutors;

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoriteTutors, setFavoriteTutors] = useState([]);

  const handleStartSession = async (tutorId) => {
    setSelectedTutor(tutorId);
    setLoading(true);

    try {
      // Simulate API call to start session
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to session room
      navigate(`/session-room/${tutorId}`, {
        state: {
          formData,
          tutorId,
          tutor: tutors.find(t => t.id === tutorId)
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
      navigate('/book-with-tutor', {
        state: {
          formData,
          tutorId,
          tutor: tutors.find(t => t.id === tutorId)
        }
      });
    } catch (error) {
      console.error('Error booking session:', error);
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavoriteTutor = (tutorId) => {
    setFavoriteTutors(prevFavorites =>
      prevFavorites.includes(tutorId)
        ? prevFavorites.filter(id => id !== tutorId)
        : [...prevFavorites, tutorId]
    );
  };

  const isFavoriteTutor = (tutorId) => {
    return favoriteTutors.includes(tutorId);
  };

  const goBack = () => {
    navigate(-1);
  };

  // If no tutors are available or state is missing, show error
  if (!filteredTutors || filteredTutors.length === 0) {
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

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
        <div className="flex flex-col">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="bg-white/85 rounded-lg shadow overflow-hidden">
              <div className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-start">
                  {/* Profile Image */}
                  <img
                    src={tutor.avatar}
                    alt={`${tutor.firstName} ${tutor.lastName}`}
                    className="w-12 h-12 rounded-full object-cover ring-1 p-[1px] ring-neutral-700/25"
                  />

                  {/* Tutor Info */}
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{tutor.firstName} {tutor.lastName}</h3>
                      <button
                        onClick={() => toggleFavoriteTutor(tutor.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        {isFavoriteTutor(tutor.id) ? (
                          <MdOutlineBookmark className="text-red-500" />
                        ) : (
                          <MdOutlineBookmarkAdd />
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      Year {tutor.yearOfStudy}{tutor.yearOfStudy === 5 ? ' Graduate' : ''}
                    </p>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {tutor.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs ${formData.subject && subject.toLowerCase().includes(formData.subject.toLowerCase())
                          ? 'ring-1 ring-primary-300'
                          : ''
                          }`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Times (only show next available) */}
                {tutor.availability && tutor.availability.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <FiClock className="text-gray-400 mr-1" />
                      <span>Next available: {tutor.availability[0].date}, {tutor.availability[0].startTime}</span>
                    </div>
                  </div>
                )}

                {/* Hourly Rate */}
                {/* <div className="mt-2 text-sm">
                  <span className="font-medium">${tutor.hourlyRate}</span>
                  <span className="text-gray-500"> per hour</span>
                </div> */}

                {/* Ratings & Book Button */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center mt-1">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-sm">{tutor.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 ml-1">({tutor.reviews} reviews)</span>
                  </div>
                  <button
                    onClick={() => immediate ? handleStartSession(tutor.id) : handleBookSession(tutor.id)}
                    disabled={loading && selectedTutor === tutor.id}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${loading && selectedTutor === tutor.id
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                  >
                    {loading && selectedTutor === tutor.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {immediate ? 'Connecting...' : 'Booking...'}
                      </span>
                    ) : immediate ? (
                        'Start Session'
                    ) : (
                          'Book Session'
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
