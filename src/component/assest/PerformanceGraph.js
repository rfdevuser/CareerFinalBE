"use client";
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { GET_ALL_EMPLOYEE_WORK_DETAILS } from '@/utils/gql/GQL_QUERIES'; // Import the query
import dayjs from 'dayjs'; // Import dayjs
import isBetween from 'dayjs/plugin/isBetween'; // Import the isBetween plugin

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeWorkStatus = ({ employeeID, employeeName, employeeTasks, showPieChart }) => {
  // Function to generate pie chart data for the employee
  const getPieChartData = () => {
    const completed = employeeTasks.filter(task => task.status === '0').length;
    const pending = employeeTasks.filter(task => task.status === '1').length;

    return {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ['#4caf50', '#f44336'], // Green for completed, Red for pending
      }],
    };
  };

  const pieChartData = getPieChartData();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-lg shadow-lg p-6 mb-6 space-y-4 md:space-y-0 md:space-x-6">
      {/* Employee Name */}
      <div className="text-center md:text-left">
        <h3 className="text-xl font-semibold text-gray-800">{employeeName}</h3>
        <p className="text-sm text-gray-500">Employee ID: {employeeID}</p>
      </div>

      {/* Conditionally render Pie Chart */}
      {showPieChart && (
        <div className="w-48 h-48">
          <Pie data={pieChartData} />
        </div>
      )}

      {/* Status Data */}
      <div className="mt-4 text-center md:text-left">
        <span className="text-green-500 font-medium">Completed: {pieChartData.datasets ? pieChartData.datasets[0].data[0] : 0}</span><br />
        <span className="text-red-500 font-medium">Pending: {pieChartData.datasets ? pieChartData.datasets[0].data[1] : 0}</span>
      </div>
    </div>
  );
};

const App = () => {
  const { loading, error, data } = useQuery(GET_ALL_EMPLOYEE_WORK_DETAILS);

  const [employeeData, setEmployeeData] = useState([]);
  const [filterCode, setFilterCode] = useState(''); // State for employee code filter
  const [filteredEmployeeData, setFilteredEmployeeData] = useState([]);
  const [prefixFilter, setPrefixFilter] = useState(''); // State for prefix filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (data && data.allEmployeeDashboardWorks) {
      setEmployeeData(data.allEmployeeDashboardWorks);
    }
  }, [data]);

  // Filter the employee data based on the entered filter code and date range
  useEffect(() => {
    let filteredData = employeeData;

    if (filterCode) {
      filteredData = filteredData.filter(task => task.employeeID.includes(filterCode));
    }

    if (startDate && endDate) {
      filteredData = filteredData.filter(task => {
        const taskDate = dayjs(task.dateOfSubmission);
        return taskDate.isBetween(dayjs(startDate), dayjs(endDate), null, '[]');
      });
    }

    // Apply prefix filter if it's set
    if (prefixFilter) {
      filteredData = filteredData.filter(task => task.employeeID.startsWith(prefixFilter));
    }

    setFilteredEmployeeData(filteredData);
  }, [filterCode, startDate, endDate, prefixFilter, employeeData]);

  // Extract unique prefixes from employee IDs
  const uniquePrefixes = [...new Set(employeeData.map(task => task.employeeID.split('_')[0]))];

  // Extract unique employee IDs
  const uniqueEmployeeIDs = [...new Set(filteredEmployeeData.map(task => task.employeeID))];

  // Handle loading and error states
  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-700">Employee Task Status</h2>
      
      {/* Employee Code Filter */}
      <div className="mb-6 text-center">
        <label htmlFor="employeeCode" className="mr-2 text-lg">Filter by Employee Code: </label>
        <input
          type="text"
          id="employeeCode"
          placeholder="Enter Employee Code"
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 text-center">
        <label htmlFor="startDate" className="mr-2 text-lg">Start Date: </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <label htmlFor="endDate" className="ml-4 mr-2 text-lg">End Date: </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Prefix Filter */}
      <div className="mb-6 text-center">
        <label className="mr-2 text-lg">Filter by Prefix: </label>
        <select
          value={prefixFilter}
          onChange={(e) => setPrefixFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="">All</option>
          {uniquePrefixes.map((prefix) => (
            <option key={prefix} value={prefix}>{prefix}</option>
          ))}
        </select>
      </div>

      {/* Dynamically render EmployeeWorkStatus components */}
      {uniqueEmployeeIDs.length === 0 ? (
        <div className="text-center text-xl text-red-500">No employees found matching the filter.</div>
      ) : (
        uniqueEmployeeIDs.map((employeeID) => {
          // Filter tasks for the current employee
          const employeeTasks = filteredEmployeeData.filter(task => task.employeeID === employeeID);
          // Get employee name
          const employeeName = employeeTasks[0]?.employeeName || 'Unknown Employee'; // Fallback to 'Unknown Employee' if name is undefined

          // Only display pie chart if a prefix is selected
          const showPieChart = Boolean(prefixFilter);

          return <EmployeeWorkStatus key={employeeID} employeeID={employeeID} employeeName={employeeName} employeeTasks={employeeTasks} showPieChart={showPieChart} />;
        })
      )}
    </div>
  );
};

export default App;
