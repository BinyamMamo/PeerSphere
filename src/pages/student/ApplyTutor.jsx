import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  FaGraduationCap,
  FaBook,
  FaMoneyBillWave,
  FaFileAlt,
  FaArrowLeft
} from 'react-icons/fa';

const ApplyTutor = () => {
  const navigate = useNavigate();
  const { currentUser, applyForTutor } = useContext(AppContext);

  // Form state
  const [formData, setFormData] = useState({
    subjects: [],
    newSubject: '',
    proposedRate: '',
    academicStanding: '',
    coverLetter: '',
    resume: null
  });

  // State for tracking form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding a new subject
  const handleAddSubject = () => {
    if (formData.newSubject && !formData.subjects.includes(formData.newSubject)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, prev.newSubject],
        newSubject: ''
      }));
    }
  };

  // Handle removing a subject
  const handleRemoveSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validation
    if (formData.subjects.length === 0) {
      setError('Please add at least one subject');
      setSubmitting(false);
      return;
    }

    if (!formData.proposedRate) {
      setError('Please enter your proposed hourly rate');
      setSubmitting(false);
      return;
    }

    if (!formData.academicStanding) {
      setError('Please enter your academic standing');
      setSubmitting(false);
      return;
    }

    if (!formData.coverLetter) {
      setError('Please provide a brief cover letter');
      setSubmitting(false);
      return;
    }

    try {
      // Submit application
      applyForTutor({
        subjects: formData.subjects,
        proposedRate: parseInt(formData.proposedRate),
        academicStanding: formData.academicStanding,
        coverLetter: formData.coverLetter,
        resume: 'resume_file.pdf' // Mock file name for the MVP
      });

      // Show success message and redirect after delay
      setSuccess(true);
      setTimeout(() => {
        navigate('/student');
      }, 3000);
    } catch (error) {
      setError('There was an error submitting your application. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with back button */}
      <div className="mb-6">
        {/* <button
          onClick={() => navigate('/student')}
          className="inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <FaArrowLeft className="mr-2" /> Back to home
        </button> */}
        <h1 className="text-2xl font-bold mt-2">Apply to Become a Tutor</h1>
        <p className="text-gray-600">Share your knowledge and help fellow students while earning.</p>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Application Submitted Successfully!</p>
          <p>Your application is now under review. We'll notify you once it's approved. Redirecting...</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Application Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Subjects Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBook className="inline mr-2" />
                Subjects You Want to Teach*
              </label>

              <div className="flex mb-2">
                <input
                  type="text"
                  name="newSubject"
                  placeholder="Enter a subject"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.newSubject}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
                >
                  Add
                </button>
              </div>

              {/* Selected subjects */}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full flex items-center"
                  >
                    <span>{subject}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(subject)}
                      className="ml-2 text-primary-800 hover:text-primary-900"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {formData.subjects.length === 0 && (
                  <p className="text-sm text-gray-500">No subjects added yet</p>
                )}
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="mb-6">
              <label htmlFor="proposedRate" className="block text-sm font-medium text-gray-700 mb-2">
                <FaMoneyBillWave className="inline mr-2" />
                Proposed Hourly Rate (AED)*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">AED</span>
                </div>
                <input
                  type="number"
                  name="proposedRate"
                  id="proposedRate"
                  min={80}
                  max={250}
                  className="pl-12 px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                  value={formData.proposedRate}
                  onChange={handleInputChange}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Suggested range: 80-250 AED/hour based on subject and experience
              </p>
            </div>

            {/* Academic Standing */}
            <div className="mb-6">
              <label htmlFor="academicStanding" className="block text-sm font-medium text-gray-700 mb-2">
                <FaGraduationCap className="inline mr-2" />
                Academic Standing*
              </label>
              <input
                type="text"
                name="academicStanding"
                id="academicStanding"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. GPA 3.8/4.0, Dean's List, etc."
                value={formData.academicStanding}
                onChange={handleInputChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Share your academic achievements to strengthen your application
              </p>
            </div>

            {/* Cover Letter */}
            <div className="mb-6">
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                <FaFileAlt className="inline mr-2" />
                Cover Letter*
              </label>
              <textarea
                name="coverLetter"
                id="coverLetter"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell us why you would make a great tutor..."
                value={formData.coverLetter}
                onChange={handleInputChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Briefly describe your teaching experience, approach, and why you want to be a tutor.
              </p>
            </div>

            {/* Resume Upload */}
            <div className="mb-6">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                <FaFileAlt className="inline mr-2" />
                Upload Resume (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC or DOCX up to 5MB</p>
                </div>
              </div>
              {formData.resume && (
                <p className="mt-2 text-sm text-green-600">
                  File selected: {formData.resume.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
                disabled={submitting || success}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyTutor;
