import React, { useState, useEffect, useRef } from 'react';
import {
  FaTimes,
  FaEraser,
  FaPaintBrush,
  FaSave,
  FaUndo,
  FaRedo,
  FaTrash,
  FaCalendarAlt
} from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';
import { TbCalendarCog } from 'react-icons/tb';

const AvailabilityEditor = ({ isOpen, onClose, onSave, initialData }) => {
  const [timeGrid, setTimeGrid] = useState(initializeTimeGrid());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState('add');
  const [toolMode, setToolMode] = useState('brush');
  const [history, setHistory] = useState([initializeTimeGrid()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [disabledDays, setDisabledDays] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  const gridRef = useRef(null);
  const lastCell = useRef(null);
  const touchTimeout = useRef(null);

  const weekdays = [
    { short: 'Sun', full: 'Sunday' },
    { short: 'Mon', full: 'Monday' },
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' }
  ];
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (initialData?.timeSlots?.length) {
      const newGrid = initializeTimeGrid();
      initialData.timeSlots.forEach(slot => {
        const hour = parseInt(slot.startTime.split(':')[0]);
        const minute = parseInt(slot.startTime.split(':')[1]);
        const rowIndex = (hour - 9);
        const dayIndex = slot.day;

        if (rowIndex >= 0 && rowIndex < newGrid.length && dayIndex >= 0 && dayIndex < 7) {
          newGrid[rowIndex][dayIndex] = true;
        }
      });
      setTimeGrid(newGrid);
      setHistory([newGrid]);
      setHistoryIndex(0);
    }
  }, [initialData]);

  function initializeTimeGrid() {
    return Array(12).fill().map(() => Array(7).fill(false));
  }

  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      slots.push({
        time: `${hour}:00`,
        label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
      });
    }
    return slots;
  }

  const handleDayToggle = (dayIndex) => {
    setDisabledDays(prev =>
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleMouseDown = (rowIndex, colIndex) => {
    const actualColIndex = isMobile ? activeDay : colIndex;

    if (rowIndex >= timeGrid.length || disabledDays.includes(actualColIndex)) return;
    const newValue = toolMode === 'brush' ? true : false;
    const newGrid = [...timeGrid];

    newGrid[rowIndex][actualColIndex] = newValue;
    setTimeGrid(newGrid);
    setDragMode(newValue ? 'add' : 'remove');
    setIsDragging(true);
    lastCell.current = { row: rowIndex, col: actualColIndex };
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDragging) return;

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && gridRef.current.contains(element)) {
      const rect = element.getBoundingClientRect();
      const rowIndex = Math.floor((touch.clientY - rect.top) / (rect.height / timeSlots.length));

      if (rowIndex >= 0 && rowIndex < timeGrid.length &&
        (!lastCell.current || lastCell.current.row !== rowIndex)) {
        if (touchTimeout.current) clearTimeout(touchTimeout.current);

        touchTimeout.current = setTimeout(() => {
          const newGrid = [...timeGrid];
          newGrid[rowIndex][activeDay] = dragMode === 'add';
          setTimeGrid(newGrid);
          lastCell.current = { row: rowIndex, col: activeDay };
        }, 50);
      }
    }
  };

  const handleMouseEnter = (rowIndex, colIndex) => {
    const actualColIndex = isMobile ? activeDay : colIndex;

    if (!isDragging || disabledDays.includes(actualColIndex) || rowIndex >= timeGrid.length) return;
    const newGrid = [...timeGrid];
    newGrid[rowIndex][actualColIndex] = dragMode === 'add';
    setTimeGrid(newGrid);
    lastCell.current = { row: rowIndex, col: actualColIndex };
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push([...timeGrid]);
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setTimeGrid([...history[historyIndex - 1]]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setTimeGrid([...history[historyIndex + 1]]);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all time slots?')) {
      const newGrid = initializeTimeGrid();
      setTimeGrid(newGrid);
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newGrid);
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);
    }
  };

  const changeActiveDay = (direction) => {
    setActiveDay(prev => {
      let newIndex = prev + direction;
      if (newIndex < 0) newIndex = 6;
      if (newIndex > 6) newIndex = 0;
      return newIndex;
    });
  };

  const convertToTimeSlots = () => {
    const slots = [];
    timeGrid.forEach((row, rowIndex) => {
      if (rowIndex >= timeSlots.length) return;
      row.forEach((isSelected, colIndex) => {
        if (isSelected) {
          const timeSlot = timeSlots[rowIndex];
          if (!timeSlot) return;
          const [hour, minute] = timeSlot.time.split(':');
          slots.push({
            day: colIndex,
            startTime: `${hour.padStart(2, '0')}:${minute}`,
            duration: 60
          });
        }
      });
    });
    return slots;
  };

  const handleSave = () => {
    const timeSlots = convertToTimeSlots();
    onSave({ timeSlots });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-2 md:p-0">
      <div className="select-none bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-3 md:p-4 border-b-0">
          <h2 className="text-lg md:text-xl text-secondary-800 font-bold flex items-center">
            <TbCalendarCog className="mr-1 md:mr-2 text-xl md:text-2xl" />
            <span className='leading-none'>
              Edit Availability
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-2 md:p-4 overflow-auto">
          {isMobile ? (
            <div className="select-none overflow-hidden flex flex-col items-center" ref={gridRef}>
              <div className="flex justify-between w-full items-center mb-2">
                <button
                  onClick={() => changeActiveDay(-1)}
                  className="p-2 text-secondary-600"
                >
                  ◀
                </button>
                <div
                  className={`text-center p-2 rounded-md w-40 font-medium
                    ${disabledDays.includes(activeDay)
                      ? 'bg-gray-100 text-gray-500'
                    : 'bg-secondary-100 text-secondary-900'
                    }`}
                  onClick={() => handleDayToggle(activeDay)}
                >
                  {weekdays[activeDay].full}
                </div>
                <button
                  onClick={() => changeActiveDay(1)}
                  className="p-2 text-secondary-600"
                >
                  ▶
                </button>
              </div>

              <div
                className="grid grid-cols-[auto_1fr] gap-1 w-full px-8 py-2"
                onTouchMove={handleTouchMove}
                style={{ touchAction: 'none' }}
              >
                {timeSlots.map((slot, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <div className="text-xs w-fit text-right pr-2 py-2 font-medium text-gray-600">
                      {slot.label}
                    </div>
                    <div
                      key={`${rowIndex}-${activeDay}`}
                      className={`w-full h-10 rounded ${rowIndex < timeGrid.length && timeGrid[rowIndex][activeDay]
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                        } ${disabledDays.includes(activeDay)
                          ? 'opacity-35 cursor-not-allowed'
                          : 'cursor-pointer'
                        } ${rowIndex % 2 === 0 ? 'border-t border-dashed border-gray-300' : ''}`}
                      onMouseDown={() => rowIndex < timeGrid.length && handleMouseDown(rowIndex, activeDay)}
                      onMouseEnter={() => rowIndex < timeGrid.length && handleMouseEnter(rowIndex, activeDay)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        rowIndex < timeGrid.length && handleMouseDown(rowIndex, activeDay);
                      }}
                    ></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div className="select-none overflow-x-auto" ref={gridRef}>
              <div className="grid grid-cols-8 gap-1 min-w-max">
                <div className="w-20"></div>
                {weekdays.map((day, index) => (
                  <div
                    key={index}
                    className={`text-center p-2 rounded-t-md cursor-pointer ${disabledDays.includes(index)
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-secondary-100 text-secondary-900/85 font-medium hover:bg-secondary-200'
                      }`}
                    onClick={() => handleDayToggle(index)}
                  >
                    {day.short}
                  </div>
                ))}
                  {timeSlots.map((slot, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <div className="w-20 text-xs text-right pr-2 py-2 font-medium text-gray-600">
                        {slot.label}
                      </div>
                      {[0, 1, 2, 3, 4, 5, 6].map(colIndex => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`h-8 peer rounded ${rowIndex < timeGrid.length && timeGrid[rowIndex][colIndex]
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-200 hover:bg-gray-300'
                            } ${disabledDays.includes(colIndex)
                              ? 'opacity-35 cursor-not-allowed'
                              : toolMode === 'brush' ? 'cursor-cell' : 'cursor-grab peer-active:cursor-grabbing active:cursor-grabbing'
                            } ${rowIndex % 2 === 0 ? 'border-t border-dashed border-gray-300' : ''}`}
                          onMouseDown={() => rowIndex < timeGrid.length && handleMouseDown(rowIndex, colIndex)}
                          onMouseEnter={() => rowIndex < timeGrid.length && handleMouseEnter(rowIndex, colIndex)}
                        ></div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
          )}
        </div>

        <div className="p-2 md:p-4 border-t bg-gray-50 flex justify-between space-y-2 md:space-y-0 md:space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm"
          >
            Cancel
          </button>
          <div className="flex space-x-2">
            <div className="flex bg-gray-100 rounded-md overflow-hidden">
              <button
                type="button"
                className={`p-2 md:p-3 flex items-center text-sm ${toolMode === 'brush'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setToolMode('brush')}
                title="Paint (add slots)"
              >
                <FaPaintBrush size={14} />
              </button>
              <button
                type="button"
                className={`p-2 md:p-3 flex items-center text-sm ${toolMode === 'eraser'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setToolMode('eraser')}
                title="Erase (remove slots)"
              >
                <FaEraser size={14} />
              </button>
            </div>
            <div className="flex bg-gray-100 rounded-md overflow-hidden">
              <button
                type="button"
                className={`p-2 md:p-3 flex items-center text-sm ${historyIndex > 0
                  ? 'text-gray-700 hover:bg-gray-200'
                  : 'text-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleUndo}
                disabled={historyIndex === 0}
                title="Undo"
              >
                <FaUndo size={14} />
              </button>
              <button
                type="button"
                className={`p-2 md:p-3 flex items-center text-sm ${historyIndex < history.length - 1
                  ? 'text-gray-700 hover:bg-gray-200'
                  : 'text-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                title="Redo"
              >
                <FaRedo size={14} />
              </button>
            </div>
            <button
              type="button"
              className="p-2 md:p-3 flex items-center text-sm text-red-600 hover:bg-red-50 rounded-md"
              onClick={handleClearAll}
              title="Clear all"
            >
              <FaTrash size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 font-medium flex items-center text-sm"
          >
            <FaSave className="mr-1 md:mr-2" size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityEditor;