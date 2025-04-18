
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiClock, FiStar, FiCalendar, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { FaGraduationCap, FaRegClock, FaVenusMars, FaBook, FaQuestionCircle } from 'react-icons/fa';

const BookWithTutor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, tutorId, tutor } = location.state || {
    formData: {},
    tutorId: null,
    tutor: null
  };

  const [loading, setLoading] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    date: '',
    time: '',
    duration: formData.duration || 30,
    explanation: formData.explanation || ''
  });
  const [errors, setErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDateTimes, setSelectedDateTimes] = useState([]);

  // In a real app, you would fetch the tutor's availability from your backend
  useEffect(() => {
    // Mock function to generate available times for the selected date
    const generateAvailableTimes = (date) => {
      // This is just mock data - in a real app, this would come from your API
      const times = [];
      const baseDate = new Date(date);

      // Start at 9 AM
      baseDate.setHours(9, 0, 0, 0);

      // Generate times every 30 minutes from 9 AM to 5 PM
      for (let i = 0; i < 16; i++) {
        const timeSlot = new Date(baseDate);
        timeSlot.setMinutes(timeSlot.getMinutes() + (i * 30));

        // Skip some times to simulate unavailability
        if (i !== 3 && i !== 7 && i !== 11) {
          times.push({
            value: timeSlot.toTimeString().substring(0, 5), // Format as HH:MM
            label: timeSlot.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          });
        }
      }

      return times;
    };

    if (bookingFormData.date) {
      setAvailableTimes(generateAvailableTimes(bookingFormData.date));
    }
  }, [bookingFormData.date]);

  // Format today's date in YYYY-MM-DD for min date in date picker
  const today = new Date().toISOString().split('T')[0];

  // Calculate price
  const calculatePrice = (duration) => {
    const baseRate = 25; // $25 per hour
    return (baseRate * parseInt(duration) / 60).toFixed(2);
  };

  // Base styling classes
  const baseInputStyles = "block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition duration-150 ease-in-out";
  const inputWithIconStyles = `${baseInputStyles} pl-10`; // Add padding for icon
  const selectStyles = `${baseInputStyles} appearance-none pr-10`; // Keep space for arrow

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData({ ...bookingFormData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleTimeSelect = (time) => {
    // Toggle selection
    if (selectedDateTimes.includes(time)) {
      setSelectedDateTimes(selectedDateTimes.filter(t => t !== time));
    } else {
      // For this example, we'll only allow one time selection
      // In a real app, you might want to allow multiple consecutive slots
      setSelectedDateTimes([time]);
    }

    setBookingFormData({ ...bookingFormData, time });
    if (errors.time) {
      setErrors({ ...errors, time: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookingFormData.date) newErrors.date = 'Please select a date';
    if (!bookingFormData.time) newErrors.time = 'Please select a time';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call to book the session
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: {
          formData: {
            ...formData,
            ...bookingFormData
          },
          tutorId,
          tutor,
          bookingTime: `${bookingFormData.date} at ${bookingFormData.time}`
        }
      });
    } catch (error) {
      console.error('Error booking session:', error);
      setErrors({ form: 'Failed to book session. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // If tutor data is missing, show error
  if (!tutor) {
    return (
      <div className="max-w-3xl mx-auto my-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Tutor Not Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find information about this tutor. Please go back and try again.
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Book a Session with {tutor.name}
          </h2>
          <button
            onClick={goBack}
            className="flex items-center text-sm text-primary-600 hover:text-primary-800"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-6 rounded-r-md">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="font-medium text-primary-800">{tutor.name}</h3>
              <div className="mt-1 flex items-center">
                <FiStar className="text-yellow-400 h-4 w-4" />
                <span className="ml-1 text-sm text-primary-700">{tutor.rating}/5.0</span>
              </div>
              <div className="mt-1 flex items-center text-sm text-primary-700">
                <FaGraduationCap className="mr-1.5 h-4 w-4 text-primary-600" />
                {tutor.academicYear}
              </div>
            </div>
            <div className="mt-3 sm:mt-0">
              <div className="text-sm text-primary-700 font-medium">Teaches:</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {tutor.subjects.map((subject) => (
                  <span
                    key={subject}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${subject === formData.subject
                        ? 'bg-primary-200 text-primary-800'
                        : 'bg-primary-100 text-primary-700'
                      }`}
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              <FiCalendar className="inline mr-2 text-gray-500" />
              Select Date <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiCalendar className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="date"
                id="date"
                name="date"
                min={today}
                value={bookingFormData.date}
                onChange={handleChange}
                className={inputWithIconStyles}
              />
            </div>
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          {/* Time Selection */}
          {bookingFormData.date && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FiClock className="inline mr-2 text-gray-500" />
                Select Time <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.length > 0 ? (
                  availableTimes.map((time) => (
                    <button
                      key={time.value}
                      type="button"
                      onClick={() => handleTimeSelect(time.value)}
                      className={`py-2 px-3 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedDateTimes.includes(time.value)
                          ? 'bg-primary-600 text-white focus:ring-primary-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-primary-500'
                        }`}
                    >
                      {time.label}
                    </button>
                  ))
                ) : (
                  <p className="col-span-4 text-sm text-gray-500">No available times for this date.</p>
                )}
              </div>
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
            </div>
          )}

          {/* Session Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              <FaRegClock className="inline mr-2 text-gray-500" />
              Session Duration
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaRegClock className="h-4 w-4 text-gray-400" />
              </span>
              <select
                id="duration"
                name="duration"
                value={bookingFormData.duration}
                onChange={handleChange}
                className={`${selectStyles} pl-10`}
              >
                <option value="30">30 minutes ($12.50)</option>
                <option value="45">45 minutes ($18.75)</option>
                <option value="60">60 minutes ($25.00)</option>
                <option value="90">90 minutes ($37.50)</option>
                <option value="120">120 minutes ($50.00)</option>
              </select>
              {/* Custom Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Price: ${calculatePrice(bookingFormData.duration)}
            </p>
          </div>

          {/* Explanation / Session Focus */}
          <div>
            <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
              <FaQuestionCircle className="inline mr-2 text-gray-500" />
              What do you need help with? (Optional)
            </label>
            <textarea
              id="explanation"
              name="explanation"
              rows="3"
              value={bookingFormData.explanation}
              onChange={handleChange}
              placeholder="Describe what you'd like to focus on in this session..."
              className={`${baseInputStyles} resize-none`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Providing details helps your tutor prepare for the session.
            </p>
          </div>

          {/* Error message if form submission fails */}
          {errors.form && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.form}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                } transition ease-in-out duration-150`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking Session...
                </>
              ) : (
                <>
                  <FiCheckCircle className="mr-2" /> Book Session
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookWithTutor;
