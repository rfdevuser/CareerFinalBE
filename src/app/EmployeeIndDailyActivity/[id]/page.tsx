"use client";
import { GET_INDIVIDUAL_EMPLOYEE_DAILYACTIVITY } from '@/utils/gql/GQL_QUERIES';
import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs'; // Import dayjs
import isBetween from 'dayjs/plugin/isBetween'; // Import the isBetween plugin

// Extend dayjs to use the isBetween plugin
dayjs.extend(isBetween);

interface Activity {
  date_of_submission: string;  // The date when the work was submitted (string in the format "DD/MM/YYYY")
  empID: string;               // The ID of the employee (e.g., "IT_001")
  id: string;                  // Unique identifier for each activity (e.g., "2")
  workDetails: string;         // Description of the work done (e.g., "rere")
}

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const [empID, setEmpID] = useState<string>(params.id);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { loading, error, data } = useQuery(GET_INDIVIDUAL_EMPLOYEE_DAILYACTIVITY, {
    variables: { employeeID: empID },
  });

  // Filtering the data based on the selected date range
  const filteredData = data?.employeeDailyActivities.filter((activity: Activity) => {
    const activityDate = dayjs(activity.date_of_submission, "DD/MM/YYYY"); // Use correct format for parsing

    if (startDate && endDate) {
      // Convert start and end dates into dayjs objects
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      
      // Log for debugging the values
      console.log("Activity Date: ", activityDate.format("DD/MM/YYYY"));
      console.log("Start Date: ", start.format("DD/MM/YYYY"));
      console.log("End Date: ", end.format("DD/MM/YYYY"));
      
      // Check if the activity date is between the start and end date
      return activityDate.isBetween(start, end, null, '[]'); // '[]' inclusive
    }

    // If no date filter is applied, show all
    return true;
  });

  useEffect(() => {
    console.log(filteredData);
  }, [startDate, endDate, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="p-4 max-w-screen-lg mx-auto">
        <h1 className="text-center text-lg lg:text-3xl mt-3 mb-8 font-semibold text-gray-800">Daily Activity of {params.id}</h1>

        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)} // Type-safe handling of date change
              dateFormat="dd/MM/yyyy"  // Specify how the date should be displayed
              className="border p-2 rounded-lg"
              placeholderText="Select start date"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)} // Type-safe handling of date change
              dateFormat="dd/MM/yyyy"  // Specify how the date should be displayed
              className="border p-2 rounded-lg"
              placeholderText="Select end date"
            />
          </div>
        </div>

        {filteredData && filteredData.length > 0 ? (
          filteredData.map((activity: Activity) => {
            return (
              <div
                key={activity.id}
                className="p-4 mb-4 border rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              >
                <p className="text-lg font-medium text-gray-800">Date: {activity.date_of_submission}</p>
                <p className="text-md text-gray-600">Work Details: {activity.workDetails}</p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No activities found for the selected date range.</p>
        )}
      </div>
    </>
  );
}

export default Page;
