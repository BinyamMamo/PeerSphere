import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaStar, FaSearch, FaHeart, FaRegHeart, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FilterTag from '../../components/shared/FilterTag';
import CollapsibleFilterTags from '../../components/shared/CollapsibleFilterTags';
import { MdOutlineBookmark, MdOutlineBookmarkAdd, MdOutlineBookmarkAdded, MdOutlineBookmarkBorder } from 'react-icons/md';

const StudentHome = () => {
  const {
    tutors,
    tutorFilters,
    setTutorFilters,
    getFilteredTutors,
    currentUser,
    toggleFavoriteTutor
  } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 9;

  // Get all available subjects (for filter dropdown)
  const allSubjects = [...new Set(tutors.flatMap(tutor => tutor.subjects))].sort();

  // Get filtered tutors
  const filteredTutors = getFilteredTutors().filter(tutor => {
    if (searchQuery) {
      const fullName = `${tutor.firstName} ${tutor.lastName}`.toLowerCase();
      const subjects = tutor.subjects.join(' ').toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) ||
        subjects.includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);
  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = filteredTutors.slice(indexOfFirstTutor, indexOfLastTutor);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    setCurrentPage(1); // Reset to first page when filters change
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
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Determine if any filters are active
  const hasActiveFilters =
    tutorFilters.subject ||
    tutorFilters.gender ||
    tutorFilters.yearOfStudy ||
    tutorFilters.availability ||
    searchQuery;

  // Get year label for display
  const getYearLabel = (yearValue) => {
    if (!yearValue) return '';
    if (yearValue === '5') return 'Graduate';

    const suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
    const suffix = suffixes[parseInt(yearValue) % 10];
    return `${yearValue}${suffix} Year`;
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="h-full">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-100 border focus:outline-none placeholder:text-neutral-500 placeholder:scale-90 placeholder:origin-left focus:placeholder:scale-100 placeholder:transition ease-in-out focus:ring-1 focus:ring-primary-500"
            placeholder="Search by name or subject..."
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
              <FaTimes size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 border rounded-lg ${showFilters ? 'text-primary-700/75 ring-1 bg-neutral-100' : 'bg-neutral-100 text-neutral-600'}`}
        >
          <FaFilter />
        </button>
        {(tutorFilters.subject || tutorFilters.gender || tutorFilters.yearOfStudy) && (
          <div className="flex">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
            >
              <span>Clear</span>
              <FaTimes size={10} />
            </button>
          </div>
        )}
      </div>

      {(tutorFilters.subject || tutorFilters.gender || tutorFilters.yearOfStudy) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tutorFilters.subject && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
              <span>Subject: {tutorFilters.subject}</span>
              <button onClick={() => handleFilterChange('subject', '')}>
                <FaTimes size={10} />
              </button>
            </div>
          )}
          {tutorFilters.gender && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
              <span>Gender: {tutorFilters.gender}</span>
              <button onClick={() => handleFilterChange('gender', '')}>
                <FaTimes size={10} />
              </button>
            </div>
          )}
          {tutorFilters.yearOfStudy && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
              <span>Year: {getYearLabel(tutorFilters.yearOfStudy)}</span>
              <button onClick={() => handleFilterChange('yearOfStudy', '')}>
                <FaTimes size={10} />
              </button>
            </div>
          )}
        </div>
      )}

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
          <CollapsibleFilterTags
            title="Subject"
            options={allSubjects}
            selectedValue={tutorFilters.subject}
            onSelect={(value) => handleFilterChange('subject', value)}
            allLabel="All Subjects"
          />
          <CollapsibleFilterTags
            title="Gender"
            options={['Male', 'Female']}
            selectedValue={tutorFilters.gender}
            onSelect={(value) => handleFilterChange('gender', value)}
            allLabel="All Genders"
          />
          <CollapsibleFilterTags
            title="Year of Study"
            options={['1', '2', '3', '4', '5']}
            selectedValue={tutorFilters.yearOfStudy}
            onSelect={(value) => handleFilterChange('yearOfStudy', value)}
            allLabel="All Years"
          />
        </div>
      )}

      {/* Tutors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTutors.length > 0 ? (
          currentTutors.map(tutor => (
            <div key={tutor.id} className="bg-white/85 rounded-lg shadow overflow-hidden">
              <div className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-start">
                  <img
                    src={tutor.avatar}
                    alt={`${tutor.firstName} ${tutor.lastName}`}
                    className="w-12 h-12 rounded-full object-cover ring-1 p-[1px] ring-neutral-700/25"
                  />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-6 text-xs">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`text-gray-600 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary-600'}`}
          >
            <FaChevronLeft />
          </button>

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-2 py-1 ${currentPage === number ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`text-gray-600 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary-600'}`}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentHome;