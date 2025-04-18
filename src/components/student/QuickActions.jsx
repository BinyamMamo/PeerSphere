// Improved Quick Actions Component for Student Rightbar
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarPlus, FaChalkboardTeacher, FaChevronRight, FaGraduationCap } from 'react-icons/fa';

const QuickActions = () => {
  return (
    <div className="mb-6 space-y-4">
      {/* Main Call-to-Action */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-1">Need help with a course?</h3>
        <p className="text-sm text-white/90 mb-3">Find the perfect tutor for your subject</p>
        <Link
          to="/student/book"
          className="flex items-center justify-between w-full bg-white text-primary-700 rounded-lg py-2.5 px-4 font-medium text-center hover:bg-gray-100 transition shadow-sm"
        >
          <span className="flex items-center">
            <FaCalendarPlus className="mr-2" />
            Book a Session
          </span>
          <FaChevronRight size={14} />
        </Link>
      </div>

      {/* Secondary Action */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <h3 className="font-semibold mb-1">Share your knowledge</h3>
        <p className="text-sm text-gray-600 mb-3">Help other students and earn</p>
        <Link
          to="/student/apply-tutor"
          className="flex items-center justify-between w-full bg-white border border-primary-600 text-primary-600 rounded-lg py-2.5 px-4 font-medium text-center hover:bg-primary-50 transition shadow-sm"
        >
          <span className="flex items-center">
            <FaChalkboardTeacher className="mr-2" />
            Become a Tutor
          </span>
          <FaChevronRight size={14} />
        </Link>
      </div>

      {/* Alternative Card Design (can be toggled with the hidden class) */}
      <div className="hidden bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg overflow-hidden shadow-md">
        <div className="p-5 flex flex-col h-full">
          <FaGraduationCap className="text-white/80 text-2xl mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Boost Your Grades</h3>
          <p className="text-white/90 text-sm mb-4">Connect with top peer tutors who understand your courses</p>
          <Link
            to="/student/book"
            className="mt-auto flex items-center justify-center bg-white/90 text-primary-700 px-4 py-2.5 rounded-lg font-medium hover:bg-white transition-colors"
          >
            Find Tutors <FaChevronRight className="ml-2" size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;