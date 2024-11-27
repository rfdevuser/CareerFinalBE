"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_EMPLOYEES } from "@/utils/gql/GQL_QUERIES";
import Link from "next/link";
import PerformanceGraph from '@/component/assest/PerformanceGraph'
const WorkingStatus = () => {
  // State for filter inputs
  const [filters, setFilters] = useState({
    employeeID: "",
    name: "",
    email: "",
    contact: ""
  });

  // Use Apollo Client's useQuery hook to fetch the employee data
  const { loading, error, data } = useQuery(GET_EMPLOYEES);

  // Handle loading and error states
  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">Error: {error.message}</p>;

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Filter the employee data based on the filter state
  const filteredEmployees = data.employeeIDGeneratorAllEmployees.filter((employee) => {
    return (
      employee.employeeID.toLowerCase().includes(filters.employeeID.toLowerCase()) &&
      employee.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      employee.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      employee.contact.toLowerCase().includes(filters.contact.toLowerCase())
    );
  });

  return (
    <>
    <PerformanceGraph/>
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Check the Working Status of Employee</h2>

      {/* Filters Section */}
      <div className="mb-6 space-x-4">
        <input
          type="text"
          name="employeeID"
          value={filters.employeeID}
          onChange={handleFilterChange}
          placeholder="Search by Employee ID"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Search by Name"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
          placeholder="Search by Email"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="contact"
          value={filters.contact}
          onChange={handleFilterChange}
          placeholder="Search by Contact"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Employee ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Contact</th>
     
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr
                  key={employee.employeeID}
                  className="border-t hover:bg-gray-100 transition-colors"
                >
                   <Link href={`/WorkingStatusEmployee(V2)?id=${employee.employeeID}`} as={`/WorkingStatusEmployee(V2)/${employee.employeeID}`}>
                  <td className="px-6 py-3 text-blue-600 hover:text-blue-900"><u><b>{employee.employeeID}</b></u></td></Link>
                  <td className="px-6 py-3">{employee.name}</td>
                  <td className="px-6 py-3">{employee.email}</td>
                  <td className="px-6 py-3">{employee.dept}</td>
                  <td className="px-6 py-3">{employee.contact}</td>
               
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-3 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default WorkingStatus;
