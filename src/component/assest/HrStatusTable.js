import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_CANDIDATE_HR_INFO } from '@/utils/gql/GQL_MUTATION';
import { GET_CANDIDATE_HR_INFO } from '@/utils/gql/GQL_QUERIES';

const HrStatusTable = ({ candidateID }) => {
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('Passed');

  // Query to fetch candidate HR info
  const { loading: candidateHrInfoLoading, error: candidateHrInfoError, data: candidateHrInfoData, refetch } = useQuery(GET_CANDIDATE_HR_INFO, {
    variables: { candidateID },
  });

  // Mutation for adding HR info
  const [addCandidateHRInfo, { loading: mutationLoading, error: mutationError, data: mutationData }] = useMutation(ADD_CANDIDATE_HR_INFO);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePostClick = async () => {
    try {
      const { data, errors } = await addCandidateHRInfo({
        variables: {
          candidateID,
          hrComment: comment,
          hrStatus: status
        }
      });

      if (errors) {
        console.error('GraphQL Errors:', errors);
        alert('GraphQL Error: ' + errors.map(err => err.message).join(', '));
      } else if (data) {
        alert(data.addCandidateHRInfo.responseMessage);
        // Refetch the query to update the table
        setComment('')
        refetch();
      }
    } catch (err) {
      console.error("Error adding candidate HR info:", err);
      alert('Failed to post HR info.');
    }
  };

  // Define classes for status styling
  const statusClasses = {
    Passed: 'bg-green-100 text-green-800',
    Failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Form to add HR info */}
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden mt-4">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">HR Comment</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">HR Status</th>
          </tr>
        </thead>
        <tbody className="bg-gray-50 divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 p-2 border border-gray-300 rounded resize-none"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <select
                value={status}
                onChange={handleStatusChange}
                className={`block w-full border border-gray-300 rounded py-2 px-3 text-gray-700 ${statusClasses[status]}`}
              >
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>
              <div className='flex justify-center mt-6'>
                <button
                  onClick={handlePostClick}
                  className={`text-white ${mutationLoading ? 'bg-gray-400' : 'bg-gray-800 hover:bg-gray-700'} rounded-md py-2 px-6 shadow-md hover:shadow-lg duration-300`}
                  disabled={mutationLoading}
                >
                  {mutationLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
              {mutationError && <p className="text-red-500 mt-4">{mutationError.message}</p>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Display fetched candidate HR info */}
      {candidateHrInfoLoading && <p>Loading candidate HR info...</p>}
      {candidateHrInfoError && <p className="text-red-500">Error loading candidate HR info: {candidateHrInfoError.message}</p>}
      {candidateHrInfoData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Current HR Info</h3>
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden mt-4">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {candidateHrInfoData.getCandidateHRInfo.map((info) => (
                <tr key={info.created_at}>
                  <td className="px-6 py-4  text-sm text-gray-500 whitespace-nowrap max-w-xs  overflow-auto">{info.hrComment}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm overflow-auto ${statusClasses[info.hrStatus]}`}>{info.hrStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(info.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HrStatusTable;
