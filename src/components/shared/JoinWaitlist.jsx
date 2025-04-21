import React, { useState, useEffect, useContext } from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const JoinWaitlist = ({ onClose }) => {
  const { currentUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    university: '',
    isDubaiUni: false,
    feedbackTypes: [],
    rating: 0,
    comment: '',
    isAnonymous: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Feedback options
  const feedbackOptions = [
    { id: 'peer-learning', label: 'Peer-to-peer learning model' },
    { id: 'flexibility', label: 'Flexible scheduling' },
    { id: 'affordability', label: 'Affordable tutoring' },
    { id: 'subject-variety', label: 'Variety of subjects' },
    { id: 'interface', label: 'User-friendly interface' }
  ];

  // Pre-fill form with user data
  useEffect(() => {
    if (currentUser && !formData.isAnonymous) {
      setFormData(prev => ({
        ...prev,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email || ''
      }));
    }
  }, [currentUser, formData.isAnonymous]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle anonymous toggle
  const handleAnonymousToggle = () => {
    setFormData(prev => ({
      ...prev,
      isAnonymous: !prev.isAnonymous,
      name: !prev.isAnonymous ? '' : prev.name,
      email: !prev.isAnonymous ? '' : prev.email
    }));
  };

  // Handle multiple feedback selection
  const toggleFeedback = (id) => {
    setFormData(prev => {
      const newFeedback = prev.feedbackTypes.includes(id)
        ? prev.feedbackTypes.filter(f => f !== id)
        : [...prev.feedbackTypes, id];
      return { ...prev, feedbackTypes: newFeedback };
    });
  };

  // Handle rating
  const handleRating = (value) => {
    setFormData(prev => ({ ...prev, rating: value }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for non-anonymous submissions
    if (!formData.isAnonymous) {
      if (!formData.email.trim()) {
        setError('Email is required for waitlist registration');
        return;
      }
      if (!formData.isDubaiUni && !formData.university.trim()) {
        setError('Please specify your university or confirm if you are from University of Dubai');
        return;
      }
    }

    // Require at least some feedback for anonymous submissions
    if (formData.isAnonymous && !formData.feedbackTypes.length && !formData.rating && !formData.comment.trim()) {
      setError('Please provide at least one piece of feedback');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (db) {
        await addDoc(collection(db, formData.isAnonymous ? "feedback" : "waitlist"), {
          ...formData,
          role: currentUser?.role || 'unknown',
          timestamp: serverTimestamp()
        });
      } else {
        throw new Error('Firebase not initialized');
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting:", error);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {formData.isAnonymous ? 'Share Your Feedback' : 'Join PeerSphere Waitlist'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              {formData.isAnonymous ? 'Thank You for Your Feedback!' : 'Welcome to the Waitlist!'}
            </h3>
            <p className="text-gray-600 mb-6 text-lg text-center">
              {formData.isAnonymous
                ? 'We appreciate your input about PeerSphere. Your feedback helps us improve!'
                : "We're thrilled about your interest in PeerSphere. You'll hear from us soon!"}
            </p>
            <button
              onClick={onClose}
              className="inline-flex justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              <p className="mb-6 text-gray-600 text-center">
                {formData.isAnonymous
                  ? 'Tell us what you think about PeerSphere!'
                  : 'Get early access to our revolutionary tutoring platform!'}
              </p>

              {/* Anonymous toggle */}
              <div className="mb-5">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={handleAnonymousToggle}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Submit anonymously (just share feedback without joining waitlist)
                  </span>
                </label>
              </div>

              {!formData.isAnonymous && (
                <>
                  {/* Name field */}
                  <div className="mb-5">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Email field */}
                  <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="your.email@university.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* University selection */}
                  <div className="mb-5">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="isDubaiUni"
                        name="isDubaiUni"
                        checked={formData.isDubaiUni}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isDubaiUni" className="ml-2 text-sm font-medium text-gray-700">
                        I am from University of Dubai
                      </label>
                    </div>
                    {!formData.isDubaiUni && (
                      <input
                        type="text"
                        name="university"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your university name"
                        value={formData.university}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                </>
              )}

              {/* Feedback options */}
              <div className="mb-5">
                <p className="block text-sm font-medium text-gray-700 mb-3">
                  What excites you about PeerSphere? (Select all that apply)
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {feedbackOptions.map(option => (
                    <label key={option.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.feedbackTypes.includes(option.id)}
                        onChange={() => toggleFeedback(option.id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-5">
                <p className="block text-sm font-medium text-gray-700 mb-3">
                  How excited are you about PeerSphere?
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(star)}
                      className="text-3xl transition-colors focus:outline-none"
                    >
                      <span className={formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm text-gray-500">
                  {formData.rating > 0 && (
                    formData.rating <= 2 ? 'Not very excited' :
                      formData.rating === 3 ? 'Somewhat excited' :
                        'Very excited!'
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Any thoughts or suggestions?
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Share your thoughts about PeerSphere..."
                  value={formData.comment}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              {error && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : formData.isAnonymous ? 'Submit Feedback' : 'Join Waitlist'}
              </button>
              <p className="mt-3 text-center text-sm text-gray-500">
                {formData.isAnonymous
                  ? 'Your anonymous feedback will help us improve PeerSphere.'
                  : "We'll only contact you with PeerSphere updates and launch information."}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JoinWaitlist;