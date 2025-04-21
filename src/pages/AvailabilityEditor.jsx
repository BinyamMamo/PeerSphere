import React, { useState, useEffect, useRef } from 'react';
import {
  FaTimes,
  FaEraser,
  FaPaintBrush,
  FaSave,
  FaUndo,
  FaRedo,
  FaTrash,
  FaAngleRight,
  FaAngleLeft,
} from 'react-icons/fa';
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
  const cellRefs = useRef({});
  const lastCell = useRef(null);

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

  // Helper function to save current state to history
  const saveToHistory = () => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(timeGrid)));
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  };

  // Get cell coordinates from touch event
  const getCellFromTouch = (touchEvent) => {
    const touch = touchEvent.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (!element) return null;

    // Check if the element has a data attribute with cell coordinates
    const cellId = element.getAttribute('data-cell-id');
    if (cellId) {
      const [rowIndex, colIndex] = cellId.split('-').map(Number);
      return { rowIndex, colIndex: isMobile ? activeDay : colIndex };
    }

    return null;
  };

  const handleCellStateChange = (rowIndex, colIndex, newValue = null) => {
    if (rowIndex >= timeGrid.length || disabledDays.includes(colIndex)) return;

    // If newValue is not explicitly provided, use the tool mode
    const cellValue = newValue !== null ? newValue : (toolMode === 'brush');

    // Only update if the cell is different from the last one we modified
    if (!lastCell.current ||
      lastCell.current.row !== rowIndex ||
      lastCell.current.col !== colIndex) {

      const newGrid = [...timeGrid];
      newGrid[rowIndex][colIndex] = cellValue;
      setTimeGrid(newGrid);
      lastCell.current = { row: rowIndex, col: colIndex };
    }
  };

  const handleMouseDown = (rowIndex, colIndex) => {
    const actualColIndex = isMobile ? activeDay : colIndex;

    if (rowIndex >= timeGrid.length || disabledDays.includes(actualColIndex)) return;

    // Get the current value of the cell to determine drag mode
    const currentValue = timeGrid[rowIndex][actualColIndex];
    const newValue = toolMode === 'brush' ? true : false;

    // Set drag mode based on current cell state and tool
    setDragMode(newValue ? 'add' : 'remove');
    setIsDragging(true);

    // Update the cell
    handleCellStateChange(rowIndex, actualColIndex, newValue);
  };

  const handleTouchStart = (e, rowIndex) => {
    e.preventDefault(); // Prevent default touch behavior

    const cell = getCellFromTouch(e);
    if (cell) {
      handleMouseDown(cell.rowIndex, cell.colIndex);
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling

    if (!isDragging) return;

    const cell = getCellFromTouch(e);
    if (cell) {
      handleCellStateChange(cell.rowIndex, cell.colIndex, dragMode === 'add');
    }
  };

  const handleMouseEnter = (rowIndex, colIndex) => {
    const actualColIndex = isMobile ? activeDay : colIndex;

    if (!isDragging || disabledDays.includes(actualColIndex) || rowIndex >= timeGrid.length) return;

    handleCellStateChange(rowIndex, actualColIndex, dragMode === 'add');
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      saveToHistory();
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
      setTimeGrid(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setTimeGrid(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all time slots?')) {
      const newGrid = initializeTimeGrid();
      setTimeGrid(newGrid);
      saveToHistory();
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

  // Register cell reference
  const registerCellRef = (rowIndex, colIndex, element) => {
    if (!element) return;
    cellRefs.current[`${rowIndex}-${colIndex}`] = element;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-2 md:p-0">
      <div className="select-none bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col">
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
            <div
              className="select-none overflow-hidden flex flex-col items-center"
              ref={gridRef}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              style={{ touchAction: 'none' }}
            >
              <div className="flex justify-between w-full items-center mb-3 font-medium text-xl">
                <button
                  onClick={() => changeActiveDay(-1)}
                  className="p-2 text-secondary-600"
                >
                  <FaAngleLeft /> 
                </button>
                <div
                  className={`text-center w-48 p-2.5 uppercase rounded-md
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
                  <FaAngleRight />
                </button>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-1 w-full px-4 pl-2 py-2">
                {timeSlots.map((slot, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <div className="text-xs w-16 text-right pr-2 py-2 font-medium text-gray-600">
                      {slot.label}
                    </div>
                    <div
                      key={`${rowIndex}-${activeDay}`}
                      data-cell-id={`${rowIndex}-${activeDay}`}
                      ref={(el) => registerCellRef(rowIndex, activeDay, el)}
                      className={`w-full h-12 rounded ${rowIndex < timeGrid.length && timeGrid[rowIndex][activeDay]
                        ? 'bg-secondary-500 hover:bg-secondary-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                        } ${disabledDays.includes(activeDay)
                          ? 'opacity-35 cursor-not-allowed'
                          : 'cursor-pointer'
                        } ${rowIndex % 2 === 0 ? 'border-t border-dashed border-gray-300' : ''}`}
                      onMouseDown={() => rowIndex < timeGrid.length && handleMouseDown(rowIndex, activeDay)}
                      onMouseEnter={() => rowIndex < timeGrid.length && handleMouseEnter(rowIndex, activeDay)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        if (rowIndex < timeGrid.length) {
                          handleTouchStart(e, rowIndex);
                        }
                      }}
                    ></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
              <div
                className="select-none overflow-x-auto"
                ref={gridRef}
              >
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
                          data-cell-id={`${rowIndex}-${colIndex}`}
                          ref={(el) => registerCellRef(rowIndex, colIndex, el)}
                          className={`h-8 peer rounded ${rowIndex < timeGrid.length && timeGrid[rowIndex][colIndex]
                            ? 'bg-secondary-500 hover:bg-secondary-600'
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

        <div className="p-2 md:p-4 border-t bg-gray-50 flex justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm"
          >
            Cancel
          </button>
          <div className="flex gap-2 md:order-none w-full md:w-auto justify-center">
            <div className="flex bg-gray-100 rounded-md overflow-hidden">
              <button
                type="button"
                className={`p-2 md:p-3 flex items-center text-sm ${toolMode === 'brush'
                  ? 'bg-secondary-100 text-secondary-700'
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
                  ? 'bg-secondary-100 text-secondary-700'
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