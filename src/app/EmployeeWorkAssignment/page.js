"use client"
import { UPDATE_EMPLOYEE_WORK_DETAILS } from '@/utils/gql/GQL_MUTATION';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const USER_ID = 'user_QBs08JbvqdXivIagZeWFH'; // Consider using environment variables for security
const SERVICE_ID = 'service_7r8sia9'; // Consider using environment variables for security
const TEMPLATE_ID = 'template_3ib2sig';

// Modified employeeMapping to include emails
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

export async function sendEmailTicket(formData) {
  try {
    const templateParams = {
      to_email: formData.to_email,
      to_name: formData.to_name,
      to_jobid: formData.to_jobid,
      from_name: formData.from_name,
      reply_to: formData.reply_to,
      subject: formData.subject,
      message: formData.message,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const EmployeeTaskAssignment = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeTask, setEmployeeTask] = useState("");
  const [taskCompletionDate, setTaskCompletionDate] = useState("");
  const [isAssigning, setIsAssigning] = useState(false); // New state to track the assigning process
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

    // Retrieve employee details from employeeMapping
    const employee = employeeMapping[selectedEmployee];
    if (!employee) {
      alert("Employee not found.");
      return;
    }

    try {
      // Set isAssigning to true when starting the process
      setIsAssigning(true);

      // Prepare email data
      const emailData = {
        to_email: employee.email,
        to_name: selectedEmployee,
        to_jobid: employee.code,
        from_name: 'RAKHIS FASHIONS',
        reply_to: 'no-reply@rakhisfashions.com',
        subject: 'Task Assignment Notification',
        message: `Dear ${selectedEmployee},\n\nYou have been assigned a new task.\nThe task is expected to be completed by ${taskCompletionDate}. Please acknowledge the assignment check the Employee Dashboard and proceed accordingly.\n\nBest regards,\nRAKHIS FASHIONS`,
      };

      // Send email notification
      await sendEmailTicket(emailData);

      // Send mutation to update work details
      const response = await insertWork({
        variables: {
          employeeID: employee.code,
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
        alert("Work details updated and email sent successfully!");
      }

    } catch (err) {
      console.error("Error during task assignment:", err);
      alert("Error updating work details or sending email: " + err.message);
    } finally {
      // Set isAssigning to false when the task is completed (successful or failed)
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
              <p>Employee Code: <span className="font-normal">{employeeMapping[selectedEmployee].code}</span></p>
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
