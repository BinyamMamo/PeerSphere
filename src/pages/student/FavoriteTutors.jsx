import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaStar, FaHeart, FaCalendarAlt } from 'react-icons/fa';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import { MdOutlineBookmarkRemove } from 'react-icons/md';

const FavoriteTutors = () => {
  const { currentUser, tutors, toggleFavoriteTutor } = useContext(AppContext);

  // Get favorite tutors
  const favoriteTutorIds = currentUser?.favoriteTutors || [];
  const favoriteTutors = tutors.filter(tutor => favoriteTutorIds.includes(tutor.id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Favorite Tutors</h1>

      {favoriteTutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteTutors.map(tutor => (
            <div key={tutor.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                {/* Tutor Header */}
                <div className="flex items-start">
                  <img
                    src={tutor.avatar}
                    alt={`${tutor.firstName} ${tutor.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{tutor.firstName} {tutor.lastName}</h3>
                      <button
                        onClick={() => toggleFavoriteTutor(tutor.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <MdOutlineBookmarkRemove />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      Year {tutor.yearOfStudy}{tutor.yearOfStudy === 5 ? ' Graduate' : ''}
                    </p>
                  </div>
                </div>

                {/* Tutor Subjects */}
                <div className="mt-3">
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

                {/* Tutor Availability */}
                <div className="mt-3">
                  <h4 className="text-xs text-gray-500 uppercase mb-1">Next Available</h4>
                  {tutor.availability && tutor.availability.length > 0 ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {tutor.availability[0].date}, {tutor.availability[0].startTime}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No availability set</p>
                  )}
                </div>

                {/* Actions */}
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
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't added any tutors to your favorites yet.</p>
          <Link
            to="/student"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Browse Tutors
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoriteTutors;
