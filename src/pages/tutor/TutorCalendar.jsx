import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaPlus,
  FaTrash
} from 'react-icons/fa';

const TutorCalendar = () => {
  const { tutors, currentUser, getUserSessions } = useContext(AppContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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

  // Format date as YYYY-MM-DD
  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Get availability for a specific day
  const getAvailabilityForDay = (day) => {
    if (!day) return [];

    const dateStr = formatDate(day);

    return tutorData.availability.filter(slot => slot.date === dateStr);
  };

  // Get booked sessions for a specific day
  const getSessionsForDay = (day) => {
    if (!day) return [];

    const dateStr = formatDate(day);

    return tutorSessions.filter(session => session.date === dateStr);
  };

  // Check if a day has availability
  const hasAvailability = (day) => {
    return getAvailabilityForDay(day).length > 0;
  };

  // Check if a day has booked sessions
  const hasBookedSessions = (day) => {
    return getSessionsForDay(day).length > 0;
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

  // Check if a day is in the past
  const isPastDay = (day) => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  // Handle day click to add availability
  const handleDayClick = (day) => {
    if (!day || isPastDay(day)) return;

    setSelectedDate(day);
    setNewSlot(prev => ({
      ...prev,
      date: formatDate(day)
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Days of the week headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Availability</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <button
            onClick={previousMonth}
            className="text-gray-600 hover:text-secondary-600"
          >
            <FaChevronLeft />
          </button>

          <h2 className="text-lg font-medium">
            {monthString} {year}
          </h2>

          <button
            onClick={nextMonth}
            className="text-gray-600 hover:text-secondary-600"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Click on a date to add or manage your availability. Dates with blue dot have availability set.
            Dates with green dot have booked sessions.
          </p>

          {/* Calendar Grid */}
          <div>
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
                          ? 'bg-secondary-50 border-secondary-200 cursor-pointer hover:bg-secondary-100'
                          : 'cursor-pointer hover:bg-gray-50'
                    }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day && (
                    <>
                      <div className="text-right flex justify-end items-center">
                        <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 ${isToday(day)
                            ? 'bg-secondary-600 text-white'
                            : isPastDay(day)
                              ? 'text-gray-400'
                              : 'text-gray-700'
                          }`}>
                          {day}
                        </span>

                        {/* Indicators for availability and bookings */}
                        <div className="flex ml-1">
                          {hasAvailability(day) && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                          )}
                          {hasBookedSessions(day) && (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          )}
                        </div>
                      </div>

                      {/* Availability slots */}
                      <div className="mt-1">
                        {getAvailabilityForDay(day).map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="text-xs p-1 mt-1 rounded bg-blue-100 text-blue-800 flex justify-between items-center"
                          >
                            <span>{slot.startTime}</span>
                            <button className="text-gray-500 hover:text-red-500">
                              <FaTrash size={10} />
                            </button>
                          </div>
                        ))}

                        {/* Booked sessions */}
                        {getSessionsForDay(day).map((session, sessionIndex) => (
                          <div
                            key={sessionIndex}
                            className="text-xs p-1 mt-1 rounded bg-green-100 text-green-800"
                          >
                            <div className="flex justify-between">
                              <span>Booked: {session.startTime}</span>
                            </div>
                            <div className="truncate">{session.subject}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding new availability slot */}
      {showAddSlot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4">
              Add Availability for {new Date(newSlot.date).toLocaleDateString()}
            </h2>

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
                    className="pl-10 px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
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
                  className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
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
                  className="px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700"
                >
                  Add Slot
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
