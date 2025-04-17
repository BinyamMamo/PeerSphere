import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaStar, FaFilter, FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa';

const StudentHome = () => {
  const {
    tutors,
    tutorFilters,
    setTutorFilters,
    getFilteredTutors,
    currentUser,
    toggleFavoriteTutor
  } = useContext(AppContext);

  // Local state for search
  const [searchQuery, setSearchQuery] = useState('');

  // Get all available subjects (for filter dropdown)
  const allSubjects = [...new Set(tutors.flatMap(tutor => tutor.subjects))].sort();

  // Get filtered tutors
  const filteredTutors = getFilteredTutors().filter(tutor => {
    // Apply search filter
    if (searchQuery) {
      const fullName = `${tutor.firstName} ${tutor.lastName}`.toLowerCase();
      const subjects = tutor.subjects.join(' ').toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) ||
        subjects.includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Check if a tutor is a favorite
  const isFavoriteTutor = (tutorId) => {
    return currentUser?.favoriteTutors?.includes(tutorId);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTutorFilters({
      ...tutorFilters,
      [name]: value
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setTutorFilters({
      subject: '',
      gender: '',
      yearOfStudy: '',
      availability: ''
    });
    setSearchQuery('');
  };

  return (
    <div className="h-full">
      {/* <h1 className="text-2xl font-bold mb-6">Find a Tutor</h1> */}

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center mb-4">
          <div className="flex items-center mr-2">
            <FaFilter className="text-primary-600 mr-2" />
            <h2 className="font-medium">Filters</h2>
          </div>

          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search by name or subject"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={tutorFilters.subject}
              onChange={handleFilterChange}
            >
              <option value="">All Subjects</option>
              {allSubjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={tutorFilters.gender}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Year of Study Filter */}
          <div>
            <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
              Year of Study
            </label>
            <select
              id="yearOfStudy"
              name="yearOfStudy"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={tutorFilters.yearOfStudy}
              onChange={handleFilterChange}
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">Graduate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tutors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTutors.length > 0 ? (
          filteredTutors.map(tutor => (
            <div key={tutor.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Tutor Card */}
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
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
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
                  {/* <h4 className="text-xs text-gray-500 uppercase mb-1">Subjects</h4> */}
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

                {/* Price & Book Button */}
                <div className="mt-4 flex justify-between items-center">
                  {/* <div>
                    <span className="font-bold text-lg">{tutor.hourlyRate} AED</span>
                    <span className="text-xs text-gray-500">/hour</span>
                  </div> */}

                  <div className="flex items-center mt-1">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-sm">{tutor.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 ml-1">({tutor.reviews} reviews)</span>
                  </div>
                  <Link
                    to={`/student/book/${tutor.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">No tutors match your filters. Try adjusting your search criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-primary-600 hover:text-primary-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
