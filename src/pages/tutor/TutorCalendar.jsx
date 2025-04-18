import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaCog,
  FaRegClock,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { IoCalendar } from 'react-icons/io5';

const TutorCalendar = () => {
  const { tutors, currentUser, getUserSessions } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', 'day'
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  // Get tutor data
  const tutorData = tutors.find(tutor =>
    tutor.firstName === currentUser?.firstName &&
    tutor.lastName === currentUser?.lastName
  ) || { availability: [] };

  // Get tutor sessions
  const tutorSessions = getUserSessions().filter(session => session.status === 'Upcoming');

  // Form state for adding new availability slot
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '09:00',
    duration: 60
  });

  // Form state for bulk add
  const [bulkAddForm, setBulkAddForm] = useState({
    startDate: formatDateForInput(new Date()),
    endDate: formatDateForInput(new Date(new Date().setDate(new Date().getDate() + 14))),
    weekdays: [1, 2, 3, 4, 5], // Monday to Friday
    timeSlots: [
      { startTime: '09:00', duration: 60 },
      { startTime: '14:00', duration: 60 }
    ]
  });

  // Helper to format date for input field
  function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }

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

  // Format date as YYYY-MM-DD
  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

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

  // Get availability for a specific day
  const getAvailabilityForDay = (day, checkMonth = month, checkYear = year) => {
    if (!day) return [];

    const dateStr = `${checkYear}-${String(checkMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return tutorData.availability.filter(slot => slot.date === dateStr);
  };

  // Get booked sessions for a specific day
  const getSessionsForDay = (day, checkMonth = month, checkYear = year) => {
    if (!day) return [];

    const dateStr = `${checkYear}-${String(checkMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return tutorSessions.filter(session => session.date === dateStr);
  };

  // Check if a day has availability
  const hasAvailability = (day, checkMonth = month, checkYear = year) => {
    return getAvailabilityForDay(day, checkMonth, checkYear).length > 0;
  };

  // Check if a day has booked sessions
  const hasBookedSessions = (day, checkMonth = month, checkYear = year) => {
    return getSessionsForDay(day, checkMonth, checkYear).length > 0;
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

  // Check if a day is in the past
  const isPastDay = (day, checkMonth = month, checkYear = year) => {
    const today = new Date();
    const checkDate = new Date(checkYear, checkMonth, day);
    return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  // Check if a specific time slot is available (not booked)
  const isTimeSlotAvailable = (date, startTime) => {
    const bookedSessions = tutorSessions.filter(session =>
      session.date === date && session.startTime === startTime
    );
    return bookedSessions.length === 0;
  };

  // Handle day click to add availability
  const handleDayClick = (day, checkMonth = month, checkYear = year) => {
    if (!day || isPastDay(day, checkMonth, checkYear)) return;

    const dateStr = `${checkYear}-${String(checkMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    setSelectedDate({
      day,
      month: checkMonth,
      year: checkYear,
      dateStr
    });

    setNewSlot(prev => ({
      ...prev,
      date: dateStr
    }));

    setShowAddSlot(true);
  };

  // Handle time slot selection for the day view
  const handleTimeSlotClick = (hour) => {
    if (!selectedDate) return;

    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    setNewSlot(prev => ({
      ...prev,
      startTime
    }));
    setShowAddSlot(true);
  };

  // Handle adding a new availability slot
  const handleAddSlot = (e) => {
    e.preventDefault();

    // Just for MVP, in a real app this would update the availability in the database
    console.log('Adding availability slot:', newSlot);

    // Reset form and close modal
    setNewSlot({
      date: '',
      startTime: '09:00',
      duration: 60
    });
    setShowAddSlot(false);
  };

  // Handle adding bulk availability
  const handleBulkAdd = (e) => {
    e.preventDefault();

    console.log('Adding bulk availability:', bulkAddForm);

    // Reset and close modal
    setShowBulkAdd(false);
  };

  // Handle adding a new time slot to bulk form
  const handleAddTimeSlot = () => {
    setBulkAddForm(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: '09:00', duration: 60 }]
    }));
  };

  // Handle removing a time slot from bulk form
  const handleRemoveTimeSlot = (index) => {
    setBulkAddForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle bulk form input changes
  const handleBulkInputChange = (e) => {
    const { name, value } = e.target;
    setBulkAddForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle time slot input changes in bulk form
  const handleTimeSlotChange = (index, field, value) => {
    setBulkAddForm(prev => {
      const newTimeSlots = [...prev.timeSlots];
      newTimeSlots[index] = {
        ...newTimeSlots[index],
        [field]: value
      };
      return {
        ...prev,
        timeSlots: newTimeSlots
      };
    });
  };

  // Handle weekday toggle in bulk form
  const handleWeekdayToggle = (day) => {
    setBulkAddForm(prev => {
      if (prev.weekdays.includes(day)) {
        return {
          ...prev,
          weekdays: prev.weekdays.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          weekdays: [...prev.weekdays, day].sort()
        };
      }
    });
  };

  // Days of the week headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
      return `${weekdaysFull[currentDate.getDay()]}, ${monthString} ${date}, ${year}`;
    }
  };

  // Render month view
  const renderMonthView = () => {
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
                ? 'bg-gray-50 cursor-default'
                : isPastDay(day)
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : isToday(day)
                    ? 'bg-primary-50 border-primary-200 cursor-pointer hover:bg-primary-100'
                    : 'cursor-pointer hover:bg-gray-50'
                }`}
              onClick={() => handleDayClick(day)}
            >
              {day && (
                <>
                  <div className="text-right flex justify-end items-center">
                    <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 ${isToday(day)
                      ? 'bg-primary-600 text-white'
                      : isPastDay(day)
                        ? 'text-gray-400'
                        : 'text-gray-700'
                      }`}>
                      {day}
                    </span>

                    {/* Indicators for availability and bookings */}
                    <div className="flex ml-1">
                      {hasAvailability(day) && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" title="Available"></div>
                      )}
                      {hasBookedSessions(day) && (
                        <div className="w-2 h-2 rounded-full bg-green-500" title="Booked"></div>
                      )}
                    </div>
                  </div>

                  {/* Availability slots */}
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                    {getAvailabilityForDay(day).map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="text-xs p-1 rounded bg-blue-100 text-blue-800 flex justify-between items-center"
                      >
                        <span>{slot.startTime}</span>
                        <button
                          className="text-gray-500 hover:text-red-500"
                          title="Remove slot"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}

                    {/* Booked sessions */}
                    {getSessionsForDay(day).map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className="text-xs p-2 rounded bg-green-100 text-green-800"
                      >
                        <div className="truncate mb-1">{session.subject}</div>
                        <div className="flex justify-between">
                          <span>{session.startTime}</span>
                        </div>
                      </div>
                    ))}
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

    return (
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="w-20"></div> {/* Empty corner cell */}
            {weekDays.map((day, index) => {
              const isPast = isPastDay(day.date, day.month, day.year);
              const isTodayFlag = isToday(day.date, day.month, day.year);

              return (
                <div
                  key={index}
                  className={`text-center ${isTodayFlag
                    ? 'bg-primary-50 border-b-2 border-primary-500'
                    : isPast
                      ? 'text-gray-400'
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

                  const availability = tutorData.availability.filter(
                    slot => slot.date === dateStr && slot.startTime === timeStr
                  );

                  const sessions = tutorSessions.filter(
                    session => session.date === dateStr && session.startTime === timeStr
                  );

                  const isAvailable = availability.length > 0;
                  const isBooked = sessions.length > 0;
                  const isPast = isPastDay(day.date, day.month, day.year) ||
                    (isToday(day.date, day.month, day.year) && hour.hour < new Date().getHours());

                  return (
                    <div
                      key={dayIndex}
                      className={`p-1 h-16 border-b border-r border-gray-200 ${isPast
                        ? 'bg-gray-50'
                        : isAvailable
                          ? isBooked
                            ? 'bg-green-50'
                            : 'bg-blue-50 cursor-pointer hover:bg-blue-100'
                          : 'cursor-pointer hover:bg-gray-50'
                        }`}
                      onClick={() => !isPast && handleDayClick(day.date, day.month, day.year)}
                    >
                      {isAvailable && !isBooked && (
                        <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded">
                          Available
                        </div>
                      )}

                      {isBooked && sessions.map((session, idx) => (
                        <div key={idx} className="text-xs bg-green-100 text-green-800 p-1 rounded">
                          <div className="font-medium">{session.subject}</div>
                          <div className="truncate text-xs">{session.studentName}</div>
                        </div>
                      ))}
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
    const dayAvailability = getAvailabilityForDay(date);
    const daySessions = getSessionsForDay(date);

    return (
      <div className="border-t border-l border-gray-200">
        {hours.map((hour, hourIndex) => {
          const timeStr = `${hour.hour.toString().padStart(2, '0')}:00`;
          const timeStr30 = `${hour.hour.toString().padStart(2, '0')}:30`;

          const isAvailable1 = dayAvailability.some(slot => slot.startTime === timeStr);
          const isAvailable2 = dayAvailability.some(slot => slot.startTime === timeStr30);

          const session1 = daySessions.find(session => session.startTime === timeStr);
          const session2 = daySessions.find(session => session.startTime === timeStr30);

          const isPast1 = isToday(date) && hour.hour < new Date().getHours();
          const isPast2 = isToday(date) && (hour.hour < new Date().getHours() ||
            (hour.hour === new Date().getHours() && new Date().getMinutes() >= 30));

          return (
            <div key={hourIndex} className="grid grid-cols-1 divide-y divide-gray-100">
              {/* First half hour */}
              <div className="flex py-3 border-b border-r border-gray-200">
                <div className="w-20 px-2 text-xs font-medium text-gray-500">
                  {hour.label}
                </div>
                <div
                  className={`flex-grow p-1 rounded-l-md mx-2 ${isPast1
                    ? 'bg-gray-50 text-gray-400'
                    : isAvailable1
                      ? session1
                        ? 'bg-green-100'
                        : 'bg-blue-100 cursor-pointer hover:bg-blue-200'
                      : 'cursor-pointer hover:bg-gray-100'
                    }`}
                  onClick={() => !isPast1 && !session1 && handleTimeSlotClick(hour.hour)}
                >
                  {isAvailable1 && !session1 && (
                    <div className="flex justify-between items-center text-blue-800 text-sm px-2">
                      <span>Available</span>
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}

                  {session1 && (
                    <div className="text-sm bg-green-100 text-green-800 p-2 rounded">
                      <div className="font-medium">{session1.subject}</div>
                      <div className="flex justify-between">
                        <span>{session1.studentName}</span>
                        <span>{timeStr}</span>
                      </div>
                    </div>
                  )}

                  {!isAvailable1 && !session1 && !isPast1 && (
                    <div className="text-gray-400 text-xs px-2">Click to add availability</div>
                  )}
                </div>
              </div>

              {/* Second half hour */}
              <div className="flex py-3 border-b border-r border-gray-200">
                <div className="w-20 px-2 text-xs font-medium text-gray-500">
                  {hour.hour}:30
                </div>
                <div
                  className={`flex-grow p-1 rounded-l-md mx-2 ${isPast2
                    ? 'bg-gray-50 text-gray-400'
                    : isAvailable2
                      ? session2
                        ? 'bg-green-100'
                        : 'bg-blue-100 cursor-pointer hover:bg-blue-200'
                      : 'cursor-pointer hover:bg-gray-100'
                    }`}
                  onClick={() => !isPast2 && !session2 && handleTimeSlotClick(hour.hour)}
                >
                  {isAvailable2 && !session2 && (
                    <div className="flex justify-between items-center text-blue-800 text-sm px-2">
                      <span>Available</span>
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}

                  {session2 && (
                    <div className="text-sm bg-green-100 text-green-800 p-2 rounded">
                      <div className="font-medium">{session2.subject}</div>
                      <div className="flex justify-between">
                        <span>{session2.studentName}</span>
                        <span>{timeStr30}</span>
                      </div>
                    </div>
                  )}

                  {!isAvailable2 && !session2 && !isPast2 && (
                    <div className="text-gray-400 text-xs px-2">Click to add availability</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Availability</h1>

        <div className="sm:mt-0">
          <button
            onClick={() => setShowBulkAdd(true)}
            className="flex items-center mr-2 bg-primary-600 text-white px-3 py-2 rounded-md hover:bg-primary-700"
          >
            <IoCalendar className="mr-2" />
            <span className='text-sm'>
              Manage Availability
            </span>
          </button>
        </div>
      </div>

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

            {/* <button
              onClick={goToToday}
              className="ml-4 px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Today
            </button> */}
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
        </div>
      </div>

      {/* Modal for adding new availability slot */}
      {showAddSlot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Add Availability for {new Date(newSlot.date).toLocaleDateString()}
              </h2>
              <button
                onClick={() => setShowAddSlot(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddSlot}>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <select
                    id="startTime"
                    name="startTime"
                    className="pl-10 px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={newSlot.startTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="09:00">9:00 AM</option>
                    <option value="09:30">9:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:30">4:30 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  name="duration"
                  className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={newSlot.duration}
                  onChange={handleInputChange}
                  required
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSlot(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for bulk adding availability */}
      {showBulkAdd && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Quick Add Availability</h2>
              <button
                onClick={() => setShowBulkAdd(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleBulkAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={bulkAddForm.startDate}
                    onChange={handleBulkInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={bulkAddForm.endDate}
                    onChange={handleBulkInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Weekdays
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekdaysFull.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm ${bulkAddForm.weekdays.includes(index)
                        ? 'bg-primary-100 text-primary-800 border border-primary-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                        }`}
                      onClick={() => handleWeekdayToggle(index)}
                    >
                      {day.slice(0, 3)}
                      {bulkAddForm.weekdays.includes(index) && <FaCheck className="inline ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Time Slots
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTimeSlot}
                    className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
                  >
                    <FaPlus className="mr-1" size={12} /> Add Slot
                  </button>
                </div>

                {bulkAddForm.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="flex-grow grid grid-cols-2 gap-2">
                      <div>
                        <select
                          className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={slot.startTime}
                          onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                        >
                          <option value="09:00">9:00 AM</option>
                          <option value="09:30">9:30 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="10:30">10:30 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="11:30">11:30 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="12:30">12:30 PM</option>
                          <option value="13:00">1:00 PM</option>
                          <option value="13:30">1:30 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="14:30">2:30 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="15:30">3:30 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="16:30">4:30 PM</option>
                          <option value="17:00">5:00 PM</option>
                          <option value="17:30">5:30 PM</option>
                          <option value="18:00">6:00 PM</option>
                          <option value="18:30">6:30 PM</option>
                          <option value="19:00">7:00 PM</option>
                          <option value="19:30">7:30 PM</option>
                          <option value="20:00">8:00 PM</option>
                        </select>
                      </div>
                      <div>
                        <select
                          className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={slot.duration}
                          onChange={(e) => handleTimeSlotChange(index, 'duration', e.target.value)}
                        >
                          <option value="30">30 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="90">90 minutes</option>
                          <option value="120">120 minutes</option>
                        </select>
                      </div>
                    </div>
                    {bulkAddForm.timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="flex items-center text-gray-700">
                  <FaRegClock className="text-primary-500 mr-2" />
                  <span className="text-sm font-medium">Summary</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  This will create {bulkAddForm.timeSlots.length} time slot(s) on each selected day
                  ({bulkAddForm.weekdays.length} days per week) from {bulkAddForm.startDate} to {bulkAddForm.endDate}.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBulkAdd(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Add Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorCalendar;