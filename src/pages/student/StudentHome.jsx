import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaStar, FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa';
import FilterTag from '../../components/shared/FilterTag';

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
  const handleFilterChange = (filterType, value) => {
    setTutorFilters({
      ...tutorFilters,
      [filterType]: value
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

  // Determine if any filters are active
  const hasActiveFilters =
    tutorFilters.subject ||
    tutorFilters.gender ||
    tutorFilters.yearOfStudy ||
    tutorFilters.availability ||
    searchQuery;

  return (
    <div className="h-full">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Search by tutor name or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-lg shadow mb-6 space-y-4">
        {/* Subject Filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Subject</h3>
            {tutorFilters.subject && (
              <button
                className="text-xs text-primary-600 hover:text-primary-800"
                onClick={() => handleFilterChange('subject', '')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterTag
              isActive={!tutorFilters.subject}
              onClick={() => handleFilterChange('subject', '')}
            >
              All Subjects
            </FilterTag>

            {allSubjects.map((subject, index) => (
              <FilterTag
                key={index}
                isActive={tutorFilters.subject === subject}
                onClick={() => handleFilterChange('subject', subject)}
              >
                {subject}
              </FilterTag>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Gender</h3>
            {tutorFilters.gender && (
              <button
                className="text-xs text-primary-600 hover:text-primary-800"
                onClick={() => handleFilterChange('gender', '')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <FilterTag
              isActive={!tutorFilters.gender}
              onClick={() => handleFilterChange('gender', '')}
            >
              All
            </FilterTag>
            <FilterTag
              isActive={tutorFilters.gender === 'Male'}
              onClick={() => handleFilterChange('gender', 'Male')}
            >
              Male
            </FilterTag>
            <FilterTag
              isActive={tutorFilters.gender === 'Female'}
              onClick={() => handleFilterChange('gender', 'Female')}
            >
              Female
            </FilterTag>
          </div>
        </div>

        {/* Year of Study Filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Year of Study</h3>
            {tutorFilters.yearOfStudy && (
              <button
                className="text-xs text-primary-600 hover:text-primary-800"
                onClick={() => handleFilterChange('yearOfStudy', '')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterTag
              isActive={!tutorFilters.yearOfStudy}
              onClick={() => handleFilterChange('yearOfStudy', '')}
            >
              All Years
            </FilterTag>
            <FilterTag
              isActive={tutorFilters.yearOfStudy === '1'}
              onClick={() => handleFilterChange('yearOfStudy', '1')}
            >
              1st Year
            </FilterTag>
            <FilterTag
              isActive={tutorFilters.yearOfStudy === '2'}
              onClick={() => handleFilterChange('yearOfStudy', '2')}
            >
              2nd Year
            </FilterTag>
            <FilterTag
              isActive={tutorFilters.yearOfStudy === '3'}
              onClick={() => handleFilterChange('yearOfStudy', '3')}
            >
              3rd Year
            </FilterTag>
            <FilterTag
              isActive={tutorFilters.yearOfStudy === '4'}
              onClick={() => handleFilterChange('yearOfStudy', '4')}
            >
              4th Year
            </FilterTag>
            <FilterTag
              isActive={tutorFilters.yearOfStudy === '5'}
              onClick={() => handleFilterChange('yearOfStudy', '5')}
            >
              Graduate
            </FilterTag>
          </div>
        </div>

        {/* Clear All Filters Button - Only show when at least one filter is active */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
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

                {/* Ratings & Book Button */}
                <div className="mt-4 flex justify-between items-center">
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