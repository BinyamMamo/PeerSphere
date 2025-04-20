import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import AvailabilityEditor from '../AvailabilityEditor';

const TutorCalendar = () => {
  const { tutors, currentUser, getUserSessions } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const tutorData = tutors.find(
    (tutor) =>
      tutor.firstName === currentUser?.firstName &&
      tutor.lastName === currentUser?.lastName
  ) || { availability: [] };

  const tutorSessions = getUserSessions().filter(
    (session) => session.status === 'Upcoming'
  );

  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '09:00',
    duration: 60,
  });

  const [bulkAddForm, setBulkAddForm] = useState({
    startDate: formatDateForInput(new Date()),
    endDate: formatDateForInput(
      new Date(new Date().setDate(new Date().getDate() + 14))
    ),
    weekdays: [1, 2, 3, 4, 5],
    timeSlots: [
      { startTime: '09:00', duration: 60 },
      { startTime: '14:00', duration: 60 },
    ],
  });

  function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const date = currentDate.getDate();
  const monthString = monthNames[month];

  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  };

  const getWeekDays = () => {
    const weekDays = [];
    const currentDay = currentDate.getDay();
    const currentDateNum = currentDate.getDate();
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDateNum - currentDay);
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      weekDays.push({
        date: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
        fullDate: day,
      });
    }
    return weekDays;
  };

  const getDayHours = () => {
    const hours = [];
    for (let i = 9; i <= 20; i++) {
      hours.push({
        hour: i,
        label: i > 12 ? `${i - 12} PM` : i === 12 ? '12 PM' : `${i} AM`,
      });
    }
    return hours;
  };

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newBlog.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

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

  const getAvailabilityForDay = (day, checkMonth = month, checkYear = year) => {
    if (!day) return [];
    const dateStr = `${checkYear}-${String(checkMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tutorData.availability.filter((slot) => slot.date === dateStr);
  };

  const getSessionsForDay = (day, checkMonth = month, checkYear = year) => {
    if (!day) return [];
    const dateStr = `${checkYear}-${String(checkMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tutorSessions.filter((session) => session.date === dateStr);
  };

  const hasAvailability = (day, checkMonth = month, checkYear = year) => {
    return getAvailabilityForDay(day, checkMonth, checkYear).length > 0;
  };

  const hasBookedSessions = (day, checkMonth = month, checkYear = year) => {
    return getSessionsForDay(day, checkMonth, checkYear).length > 0;
  };

  const isToday = (day, checkMonth = month, checkYear = year) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      checkMonth === today.getMonth() &&
      checkYear === today.getFullYear()
    );
  };

  const isPastDay = (day, checkMonth = month, checkYear = year) => {
    const today = new Date();
    const checkDate = new Date(checkYear, checkMonth, day);
    return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const handleDayClick = (day, checkMonth = month, checkYear = year) => {
    if (!day || isPastDay(day, checkMonth, checkYear)) return;
    const dateStr = `${checkYear}-${String(checkMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate({ day, month: checkMonth, year: checkYear, dateStr });
    setNewSlot((prev) => ({ ...prev, date: dateStr }));
    setShowAddSlot(true);
  };

  const handleTimeSlotClick = (hour) => {
    if (!selectedDate) return;
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    setNewSlot((prev) => ({ ...prev, startTime }));
    setShowAddSlot(true);
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    console.log('Adding availability slot:', newSlot);
    setNewSlot({ date: '', startTime: '09:00', duration: 60 });
    setShowAddSlot(false);
  };

  const handleBulkAdd = (data) => {
    const availabilitySlots = [];
    const { startDate, endDate, weekdays, timeSlots } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (weekdays.includes(dayOfWeek)) {
        const dateStr = current.toISOString().split('T')[0];
        timeSlots.forEach((slot) => {
          availabilitySlots.push({
            date: dateStr,
            startTime: slot.startTime,
            duration: slot.duration,
          });
        });
      }
      current.setDate(current.getDate() + 1);
    }
    console.log('Adding bulk availability:', availabilitySlots);
    setBulkAddForm(data);
    setShowBulkAdd(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot((prev) => ({ ...prev, [name]: value }));
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getHeaderText = () => {
    if (calendarView === 'month') {
      return `${monthString} ${year}`;
    } else if (calendarView === 'week') {
      const weekDays = getWeekDays();
      const firstDay = weekDays[0];
      const lastDay = weekDays[6];
      if (firstDay.month !== lastDay.month) {
        return `${monthNames[firstDay.month]} ${firstDay.date} - ${monthNames[lastDay.month]} ${lastDay.date}, ${lastDay.year}`;
      }
      return `${monthNames[firstDay.month]} ${firstDay.date} - ${lastDay.date}, ${firstDay.year}`;
    } else {
      return `${weekdaysFull[currentDate.getDay()]}, ${monthString} ${date}, ${year}`;
    }
  };

  const renderMonthView = () => {
    return (
      <>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-1 sm:gap-2">
          {getDaysArray().map((day, index) => (
            <div
              key={index}
              className={`min-h-20 sm:min-h-24 p-1 sm:p-2 border rounded-lg touch-manipulation ${!day
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
                    <span
                      className={`inline-block w-5 h-5 sm:w-6 sm:h-6 rounded-full text-center leading-5 sm:leading-6 text-xs sm:text-sm ${isToday(day)
                        ? 'bg-primary-600 text-white'
                        : isPastDay(day)
                          ? 'text-gray-400'
                          : 'text-gray-700'
                        }`}
                    >
                      {day}
                    </span>
                    <div className="flex ml-1">
                      {hasAvailability(day) && (
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500 mr-1" title="Available"></div>
                      )}
                      {hasBookedSessions(day) && (
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" title="Booked"></div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-16 sm:max-h-20">
                    {getAvailabilityForDay(day).map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="text-xs p-1 rounded bg-primary-100 text-primary-800 flex justify-between items-center"
                      >
                        <span>{slot.startTime}</span>
                        <button
                          className="text-gray-500 hover:text-red-500"
                          title="Remove slot"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {getSessionsForDay(day).map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className="text-xs p-1 sm:p-2 rounded bg-green-100 text-green-800"
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

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hours = getDayHours();
    return (
      <div className="overflow-x-auto touch-pan-x">
        <div className="min-w-[600px] sm:min-w-max">
          <div className="grid grid-cols-8 gap-1 sm:gap-2 mb-2">
            <div className="w-16 sm:w-20"></div>
            {weekDays.map((day, index) => {
              const isPast = isPastDay(day.date, day.month, day.year);
              const isTodayFlag = isToday(day.date, day.month, day.year);
              return (
                <div
                  key={index}
                  className={`text-center text-xs sm:text-sm ${isTodayFlag
                    ? 'bg-primary-50 border-b-2 border-primary-500'
                    : isPast
                      ? 'text-gray-400'
                      : ''
                    }`}
                >
                  <div className="font-medium">{weekdays[index]}</div>
                  <div
                    className={`text-base sm:text-lg font-semibold ${isTodayFlag ? 'text-primary-600' : ''
                      }`}
                  >
                    {day.date}
                  </div>
                  <div className="text-xs text-gray-500">
                    {monthNames[day.month].slice(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-l border-gray-200">
            {hours.map((hour, hourIndex) => (
              <div key={hourIndex} className="grid grid-cols-8 gap-0">
                <div className="w-16 sm:w-20 px-2 py-2 sm:py-3 border-b border-r border-gray-200 text-xs font-medium text-gray-500">
                  {hour.label}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const dateStr = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
                  const timeStr = `${hour.hour.toString().padStart(2, '0')}:00`;
                  const availability = tutorData.availability.filter(
                    (slot) => slot.date === dateStr && slot.startTime === timeStr
                  );
                  const sessions = tutorSessions.filter(
                    (session) => session.date === dateStr && session.startTime === timeStr
                  );
                  const isAvailable = availability.length > 0;
                  const isBooked = sessions.length > 0;
                  const isPast =
                    isPastDay(day.date, day.month, day.year) ||
                    (isToday(day.date, day.month, day.year) &&
                      hour.hour < new Date().getHours());
                  return (
                    <div
                      key={dayIndex}
                      className={`p-1 h-14 sm:h-16 border-b border-r border-gray-200 touch-manipulation ${isPast
                        ? 'bg-gray-50'
                        : isAvailable
                          ? isBooked
                            ? 'bg-green-50'
                            : 'bg-primary-50 cursor-pointer hover:bg-primary-100'
                          : 'cursor-pointer hover:bg-gray-50'
                        }`}
                      onClick={() => !isPast && handleDayClick(day.date, day.month, day.year)}
                    >
                      {isAvailable && !isBooked && (
                        <div className="text-xs bg-primary-100 text-primary-800 p-1 rounded">
                          Available
                        </div>
                      )}
                      {isBooked &&
                        sessions.map((session, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-green-100 text-green-800 p-1 rounded"
                          >
                            <div className="font-medium">{session.subject}</div>
                            <div className="truncate">{session.studentName}</div>
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

  const renderDayView = () => {
    const hours = getDayHours();
    const dayAvailability = getAvailabilityForDay(date);
    const daySessions = getSessionsForDay(date);
    return (
      <div className="border-t border-l border-gray-200">
        {hours.map((hour, hourIndex) => {
          const timeStr = `${hour.hour.toString().padStart(2, '0')}:00`;
          const timeStr30 = `${hour.hour.toString().padStart(2, '0')}:30`;
          const isAvailable1 = dayAvailability.some((slot) => slot.startTime === timeStr);
          const isAvailable2 = dayAvailability.some((slot) => slot.startTime === timeStr30);
          const session1 = daySessions.find((session) => session.startTime === timeStr);
          const session2 = daySessions.find((session) => session.startTime === timeStr30);
          const isPast1 = isToday(date) && hour.hour < new Date().getHours();
          const isPast2 =
            isToday(date) &&
            (hour.hour < new Date().getHours() ||
              (hour.hour === new Date().getHours() && new Date().getMinutes() >= 30));
          return (
            <div key={hourIndex} className="grid grid-cols-1 divide-y divide-gray-100">
              <div className="flex py-2 sm:py-3 border-b border-r border-gray-200">
                <div className="w-16 sm:w-20 px-2 text-xs font-medium text-gray-500">
                  {hour.label}
                </div>
                <div
                  className={`flex-grow p-1 rounded-l-md mx-2 touch-manipulation ${isPast1
                    ? 'bg-gray-50 text-gray-400'
                    : isAvailable1
                      ? session1
                        ? 'bg-green-100'
                        : 'bg-primary-100 cursor-pointer hover:bg-primary-200'
                      : 'cursor-pointer hover:bg-gray-100'
                    }`}
                  onClick={() => !isPast1 && !session1 && handleTimeSlotClick(hour.hour)}
                >
                  {isAvailable1 && !session1 && (
                    <div className="flex justify-between items-center text-primary-800 text-xs sm:text-sm px-2">
                      <span>Available</span>
                      <button className="text-red-500 hover:text-red-700">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {session1 && (
                    <div className="text-xs sm:text-sm bg-green-100 text-green-800 p-2 rounded">
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
              <div className="flex py-2 sm:py-3 border-b border-r border-gray-200">
                <div className="w-16 sm:w-20 px-2 text-xs font-medium text-gray-500">
                  {hour.hour}:30
                </div>
                <div
                  className={`flex-grow p-1 rounded-l-md mx-2 touch-manipulation ${isPast2
                    ? 'bg-gray-50 text \text-gray-400'
                    : isAvailable2
                      ? session2
                        ? 'bg-green-100'
                        : 'bg-primary-100 cursor-pointer hover:bg-primary-200'
                      : 'cursor-pointer hover:bg-gray-100'
                    }`}
                  onClick={() => !isPast2 && !session2 && handleTimeSlotClick(hour.hour)}
                >
                  {isAvailable2 && !session2 && (
                    <div className="flex justify-between items-center text-primary-800 text-xs sm:text-sm px-2">
                      <span>Available</span>
                      <button className="text-red-500 hover:text-red-700">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {session2 && (
                    <div className="text-xs sm:text-sm bg-green-100 text-green-800 p-2 rounded">
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Calendar</h1>
        <button
          onClick={() => setShowBulkAdd(true)}
          className="flex items-center bg-primary-600 gap-1 text-white px-3 py-2 rounded-md hover:bg-primary-700 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>

          <span className='md:flex'>
            Manage Availability
            </span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <button
              onClick={navigatePrevious}
              className="text-gray-600 hover:text-primary-600 mr-3 sm:mr-4 p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-base sm:text-lg font-medium mr-3 sm:mr-4">
              {getHeaderText()}
            </h2>
            <button
              onClick={navigateNext}
              className="text-gray-600 hover:text-primary-600 p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="inline-flex bg-gray-100 rounded-md overflow-hidden">
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center ${calendarView === 'month'
                ? 'text-primary-800 font-bold bg-primary-50'
                : 'text-gray-700 hover:bg-gray-200 font-medium'
                }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className='hidden md:flex'>
                Month
              </span>
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center ${calendarView === 'week'
                ? 'text-primary-800 font-bold bg-primary-50'
                : 'text-gray-700 hover:bg-gray-200 font-medium'
                }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 5H3m3 0v14m0 0h3m-3 0H3m9-14h9m-9 0v14m0 0h9m-9 0h3" />
              </svg>
              <span className='hidden md:flex'>
                Week
              </span>
            </button>
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center ${calendarView === 'day'
                ? 'text-primary-800 font-bold bg-primary-50'
                : 'text-gray-700 hover:bg-gray-200 font-medium'
                }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18m-7 5h7" />
              </svg>
              <span className='hidden md:flex'>
                Day
              </span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {calendarView === 'month' && renderMonthView()}
          {calendarView === 'week' && renderWeekView()}
          {calendarView === 'day' && renderDayView()}
        </div>
      </div>
      {showAddSlot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-medium">
                Add Availability for {new Date(newSlot.date).toLocaleDateString()}
              </h2>
              <button
                onClick={() => setShowAddSlot(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddSlot}>
              <div className="mb-4">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <select
                    id="startTime"
                    name="startTime"
                    className="pl-10 px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
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
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  name="duration"
                  className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
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
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showBulkAdd && (
        <AvailabilityEditor
          isOpen={showBulkAdd}
          onClose={() => setShowBulkAdd(false)}
          onSave={handleBulkAdd}
          initialData={bulkAddForm}
        />
      )}
    </div>
  );
};

export default TutorCalendar;