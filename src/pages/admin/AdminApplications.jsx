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
  FaMoneyBillWave,
  FaBook
} from 'react-icons/fa';

const AdminApplications = () => {
  const { applications, students, updateApplicationStatus } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewApplication, setViewApplication] = useState(null);

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
      className={`px-4 py-2 font-medium text-sm rounded-md ${activeTab === id
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

    // Close modal if open
    if (viewApplication?.id === applicationId) {
      setViewApplication(null);
    }
  };

  // Handle application rejection
  const handleReject = (applicationId) => {
    updateApplicationStatus(applicationId, 'Rejected');

    // Close modal if open
    if (viewApplication?.id === applicationId) {
      setViewApplication(null);
    }
  };

  // Count applications by status
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tutor Applications</h1>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center mb-4">
          <div className="flex items-center mr-4 w-full md:w-auto mb-2 md:mb-0">
            <div className="relative flex-grow">
              <input
                type="text"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <FaFilter className="text-accent-600 mr-2" />
            <h2 className="font-medium">Status Filter</h2>
          </div>
        </div>

        <div className="flex space-x-2">
          <Tab id="pending" label="Pending" count={pendingCount} />
          <Tab id="approved" label="Approved" count={approvedCount} />
          <Tab id="rejected" label="Rejected" count={rejectedCount} />
          <Tab id="all" label="All" count={applications.length} />
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredApplications.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-600">
              <div className="col-span-3">Applicant</div>
              <div className="col-span-3">Subjects</div>
              <div className="col-span-2">Proposed Rate</div>
              <div className="col-span-2">Date Applied</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {filteredApplications.map(application => {
                const student = getStudentInfo(application.studentId);

                return (
                  <div
                    key={application.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
                  >
                    <div className="col-span-3 flex items-center">
                      <img
                        src={student.avatar || "https://i.pravatar.cc/150?img=1"}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-medium">{student.firstName} {student.lastName}</h3>
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
                      <span className="font-medium">{application.proposedRate} AED</span>
                      <span className="text-xs text-gray-500">/hour</span>
                    </div>

                    <div className="col-span-2 text-sm text-gray-600">
                      {application.dateApplied}
                    </div>

                    <div className="col-span-2 flex justify-end space-x-2">
                      <button
                        onClick={() => setViewApplication(application)}
                        className="p-2 text-gray-500 hover:text-accent-600 rounded"
                        title="View Application"
                      >
                        <FaEye />
                      </button>

                      {application.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(application.id)}
                            className="p-2 text-green-500 hover:text-green-600 rounded"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>

                          <button
                            onClick={() => handleReject(application.id)}
                            className="p-2 text-red-500 hover:text-red-600 rounded"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}

                      {application.status === 'Approved' && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Approved
                        </span>
                      )}

                      {application.status === 'Rejected' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No applications found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {viewApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Application Details
              </h2>
              <button
                onClick={() => setViewApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            {/* Applicant details */}
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center">
                <img
                  src={getStudentInfo(viewApplication.studentId).avatar || "https://i.pravatar.cc/150?img=1"}
                  alt={`${getStudentInfo(viewApplication.studentId).firstName} ${getStudentInfo(viewApplication.studentId).lastName}`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-medium">
                    {getStudentInfo(viewApplication.studentId).firstName} {getStudentInfo(viewApplication.studentId).lastName}
                  </h3>
                  <p className="text-gray-600">Year {getStudentInfo(viewApplication.studentId).yearOfStudy} Student</p>
                  <p className="text-sm text-gray-500">
                    Applied on: {viewApplication.dateApplied}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className={`px-3 py-1 rounded-full text-sm ${viewApplication.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : viewApplication.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {viewApplication.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Application details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <FaBook className="text-accent-600 mr-2" />
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
                <h4 className="font-medium flex items-center mb-2">
                  <FaMoneyBillWave className="text-accent-600 mr-2" />
                  Proposed Rate
                </h4>
                <p className="text-2xl font-bold text-gray-800">
                  {viewApplication.proposedRate} <span className="text-sm font-normal text-gray-500">AED/hour</span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium flex items-center mb-2">
                <FaGraduationCap className="text-accent-600 mr-2" />
                Academic Standing
              </h4>
              <p className="text-gray-800">
                {viewApplication.academicStanding}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium flex items-center mb-2">
                <FaFileAlt className="text-accent-600 mr-2" />
                Cover Letter
              </h4>
              <div className="p-4 bg-gray-50 rounded-lg text-gray-800">
                {viewApplication.coverLetter}
              </div>
            </div>

            {/* Action buttons */}
            {viewApplication.status === 'Pending' && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleReject(viewApplication.id)}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(viewApplication.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
