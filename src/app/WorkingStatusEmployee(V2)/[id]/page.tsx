"use client";
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEE_WORK_DETAILS } from '@/utils/gql/GQL_QUERIES';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Page = ({ params }: { params: { id: string } }) => {
  const { loading, error, data } = useQuery(GET_EMPLOYEE_WORK_DETAILS, {
    variables: { employeeID: params.id },
  });
console.log(data)
  if (loading) return <p className='flex justify-center text-2xl items-center text-red-800'>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Helper function to set status color
  const getStatusColor = (status: string) => {
    return status === "1" ? "bg-red-300 p-4 text-red-900" : "bg-green-300 p-4 text-green-900"; // 1 is pending (red), 0 is complete (green)
  };

  // Count pending and completed tasks
  const statusCount = {
    pending: 0,
    completed: 0,
  };

  data.employeeDashboardWorks.forEach((work: any) => {
    if (work.status === "1") {
      statusCount.pending++;
    } else {
      statusCount.completed++;
    }
  });

  // Pie chart data
  const pieData = {
    labels: ['Pending', 'Completed'],
    datasets: [
      {
        data: [statusCount.pending, statusCount.completed],
        backgroundColor: ['#f87171', '#34d399'], // Red for pending, Green for completed
        hoverOffset: 4,
      },
    ],
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Sort the works by status and dateOfSubmission (newest first)
  const sortedWorks = [...data.employeeDashboardWorks].sort((a: any, b: any) => {
    // First, sort by status (1 is pending, 0 is completed)
    if (a.status !== b.status) {
      return a.status === "1" ? -1 : 1; // "1" comes first (pending)
    }
    // If the status is the same, then sort by date of submission
    return new Date(b.dateOfSubmission).getTime() - new Date(a.dateOfSubmission).getTime();
  });

  return (
    <>
      <h1 className='flex justify-center text-md lg:text-3xl text-red-800'>
        Work Assign for the {params.id}
      </h1>

      {/* Pie chart */}
      <div className="flex justify-center my-4">
        <div className="w-1/4">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="p-4">
        {sortedWorks.map((workDetail: any) => (
          <div key={workDetail.workTicket} className="bg-white shadow-md rounded-lg mb-4 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{workDetail.employeeName}</h3>
              <span
                className={`px-3 py-1 rounded-full ${getStatusColor(workDetail.status)}`}
              >
                {workDetail.status === "1" ? "Pending" : "Completed"}
              </span>
            </div>

            <p className="text-sm mt-2">
              <strong>Date of Assignment:</strong> {new Date(workDetail.dateOfSubmission).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <strong>Timeline:</strong> {new Date(workDetail.timeline).toLocaleDateString()}
            </p>

            {/* Accordion for workTicket */}
            <div className="mt-4">
              <button
                type="button"
                className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
                onClick={() => {
                  const content = document.getElementById(workDetail.workTicket);
                  if (content) {
                    content.classList.toggle('hidden');
                  }
                }}
              >
                <strong>Work Ticket Details</strong>
              </button>
              <div
                id={workDetail.workTicket}
                className="hidden mt-2 px-4 py-2 bg-gray-50 rounded-md"
              >
                <p>{workDetail.workTicket}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
