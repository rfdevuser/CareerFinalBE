import React from 'react';

const CandidateTable = ({ candidate, viewResume }) => {
  return (
    <>
    <div className='text-red-800 text-bold text-2xl flex justify-center mt-8'>GENERAL INFORMATION</div>
    <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Attribute</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Value</th>
        </tr>
      </thead>
      <tbody className="bg-gray-50 divide-y divide-gray-200">
      <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">key</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.id}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Job ID</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.job_id}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Name</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.name}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Email</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.email}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Contact</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.contact}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">City</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.city}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gender</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.gender}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Qualification</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.qualification}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Working Professional</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.working_professional ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Years of Experience</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.year_of_experience}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Resume</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <button
              onClick={() => viewResume(candidate.contact)}
              className="text-white bg-gray-800 hover:bg-gray-700 rounded-md py-2 px-6 shadow-md hover:shadow-lg duration-300"
            >
              View Resume
            </button>
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Student</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.student ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Passing Year</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.passing_year}</td>
        </tr>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Submission Date</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.submission_date}</td>
        </tr>
      </tbody>
    </table>
    </>
  );
};

export default CandidateTable;
