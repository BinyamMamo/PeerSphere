import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  FaChartBar,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaDownload
} from 'react-icons/fa';

// Simple bar chart component
const BarChart = ({ data, xKey, yKey, title, color = 'accent' }) => {
  const maxValue = Math.max(...data.map(item => item[yKey])) * 1.2;

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="h-60 relative">
        <div className="absolute inset-0 flex items-end">
          {data.map((item, index) => {
            const height = (item[yKey] / maxValue) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-2/3 bg-${color}-500 rounded-t relative group`}
                  style={{ height: `${height}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {item[yKey]}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-1 truncate w-full text-center">
                  {item[xKey]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Simple line chart component
const LineChart = ({ data, xKey, yKey, title, color = 'accent' }) => {
  const maxValue = Math.max(...data.map(item => item[yKey])) * 1.2;
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item[yKey] / maxValue) * 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="h-60 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={`var(--color-${color}-500)`}
            strokeWidth="2"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item[yKey] / maxValue) * 100);
            return (
              <g key={index} className="group">
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill={`var(--color-${color}-500)`}
                />
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="8"
                  className="opacity-0 group-hover:opacity-100"
                >
                  {item[yKey]}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <div key={index} className="text-xs text-gray-600 w-full text-center">
              {item[xKey]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Doughnut chart component
const DoughnutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercent = 0;

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="flex justify-center mb-4">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const percent = (item.count / total) * 100;
              const startPercent = cumulativePercent;
              cumulativePercent += percent;

              const startX = 50 + 40 * Math.cos(2 * Math.PI * startPercent / 100);
              const startY = 50 + 40 * Math.sin(2 * Math.PI * startPercent / 100);
              const endX = 50 + 40 * Math.cos(2 * Math.PI * cumulativePercent / 100);
              const endY = 50 + 40 * Math.sin(2 * Math.PI * cumulativePercent / 100);

              const largeArcFlag = percent > 50 ? 1 : 0;
              const pathData = [
                `M 50 50`,
                `L ${startX} ${startY}`,
                `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `Z`
              ].join(' ');

              const colors = ['accent', 'primary', 'secondary', 'green', 'yellow', 'red'];
              const color = colors[index % colors.length];

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={`var(--color-${color}-500)`}
                  stroke="white"
                  strokeWidth="1"
                  className="transition-opacity duration-200 hover:opacity-80"
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {data.map((item, index) => {
          const colors = ['accent', 'primary', 'secondary', 'green', 'yellow', 'red'];
          const color = colors[index % colors.length];
          const percent = Math.round((item.count / total) * 100);

          return (
            <div key={index} className="flex items-center">
              <div
                className={`w-3 h-3 bg-${color}-500 mr-2 rounded-sm`}
              ></div>
              <span className="text-sm">
                {item.location}: {percent}% ({item.count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const { analytics } = useContext(AppContext);
  const [timePeriod, setTimePeriod] = useState('all'); // 'all', 'month', 'week'

  // For an MVP, we'll just use the mock analytics data

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

        <div className="flex space-x-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
          </select>

          <button className="bg-accent-600 hover:bg-accent-700 text-white rounded-md px-4 py-2 flex items-center">
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaUsers />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h3 className="text-xl font-bold">{analytics.tutorGrowth?.reduce((max, item) => Math.max(max, item.count), 0) || 50}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <h3 className="text-xl font-bold">{analytics.sessionsPerWeek?.reduce((sum, item) => sum + item.count, 0) || 125}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaChartLine />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Rating</p>
              <h3 className="text-xl font-bold">
                {(analytics.tutorPerformance?.reduce((sum, item) => sum + item.rating, 0) / analytics.tutorPerformance?.length || 4.7).toFixed(1)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 mr-4">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-xl font-bold">
                {analytics.revenueByMonth?.reduce((sum, item) => sum + item.amount, 0) || 80100} AED
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Sessions Over Time</h2>
          </div>
          <BarChart
            data={analytics.sessionsPerWeek}
            xKey="week"
            yKey="count"
            title="Sessions per Week"
            color="primary"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Revenue Trends</h2>
          </div>
          <LineChart
            data={analytics.revenueByMonth}
            xKey="month"
            yKey="amount"
            title="Monthly Revenue (AED)"
            color="green"
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Subject Popularity</h2>
          </div>
          <BarChart
            data={analytics.subjectPopularity.slice(0, 8)}
            xKey="subject"
            yKey="sessions"
            title="Sessions by Subject"
            color="secondary"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Sessions by Location</h2>
          </div>
          <DoughnutChart
            data={analytics.sessionsByLocation}
            title="Distribution by Location"
          />
        </div>
      </div>

      {/* Tutor Performance */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Top Tutor Performance</h2>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.tutorPerformance?.slice(0, 5).map((tutor) => (
                  <tr key={tutor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tutor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${star <= tutor.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{tutor.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tutor.sessions}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(tutor.sessions / Math.max(...analytics.tutorPerformance.map(t => t.sessions))) * 100}%`
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
