import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaSearch,
  FaFilter,
  FaTimes,
  FaBookmark,
  FaLocationArrow,
  FaCheck,
  FaUniversity
} from 'react-icons/fa';

const StudentCalendar = () => {
  const { getUserSessions, tutors } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', 'day'
  const [filterSubject, setFilterSubject] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    subjects: [],
    tutors: [],
    status: 'upcoming' // 'all', 'upcoming', 'past', 'canceled'
  });
  const [sessionDetails, setSessionDetails] = useState(null);
  const [allSubjects, setAllSubjects] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Get user sessions
  const userSessions = getUserSessions();

  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract all unique subjects for filter
  useEffect(() => {
    const subjects = [...new Set(userSessions.map(session => session.subject))];
    setAllSubjects(subjects);
  }, [userSessions]);

  // Apply filters to sessions
  const getFilteredSessions = () => {
    let result = [...userSessions];

    // Text search filter
    if (filterSubject) {
      result = result.filter(session =>
        session.subject.toLowerCase().includes(filterSubject.toLowerCase())
      );
    }

    // Subject filter
    if (filters.subjects.length > 0) {
      result = result.filter(session =>
        filters.subjects.includes(session.subject)
      );
    }

    // Tutor filter
    if (filters.tutors.length > 0) {
      result = result.filter(session =>
        filters.tutors.includes(session.tutorId)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      const now = new Date();

      if (filters.status === 'upcoming') {
        result = result.filter(session => {
          const sessionDate = new Date(session.date + 'T' + session.startTime);
          return sessionDate > now && session.status !== 'Canceled';
        });
      } else if (filters.status === 'past') {
        result = result.filter(session => {
          const sessionDate = new Date(session.date + 'T' + session.startTime);
          return sessionDate < now && session.status !== 'Canceled';
        });
      } else if (filters.status === 'canceled') {
        result = result.filter(session => session.status === 'Canceled');
      }
    }

    return result;
  };

  const filteredSessions = getFilteredSessions();

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

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const date = currentDate.getDate();
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

  // Get week based on current date
  const getWeekDays = () => {
    const weekDays = [];
    const currentDay = currentDate.getDay(); // 0-6
    const currentDateNum = currentDate.getDate();

    // Find the first day of the week (Sunday)
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDateNum - currentDay);

    // Generate array of the 7 days in the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      weekDays.push({
        date: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
        fullDate: day
      });
    }

    return weekDays;
  };

  // Get hours for day view
  const getDayHours = () => {
    const hours = [];
    for (let i = 9; i <= 20; i++) { // 9 AM to 8 PM
      hours.push({
        hour: i,
        label: i > 12 ? `${i - 12} PM` : i === 12 ? '12 PM' : `${i} AM`
      });
    }
    return hours;
  };

  // Navigate to previous month/week/day
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next month/week/day
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get sessions for a specific day
  const getSessionsForDay = (day, checkMonth = month, checkYear = year) => {
    if (!day) return [];

    const dateStr = `${checkYear}-${String(checkMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return filteredSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return (
        sessionDate.getFullYear() === checkYear &&
        sessionDate.getMonth() === checkMonth &&
        sessionDate.getDate() === day
      );
    });
  };

  // Get tutor info by ID
  const getTutorInfo = (tutorId) => {
    return tutors.find(tutor => tutor.id === tutorId) || {};
  };

  // Check if a day is today
  const isToday = (day, checkMonth = month, checkYear = year) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      checkMonth === today.getMonth() &&
      checkYear === today.getFullYear()
    );
  };

  // Check if a day has sessions
  const hasSessionsOnDay = (day, checkMonth = month, checkYear = year) => {
    return getSessionsForDay(day, checkMonth, checkYear).length > 0;
  };

  // Format time for display (12-hour format)
  const formatTime = (timeString) => {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${meridiem}`;
  };

  // Calculate session end time
  const getEndTime = (startTime, duration = 60) => {
    if (!startTime) return '';

    const [hours, minutes] = startTime.split(':').map(part => parseInt(part, 10));

    let endHour = hours;
    let endMinute = minutes + duration;

    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }

    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  // Toggle subject in filter
  const toggleSubjectFilter = (subject) => {
    setFilters(prev => {
      if (prev.subjects.includes(subject)) {
        return {
          ...prev,
          subjects: prev.subjects.filter(s => s !== subject)
        };
      } else {
        return {
          ...prev,
          subjects: [...prev.subjects, subject]
        };
      }
    });
  };

  // Toggle tutor in filter
  const toggleTutorFilter = (tutorId) => {
    setFilters(prev => {
      if (prev.tutors.includes(tutorId)) {
        return {
          ...prev,
          tutors: prev.tutors.filter(t => t !== tutorId)
        };
      } else {
        return {
          ...prev,
          tutors: [...prev.tutors, tutorId]
        };
      }
    });
  };

  // Set status filter
  const setStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      subjects: [],
      tutors: [],
      status: 'upcoming'
    });
    setFilterSubject('');
  };

  // Show session details
  const showSessionDetail = (session) => {
    setSessionDetails(session);
  };

  // Close session details
  const closeSessionDetails = () => {
    setSessionDetails(null);
  };

  // Get header text based on current view
  const getHeaderText = () => {
    if (calendarView === 'month') {
      return `${monthString} ${year}`;
    } else if (calendarView === 'week') {
      const weekDays = getWeekDays();
      const firstDay = weekDays[0];
      const lastDay = weekDays[6];

      // If the week spans two months
      if (firstDay.month !== lastDay.month) {
        return `${monthNames[firstDay.month]} ${firstDay.date} - ${monthNames[lastDay.month]} ${lastDay.date}, ${lastDay.year}`;
      }

      return `${monthNames[firstDay.month]} ${firstDay.date} - ${lastDay.date}, ${firstDay.year}`;
    } else {
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${weekdays[currentDate.getDay()]}, ${monthString} ${date}, ${year}`;
    }
  };

  // Get session status classes
  const getSessionStatusClasses = (session) => {
    // Define base classes
    let baseClasses = "block p-1 text-xs rounded hover:opacity-90";

    // Check if session is in the past
    const sessionDate = new Date(session.date + 'T' + session.startTime);
    const now = new Date();
    const isPast = sessionDate < now;

    // Add status-specific classes
    if (session.status === 'Canceled') {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (isPast) {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    } else {
      return `${baseClasses} bg-primary-100 text-primary-800 hover:bg-primary-200`;
    }
  };

  // Render month view
  const renderMonthView = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <>
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
                  : hasSessionsOnDay(day)
                    ? 'bg-blue-50 hover:bg-blue-100'
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
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                    {getSessionsForDay(day).map(session => {
                      const tutor = getTutorInfo(session.tutorId);

                      return (
                        <div
                          key={session.id}
                          className={getSessionStatusClasses(session)}
                          onClick={() => showSessionDetail(session)}
                        >
                          <div className="font-medium truncate">{session.subject}</div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" size={10} />
                            {formatTime(session.startTime)}
                          </div>
                          <div className="flex items-center">
                            <FaUser className="mr-1" size={10} />
                            {tutor.firstName} {tutor.lastName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hours = getDayHours();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="w-20"></div> {/* Empty corner cell */}
            {weekDays.map((day, index) => {
              const isTodayFlag = isToday(day.date, day.month, day.year);

              return (
                <div
                  key={index}
                  className={`text-center ${isTodayFlag
                    ? 'bg-primary-50 border-b-2 border-primary-500'
                    : ''
                    }`}
                >
                  <div className="text-sm font-medium">{weekdays[index]}</div>
                  <div className={`text-lg font-semibold ${isTodayFlag ? 'text-primary-600' : ''}`}>
                    {day.date}
                  </div>
                  <div className="text-xs text-gray-500">
                    {monthNames[day.month].slice(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slots grid */}
          <div className="border-t border-l border-gray-200">
            {hours.map((hour, hourIndex) => (
              <div key={hourIndex} className="grid grid-cols-8 gap-0">
                {/* Hour label */}
                <div className="w-20 px-2 py-3 border-b border-r border-gray-200 text-xs font-medium text-gray-500">
                  {hour.label}
                </div>

                {/* Days */}
                {weekDays.map((day, dayIndex) => {
                  const dateStr = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
                  const timeStr = `${hour.hour.toString().padStart(2, '0')}:00`;

                  const sessions = filteredSessions.filter(
                    session => session.date === dateStr && session.startTime === timeStr
                  );

                  return (
                    <div
                      key={dayIndex}
                      className={`p-1 h-16 border-b border-r border-gray-200 ${sessions.length > 0 ? 'bg-blue-50' : ''
                        }`}
                    >
                      {sessions.map((session, idx) => {
                        const tutor = getTutorInfo(session.tutorId);

                        return (
                          <div
                            key={idx}
                            className={getSessionStatusClasses(session)}
                            onClick={() => showSessionDetail(session)}
                          >
                            <div className="font-medium truncate">{session.subject}</div>
                            <div className="text-xs truncate">{tutor.firstName} {tutor.lastName}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const hours = getDayHours();
    const daySessions = getSessionsForDay(date);

    return (
      <div className="border-t border-l border-gray-200">
        {hours.map((hour, hourIndex) => {
          const timeStr = `${hour.hour.toString().padStart(2, '0')}:00`;
          const timeStr30 = `${hour.hour.toString().padStart(2, '0')}:30`;

          const session1 = daySessions.find(session => session.startTime === timeStr);
          const session2 = daySessions.find(session => session.startTime === timeStr30);

          return (
            <div key={hourIndex} className="grid grid-cols-1 divide-y divide-gray-100">
              {/* First half hour */}
              <div className="flex py-3 border-b border-r border-gray-200">
                <div className="w-20 px-2 text-xs font-medium text-gray-500">
                  {hour.label}
                </div>
                <div className="flex-grow p-1 ml-2">
                  {session1 && (
                    <div
                      className={`${getSessionStatusClasses(session1)} text-sm p-2`}
                      onClick={() => showSessionDetail(session1)}
                    >
                      <div className="font-medium">{session1.subject}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center">
                          <FaUser className="mr-1" size={12} />
                          <span className="text-xs">{getTutorInfo(session1.tutorId).firstName} {getTutorInfo(session1.tutorId).lastName}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" size={12} />
                          <span className="text-xs">{formatTime(session1.startTime)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Second half hour */}
              <div className="flex py-3 border-b border-r border-gray-200">
                <div className="w-20 px-2 text-xs font-medium text-gray-500">
                  {hour.hour}:30
                </div>
                <div className="flex-grow p-1 ml-2">
                  {session2 && (
                    <div
                      className={`${getSessionStatusClasses(session2)} text-sm p-2`}
                      onClick={() => showSessionDetail(session2)}
                    >
                      <div className="font-medium">{session2.subject}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center">
                          <FaUser className="mr-1" size={12} />
                          <span className="text-xs">{getTutorInfo(session2.tutorId).firstName} {getTutorInfo(session2.tutorId).lastName}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" size={12} />
                          <span className="text-xs">{formatTime(session2.startTime)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render filter panel
  const renderFilterPanel = () => {
    // Extract unique subjects and tutors for filters
    const uniqueTutors = [...new Set(userSessions.map(session => session.tutorId))];

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700">Filter Sessions</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Clear all
          </button>
        </div>

        {/* Status filter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Status</h4>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              className={`px-3 py-1 text-xs rounded-full ${filters.status === 'all'
                ? 'bg-primary-100 text-primary-800 border border-primary-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              onClick={() => setStatusFilter('all')}
            >
              All Sessions
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${filters.status === 'upcoming'
                ? 'bg-primary-100 text-primary-800 border border-primary-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              onClick={() => setStatusFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${filters.status === 'past'
                ? 'bg-primary-100 text-primary-800 border border-primary-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              onClick={() => setStatusFilter('past')}
            >
              Past
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${filters.status === 'canceled'
                ? 'bg-primary-100 text-primary-800 border border-primary-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              onClick={() => setStatusFilter('canceled')}
            >
              Canceled
            </button>
          </div>
        </div>

        {/* Subject filter */}
        {allSubjects.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Subjects</h4>
            <div className="flex flex-wrap gap-2">
              {allSubjects.map((subject, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 text-xs rounded-full ${filters.subjects.includes(subject)
                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  onClick={() => toggleSubjectFilter(subject)}
                >
                  {subject}
                  {filters.subjects.includes(subject) && <FaCheck className="inline ml-1" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tutor filter */}
        {uniqueTutors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Tutors</h4>
            <div className="flex flex-wrap gap-2">
              {uniqueTutors.map((tutorId, index) => {
                const tutor = getTutorInfo(tutorId);
                return (
                  <button
                    key={index}
                    className={`px-3 py-1 text-xs rounded-full ${filters.tutors.includes(tutorId)
                      ? 'bg-primary-100 text-primary-800 border border-primary-300'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    onClick={() => toggleTutorFilter(tutorId)}
                  >
                    {tutor.firstName} {tutor.lastName}
                    {filters.tutors.includes(tutorId) && <FaCheck className="inline ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render session details modal
  const renderSessionDetailsModal = () => {
    if (!sessionDetails) return null;

    const tutor = getTutorInfo(sessionDetails.tutorId);
    const endTime = getEndTime(sessionDetails.startTime, sessionDetails.duration || 60);
    const sessionDate = new Date(sessionDetails.date);
    const formattedDate = sessionDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Check if session is in the past
    const now = new Date();
    const isPast = new Date(sessionDetails.date + 'T' + sessionDetails.startTime) < now;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Session Details</h2>
            <button
              onClick={closeSessionDetails}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-4">
            {/* Session status */}
            <div className="mb-4">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${sessionDetails.status === 'Canceled'
                ? 'bg-red-100 text-red-800'
                : isPast
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-green-100 text-green-800'
                }`}>
                {sessionDetails.status === 'Canceled'
                  ? 'Canceled'
                  : isPast
                    ? 'Completed'
                    : 'Upcoming'}
              </span>
            </div>

            {/* Session subject */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{sessionDetails.subject}</h3>

            {/* Date and time */}
            <div className="flex items-start mb-4">
              <FaClock className="text-primary-600 mt-1 mr-3" />
              <div>
                <p className="text-gray-700">{formattedDate}</p>
                <p className="text-gray-700">{formatTime(sessionDetails.startTime)} - {formatTime(endTime)}</p>
                <p className="text-sm text-gray-500">{sessionDetails.duration || 60} minutes</p>
              </div>
            </div>

            {/* Tutor info */}
            <div className="flex items-start mb-4">
              <FaUser className="text-primary-600 mt-1 mr-3" />
              <div>
                <p className="text-gray-700 font-medium">{tutor.firstName} {tutor.lastName}</p>
                <p className="text-sm text-gray-500">{tutor.subject || 'Tutor'}</p>
                {tutor.rating && (
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3 h-3 ${i < tutor.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-gray-500">{tutor.rating}.0</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start mb-4">
              <FaMapMarkerAlt className="text-primary-600 mt-1 mr-3" />
              <div>
                <p className="text-gray-700">{sessionDetails.location || 'Online'}</p>
                {sessionDetails.location === 'Online' && (
                  <p className="text-sm text-primary-600 mt-1">
                    <a href={sessionDetails.meetingLink || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Join Meeting <FaLocationArrow className="ml-1" size={12} />
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Session notes if available */}
            {sessionDetails.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{sessionDetails.notes}</p>
              </div>
            )}

            {/* Action buttons based on session status */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Link
                to={`/student/sessions/${sessionDetails.id}`}
                className="px-4 py-2 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700"
              >
                View Details
              </Link>

              {!isPast && sessionDetails.status !== 'Canceled' && (
                <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50">
                  Cancel Session
                </button>
              )}

              {isPast && sessionDetails.status !== 'Canceled' && !sessionDetails.reviewed && (
                <button className="px-4 py-2 border border-primary-500 text-primary-600 rounded-md hover:bg-primary-50">
                  Leave Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">My Calendar</h1>

        <div className="flex items-center mt-3 sm:mt-0">
          <div className="relative mr-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filter by subject..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 rounded-md ${showFilters || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'upcoming')
              ? 'bg-primary-100 text-primary-800 border border-primary-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <FaFilter className="mr-1" />
            <span className={isMobileView ? 'hidden' : ''}>Filters</span>
            {(Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'upcoming')) && (
              <span className="ml-1 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {filters.subjects.length + filters.tutors.length + (filters.status !== 'upcoming' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && renderFilterPanel()}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border-b">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={navigatePrevious}
              className="text-gray-600 hover:text-primary-600 mr-4"
            >
              <FaChevronLeft />
            </button>

            <h2 className="text-lg font-medium mr-4">
              {getHeaderText()}
            </h2>

            <button
              onClick={navigateNext}
              className="text-gray-600 hover:text-primary-600"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="inline-flex bg-gray-100 rounded-md overflow-hidden">
            <button
              onClick={() => setCalendarView('month')}
              className={`px-4 flex items-center py-2 text-sm ${calendarView === 'month'
                ? 'text-primary-600 ring font-bold ring-primary-600/5'
                : 'text-gray-700 hover:bg-gray-200  font-medium'
                }`}
            >
              <FaCalendarAlt className="inline mr-1" />
              <span>
                Month
              </span>
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-4 flex items-center py-2 text-sm ${calendarView === 'week'
                ? 'text-primary-600 ring font-bold ring-primary-600/5'
                : 'text-gray-700 hover:bg-gray-200  font-medium'
                }`}
            >
              <FaCalendarWeek className="inline mr-1" />
              <span>
                Week
              </span>
            </button>
            <button
              onClick={() => setCalendarView('day')}
              className={`px-4 flex items-center py-2 text-sm ${calendarView === 'day'
                ? 'text-primary-600 ring font-bold ring-primary-600/5'
                : 'text-gray-700 hover:bg-gray-200  font-medium'
                }`}
            >
              <FaCalendarDay className="inline mr-1" />
              <span>
                Day
              </span>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Calendar Content based on view */}
          {calendarView === 'month' && renderMonthView()}
          {calendarView === 'week' && renderWeekView()}
          {calendarView === 'day' && renderDayView()}

          {/* No sessions message */}
          {filteredSessions.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">No sessions found</div>
              <p className="text-gray-500">
                {filterSubject || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'upcoming')
                  ? `No sessions match your current filters. Try adjusting your search criteria.`
                  : "You don't have any upcoming sessions scheduled. Book a session with a tutor to get started!"}
              </p>
              {!(filterSubject || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'upcoming')) && (
                <Link
                  to="/student/tutors"
                  className="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Find a Tutor
                </Link>
              )}
              {(filterSubject || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'upcoming')) && (
                <button
                  onClick={clearFilters}
                  className="inline-block mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Session details modal */}
      {sessionDetails && renderSessionDetailsModal()}
    </div>
  );
};

export default StudentCalendar;