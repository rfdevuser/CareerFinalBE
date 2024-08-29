"use client"
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
 // Import the CandidateTable component
import { GET_CANDIDATES_BY_STATUS } from '@/utils/gql/GQL_QUERIES';
import StatusTable from '../assest/StatusTable';



const Index = () => {
  const [status, setStatus] = useState('Ongoing Process');

  const { loading, error, data } = useQuery(GET_CANDIDATES_BY_STATUS, {
    variables: { status },
    fetchPolicy: 'network-only',
  });
console.log(data)
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
        <Link href='./JobPostForm'>
          <div className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center'>
            Post the Job here
          </div>
        </Link>
        <Link href='./UpdateTicker'>
          <div className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center'>
            Update and Delete Ticker here
          </div>
        </Link>
        <Link href='./StudentDataTable'>
          <div className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center'>
            See Candidates Response here
          </div>
        </Link>
      </div>

     

      <div className='mt-8'>
       <StatusTable/>
      </div>
    </section>
  );
};

export default Index;
