import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaClipboardList,
  FaChartBar,
  FaExpand,
  FaTimes,
  FaTrophy,
  FaGraduationCap,
} from 'react-icons/fa';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

// --- Helper: Color Mapping ---
const colorMap = {
  accent: '#6366F1', // Indigo for Revenue Overview
  primary: '#3B82F6', // Blue for Sessions Over Time
  secondary: '#14B8A6', // Teal for Subject Popularity
  green: '#22C55E', // Green for Revenue Trends
  yellow: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6', // Purple for Popular Subjects
  teal: '#14B8A6', // Teal, no pink
};

// --- Sample Data for Fallback ---
const sampleData = {
  sessionsPerWeek: [
    { week: 'Week 1', count: 100 },
    { week: 'Week 2', count: 130 },
    { week: 'Week 3', count: 160 },
    { week: 'Week 4', count: 180 },
    { week: 'Week 5', count: 150 },
    { week: 'Week 6', count: 170 },
    { week: 'Week 7', count: 190 },
    { week: 'Week 8', count: 210 },
    { week: 'Week 9', count: 200 },
    { week: 'Week 10', count: 220 },
  ],
  revenueByMonth: [
    { month: 'Jan', amount: 12000 },
    { month: 'Feb', amount: 15000 },
    { month: 'Mar', amount: 18000 },
    { month: 'Apr', amount: 20000 },
    { month: 'May', amount: 22000 },
    { month: 'Jun', amount: 25000 },
    { month: 'Jul', amount: 27000 },
    { month: 'Aug', amount: 26000 },
    { month: 'Sep', amount: 28000 },
    { month: 'Oct', amount: 30000 },
  ],
  subjectPopularity: [
    { subject: 'Mathematics', sessions: 350 },
    { subject: 'Science', sessions: 300 },
    { subject: 'English', sessions: 250 },
    { subject: 'History', sessions: 200 },
    { subject: 'Physics', sessions: 180 },
    { subject: 'Chemistry', sessions: 160 },
    { subject: 'Biology', sessions: 140 },
    { subject: 'Computer Science', sessions: 120 },
    { subject: 'Geography', sessions: 100 },
    { subject: 'Economics', sessions: 80 },
  ],
  sessionsByLocation: [
    { location: 'Dubai', count: 400 },
    { location: 'Abu Dhabi', count: 300 },
    { location: 'Sharjah', count: 200 },
    { location: 'Ajman', count: 100 },
  ],
  tutorPerformance: [
    { id: 1, name: 'John Doe', rating: 4.8, sessions: 50 },
    { id: 2, name: 'Jane Smith', rating: 4.6, sessions: 45 },
    { id: 3, name: 'Mike Brown', rating: 4.9, sessions: 60 },
    { id: 4, name: 'Sara Lee', rating: 4.7, sessions: 40 },
    { id: 5, name: 'Alex Kim', rating: 4.5, sessions: 35 },
  ],
};

// --- Full-Screen Chart Modal Component ---
const FullScreenChartModal = ({ isOpen, onClose, title, chartData, chartOptions, ChartComponent, isDoughnut }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="h-[calc(80vh-80px)]">
          {isDoughnut ? (
            <div className="w-full max-w-[500px] mx-auto h-full">
              <ChartComponent data={chartData} options={chartOptions} />
            </div>
          ) : (
            <ChartComponent data={chartData} options={chartOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const { tutors, students, sessions, applications, analytics } = useContext(AppContext);
  const [timePeriod, setTimePeriod] = useState('all');
  const [fullScreenChart, setFullScreenChart] = useState(null);

  // Use sample data if analytics is empty
  const data = analytics && Object.keys(analytics).length > 0 ? analytics : sampleData;

  // Filter data based on time period
  const filterDataByPeriod = (data, period) => {
    if (period === 'all') return data;
    if (!data) return [];
    if (period === 'week') {
      return data.slice(-4); // Last 4 weeks
    } else if (period === 'month') {
      return data.slice(-3); // Last 3 months
    }
    return data;
  };

  const sessionsPerWeekData = filterDataByPeriod(data.sessionsPerWeek, timePeriod);
  const revenueByMonthData = filterDataByPeriod(data.revenueByMonth, timePeriod);
  const sessionsByLocationData = data.sessionsByLocation || [];
  const tutorPerformanceData = data.tutorPerformance || [];

  // Calculate key metrics
  const totalStudents = students.length;
  const totalTutors = tutors.length;
  const totalSessions = sessions.length;
  const pendingApplications = applications.filter(app => app.status === 'Pending').length;
  const completedSessions = sessions.filter(session => session.status === 'Completed').length;
  const totalRevenue = sessions.reduce((sum, session) => sum + (session.amount || 0), 0);

  // Chart.js Configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#e5e7eb' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Revenue Overview (Line Chart, no fill)
  const revenueOverviewChartData = {
    labels: revenueByMonthData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue (AED)',
        data: revenueByMonthData.map(item => Number(item.amount) || 0),
        backgroundColor: colorMap.accent,
        borderColor: colorMap.accent,
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  // Sessions Over Time (Bar Chart)
  const sessionsChartData = {
    labels: sessionsPerWeekData.map(item => item.week),
    datasets: [
      {
        label: 'Sessions',
        data: sessionsPerWeekData.map(item => Number(item.count) || 0),
        backgroundColor: colorMap.primary,
        borderColor: colorMap.primary,
        borderWidth: 1,
      },
    ],
  };

  // Payment Summary (Area Chart using Line with fill)
  const paymentChartData = {
    labels: revenueByMonthData.map(item => item.month),
    datasets: [
      {
        label: 'Tutor Payments (AED)',
        data: revenueByMonthData.map(item => Number(item.amount) || 0),
        backgroundColor: `${colorMap.green}80`, // Semi-transparent fill
        borderColor: colorMap.green,
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Sessions by Location (Doughnut Chart)
  const locationChartData = {
    labels: sessionsByLocationData.map(item => item.location),
    datasets: [
      {
        label: 'Sessions',
        data: sessionsByLocationData.map(item => Number(item.count) || 0),
        backgroundColor: [
          colorMap.accent,
          colorMap.primary,
          colorMap.secondary,
          colorMap.green,
          colorMap.yellow,
          colorMap.red,
          colorMap.purple,
          colorMap.teal,
        ],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  // Top Tutor Performance
  const tutorPerformanceChartData = {
    labels: tutorPerformanceData
      .sort((a, b) => b.rating - a.rating || b.sessions - a.sessions)
      .slice(0, 5)
      .map(item => item.name),
    datasets: [
      {
        label: 'Rating',
        data: tutorPerformanceData
          .sort((a, b) => b.rating - a.rating || b.sessions - a.sessions)
          .slice(0, 5)
          .map(item => Number(item.rating) || 0),
        backgroundColor: colorMap.yellow,
        borderColor: colorMap.yellow,
        borderWidth: 1,
      },
      {
        label: 'Sessions',
        data: tutorPerformanceData
          .sort((a, b) => b.rating - a.rating || b.sessions - a.sessions)
          .slice(0, 5)
          .map(item => Number(item.sessions) / 10 || 0), // Scaled for visualization
        backgroundColor: colorMap.purple,
        borderColor: colorMap.purple,
        borderWidth: 1,
      },
    ],
  };

  // Handle Full-Screen Toggle
  const openFullScreen = (chartId, title, chartData, chartOptions, ChartComponent, isDoughnut = false) => {
    setFullScreenChart({ chartId, title, chartData, chartOptions, ChartComponent, isDoughnut });
  };

  const closeFullScreen = () => {
    setFullScreenChart(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Full-Screen Modal */}
      {fullScreenChart && (
        <FullScreenChartModal
          isOpen={!!fullScreenChart}
          onClose={closeFullScreen}
          title={fullScreenChart.title}
          chartData={fullScreenChart.chartData}
          chartOptions={fullScreenChart.chartOptions}
          ChartComponent={fullScreenChart.ChartComponent}
          isDoughnut={fullScreenChart.isDoughnut}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Time Period Filter */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setTimePeriod('week')}
            className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${timePeriod === 'week' ? 'bg-accent-600 text-white hover:bg-accent-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setTimePeriod('month')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-300 focus:z-10 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${timePeriod === 'month' ? 'bg-accent-600 text-white hover:bg-accent-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setTimePeriod('all')}
            className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-md focus:z-10 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${timePeriod === 'all' ? 'bg-accent-600 text-white hover:bg-accent-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaUserGraduate />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h3 className="text-xl font-bold">{totalStudents}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaChalkboardTeacher />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tutors</p>
              <h3 className="text-xl font-bold">{totalTutors}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaCalendarCheck />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <h3 className="text-xl font-bold">{totalSessions}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue and Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden relative">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Tutor Payment Summary</h2>
            <button
              onClick={() =>
                openFullScreen('revenue', 'Tutor Payment Summary', paymentChartData, chartOptions, Line)
              }
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="View Full Screen"
            >
              <FaExpand size={16} />
            </button>
          </div>
          <div className="p-4 h-[350px]">
            {revenueByMonthData.length > 0 ? (
              <Line data={paymentChartData} options={chartOptions} />
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Pending Applications</h2>
            <Link
              to="/admin/applications"
              className="text-sm text-accent-600 hover:text-accent-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y">
            {applications.filter(app => app.status === 'Pending').slice(0, 4).map(application => {
              const student = students.find(s => s.id === application.studentId) || {};

              return (
                <div key={application.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{student.firstName} {student.lastName}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {application.subjects?.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Applied: {application.dateApplied}
                      </div>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {applications.filter(app => app.status === 'Pending').length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No pending applications</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden relative">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Sessions Over Time</h2>
            <button
              onClick={() =>
                openFullScreen('sessions', 'Sessions Over Time', sessionsChartData, chartOptions, Bar)
              }
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="View Full Screen"
            >
              <FaExpand size={16} />
            </button>
          </div>
          <div className="p-4 h-[350px]">
            {sessionsPerWeekData.length > 0 ? (
              <Bar data={sessionsChartData} options={chartOptions} />
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden relative">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Sessions by Location</h2>
            <button
              onClick={() =>
                openFullScreen(
                  'location',
                  'Sessions by Location',
                  locationChartData,
                  doughnutOptions,
                  Doughnut,
                  true
                )
              }
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="View Full Screen"
            >
              <FaExpand size={16} />
            </button>
          </div>
          <div className="p-4 h-[350px] flex justify-center">
            {sessionsByLocationData.length > 0 ? (
              <div className="w-full max-w-[300px]">
                <Doughnut data={locationChartData} options={doughnutOptions} />
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Tutor Performance List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Top Tutor Performance</h2>
            <Link
              to="/admin/tutors"
              className="text-sm text-accent-600 hover:text-accent-800"
            >
              View All
            </Link>
          </div>
          <div className="overflow-y-auto">
            {tutorPerformanceData.length > 0 ? (
              <div className="divide-y">
                {tutorPerformanceData
                  .sort((a, b) => b.rating - a.rating || b.sessions - a.sessions)
                  .slice(0, 6)
                  .map(tutor => (
                    <div key={tutor.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-yellow-100 text-yellow-800 mr-3">
                            <FaTrophy size={16} />
                          </div>
                          <div>
                            <h3 className="font-medium">{tutor.name}</h3>
                            <div className="flex items-center mt-1">
                              <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`h-4 w-4 ${star <= Math.floor(tutor.rating) ? 'fill-current' : 'text-gray-300'}`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="ml-1 text-sm text-gray-600">{tutor.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium">{tutor.sessions} sessions</span>
                          <div className="mt-2 w-20 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-300 h-1.5 rounded-full"
                              style={{
                                width: `${(tutor.sessions / Math.max(...tutorPerformanceData.map(t => t.sessions))) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No tutor performance data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Recent Sessions</h2>
            <Link
              to="/admin/sessions"
              className="text-sm text-accent-600 hover:text-accent-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y">
            {sessions.slice(0, 5).map(session => {
              const student = students.find(s => s.id === session.studentId) || {};
              const tutor = tutors.find(t => t.id === session.tutorId) || {};

              return (
                <div key={session.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{session.subject}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {student.firstName} {student.lastName} • {tutor.firstName} {tutor.lastName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {session.date}, {session.startTime}
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${session.status === 'Upcoming'
                        ? 'bg-green-100 text-green-800'
                        : session.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Quick Actions</h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/applications"
            className="block p-4 border rounded-lg hover:border-accent-400 hover:bg-accent-50"
          >
            <div className="flex">
              <div className="p-2 rounded-md bg-accent-100 text-accent-800">
                <FaClipboardList />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Review Applications</h3>
                <p className="text-sm text-gray-600">
                  {pendingApplications} pending {pendingApplications === 1 ? 'application' : 'applications'}
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/sessions"
            className="block p-4 border rounded-lg hover:border-accent-400 hover:bg-accent-50"
          >
            <div className="flex">
              <div className="p-2 rounded-md bg-accent-100 text-accent-800">
                <FaCalendarCheck />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Manage Sessions</h3>
                <p className="text-sm text-gray-600">View and manage all sessions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="block p-4 border rounded-lg hover:border-accent-400 hover:bg-accent-50"
          >
            <div className="flex">
              <div className="p-2 rounded-md bg-accent-100 text-accent-800">
                <FaChartBar />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">View Analytics</h3>
                <p className="text-sm text-gray-600">Detailed performance reports</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;