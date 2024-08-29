"use client";
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_INTERVIEWER_CANDIDATE_INFO } from '@/utils/gql/GQL_QUERIES'; // Import your query
import { ADD_INTERVIEWER_CANDIDATE_INFO } from '@/utils/gql/GQL_MUTATION'; // Import your mutation

const InterviewTable = ({ candidateID }) => {
  const [rows, setRows] = useState([{ name: '', comment: '', status: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing data using useQuery
  const { data, loading, error, refetch } = useQuery(GET_INTERVIEWER_CANDIDATE_INFO, {
    variables: { candidateID },
  });

  const [addInterviewerCandidateInfo] = useMutation(ADD_INTERVIEWER_CANDIDATE_INFO);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newRows = rows.slice();
    newRows[index][name] = value;
    setRows(newRows);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      for (const row of rows) {
        if (row.name && row.comment && row.status) {
          await addInterviewerCandidateInfo({
            variables: {
              candidateID: candidateID,
              interviewerName: row.name,
              interviewerComment: row.comment,
              interviewerStatus: row.status,
            },
          });
        }
      }
      alert('Data posted successfully!');
      setRows([{ name: '', comment: '', status: '' }]); // Reset form
      await refetch(); // Refetch data after mutation
    } catch (error) {
      console.error("Error posting data:", error);
      alert('Error posting data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4 mt-4">
      {/* Table for existing data */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Existing Interviewer Feedback</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Interview Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Interviewer Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-48">Candidate Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-64">Submission Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.interviewerCandidateInfoByID?.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{item.interviewerName}</td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs overflow-auto">{item.interviewerComment}</td>
                <td className="px-6 py-4 whitespace-nowrap w-48 max-h-24 overflow-auto">
                  <div className={`inline-flex text-xs leading-5 font-semibold rounded-full p-2 ${
                    item.interviewerStatus === 'passed' ? 'bg-green-100 text-green-800' :
                    item.interviewerStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    item.interviewerStatus === 'f2f' ? 'bg-yellow-100 text-yellow-800' :
                    item.interviewerStatus === 'reconsideration' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.interviewerStatus === 'passed' ? 'Selected' :
                     item.interviewerStatus === 'failed' ? 'UnSelected' :
                     item.interviewerStatus === 'f2f' ? 'Face to Face' :
                     item.interviewerStatus === 'reconsideration' ? 'Reconsideration' :
                     'Unknown'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs overflow-x-auto">
                  {item.submissionTimestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table for new data entry */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add New Interviewer Feedback</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-400">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Interview Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Interviewer Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-48">Candidate Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="name"
                      value={row.name}
                      onChange={(e) => handleChange(index, e)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm p-2"
                      placeholder="Interview Name"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <textarea
                      name="comment"
                      value={row.comment}
                      onChange={(e) => handleChange(index, e)}
                      className="block w-full h-24 border border-gray-300 rounded-md shadow-sm sm:text-sm p-2 resize-none"
                      placeholder="Interviewer Comment"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-48">
                    <select
                      name="status"
                      value={row.status}
                      onChange={(e) => handleChange(index, e)}
                      className={`block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm p-2 ${
                        row.status === 'failed' ? 'bg-red-100 text-red-800' : 
                        row.status === 'passed' ? 'bg-green-100 text-green-800' :
                        row.status === 'f2f' ? 'bg-yellow-100 text-yellow-800' :
                        row.status === 'reconsideration' ? 'bg-purple-100 text-purple-800' : ''
                      }`}
                    >
                      <option value="">Select Status</option>
                      <option value="passed">Selected</option>
                      <option value="failed">UnSelected</option>
                      <option value="f2f">Face to Face</option>
                      <option value="reconsideration">Reconsideration</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`text-white rounded-md py-2 px-6 shadow-md duration-300 ${
              isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewTable;
