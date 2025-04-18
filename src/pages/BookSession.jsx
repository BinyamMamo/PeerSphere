
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiInfo, FiPlus, FiClock, FiCalendar } from 'react-icons/fi';
import {
  FaGraduationCap,
  FaBook,
  FaVenusMars,
  FaChalkboardTeacher,
  FaQuestionCircle,
  FaClock
} from 'react-icons/fa';

const BookSession = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    preferredGender: '',
    academicYear: '',
    sessionType: 'immediate', // 'immediate' or 'scheduled'
    scheduledDate: '',
    scheduledTime: '',
    explanation: '',
    duration: 30, // Default 30 minutes
  });
  const [errors, setErrors] = useState({});

  // Sample subject list
  const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Economics', 'Business', 'Psychology'
  ];

  // Academic year options for tutors
  const academicYearOptions = [
    'Any', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'
  ];

  // Duration options in minutes
  const durationOptions = [30, 45, 60, 90, 120];

  // --- Styling Classes ---
  const baseInputStyles = "block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition duration-150 ease-in-out";
  const inputWithIconStyles = `${baseInputStyles} pl-10`; // Add padding for icon
  const selectStyles = `${baseInputStyles} appearance-none pr-10`; // Keep space for arrow

  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (formData.sessionType === 'scheduled') {
      if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date';
      if (!formData.scheduledTime) newErrors.scheduledTime = 'Please select a time';
    }
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
      // Simulate API call to find available tutors
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response - in a real app, this would come from your API
      const mockAvailableTutors = formData.sessionType === 'immediate' ?
        [
          { id: 1, name: 'Jane Doe', rating: 4.8, subjects: ['Mathematics'], academicYear: 'Graduate' },
          { id: 2, name: 'John Smith', rating: 4.5, subjects: ['Mathematics', 'Physics'], academicYear: 'PhD' }
        ] : [];

      if (mockAvailableTutors.length > 0) {
        // Navigate to available tutors list with the form data and tutors
        navigate('/available-tutors', {
          state: {
            formData,
            availableTutors: mockAvailableTutors,
            immediate: formData.sessionType === 'immediate'
          }
        });
      } else {
        // Navigate to suggested tutors (not immediately available)
        navigate('/suggested-tutors', {
          state: {
            formData,
            // In a real app, you'd fetch these from your API
            suggestedTutors: [
              { id: 3, name: 'Alex Johnson', rating: 4.9, subjects: ['Mathematics'], academicYear: 'PhD', nextAvailable: '2025-04-20T14:00:00' },
              { id: 4, name: 'Sarah Williams', rating: 4.7, subjects: ['Mathematics', 'Statistics'], academicYear: 'Graduate', nextAvailable: '2025-04-19T10:00:00' }
            ]
          }
        });
      }
    } catch (error) {
      console.error('Error finding tutors:', error);
      setErrors({ form: 'Failed to find tutors. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Book a Tutoring Session</h3>

          {/* Info Box */}
          <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-8 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-primary-800">
                  Fill out this form to book a tutoring session. You can either connect with an available tutor immediately
                  or schedule a session for later.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Selection */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                <FaBook className="inline mr-2 text-gray-500" />
                Subject <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaBook className="h-4 w-4 text-gray-400" />
                </span>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`${selectStyles} pl-10`}
                >
                  <option value="">Select subject...</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
            </div>

            {/* Session Type Radio Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-gray-500" />
                Session Timing
              </label>
              <div className="flex space-x-4 mt-1">
                <div className="flex items-center">
                  <input
                    id="session-immediate"
                    name="sessionType"
                    type="radio"
                    value="immediate"
                    checked={formData.sessionType === "immediate"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="session-immediate" className="ml-2 block text-sm text-gray-700">
                    Connect now
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="session-scheduled"
                    name="sessionType"
                    type="radio"
                    value="scheduled"
                    checked={formData.sessionType === "scheduled"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="session-scheduled" className="ml-2 block text-sm text-gray-700">
                    Schedule for later
                  </label>
                </div>
              </div>
            </div>

            {/* Date and Time (only if scheduled) */}
            {formData.sessionType === 'scheduled' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                    <FiCalendar className="inline mr-2 text-gray-500" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiCalendar className="h-4 w-4 text-gray-400" />
                    </span>
                    <input
                      type="date"
                      id="scheduledDate"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                      className={inputWithIconStyles}
                    />
                  </div>
                  {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
                </div>
                <div>
                  <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
                    <FiClock className="inline mr-2 text-gray-500" />
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiClock className="h-4 w-4 text-gray-400" />
                    </span>
                    <input
                      type="time"
                      id="scheduledTime"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleChange}
                      className={inputWithIconStyles}
                    />
                  </div>
                  {errors.scheduledTime && <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>}
                </div>
              </div>
            )}

            {/* Session Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                <FaClock className="inline mr-2 text-gray-500" />
                Session Duration
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaClock className="h-4 w-4 text-gray-400" />
                </span>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`${selectStyles} pl-10`}
                >
                  {durationOptions.map((duration) => (
                    <option key={duration} value={duration}>{duration} minutes</option>
                  ))}
                </select>
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Grid for Preferred Tutor Gender & Academic Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preferred Gender */}
              <div>
                <label htmlFor="preferredGender" className="block text-sm font-medium text-gray-700">
                  <FaVenusMars className="inline mr-2 text-gray-500" />
                  Preferred Tutor Gender
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaVenusMars className="h-4 w-4 text-gray-400" />
                  </span>
                  <select
                    id="preferredGender"
                    name="preferredGender"
                    value={formData.preferredGender}
                    onChange={handleChange}
                    className={`${selectStyles} pl-10`}
                  >
                    <option value="">No preference</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Preferred Academic Year */}
              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                  <FaGraduationCap className="inline mr-2 text-gray-500" />
                  Preferred Tutor Academic Level
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaGraduationCap className="h-4 w-4 text-gray-400" />
                  </span>
                  <select
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className={`${selectStyles} pl-10`}
                  >
                    <option value="">No preference</option>
                    {academicYearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
                <FaQuestionCircle className="inline mr-2 text-gray-500" />
                What do you need help with? (Optional)
              </label>
              <textarea
                id="explanation"
                name="explanation"
                rows="3"
                value={formData.explanation}
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
                    {formData.sessionType === 'immediate' ? 'Finding available tutors...' : 'Submitting...'}
                  </>
                ) : (
                  formData.sessionType === 'immediate' ? 'Find Available Tutors' : 'Schedule Session'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
