import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import FilterTag from './FilterTag';

const CollapsibleFilterTags = ({
  title,
  options,
  selectedValue,
  onSelect,
  allLabel = "All"
}) => {
  const [expanded, setExpanded] = useState(false);

  // Always show the first few items plus selected one if not in first few
  const initialDisplayCount = 3;
  const initialItems = options.slice(0, initialDisplayCount);

  // If the selected item is not in the initial items, add it
  if (selectedValue && !initialItems.includes(selectedValue) && options.includes(selectedValue)) {
    initialItems.push(selectedValue);
  }

  const hasMoreItems = options.length > initialDisplayCount;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="flex items-center">
          {selectedValue && (
            <button
              className="text-xs text-primary-600 hover:text-primary-800 mr-2"
              onClick={() => onSelect('')}
            >
              Clear
            </button>
          )}

          {hasMoreItems && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterTag
          isActive={!selectedValue}
          onClick={() => onSelect('')}
        >
          {allLabel}
        </FilterTag>

        {/* Display initial items or all items if expanded */}
        {(expanded ? options : initialItems).map((option, index) => (
          <FilterTag
            key={index}
            isActive={selectedValue === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </FilterTag>
        ))}

        {/* Show "more" indicator if not expanded and has more items */}
        {!expanded && hasMoreItems && options.length > initialItems.length && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-primary-600 hover:text-primary-800 py-1.5 px-3"
          >
            +{options.length - initialItems.length} more
          </button>
        )}
      </div>
    </div>
  );
};

export default CollapsibleFilterTags;
