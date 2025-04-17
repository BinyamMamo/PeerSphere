import React from 'react';

const FilterTag = ({ label, isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-2xl text-xs transition-colors line-clamp-2 ${isActive
        ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
    >
      {children || label}
    </button>
  );
};

export default FilterTag;
