"use client";
import { UPDATE_EMPLOYEE_WORK_DETAILS } from '@/utils/gql/GQL_MUTATION';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import React, { useState } from 'react';
import { sendEmail } from '@/email/email';

const employeeMapping = {
  "Abhishek Suman": { code: "IT_001", email: "suman.abhishek@rakhisfashions.com" },
  "Balasubramanian B": { code: "HR_001", email: "balahr@rakhisfashions.com" },
  "Shimna Nithesh": { code: "ACC_001", email: "accounts@rakhisfashions.com" },
  "KS Sushma": { code: "FD_004", email: "sushma@rakhisfashions.com" },
  "BhanuPriya Boral": { code: "FD_002", email: "bhanupriya@rakhisfashions.com" },
  "Prajwala C": { code: "FD_005", email: "prajwala@rakhisfashions.com" },
  "Laxmi Pandey": { code: "FD_001", email: "laxmi@rakhisfashions.com" },
  "Kruthika A": { code: "FD_003", email: "kruthika@rakhisfashions.com" },
  "Chandrashekar B": { code: "ADF_001", email: "chandrashekar@example.com" },
  "Jayamala V": { code: "PROD_001", email: "jayamala@example.com" },
  "Mohammad Tarik": { code: "PROD_002", email: "tarik@example.com" },
  "Ambika JC": { code: "PROD_003", email: "ambika@example.com" },
  "Sagir Ansri": { code: "PROD_004", email: "sagir@example.com" },
  "Sampa Das": { code: "PROD_005", email: "sampa@example.com" },
  "Ambrish V": { code: "PROD_006", email: "ambrish@example.com" },
  "Sunil Kumar G K": { code: "ADF_002", email: "sunil@example.com" },
  "Prantosh Namasudra": { code: "ADF_003", email: "prantosh@example.com" },
  "Valipi Yogananda": { code: "PROD_007", email: "yogananda@rakhisfashions.com" }
};

const EmployeeTaskAssignment = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeTask, setEmployeeTask] = useState("");
  const [taskCompletionDate, setTaskCompletionDate] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [insertWork, { loading, error }] = useMutation(UPDATE_EMPLOYEE_WORK_DETAILS);

  const handleEmployeeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedEmployees((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((employee) => employee !== value)
    );
  };

  const handleEmployeeTaskChange = (event) => {
    setEmployeeTask(event.target.value);
  };

  const handleTaskCompletionDate = (event) => {
    setTaskCompletionDate(event.target.value);
  };

  const handleManagerNameChange = (event) => {
    setManagerName(event.target.value);
  };

  const handleManagerEmailChange = (event) => {
    setManagerEmail(event.target.value);
  };

  const handleOnClick = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (selectedEmployees.length === 0 || !employeeTask || !taskCompletionDate) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      setIsAssigning(true);

      for (const employeeName of selectedEmployees) {
        const employee = employeeMapping[employeeName];
        if (!employee) {
          alert(`Employee ${employeeName} not found.`);
          continue;
        }

        // Prepare email data with manager's info if provided
        const emailData = {
          to_email: employee.email,
          to_name: employeeName,
          to_jobid: employee.code,
          from_name: 'RAKHIS FASHIONS',
          reply_to: managerEmail || 'no-reply@rakhisfashions.com',
          cc: managerEmail, // CC manager's email if provided
          subject: 'Task Ticket Assignment Notification',
          message: `Dear ${employeeName},\n\nYou have been assigned a new task-  ${employeeTask}.\nThe task is expected to be completed by ${taskCompletionDate}. Please acknowledge the assignment, check the Employee Dashboard, and proceed accordingly.\n\nBest regards,\n${managerName || 'RAKHIS FASHIONS'}`,
        };

        await sendEmail(emailData);

        await insertWork({
          variables: {
            employeeID: employee.code,
            employeeName: employeeName,
            timeline: taskCompletionDate,
            status: "1", // Assuming status is always '1'
            workTicket: employeeTask
          },
        });
      }

      alert("Work details updated and emails sent successfully!");
      setEmployeeTask('');
      setTaskCompletionDate('');
      setSelectedEmployees([]);
      setManagerName('');
      setManagerEmail('');

    } catch (err) {
      console.error("Error during task assignment:", err);
      alert("Error updating work details or sending emails: " + err.message);
    } finally {
      setIsAssigning(false);
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
            <label className="block text-gray-800 font-medium mb-2">Select Employee(s)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(employeeMapping).map((employeeName) => (
                <div key={employeeName} className="flex items-center">
                  <input
                    type="checkbox"
                    id={employeeName}
                    value={employeeName}
                    onChange={handleEmployeeChange}
                    className="mr-2"
                  />
                  <label htmlFor={employeeName} className="text-gray-800">{employeeName}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <label className="block text-gray-800 font-medium mb-2">Manager Name</label>
            <input
              type="text"
              value={managerName}
              onChange={handleManagerNameChange}
              placeholder="Enter manager's name"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-800 font-medium mb-2">Manager Email (Optional)</label>
            <input
              type="email"
              value={managerEmail}
              onChange={handleManagerEmailChange}
              placeholder="Enter manager's email"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-800 font-medium mb-2">Task to be Assigned</label>
            <input
              type="text"
              value={employeeTask}
              onChange={handleEmployeeTaskChange}
              className="w-full h-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-800 font-medium mb-2">Date of Completion</label>
            <input
              type="date"
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
          disabled={isAssigning || loading} // Disable button when assigning
        >
          {isAssigning || loading ? "Assigning..." : "Assign"}
        </button>
      </div>
      {error && <p className="text-red-600 text-center">{error.message}</p>}
    </>
  );
};

export default EmployeeTaskAssignment;
