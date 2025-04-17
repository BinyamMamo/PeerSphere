import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaStar, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

const BookingPage = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { tutors, bookSession } = useContext(AppContext);
  
  // Find the tutor by ID
  const tutor = tutors.find(t => t.id === parseInt(tutorId));
  
  // Local state for booking details
  const [bookingDetails, setBookingDetails] = useState({
    subject: '',
    date: '',
    timeSlot: '',
    location: 'Online'
  });
  
  // State for tracking form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Set default subject if tutor only teaches one subject
  useEffect(() => {
    if (tutor && tutor.subjects.length === 1) {
      setBookingDetails(prev => ({
        ...prev,
        subject: tutor.subjects[0]
      }));
    }
  }, [tutor]);
  
  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!bookingDetails.date || !tutor?.availability) return [];
    
    const slots = tutor.availability
      .filter(slot => slot.date === bookingDetails.date)
      .map(slot => slot.startTime);
    
    return slots;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    if (!bookingDetails.subject || !bookingDetails.date || !bookingDetails.timeSlot) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }
    
    try {
      // Create the booking
      bookSession(
        parseInt(tutorId),
        bookingDetails.subject,
        bookingDetails.date,
        bookingDetails.timeSlot
      );
      
      // Show success message and redirect after delay
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/sessions');
      }, 2000);
    } catch (error) {
      setError('There was an error booking your session. Please try again.');
      setSubmitting(false);
    }
  };
  
  // If tutor not found
  if (!tutor) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tutor not found. Please select another tutor.</p>
        <button 
          onClick={() => navigate('/student')}
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <FaArrowLeft className="mr-2" /> Back to tutors
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/student')}
          className="inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <FaArrowLeft className="mr-2" /> Back to tutors
        </button>
        <h1 className="text-2xl font-bold mt-2">Book a Session</h1>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>Session booked successfully! Redirecting to your sessions...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tutor Info Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <img 
                src={tutor.avatar} 
                alt={`${tutor.firstName} ${tutor.lastName}`} 
                className="w-16 h-16 rounded-full object-cover"
              />
              
              <div className="ml-4">
                <h3 className="font-medium">{tutor.firstName} {tutor.lastName}</h3>
                <div className="flex items-center mt-1">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="text-sm">{tutor.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 ml-1">({tutor.reviews} reviews)</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Year {tutor.yearOfStudy}{tutor.yearOfStudy === 5 ? ' Graduate' : ''}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-xs text-gray-500 uppercase mb-1">Subjects</h4>
              <div className="flex flex-wrap gap-1">
                {tutor.subjects.map((subject, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-xs text-gray-500 uppercase mb-1">Rate</h4>
              <p className="font-bold text-lg">{tutor.hourlyRate} AED<span className="text-xs font-normal text-gray-500">/hour</span></p>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Session Details</h2>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Subject selection */}
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject*
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={bookingDetails.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select Subject</option>
                  {tutor.subjects.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Date selection */}
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <select
                    id="date"
                    name="date"
                    className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={bookingDetails.date}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select Date</option>
                    {[...new Set(tutor.availability.map(slot => slot.date))].map((date, index) => (
                      <option key={index} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Time slot selection */}
              <div className="mb-4">
                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Slot*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <select
                    id="timeSlot"
                    name="timeSlot"
                    className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={bookingDetails.timeSlot}
                    onChange={handleInputChange}
                    required
                    disabled={!bookingDetails.date}
                  >
                    <option value="" disabled>
                      {!bookingDetails.date ? 'Select a date first' : 'Select Time Slot'}
                    </option>
                    {getAvailableTimeSlots().map((timeSlot, index) => (
                      <option key={index} value={timeSlot}>
                        {timeSlot}
                      </option>
                    ))}
                  </select>
                </div>
                {bookingDetails.date && getAvailableTimeSlots().length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No time slots available for this date. Please select another date.
                  </p>
                )}
              </div>
              
              {/* Location selection */}
              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <select
                    id="location"
                    name="location"
                    className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={bookingDetails.location}
                    onChange={handleInputChange}
                  >
                    <option value="Online">Online</option>
                    <option value="Library Study Room 1">Library Study Room 1</option>
                    <option value="Library Study Room 2">Library Study Room 2</option>
                    <option value="Library Study Room 3">Library Study Room 3</option>
                  </select>
                </div>
              </div>
              
              {/* Submit button */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Total: {tutor.hourlyRate} AED</p>
                  <p className="text-xs text-gray-500">1 hour session</p>
                </div>
                
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
                  disabled={submitting || success || !bookingDetails.subject || !bookingDetails.date || !bookingDetails.timeSlot}
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
