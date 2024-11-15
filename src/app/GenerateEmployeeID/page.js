"use client";
import { INSERT_EMPLOYEE } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_MULTIPLE_DETAILS } from '@/utils/gql/GQL_QUERIES';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';

const GenerateEmployeeID = () => {
    const [formData, setFormData] = useState({
        name: '',
        dept: '',
        contact: '',
        email: '',
        password: '',
    });
const [EmployeeID , setEmployeeID]= useState('')
    const [password, setPassword] = useState(null);
    const [showFetchButton, setShowFetchButton] = useState(false);
    const [contact, setContact] = useState('');

    const [insertEmployee, { loading: loadingInsert, error: errorInsert }] = useMutation(INSERT_EMPLOYEE);

    const { data, loading: loadingFetch, error: errorFetch } = useQuery(GET_EMPLOYEE_MULTIPLE_DETAILS, {
        variables: { contact },
        skip: !contact, // Skip the query until contact is set
    });

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await insertEmployee({
                variables: {
                    dept: formData.dept,
                    contact: formData.contact,
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                },
            });
            
            const newPassword = response.data.employeeIDGeneratorInsertEmployee.password;
            localStorage.setItem('employeeContact', formData.contact);
            setPassword(newPassword);
            setContact(formData.contact); // Set the contact for fetching
            
            setShowFetchButton(true); // Show the button after successful submission
            
        } catch (err) {
            console.error('Error inserting employee:', err);
        }
        setFormData({
            name: '',
            email: '',
            contact: '',
            dept: '',
            password: '',
        });
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchEmployeeID = () => {
        if (data && data.employeeIDByContact) {
            const employeeID = data.employeeIDByContact.employeeID;
            // alert(`Employee ID: ${employeeID}, Password: ${password}`); // Displaying the result
            setEmployeeID(employeeID)
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleOnSubmit} className="bg-white shadow-md rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Generate Employee ID</h2>

                <label className="block text-gray-700 mb-1">Enter Name of Employee</label>
                <input
                    type='text'
                    value={formData.name}
                    name='name'
                    id='name'
                    onChange={handleOnChange}
                    placeholder='Enter the name of Employee'
                    required
                    className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-gray-700 mb-1">Department</label>
                <select
                    value={formData.dept}
                    onChange={handleOnChange}
                    name='dept'
                    className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="" disabled>Select an option</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="FD">FASHION DESIGNER</option>
                    <option value="ADF">ADMIN AND FACILITY</option>
                    <option value="ACC">ACCOUNT</option>
                    <option value="OGIFT">OGIFT</option>
                    <option value="PROD">PRODUCTION</option>
                </select>

                <label className="block text-gray-700 mb-1">Enter Contact Number</label>
                <input
                    type='tel'
                    value={formData.contact}
                    name='contact'
                    id='contact'
                    onChange={handleOnChange}
                    placeholder='Enter the main phone number of employee'
                    required
                    className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-gray-700 mb-1">Enter Email ID</label>
                <input
                    type='email'
                    value={formData.email}
                    name='email'
                    id='email'
                    onChange={handleOnChange}
                    placeholder='Enter the personal email of employee'
                    required
                    className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-gray-700 mb-1">Enter Password</label>
                <input
                    type='text' 
                    value={formData.password}
                    name='password'
                    id='password'
                    onChange={handleOnChange}
                    placeholder='Enter the password for employee'
                    required
                    className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button type='submit' className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200">
                    Submit
                </button>
                {loadingInsert && <p className="text-blue-500">Submitting...</p>}
                {errorInsert && <p className="text-red-500">Error: {errorInsert.message}</p>}
                
                {showFetchButton && (
                    <button
                        type='button'
                        onClick={fetchEmployeeID}
                        className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-200 mt-4"
                    >
                        Fetch Employee ID
                    </button>
                )}
                <div className='bg-red-100 mt-4 p-4'>
                <p className='text-xl'><b>EmployeeID: </b> {EmployeeID}</p>
                <p className='text-xl'><b>Password: </b>{password}</p>
                </div>
                {loadingFetch && <p className="text-blue-500">Fetching Employee ID...</p>}
                {errorFetch && <p className="text-red-500">Error fetching ID: {errorFetch.message}</p>}
            </form>
        </div>
    );
}

export default GenerateEmployeeID;
