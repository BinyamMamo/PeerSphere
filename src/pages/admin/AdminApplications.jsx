import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaGraduationCap,
  FaBook,
  FaSortUp,
  FaSortDown,
  FaSort
} from 'react-icons/fa';

const AdminApplications = () => {
  const { applications, students, updateApplicationStatus } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewApplication, setViewApplication] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Filter applications based on active tab and search query
  const filteredApplications = applications.filter(application => {
    // Filter by status
    if (activeTab !== 'all' && application.status.toLowerCase() !== activeTab) {
      return false;
    }

    // Apply search filter if provided
    if (searchQuery) {
      // Get student info
      const student = students.find(s => s.id === application.studentId) || {};
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const subjects = application.subjects?.join(' ').toLowerCase() || '';

      return fullName.includes(searchQuery.toLowerCase()) ||
        subjects.includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = sortConfig.key === 'academicStanding'
      ? parseFloat(a[sortConfig.key].replace('GPA: ', ''))
      : a[sortConfig.key];
    let bValue = sortConfig.key === 'academicStanding'
      ? parseFloat(b[sortConfig.key].replace('GPA: ', ''))
      : b[sortConfig.key];

    if (sortConfig.key === 'dateApplied') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1" size={14} />;
    }
    return sortConfig.direction === 'ascending' ?
      <FaSortUp className="inline ml-1" size={14} /> :
      <FaSortDown className="inline ml-1" size={14} />;
  };

  // Get student info by ID
  const getStudentInfo = (studentId) => {
    return students.find(student => student.id === studentId) || {
      firstName: 'Unknown',
      lastName: 'Student'
    };
  };

  // Tab component for cleaner rendering
  const Tab = ({ id, label, count }) => (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-md whitespace-nowrap transition-colors duration-200 ${activeTab === id
          ? 'bg-accent-100 text-accent-700'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
      onClick={() => setActiveTab(id)}
    >
      {label} {count > 0 && <span className="ml-1 text-xs">({count})</span>}
    </button>
  );

  // Handle application approval
  const handleApprove = (applicationId) => {
    updateApplicationStatus(applicationId, 'Approved');
    if (viewApplication?.id === applicationId) {
      setViewApplication(null);
    }
  };

  // Handle application rejection
  const handleReject = (applicationId) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      updateApplicationStatus(applicationId, 'Rejected');
      if (viewApplication?.id === applicationId) {
        setViewApplication(null);
      }
    }
  };

  // Count applications by status
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">Tutor Applications</h1>

      {/* Search & Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 flex flex-col gap-4">
        <div className="flex overflow-x-auto gap-2 sm:gap-3">
          <Tab id="pending" label="Pending" count={pendingCount} />
          <Tab id="approved" label="Approved" count={approvedCount} />
          <Tab id="rejected" label="Rejected" count={rejectedCount} />
          <Tab id="all" label="All" count={applications.length} />
        </div>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {sortedApplications.length > 0 ? (
          <>
            {/* Table Header - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-600">
              <div className="col-span-3">Applicant</div>
              <div className="col-span-3">Subjects</div>
              <div
                className="col-span-2 cursor-pointer flex items-baseline"
                onClick={() => handleSort('academicStanding')}
              >
                <span>Grade</span>
                {getSortIcon('academicStanding')}
              </div>
              <div
                className="col-span-2 cursor-pointer flex items-baseline"
                onClick={() => handleSort('dateApplied')}
              >
                <span>Date Applied</span>
                {getSortIcon('dateApplied')}
              </div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {sortedApplications.map(application => {
                const student = getStudentInfo(application.studentId);

                return (
                  <div
                    key={application.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Mobile View */}
                    <div className="block md:hidden">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <img
                            src={student.avatar || "https://i.pravatar.cc/150?img=1"}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                            loading="lazy"
                          />
                          <div>
                            <h3 className="font-medium text-base">{student.firstName} {student.lastName}</h3>
                            <p className="text-xs text-gray-500">Year {student.yearOfStudy}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${application.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {application.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">Subjects</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.subjects?.map((subject, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-accent-50 text-accent-700 rounded-md text-xs"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-12">
                          <div>
                            <h4 className="text-sm font-medium text-gray-600">Grade</h4>
                            <p className="text-sm">{application.academicStanding}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-600">Date Applied</h4>
                            <p className="text-sm text-gray-600">{application.dateApplied}</p>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setViewApplication(application)}
                            className="p-3 text-gray-500 hover:text-accent-600 rounded-full transition-colors duration-200"
                            title="View Application"
                          >
                            <FaEye size={18} />
                          </button>

                          {application.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(application.id)}
                                className="p-3 text-green-500 hover:text-green-600 rounded-full transition-colors duration-200"
                                title="Approve"
                              >
                                <FaCheck size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(application.id)}
                                className="p-3 text-red-500 hover:text-red-600 rounded-full transition-colors duration-200"
                                title="Reject"
                              >
                                <FaTimes size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 flex items-center">
                        <img
                          src={student.avatar || "https://i.pravatar.cc/150?img=1"}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          loading="lazy"
                        />
                        <div>
                          <h3 className="font-medium text-base">{student.firstName} {student.lastName}</h3>
                          <p className="text-xs text-gray-500">Year {student.yearOfStudy}</p>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="flex flex-wrap gap-1">
                          {application.subjects?.map((subject, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-accent-50 text-accent-700 rounded-md text-xs"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <span className="text-sm">{application.academicStanding}</span>
                      </div>

                      <div className="col-span-2 text-sm text-gray-600">
                        {application.dateApplied}
                      </div>

                      <div className="col-span-2 flex justify-end space-x-2">
                        <button
                          onClick={() => setViewApplication(application)}
                          className="p-3 text-gray-500 hover:text-accent-600 rounded-full transition-colors duration-200"
                          title="View Application"
                        >
                          <FaEye size={18} />
                        </button>

                        {application.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(application.id)}
                              className="p-3 text-green-500 hover:text-green-600 rounded-full transition-colors duration-200"
                              title="Approve"
                            >
                              <FaCheck size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(application.id)}
                              className="p-3 text-red-500 hover:text-red-600 rounded-full transition-colors duration-200"
                              title="Reject"
                            >
                              <FaTimes size={18} />
                            </button>
                          </>
                        )}

                        {application.status === 'Approved' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Approved
                          </span>
                        )}

                        {application.status === 'Rejected' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <p className="text-sm sm:text-base">No applications found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {viewApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Application Details</h2>
              <button
                onClick={() => setViewApplication(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Applicant details */}
            <div className="border-b pb-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                  <img
                    src={getStudentInfo(viewApplication.studentId).avatar || "https://i.pravatar.cc/150?img=1"}
                    alt={`${getStudentInfo(viewApplication.studentId).firstName} ${getStudentInfo(viewApplication.studentId).lastName}`}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="text-lg font-medium">
                      {getStudentInfo(viewApplication.studentId).firstName} {getStudentInfo(viewApplication.studentId).lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Year {getStudentInfo(viewApplication.studentId).yearOfStudy} Student</p>
                    <p className="text-xs text-gray-500">
                      Applied on: {viewApplication.dateApplied}
                    </p>
                  </div>
                </div>
                <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-medium ${viewApplication.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : viewApplication.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {viewApplication.status}
                </span>
              </div>
            </div>

            {/* Application details */}
            <div className="space-y-6 mb-6">
              <div>
                <h4 className="font-medium flex items-center mb-2 text-sm">
                  <FaBook className="text-accent-600 mr-2" size={16} />
                  Subjects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewApplication.subjects?.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent-50 text-accent-700 rounded-md text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium flex items-center mb-2 text-sm">
                  <FaFileAlt className="text-accent-600 mr-2" size={16} />
                  Resume
                </h4>
                <a
                  href={viewApplication.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-600 hover:underline text-sm"
                >
                  View Resume (PDF)
                </a>
              </div>

              <div>
                <h4 className="font-medium flex items-center mb-2 text-sm">
                  <FaGraduationCap className="text-accent-600 mr-2" size={16} />
                  Academic Standing
                </h4>
                <p className="text-sm text-gray-800">
                  {viewApplication.academicStanding}
                </p>
              </div>

              <div>
                <h4 className="font-medium flex items-center mb-2 text-sm">
                  <FaFileAlt className="text-accent-600 mr-2" size={16} />
                  Cover Letter
                </h4>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800">
                  {viewApplication.coverLetter}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {viewApplication.status === 'Pending' && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleReject(viewApplication.id)}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium transition-colors duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(viewApplication.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors duration-200"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;