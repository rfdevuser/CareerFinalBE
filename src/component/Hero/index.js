import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Index = () => {
  return (
    <section className='bg-white min-h-screen'>
      <div className='flex flex-col items-center'>
        <div className='bg-[#ffe4e6] text-white p-4 w-full flex justify-center'>
          <Image
            src='/logos/rf.png'
            alt='logo'
            height={100}
            width={300}
          />
        </div>
        <div className='flex justify-center mt-4'>
          <strong>This website is for the internal use of the Employee</strong>
        </div>
      </div>

      <div className='flex flex-wrap justify-center mt-8 gap-4'>
       <Link href='./JobPostForm'> <div className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center'>
          Post the Job here
        </div></Link>
        <Link href='./UpdateTicker'>  <div className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center'>
          Update and Delete Ticker here
        </div></Link>
        <Link href='./StudentDataTable'>   <div className='border-2 border-gray-300 bg-[#831843] text-white rounded-lg p-4 h-48 w-48 flex items-center justify-center'>
          See Student Response here
        </div></Link>
      </div>
    </section>
  );
};

export default Index;
