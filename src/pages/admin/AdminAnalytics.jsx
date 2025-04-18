import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaChartBar,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaDownload,
  FaExpand,
  FaTimes,
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
  accent: '#6366F1',
  primary: '#3B82F6',
  secondary: '#14B8A6', // Changed from pink (#EC4899) to teal
  green: '#22C55E',
  yellow: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  teal: '#14B8A6', // Replaced pink (#DB2777) with teal
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
  tutorGrowth: [
    { period: 'Q1', count: 50 },
    { period: 'Q2', count: 75 },
    { period: 'Q3', count: 100 },
    { period: 'Q4', count: 125 },
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

// --- Main Admin Analytics Component ---
const AdminAnalytics = () => {
  const { analytics } = useContext(AppContext);
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
  const subjectPopularityData = data.subjectPopularity || [];
  const sessionsByLocationData = data.sessionsByLocation || [];
  const tutorPerformanceData = data.tutorPerformance || [];
  const tutorGrowthData = data.tutorGrowth || [];

  // Calculate Summary Stats
  const totalStudents = tutorGrowthData.reduce((max, item) => Math.max(max, Number(item.count) || 0), 0) || 0;
  const totalSessions = sessionsPerWeekData.reduce((sum, item) => sum + (Number(item.count) || 0), 0) || 0;
  const totalRevenue = revenueByMonthData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;
  const totalRatingsSum = tutorPerformanceData.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
  const averageRating = tutorPerformanceData.length > 0 ? (totalRatingsSum / tutorPerformanceData.length) : 0;

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

  // Revenue Trends (Area Chart using Line with fill)
  const revenueChartData = {
    labels: revenueByMonthData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue (AED)',
        data: revenueByMonthData.map(item => Number(item.amount) || 0),
        backgroundColor: `${colorMap.green}80`, // Semi-transparent fill
        borderColor: colorMap.green,
        borderWidth: 2,
        fill: true,
        tension: 0.3, // Smooth curve
      },
    ],
  };

  // Subject Popularity (Bar Chart)
  const subjectChartData = {
    labels: subjectPopularityData
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 8)
      .map(item => item.subject),
    datasets: [
      {
        label: 'Sessions',
        data: subjectPopularityData
          .sort((a, b) => b.sessions - a.sessions)
          .slice(0, 8)
          .map(item => Number(item.sessions) || 0),
        backgroundColor: colorMap.secondary,
        borderColor: colorMap.secondary,
        borderWidth: 1,
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
          colorMap.teal, // Replaced pink with teal
        ],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      },
    ],
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

  // Export Functionality
  const handleExport = () => {
    const dataToExport = [
      { metric: 'Total Students', value: totalStudents },
      { metric: 'Total Sessions', value: totalSessions },
      { metric: 'Average Rating', value: averageRating.toFixed(1) },
      { metric: 'Total Revenue (AED)', value: totalRevenue },
      ...subjectPopularityData.map(s => ({ metric: `Sessions - ${s.subject}`, value: s.sessions })),
    ];

    const header = ['Metric', 'Value'];
    const rows = dataToExport.map(item => [item.metric, item.value]);
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_report_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
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
          <button
            onClick={handleExport}
            className="bg-accent-600 hover:bg-accent-700 text-white rounded-md px-4 py-2 flex items-center transition-colors duration-200"
            title="Download analytics summary as CSV"
          >
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-700 mr-4">
              <FaUsers size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h3 className="text-xl font-bold text-gray-800">{totalStudents}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-700 mr-4">
              <FaCalendarAlt size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <h3 className="text-xl font-bold text-gray-800">{totalSessions}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-700 mr-4">
              <FaChartLine size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Rating</p>
              <h3 className="text-xl font-bold text-gray-800">
                {averageRating.toFixed(1)} / 5.0
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
              <FaMoneyBillWave size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-xl font-bold text-gray-800">
                {totalRevenue.toLocaleString()} AED
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden relative">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Sessions Over Time</h2>
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
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden relative">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Revenue Trends</h2>
            <button
              onClick={() =>
                openFullScreen('revenue', 'Revenue Trends', revenueChartData, chartOptions, Line)
              }
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="View Full Screen"
            >
              <FaExpand size={16} />
            </button>
          </div>
          <div className="p-4 h-[350px]">
            {revenueByMonthData.length > 0 ? (
              <Line data={revenueChartData} options={chartOptions} />
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden relative">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Subject Popularity</h2>
            <button
              onClick={() =>
                openFullScreen('subject', 'Subject Popularity', subjectChartData, chartOptions, Bar)
              }
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="View Full Screen"
            >
              <FaExpand size={16} />
            </button>
          </div>
          <div className="p-4 h-[350px]">
            {subjectPopularityData.length > 0 ? (
              <Bar data={subjectChartData} options={chartOptions} />
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden relative">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Sessions by Location</h2>
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

      {/* Tutor Performance Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Top Tutor Performance</h2>
        </div>
        <div className="p-0 md:p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Performance Indicator
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tutorPerformanceData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No tutor data available
                    </td>
                  </tr>
                ) : (
                  tutorPerformanceData
                    .sort((a, b) => b.rating - a.rating || b.sessions - a.sessions)
                    .slice(0, 5)
                    .map((tutor) => (
                      <tr key={tutor.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tutor.name || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`h-4 w-4 ${star <= (Number(tutor.rating) || 0)
                                      ? 'fill-current'
                                      : 'text-gray-300 fill-current'
                                    }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {(Number(tutor.rating) || 0).toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{Number(tutor.sessions) || 0}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                          {tutorPerformanceData.length > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${((Number(tutor.sessions) || 0) /
                                      Math.max(
                                        1,
                                        ...tutorPerformanceData
                                          .slice(0, 5)
                                          .map((t) => Number(t.sessions) || 0)
                                      )) *
                                    100
                                    }%`,
                                }}
                                title={`Sessions: ${Number(tutor.sessions) || 0}`}
                              ></div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;