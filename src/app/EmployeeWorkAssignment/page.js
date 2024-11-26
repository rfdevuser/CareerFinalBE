"use client";
import { UPDATE_EMPLOYEE_WORK_DETAILS } from '@/utils/gql/GQL_MUTATION';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import React, { useState } from 'react';

const EmployeeTaskAssignment = () => {
  const employeeMapping = {
    "Abhishek Suman": "IT_001",
    "Balasubramanian B": "HR_001",
    "Shimna Nithesh": "ACC_001",
    "KS Sushma": "FD_004",
    "BhanuPriya Boral": "FD_002",
    "Prajwala C": "FD_005",
    "Laxmi Pandey": "FD_001",
    "Kruthika A": "FD_003",
    "Chandrashekar B": "ADF_001",
    "Jayamala V": "PROD_001",
    "Mohammad Tarik": "PROD_002",
    "Ambika JC": "PROD_003",
    "Sagir Ansri": "PROD_004",
    "Sampa Das": "PROD_005",
    "Ambrish V": "PROD_006",
    "Sunil Kumar G K": "ADF_002",
    "Prantosh Namasudra": "ADF_003",
    "Valipi Yogananda": "PROD_007"
  };

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeTask, setEmployeeTask] = useState("");
  const [taskCompletionDate, setTaskCompletionDate] = useState("");
  const [insertWork, { loading, error }] = useMutation(UPDATE_EMPLOYEE_WORK_DETAILS);

  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleEmployeeTaskChange = (event) => {
    setEmployeeTask(event.target.value);
  };

  const handleTaskCompletionDate = (event) => {
    setTaskCompletionDate(event.target.value);
  };

  const handleOnClick = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!selectedEmployee || !employeeTask || !taskCompletionDate) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await insertWork({
        variables: {
          employeeID: employeeMapping[selectedEmployee],
          employeeName: selectedEmployee,
          timeline: taskCompletionDate,
          status: "1",  // Assuming status is always '1'
          workTicket: employeeTask
        },
      });

      if (response.data) {
        setEmployeeTask('');
        setTaskCompletionDate('');
        setSelectedEmployee('');
        alert("Work details updated successfully!");
      }
    } catch (err) {
      alert("Error updating work details: " + err.message);
    }
  };

  return (
    <>
      <div className="bg-red-200 p-4">
        <h1 className="text-md lg:text-2xl text-gray-800 flex justify-center font-bold mb-8 mt-2">
          Assignment for the Employee
        </h1>
      </div>

      <div className="mt-2 mx-4">
        <Link href='/WorkingStatusEmployee'>
        <button className="bg-yellow-200 p-4 text-xl rounded-md hover:bg-yellow-400 w-full lg:w-1/4">
          ☰ Check Working status of team
        </button>
        </Link>
      </div>

      <div className="bg-blue-50 m-4 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full">
            <label className="block text-gray-800 font-medium mb-2">Select Employee Name</label>
            <select
              id="EmployeeName"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--Select Employee--</option>
              {Object.keys(employeeMapping).map((employeeName) => (
                <option key={employeeName} value={employeeName}>
                  {employeeName}
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && (
            <div className="text-lg font-semibold text-gray-700 mt-4">
              <p>Employee Code: <span className="font-normal">{employeeMapping[selectedEmployee]}</span></p>
            </div>
          )}

          <div className="w-full">
            <label className="block text-gray-800 font-medium mb-2">Task to be Assigned</label>
            <input
              type="text"
              id="EmployeeTask"
              value={employeeTask}
              onChange={handleEmployeeTaskChange}
              className="w-full h-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-800 font-medium mb-2">Date of Completion</label>
            <input
              type="date"
              id="taskCompletion"
              value={taskCompletionDate}
              onChange={handleTaskCompletionDate}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <button
          className='bg-red-600 px-4 py-2 rounded-md text-white hover:bg-red-800'
          onClick={handleOnClick}
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </div>
      {error && <p className="text-red-600 text-center">{error.message}</p>}
    </>
  );
};

export default EmployeeTaskAssignment;
