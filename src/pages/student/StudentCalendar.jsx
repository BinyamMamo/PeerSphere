import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaMapMarkerAlt,
  FaUser
} from 'react-icons/fa';

const StudentCalendar = () => {
  const { getUserSessions, tutors } = useContext(AppContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get user sessions
  const userSessions = getUserSessions();

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week (0-6, where 0 is Sunday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Get month and year strings
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  const monthString = monthNames[month];

  // Get days array for current month
  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    // Array to hold all days including empty cells for padding
    const daysArray = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Get sessions for a specific day
  const getSessionsForDay = (day) => {
    if (!day) return [];

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return userSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return (
        sessionDate.getFullYear() === year &&
        sessionDate.getMonth() === month &&
        sessionDate.getDate() === day &&
        session.status === 'Upcoming'
      );
    });
  };

  // Get tutor info by ID
  const getTutorInfo = (tutorId) => {
    return tutors.find(tutor => tutor.id === tutorId) || {};
  };

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Days of the week headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <button
            onClick={previousMonth}
            className="text-gray-600 hover:text-primary-600"
          >
            <FaChevronLeft />
          </button>

          <h2 className="text-lg font-medium">
            {monthString} {year}
          </h2>

          <button
            onClick={nextMonth}
            className="text-gray-600 hover:text-primary-600"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekdays.map(day => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysArray().map((day, index) => (
              <div
                key={index}
                className={`min-h-24 p-2 border rounded-lg ${!day
                    ? 'bg-gray-50'
                    : isToday(day)
                      ? 'bg-primary-50 border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
              >
                {day && (
                  <>
                    <div className="text-right">
                      <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 ${isToday(day)
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700'
                        }`}>
                        {day}
                      </span>
                    </div>

                    {/* Sessions for this day */}
                    <div className="mt-1">
                      {getSessionsForDay(day).map(session => {
                        const tutor = getTutorInfo(session.tutorId);

                        return (
                          <Link
                            key={session.id}
                            to={`/student/sessions`}
                            className="block text-xs p-1 mt-1 rounded bg-primary-100 text-primary-800 hover:bg-primary-200"
                          >
                            <div className="font-medium truncate">{session.subject}</div>
                            <div className="flex items-center">
                              <FaClock className="mr-1" size={10} />
                              {session.startTime}
                            </div>
                            <div className="flex items-center">
                              <FaUser className="mr-1" size={10} />
                              {tutor.firstName} {tutor.lastName}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;
