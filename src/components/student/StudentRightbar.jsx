import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaCalendarAlt, FaArrowRight, FaChalkboardTeacher, FaCalendarPlus, FaCaretUp } from 'react-icons/fa';
import AccountStatusIndicator from '../shared/AccountStatusIndicator';
import { MdOpenInFull, MdOpenInNew, MdOutlineOpenInBrowser, MdOutlineReadMore } from 'react-icons/md';
import { IoExpandSharp } from 'react-icons/io5';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { RiExpandLeftFill, RiExpandRightLine } from 'react-icons/ri';

const StudentRightbar = () => {
  const { currentUser } = useContext(AppContext);

  // Get upcoming sessions (first 3)
  const { sessions } = useContext(AppContext);
  const upcomingSessions = sessions
    .filter(session =>
      session.studentId === currentUser?.id &&
      session.status === 'Upcoming'
    )
    .slice(0, 3);

  return (
    <div className="h-full w-80 bg-transparent shadow-none flex flex-col p-4 overflow-auto">
      {/* Profile Section with Account Status */}
      <div className="flex flex-col mb-6 mt-3.5">
        <div className="flex items-center">
          <img
            src={currentUser?.avatar || "https://i.pravatar.cc/150?img=4"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3 flex-grow space-y-1">
            <h2 className="font-medium pl-1">{currentUser?.firstName || 'Student'} {currentUser?.lastName || ''} </h2>
            <div className="flex items-end justify-between mt-0.5">
              <AccountStatusIndicator />
              {/* <p className="text-sm text-gray-500">Year {currentUser?.yearOfStudy || '1'}</p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 space-y-2.5">
        <Link
          to="/book-session"
          className="flex items-center justify-center w-full bg-primary-600 text-white rounded-lg py-3 px-4 font-medium text-center mb-3 hover:bg-primary-700  hover:shadow transition ease-in-out"
        >
          <FaCalendarPlus className="mr-2" />
          <span className="">
            Book a Session
          </span>
        </Link>
        <Link
          to="/student/apply-tutor"
          className="flex items-center justify-center w-full bg-white border border-primary-600 text-primary-600 rounded-lg py-3 px-4 font-medium text-center hover:shadow transition ease-in-out"
        >
          <FaChalkboardTeacher className="mr-2 text-sm" />
          <span className="">
            Become a Tutor
          </span>
        </Link>
      </div>

      {/* Upcoming Sessions */}
      <div className="mb-6">
        <div className='flex mb-2 items-center justify-between'>
          <Link to="/student/sessions" className="font-medium flex items-center">
          <FaCalendarAlt className="mr-2 text-primary-600" />
          Upcoming Sessions
          </Link>
          <Link to="/student/sessions" className="text-xs text-primary-600 font-medium flex items-center">
            {/* View all sessions */}
            {/* View all */}
            <RiExpandRightLine className="ml-1 text-sm active:animate-ping" />
          </Link>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map(session => (
              <div key={session.id} className="bg-primary-100/45 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium mb-1.5">{session.subject}</h4>
                    <p className="text-sm text-gray-600">{session.date}, {session.startTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No upcoming sessions</p>
        )}
      </div>

      {/* Mini Calendar */}
      <div>
        <div className='flex mb-2 items-center justify-between'>
          <h3 className="font-medium flex items-center">
          <FaCalendarAlt className="mr-2 text-primary-600" />
          Calendar
        </h3>
          <Link to="/student/calendar" className="text-xs text-primary-600 font-medium flex items-center">
            <RiExpandRightLine className="ml-1 text-sm active:animate-ping" />
          </Link>
        </div>

        <div className="bg-primary-50/55 p-3 rounded-lg">
          <div className="text-center mb-2">
            <p className="font-medium">April 2025</p>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>

            <div className="text-gray-400">30</div>
            <div className="text-gray-400">31</div>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>

            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
            <div>11</div>
            <div>12</div>

            <div>13</div>
            <div>14</div>
            <div>15</div>
            <div>16</div>
            <div className="bg-primary-100 text-primary-700 rounded-full">17</div>
            <div>18</div>
            <div>19</div>

            <div>20</div>
            <div>21</div>
            <div>22</div>
            <div>23</div>
            <div>24</div>
            <div>25</div>
            <div>26</div>

            <div>27</div>
            <div>28</div>
            <div>29</div>
            <div>30</div>
            <div className="text-gray-400">1</div>
            <div className="text-gray-400">2</div>
            <div className="text-gray-400">3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRightbar;
