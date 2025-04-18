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

  const gridRef = useRef(null);
  const lastCell = useRef(null);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (initialData?.timeSlots?.length) {
      const newGrid = initializeTimeGrid();
      initialData.timeSlots.forEach(slot => {
        const hour = parseInt(slot.startTime.split(':')[0]);
        const minute = parseInt(slot.startTime.split(':')[1]);
        const rowIndex = (hour - 9); // Adjusted for hourly slots
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
    return Array(12).fill().map(() => Array(7).fill(false)); // 12 hours (9 AM to 8 PM)
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
    if (rowIndex >= timeGrid.length || disabledDays.includes(colIndex)) return;
    const newValue = toolMode === 'brush' ? true : false;
    const newGrid = [...timeGrid];

    newGrid[rowIndex][colIndex] = newValue;
    setTimeGrid(newGrid);
    setDragMode(newValue ? 'add' : 'remove');
    setIsDragging(true);
    lastCell.current = { row: rowIndex, col: colIndex };
  };

  const handleMouseEnter = (rowIndex, colIndex) => {
    if (!isDragging || disabledDays.includes(colIndex) || rowIndex >= timeGrid.length) return;
    const newGrid = [...timeGrid];
    newGrid[rowIndex][colIndex] = dragMode === 'add';
    setTimeGrid(newGrid);
    lastCell.current = { row: rowIndex, col: colIndex };
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
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="select-none bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b-0">
          <h2 className="text-xl text-primary-800 font-bold flex items-center">
            <TbCalendarCog className="mr-2 text-2xl" />
            <span className='leading-none'>
              Edit Availability
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-4">
          {/* <h3 className="text-lg font-medium mb-4">Select Time Slots</h3> */}
          <div className="select-none" ref={gridRef}>
            <div className="grid grid-cols-8 gap-1 min-w-max">
              <div className="w-20"></div>
              {weekdays.map((day, index) => (
                <div
                  key={index}
                  className={`text-center p-2 rounded-t-md cursor-pointer ${disabledDays.includes(index)
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-primary-100 text-primary-900/85 font-medium hover:bg-primary-200'
                    }`}
                  onClick={() => handleDayToggle(index)}
                >
                  {day}
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
          <div className="flex items-center justify-between mt-4 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-between space-x-3">
          <div className="flex space-x-2">
            <div className="flex bg-gray-100 rounded-md overflow-hidden">
              <button
                type="button"
                className={`p-4 flex items-center text-sm ${toolMode === 'brush'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setToolMode('brush')}
                title="Paint (add slots)"
              >
                <FaPaintBrush size={16} />
              </button>
              <button
                type="button"
                className={`p-4 flex items-center text-sm ${toolMode === 'eraser'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setToolMode('eraser')}
                title="Erase (remove slots)"
              >
                <FaEraser size={16} />
              </button>
            </div>
            <div className="flex bg-gray-100 rounded-md overflow-hidden">
              <button
                type="button"
                className={`p-4 flex items-center text-sm ${historyIndex > 0
                  ? 'text-gray-700 hover:bg-gray-200'
                  : 'text-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleUndo}
                disabled={historyIndex === 0}
                title="Undo"
              >
                <FaUndo size={16} />
              </button>
              <button
                type="button"
                className={`p-4 flex items-center text-sm ${historyIndex < history.length - 1
                  ? 'text-gray-700 hover:bg-gray-200'
                  : 'text-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                title="Redo"
              >
                <FaRedo size={16} />
              </button>
            </div>
            <button
              type="button"
              className="p-4 flex items-center text-sm text-red-600 hover:bg-red-50 rounded-md"
              onClick={handleClearAll}
              title="Clear all"
            >
              <FaTrash size={16} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium flex items-center"
            >
              <FaSave className="mr-2" />
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityEditor;