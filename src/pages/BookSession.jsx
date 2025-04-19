import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiInfo,
  FiPlus,
  FiClock,
  FiCalendar,
  FiCheckCircle
} from 'react-icons/fi';
import {
  FaBook,
  FaVenusMars,
  FaClock,
  FaStar
} from 'react-icons/fa';

const BookSession = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    preferredGender: '',
    sessionType: 'immediate',
    scheduledDate: '',
    scheduledTime: '',
    explanation: '',
    duration: 30,
    ratingFilter: 4.0,
  });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const subjectCategories = {
    "Mathematics": ["Algebra", "Calculus", "Statistics", "Trigonometry", "Geometry", "Linear Algebra"],
    "Sciences": ["Physics", "Chemistry", "Biology", "Computer Science", "Environmental Science"],
    "Languages": ["English", "Spanish", "French", "German", "Chinese", "Japanese"],
    "Humanities": ["History", "Psychology", "Sociology", "Philosophy", "Political Science"],
    "Business": ["Economics", "Accounting", "Finance", "Marketing", "Management"]
  };

  const allSubjects = Object.values(subjectCategories).flat();
  const popularSubjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology', 'Economics', 'History'];

  const filteredSubjects = searchQuery
    ? allSubjects.filter(subject =>
      subject.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' },
    { value: 90, label: '90 minutes' },
    { value: 120, label: '120 minutes' }
  ];

  const baseInputStyles = "block w-full px-4 py-3 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition duration-150 ease-in-out";
  const inputWithIconStyles = `${baseInputStyles} pl-10`;
  const buttonStyles = "w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition ease-in-out duration-150";
  const primaryButtonStyles = `${buttonStyles} bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`;
  const secondaryButtonStyles = `${buttonStyles} bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400`;
  const disabledButtonStyles = `${buttonStyles} bg-gray-400 cursor-not-allowed`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubjectSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSubjectSuggestions(true);
  };

  const selectSubject = (subject) => {
    setFormData({ ...formData, subject });
    setSearchQuery(subject);
    setShowSubjectSuggestions(false);
    if (errors.subject) {
      setErrors({ ...errors, subject: null });
    }
  };

  const handleRatingChange = (value) => {
    setFormData({ ...formData, ratingFilter: value });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.duration) newErrors.duration = 'Please select a session duration';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.sessionType === 'scheduled') {
      if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date';
      if (!formData.scheduledTime) newErrors.scheduledTime = 'Please select a time';
    }
    return newErrors;
  };

  const handleNextStep = () => {
    const newErrors = validateStep1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateStep2();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setFormSubmitted(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAvailableTutors = [
        { id: 1, name: 'Jane Doe', rating: 4.8, subjects: ['Mathematics', 'Calculus'], academicYear: 'Graduate', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: 2, name: 'John Smith', rating: 4.5, subjects: ['Mathematics', 'Physics'], academicYear: 'PhD', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 3, name: 'Alex Johnson', rating: 4.9, subjects: ['Mathematics', 'Algebra'], academicYear: 'PhD', image: 'https://randomuser.me/api/portraits/men/36.jpg' }
      ];

      navigate('/available-tutors', {
        state: {
          formData,
          availableTutors: mockAvailableTutors,
          immediate: formData.sessionType === 'immediate'
        }
      });
    } catch (error) {
      console.error('Error finding tutors:', error);
      setErrors({ form: 'Failed to find tutors. Please try again.' });
      setFormSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const getMinTime = () => {
    if (formData.scheduledDate === today) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '';
  };

  return (
    <div className="mx-auto my-8 px-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Book a Tutoring Session</h2>
          {/* <div className="flex items-center mt-4">
            <div className={`flex items-center justify-center w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'} font-bold`}></div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'} font-bold`}></div>
          </div> */}
        </div>

        <div className="p-6 pt-0 sm:p-8 sm:pt-0">
          {formSubmitted ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mb-4"></div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Finding the perfect tutor for you...</h3>
              <p className="text-gray-600">We're matching you with tutors that match your requirements.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-8 rounded-r-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiInfo className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-primary-800">
                            Tell us what subject you need help with and how long you'd like your session to be.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="flex items-center text-sm font-medium text-gray-700 mb-2.5">
                        <FaBook className="inline mr-2 text-gray-500" />
                        <span>
                          Subject <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaBook className="h-4 w-4 text-gray-400" />
                        </span>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={searchQuery}
                          onChange={handleSubjectSearch}
                          onFocus={() => setShowSubjectSuggestions(true)}
                          placeholder="Search for a subject..."
                          className={inputWithIconStyles}
                          autoComplete="off"
                        />
                        {showSubjectSuggestions && searchQuery && (
                          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                            {filteredSubjects.length > 0 ? (
                              filteredSubjects.map((subject) => (
                                <div
                                  key={subject}
                                  className="px-4 py-2 hover:bg-primary-50 cursor-pointer"
                                  onClick={() => selectSubject(subject)}
                                >
                                  {subject}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">No matching subjects</div>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Popular subjects:</p>
                        <div className="flex flex-wrap gap-2">
                          {popularSubjects.map((subject) => (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => selectSubject(subject)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        <FaClock className="inline mr-2 text-gray-500" />
                        Session Duration <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
                        {durationOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => handleChange({ target: { name: 'duration', value: option.value } })}
                            className={`border rounded-md p-3 text-center cursor-pointer transition-all ${formData.duration === option.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                              }`}
                          >
                            <div className="font-medium">{option.label}</div>
                          </div>
                        ))}
                      </div>
                      {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                    </div>

                    <div>
                      <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-2.5">
                        <FaBook className="inline mr-2 text-gray-500" />
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

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className={primaryButtonStyles}
                      >
                        Continue to Scheduling
                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-8 rounded-r-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FiInfo className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-primary-800">
                            Choose whether you want to connect with a tutor now or schedule for later.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaClock className="inline mr-2 text-gray-500" />
                        Session Timing
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                        <div
                          className={`border rounded-lg p-4 cursor-pointer ${formData.sessionType === 'immediate'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300'
                            }`}
                          onClick={() => handleChange({ target: { name: 'sessionType', value: 'immediate' } })}
                        >
                          <div className="flex items-start">
                            <input
                              id="session-immediate"
                              name="sessionType"
                              type="radio"
                              value="immediate"
                              checked={formData.sessionType === "immediate"}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <label htmlFor="session-immediate" className="block text-sm font-medium text-gray-700">
                                Connect Now
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                Get connected with an available tutor within minutes
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`border rounded-lg p-4 cursor-pointer ${formData.sessionType === 'scheduled'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300'
                            }`}
                          onClick={() => handleChange({ target: { name: 'sessionType', value: 'scheduled' } })}
                        >
                          <div className="flex items-start">
                            <input
                              id="session-scheduled"
                              name="sessionType"
                              type="radio"
                              value="scheduled"
                              checked={formData.sessionType === "scheduled"}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <label htmlFor="session-scheduled" className="block text-sm font-medium text-gray-700">
                                Schedule for Later
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                Choose a specific date and time for your session
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formData.sessionType === 'scheduled' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
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
                              min={today}
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
                              min={formData.scheduledDate === today ? getMinTime() : ''}
                              className={inputWithIconStyles}
                            />
                          </div>
                          {errors.scheduledTime && <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaVenusMars className="inline mr-2 text-gray-500" />
                        Preferred Tutor Gender
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
                        <div
                          className={`border rounded-lg p-4 cursor-pointer ${formData.preferredGender === ''
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300'
                            }`}
                          onClick={() => handleChange({ target: { name: 'preferredGender', value: '' } })}
                        >
                          <div className="flex items-start">
                            <input
                              id="gender-none"
                              name="preferredGender"
                              type="radio"
                              value=""
                              checked={formData.preferredGender === ""}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <label htmlFor="gender-none" className="block text-sm font-medium text-gray-700">
                                No Preference
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                Open to any tutor
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`border rounded-lg p-4 cursor-pointer ${formData.preferredGender === 'Male'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300'
                            }`}
                          onClick={() => handleChange({ target: { name: 'preferredGender', value: 'Male' } })}
                        >
                          <div className="flex items-start">
                            <input
                              id="gender-male"
                              name="preferredGender"
                              type="radio"
                              value="Male"
                              checked={formData.preferredGender === "Male"}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <label htmlFor="gender-male" className="block text-sm font-medium text-gray-700">
                                Male
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                Prefer a male tutor
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`border rounded-lg p-4 cursor-pointer ${formData.preferredGender === 'Female'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300'
                            }`}
                          onClick={() => handleChange({ target: { name: 'preferredGender', value: 'Female' } })}
                        >
                          <div className="flex items-start">
                            <input
                              id="gender-female"
                              name="preferredGender"
                              type="radio"
                              value="Female"
                              checked={formData.preferredGender === "Female"}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <label htmlFor="gender-female" className="block text-sm font-medium text-gray-700">
                                Female
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                Prefer a female tutor
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaStar className="inline mr-2 text-gray-500" />
                        Minimum Tutor Rating
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="relative w-full">
                          <input
                            type="range"
                            min="3"
                            max="5"
                            step="0.1"
                            value={formData.ratingFilter}
                            onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #3b82f6 ${(formData.ratingFilter - 3) / 2 * 100}%, #e5e7eb ${(formData.ratingFilter - 3) / 2 * 100}%)`
                            }}
                          />
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>3.0</span>
                            <span>4.0</span>
                            <span>5.0</span>
                          </div>
                        </div>
                        <span className="flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-md">
                          <FaStar className="text-yellow-400 mr-1" /> {formData.ratingFilter.toFixed(1)}+
                        </span>
                      </div>
                    </div>

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

                    <div className="pt-6 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className={secondaryButtonStyles}
                      >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={loading ? disabledButtonStyles : primaryButtonStyles}
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
                          formData.sessionType === 'immediate' ? (
                            <>
                              Find Available Tutors
                              <FiCheckCircle className="ml-2 h-5 w-5" />
                            </>
                          ) : (
                            <>
                              Schedule Session
                              <FiCheckCircle className="ml-2 h-5 w-5" />
                            </>
                          )
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSession;