import React, { useState } from 'react';
import { FiCheck, FiInfo, FiPlus, FiUploadCloud } from 'react-icons/fi'; // Added FiPlus, FiUploadCloud
import {
  FaGraduationCap,
  FaBook,
  FaUser,
  FaFileAlt,
  FaVenusMars // More appropriate icon for Gender
} from 'react-icons/fa';

const TutorApplication = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    subjects: [],
    bio: '',
    academicYear: '',
    academicStanding: '',
    gender: '',
    coverLetter: '',
    resume: null
  });
  const [customSubject, setCustomSubject] = useState('');
  const [errors, setErrors] = useState({});

  // Sample subject list
  const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Economics', 'Business', 'Psychology'
  ];

  // Academic year options
  const academicYearOptions = [
    'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'
  ];

  // --- Input Styling Classes ---
  // Base styles for text inputs, textareas, and selects for consistency
  const baseInputStyles = "block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition duration-150 ease-in-out";
  const inputWithIconStyles = `${baseInputStyles} pl-10`; // Add padding for icon
  const selectStyles = `${baseInputStyles} appearance-none pr-10`; // Keep space for arrow

  // --- Event Handlers (mostly unchanged, minor error clearing logic adjustments if needed) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubjectToggle = (subject) => {
    const subjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    setFormData({ ...formData, subjects });
    if (errors.subjects) {
      setErrors({ ...errors, subjects: null });
    }
  };

  const handleAddCustomSubject = () => {
    const trimmedSubject = customSubject.trim();
    if (trimmedSubject && !formData.subjects.includes(trimmedSubject)) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, trimmedSubject]
      });
      setCustomSubject('');
      if (errors.subjects) {
        setErrors({ ...errors, subjects: null });
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
      // Optional: Clear resume error if present
      if (errors.resume) {
        setErrors({ ...errors, resume: null });
      }
    }
  };

  // --- Form Validation (Unchanged) ---
  const validateForm = () => {
    const newErrors = {};
    if (formData.subjects.length === 0) newErrors.subjects = 'Please select or add at least one subject';
    if (!formData.bio.trim()) newErrors.bio = 'Please provide a short bio';
    if (!formData.academicYear) newErrors.academicYear = 'Please select your academic year';
    if (!formData.academicStanding.trim()) newErrors.academicStanding = 'Please provide your academic standing';
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Please provide a cover letter';
    // Optional: Add resume validation if needed (e.g., file type, size)
    // if (!formData.resume) newErrors.resume = 'Please upload your resume';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden"> {/* Added shadow-lg */}
      <div className="p-6 sm:p-8"> {/* Increased padding */}
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Tutor Application</h3> {/* Slightly larger heading */}

        {/* Info Box - Slightly adjusted styling */}
        <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-8 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-primary-800">
                Complete this form to apply as a tutor. Share your knowledge and help fellow students while earning. Your application will be reviewed by an administrator before you can start tutoring.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6"> {/* Added space between form sections */}

          {/* Subjects Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBook className="inline mr-2 text-gray-500" />
              Subjects you can teach <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-4"> {/* Increased bottom margin */}
              {subjectOptions.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => handleSubjectToggle(subject)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${formData.subjects.includes(subject)
                    ? 'bg-primary-600 text-white border-primary-700 shadow-sm hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                    }`}
                >
                  {subject} {formData.subjects.includes(subject) && <FiCheck className="inline ml-1 h-4 w-4" />}
                </button>
              ))}
            </div>

            {/* --- Improved Custom Subject Input & Button --- */}
            <div className="flex items-center mt-2 space-x-2"> {/* Use space-x for spacing */}
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaBook className="h-4 w-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Add another subject..."
                  // Use modified base styles
                  className={`${inputWithIconStyles} focus:ring-primary-300`}
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomSubject}
                disabled={!customSubject.trim()}
                // Improved Button Styling
                className="inline-flex items-center px-5 py-3 bg-primary-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-800 focus:outline-none focus:border-primary-900 focus:ring focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150 shadow-sm"
              >
                <FiPlus className="-ml-1 mr-2 h-4 w-4" /> {/* Added Icon */}
                Add
              </button>
            </div>
            {/* --- End Improved Section --- */}

            {errors.subjects && (
              <p className="mt-2 text-sm text-red-600">{errors.subjects}</p>
            )}

            {/* Selected Subjects Display (Slightly improved tags) */}
            {formData.subjects.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Selected:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.subjects.map((subject) => (
                    <span key={subject} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200">
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleSubjectToggle(subject)}
                        className="ml-1.5 flex-shrink-0 text-primary-500 hover:text-primary-700 focus:outline-none focus:text-primary-800"
                        aria-label={`Remove ${subject}`}
                      >
                        <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              <FaUser className="inline mr-2 text-gray-500" />
              Short Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself in a few sentences..."
              className={`${baseInputStyles} resize-none`} // Apply base styles
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
            <p className="mt-1 text-xs text-gray-500">
              A brief introduction visible on your tutor profile.
            </p>
          </div>

          {/* Grid for Academic Year & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Year */}
            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                <FaGraduationCap className="inline mr-2 text-gray-500" />
                Academic Year <span className="text-red-500">*</span>
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
                  className={`${selectStyles} pl-10`} // Use select styles with icon padding
                >
                  <option value="">Select year...</option>
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
              {errors.academicYear && <p className="mt-1 text-sm text-red-600">{errors.academicYear}</p>}
            </div>

            {/* Gender Dropdown */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                {/* Changed Icon */}
                <FaVenusMars className="inline mr-2 text-gray-500" />
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaVenusMars className="h-4 w-4 text-gray-400" />
                </span>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`${selectStyles} pl-10`} // Use select styles with icon padding
                >
                  <option value="">Select gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>
          </div>

          {/* Academic Standing */}
          <div>
            <label htmlFor="academicStanding" className="block text-sm font-medium text-gray-700">
              <FaGraduationCap className="inline mr-2 text-gray-500" />
              Academic Standing <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaGraduationCap className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                id="academicStanding"
                name="academicStanding"
                value={formData.academicStanding}
                onChange={handleChange}
                placeholder="e.g. GPA 3.8/4.0, Dean's List..."
                className={inputWithIconStyles} // Apply base styles + icon padding
              />
            </div>
            {errors.academicStanding && <p className="mt-1 text-sm text-red-600">{errors.academicStanding}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Share achievements like GPA, awards, etc.
            </p>
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
              <FaFileAlt className="inline mr-2 text-gray-500" />
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows="4" // Slightly taller
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Why would you be a great tutor? Describe your teaching style..."
              className={`${baseInputStyles} resize-none`} // Apply base styles
            />
            {errors.coverLetter && <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>}
            <p className="mt-1 text-xs text-gray-500">
              This detailed letter is for administrators only.
            </p>
          </div>

          {/* Resume Upload */}
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
              <FaFileAlt className="inline mr-2 text-gray-500" />
              Upload Resume (Optional)
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.resume ? 'border-red-400' : 'border-gray-300'} border-dashed rounded-md hover:border-primary-400 transition-colors duration-200`}>
              <div className="space-y-1 text-center">
                {/* Changed Icon */}
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx" // Specify accepted formats
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
              </div>
            </div>
            {formData.resume && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                File selected: {formData.resume.name}
              </p>
            )}
            {/* Optional: Add error display for resume */}
            {/* {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>} */}
          </div>

          {/* Submit Button */}
          <div className="pt-4"> {/* Added padding top */}
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
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorApplication;