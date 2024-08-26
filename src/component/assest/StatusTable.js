import Link from 'next/link';
import React from 'react';

const StatusTable = ({ data }) => {
    // Create a copy of the data to avoid modifying the original data object
    const sortedData = [...data.getCandidatesByStatus].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return (
      <div className="overflow-x-auto p-4">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Created At</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Candidate ID</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Expected Commission</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Proposed Commission</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((candidate) => (
              <tr key={candidate.candidateID} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{candidate.created_at}</td>
                <Link href={`/SingleCandidatePage?id=${candidate.candidateID}`} as={`/SingleCandidatePage/${candidate.candidateID}`}>
                <td className="px-6 py-4 text-gray-800"><u><b>{candidate.candidateID}</b></u></td></Link>
                <td className="px-6 py-4 text-gray-800">{candidate.expectedCom}</td>
                <td className="px-6 py-4 text-gray-800">{candidate.proposedCom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  

export default StatusTable;
