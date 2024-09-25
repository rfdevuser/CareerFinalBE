import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { GET_CANDIDATE_MULTIPLE_DETAILS } from '@/utils/gql/GQL_QUERIES';
import Link from 'next/link';


// Function to get row color based on interviewerStatus
const getStatusColor = (status) => {
  const statusLower = (status || '').toLowerCase();
  switch (statusLower) {
    case 'passed':
      return 'bg-green-100 text-green-800'; // Green
    case 'failed':
      return 'bg-red-100 text-red-800'; // Red
    case 'f2f':
      return 'bg-yellow-100 text-yellow-800'; // Yellow
    default:
      return 'bg-blue-100 text-blue-800'; // Blue
  }
};

const CandidateTable = () => {
  // State for selected status and query results
  const [status, setStatus] = useState('Ongoing Process');
  const { loading, error, data } = useQuery(GET_CANDIDATE_MULTIPLE_DETAILS, {
    variables: { status },
    skip: !status, // Skip query if no status is selected
  });
console.log(data)
  // Handle status change
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Candidate Details</h1>
      
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Select Status:</label>
      <select
        id="status"
        value={status}
        onChange={handleStatusChange}
        className="block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
      >
        <option value="Ongoing Process">Ongoing Process</option>
        <option value="Selected">Selected</option>
 
      </select>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error.message}</p>}
      {data && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.getMultipleQueryCandidatesByStatus.map(candidate => (
                <tr key={candidate.candidateID} className={getStatusColor(candidate.interviewerStatus)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.candidateID}</td>
                  <Link  href={`/SingleCandidatePage?id=${candidate.candidateID}`} as={`/SingleCandidatePage/${candidate.candidateID}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><b><u>{candidate.name}</u></b></td></Link>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{candidate.interviewerStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;
