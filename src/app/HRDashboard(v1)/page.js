import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
    <div className='bg-[#fff1f2]'>
    <div className='flex justify-center text-lg lg:text-3xl pt-10'><b>HR Dashboard</b> </div>
  <div className="flex flex-col lg:flex-row justify-center items-center h-screen">
    <Link href='/PerformanceGraphEmp'>
<div className='bg-[#500724] text-white w-48 h-48 items-center rounded-md text-center p-4 m-2'>See performance Chat</div>
</Link>
<Link href='EmployeeDailyActivity(v1)'>
<div className='bg-[#500724] text-white w-48 h-48 items-center rounded-md text-center p-4 m-2'>See Daily Activity</div></Link>
<div className='bg-[#500724] text-white w-48 h-48 items-center rounded-md text-center p-4 m-2'>TBD....</div>


    </div>
    </div>
    
    </>
  )
}

export default page
