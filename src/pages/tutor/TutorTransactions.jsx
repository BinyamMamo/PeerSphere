import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { FaCalendarAlt, FaMoneyBillWave, FaDownload, FaFilter } from 'react-icons/fa';

const TutorTransactions = () => {
  const { getUserSessions } = useContext(AppContext);
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'month', 'week'

  // Get completed tutor sessions
  const completedSessions = getUserSessions().filter(session =>
    session.status === 'Completed'
  );

  // Apply date filter to transactions
  const filteredTransactions = useMemo(() => {
    if (filterPeriod === 'all') return completedSessions;

    const today = new Date();
    const startDate = new Date();

    if (filterPeriod === 'month') {
      startDate.setMonth(today.getMonth() - 1);
    } else if (filterPeriod === 'week') {
      startDate.setDate(today.getDate() - 7);
    }

    return completedSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= today;
    });
  }, [completedSessions, filterPeriod]);

  // Calculate total earnings
  const totalEarnings = filteredTransactions.reduce(
    (sum, session) => sum + session.amount,
    0
  );

  // Group transactions by month
  const transactionsByMonth = useMemo(() => {
    const grouped = {};

    filteredTransactions.forEach(session => {
      const date = new Date(session.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(session);
    });

    // Convert to array and sort by date (descending)
    return Object.entries(grouped)
      .map(([monthYear, sessions]) => ({
        monthYear,
        month: new Date(monthYear + '-01').toLocaleString('default', { month: 'long' }),
        year: new Date(monthYear + '-01').getFullYear(),
        sessions,
        total: sessions.reduce((sum, session) => sum + session.amount, 0)
      }))
      .sort((a, b) => new Date(b.monthYear) - new Date(a.monthYear));
  }, [filteredTransactions]);

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-6">Earnings & Transactions</h1>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-lg font-medium">Total Earnings</h2>
            <div className="text-3xl font-bold mt-2">{totalEarnings} AED</div>
            <p className="text-sm text-gray-500 mt-1">
              {filteredTransactions.length} completed {filteredTransactions.length === 1 ? 'session' : 'sessions'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-end gap-4">
            <div className="w-full sm:w-auto">
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
                Filter Period
              </label>
              <div className="relative">
                <select
                  id="period"
                  className="w-full sm:w-auto pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="month">Last Month</option>
                  <option value="week">Last Week</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
              </div>
            </div>

            <button className="w-full sm:w-auto mt-2 sm:mt-0 bg-secondary-600 hover:bg-secondary-700 text-white rounded-md px-4 py-2 flex items-center justify-center">
              <FaDownload className="mr-2 flex-shrink-0" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="space-y-6">
        {transactionsByMonth.length > 0 ? (
          transactionsByMonth.map(monthData => (
            <div key={monthData.monthYear} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Month header */}
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <h3 className="font-medium">
                  {monthData.month} {monthData.year}
                </h3>
                <div className="font-medium">{monthData.total} AED</div>
              </div>

              {/* Transaction list */}
              <div className="divide-y">
                {monthData.sessions.map(session => (
                  <div key={session.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <h4 className="font-medium">{session.subject}</h4>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <FaCalendarAlt className="mr-1 text-gray-400 flex-shrink-0" />
                        <span>{session.date}, {session.startTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center self-end sm:self-auto">
                      <div className="mr-4 text-right">
                        <div className="font-medium">{session.amount} AED</div>
                        <div className="text-xs text-green-600">Completed</div>
                      </div>
                      <FaMoneyBillWave className="text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No transactions found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorTransactions;