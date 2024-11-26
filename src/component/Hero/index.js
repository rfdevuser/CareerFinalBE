"use client";
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation
// Import the CandidateTable component
import { GET_CANDIDATES_BY_STATUS } from '@/utils/gql/GQL_QUERIES';
import StatusTable from '../assest/StatusTable';

const Index = () => {
  const [status, setStatus] = useState('Ongoing Process');
  const router = useRouter(); // Use router for programmatic navigation

  const { loading, error, data } = useQuery(GET_CANDIDATES_BY_STATUS, {
    variables: { status },
    fetchPolicy: 'network-only',
  });
  console.log(data);

  // Function to ask for a code before navigating
  const askForCode = (redirectUrl) => {
    const code = prompt("Please enter the code to access this page:");
    const correctCode = "wetailor4u_HR"; // Set your correct code here

    if (code === correctCode) {
      router.push(redirectUrl); // Navigate to the page if the code is correct
    } else {
      alert("Incorrect code. You cannot access this page.");
    }
  };

  return (
    <section className='bg-white min-h-screen'>
      <div className='flex flex-col items-center'>
        <div className='bg-[#ffe4e6] text-white p-4 w-full flex justify-center'>
          <Image src='/logos/rf.png' alt='logo' height={100} width={300} />
        </div>
        <div className='flex justify-center mt-4'>
          <strong>This website is for the internal use of the Employee</strong>
        </div>
      </div>

      <div className='flex flex-wrap justify-center mt-8 gap-4'>
        <div
          className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center cursor-pointer'
          onClick={() => askForCode('./JobPostForm')}
        >
          Post the Job here
        </div>
        <div
          className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center cursor-pointer'
          onClick={() => askForCode('./UpdateTicker')}
        >
          Update and Delete Ticker here
        </div>
        <div
          className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center cursor-pointer'
          onClick={() => askForCode('./StudentDataTable')}
        >
          See Candidates Response here
        </div>
        <div
          className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center cursor-pointer'
          onClick={() => askForCode('./GenerateEmployeeID')}
        >
          Generate Employee ID
        </div>
        <div
          className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center cursor-pointer'
          onClick={() => askForCode('./EmployeeDocument')}
        >
          Employee Document
        </div>

        {/* No code prompt for Employee Work Assignment */}
        <Link href='./EmployeeWorkAssignment'>
          <div className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center'>
            Employee Work Assignment
          </div>
        </Link>

        <div
          className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center cursor-pointer'
          onClick={() => askForCode('./HRDashboard(v1)')}
        >
          HR Dashboard
        </div>
      </div>

      <div className='mt-8'>
        <StatusTable />
      </div>
    </section>
  );
};

export default Index;
