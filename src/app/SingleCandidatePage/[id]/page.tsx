"use client";
import { GET_PRODUCT_BY_ID, GET_CANDIDATE_INTERNAL_INFO } from '@/utils/gql/GQL_QUERIES';
import { useQuery, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { BallTriangle } from 'react-loader-spinner';
import InterviewTable from '@/component/assest/InterviewerTable';
import CandidateTable from '@/component/assest/CandidatePersonalTable';
import HrStatusTable from '@/component/assest/HrStatusTable';
import { ADD_CANDIDATE_INTERNAL_INFO, UPDATE_CANDIDATE_STATUS } from '@/utils/gql/GQL_MUTATION';
import { sendEmail } from '@/email/email';
interface Candidate {
  id: string;
  job_id: string;
  name: string;
  email: string;
  contact: string;
  city: string;
  qualification: string;
  gender: string;
  student: boolean;
  working_professional: boolean;
  passing_year: number;
  year_of_experience: number;
}
const SingleCandidatePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Fetch candidate by ID
  const { loading: candidateLoading, error: candidateError, data: candidateData } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id },
  });

  // Fetch candidate internal info
  const { loading: internalInfoLoading, error: internalInfoError, data: internalInfoData, refetch } = useQuery(GET_CANDIDATE_INTERNAL_INFO, {
    variables: { candidateID: id },
  });

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [noticePeriod, setNoticePeriod] = useState('');
  const [availableToJoin, setAvailableToJoin] = useState('');
  const [presentCom, setPresentCom] = useState('');
  const [expectedCom, setExpectedCom] = useState('');
  const [proposedCom, setProposedCom] = useState('');
  const [mutationLoading, setMutationLoading] = useState(false);

  const [updateaddCandidateInternalInfo] = useMutation(ADD_CANDIDATE_INTERNAL_INFO, {
    onCompleted: () => {
      setMutationLoading(false);
      refetch();
    },
    onError: (err) => {
      console.error("Error:", err);
    },
  });
  const [updateCandidateStatus] = useMutation(UPDATE_CANDIDATE_STATUS);

  // Update form state when internalInfoData changes
  useEffect(() => {
    if (internalInfoData?.getCandidateInternalInfo?.length > 0) {
      const info = internalInfoData.getCandidateInternalInfo[0];
      setActiveAccordion(info.candidateStatus || null);
      setNoticePeriod(info.noticePeriod || '');
      setAvailableToJoin(info.availableToJoin || '');
      setPresentCom(info.presentCom || '');
      setExpectedCom(info.expectedCom || '');
      setProposedCom(info.proposedCom || '');
    }
  }, [internalInfoData]);

  const viewResume = (contact: string) => {
    const resumeRef = ref(storage, `images/${contact}`);
    getDownloadURL(resumeRef)
      .then((url) => {
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.error("Error fetching resume: ", error);
      });
  };

  const handleAccordionClick = (status: string) => {
    setActiveAccordion(activeAccordion === status ? null : status);
  };

  const handleSubmit = () => {
    setMutationLoading(true);

    updateaddCandidateInternalInfo({
      variables: {
        candidateID: id,
        candidateName: candidateData.candidateById.name,
        candidateStatus: activeAccordion,
        noticePeriod: noticePeriod,
        availableToJoin: availableToJoin,
        presentCom: presentCom,
        expectedCom: expectedCom,
        proposedCom: proposedCom,
      },
      
    });
     updateCandidateStatus({
      variables: {
        id: candidate.id,
        status: activeAccordion, // Set status to 'Unselected'
      },
    });
   
  };
  const handleReject = async (candidate: Candidate) => {
    const confirmed = window.confirm(`Are you sure you want to send a rejection email to ${candidate.name}?`);
    if (!confirmed) return;
  
    try {
      // Send rejection email
      const emailData = {
        to_email: candidate.email,
        to_name: candidate.name,
        to_jobid: candidate.job_id,
        from_name: 'RAKHIS FASHIONS',
        reply_to: 'no-reply@rakhisfashions.com',
        subject: 'Application Status Update',
        message: 'We wish you the best of luck in your job search and future career endeavors.',
      };
  
      await sendEmail(emailData);
  
      // Update candidate status to 'Unselected'
      await updateaddCandidateInternalInfo({
        variables: {
          candidateID: id,
          candidateName: candidateData.candidateById.name,
          candidateStatus: 'Unselected', // Set status to 'Unselected'
          noticePeriod,
          availableToJoin,
          presentCom,
          expectedCom,
          proposedCom,
        },
      });
   
    await updateCandidateStatus({
      variables: {
        id: candidate.id,
        status: 'hold', // Set status to 'hold'
      },
    });
      // Refetch data to update the UI
      await refetch();
    } catch (error) {
      console.error('Error handling rejection:', error);
    } finally {
      setMutationLoading(false); // Reset loading state
    }
  };
  
  if (candidateLoading || internalInfoLoading) {
    return (
      <div className='flex justify-center'>
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#4fa94d"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  if (candidateError || internalInfoError) {
    return <p>Error: {candidateError?.message || internalInfoError?.message}</p>;
  }

  const candidate = candidateData?.candidateById;
  const candidateInternalInfo = internalInfoData?.getCandidateInternalInfo;

  return (
    <div>
      <div className='flex justify-center text-red text-4xl mt-4'>
        <h1>Welcome to the candidature of <u><b>{candidate.name}</b></u></h1>
      </div>

      <CandidateTable candidate={candidate} viewResume={viewResume} />

      <div className='text-red-800 text-bold text-2xl flex justify-center mt-8'>ONGOING UPDATES</div>
      <div className='flex flex-row'>
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Status</h2>
            <div className="mt-4">
              {['Selected', 'Unselected', 'Ongoing Process', 'Onboarded'].map((status) => (
                <div key={status} className="border-t border-gray-200">
                  <button
                    onClick={() => handleAccordionClick(status)}
                    className={`w-full text-left py-2 px-4 focus:outline-none font-medium transition ease-in-out duration-150 ${activeAccordion === status
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                  >
                    {status}
                  </button>
                 
                  <div
                    className={`px-4 py-2 ${activeAccordion === status ? 'block' : 'hidden'
                      }`}
                  >
                    <p>Candidate Status is : {status}.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4 mt-8">
          <h2 className="text-xl font-semibold mb-4">Additional Candidate Information</h2>
          <div>
            <label htmlFor="notice-period" className="block text-sm font-medium text-gray-700">Notice Period</label>
            <input
              type="text"
              id="notice-period"
              name="notice-period"
              placeholder="e.g., 30 days"
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="available-join" className="block text-sm font-medium text-gray-700">Available for Join</label>
            <input
              type="date"
              id="available-join"
              name="available-join"
              value={availableToJoin}
              onChange={(e) => setAvailableToJoin(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="present-compensation" className="block text-sm font-medium text-gray-700">Present Compensation</label>
            <input
              type="text"
              id="present-compensation"
              name="present-compensation"
              placeholder="e.g., $20,000/year"
              value={presentCom}
              onChange={(e) => setPresentCom(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="expected-compensation" className="block text-sm font-medium text-gray-700">Expected Compensation</label>
            <input
              type="text"
              id="expected-compensation"
              name="expected-compensation"
              placeholder="e.g., $60,000/year"
              value={expectedCom}
              onChange={(e) => setExpectedCom(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="proposed-compensation" className="block text-sm font-medium text-gray-700">Proposed Compensation</label>
            <input
              type="text"
              id="proposed-compensation"
              name="proposed-compensation"
              placeholder="e.g., $30,000/year"
              value={proposedCom}
              onChange={(e) => setProposedCom(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        </div>
        <button
                    onClick={() => handleReject(candidate)}
                    className="text-red-600 hover:text-red-900 mx-8 bg-yellow-200 p-2 rounded-md"
                  >
                    Reject
                  </button>
      </div>

      {/* Display candidate internal information */}
      <div className='max-w-4xl mx-auto bg-white rounded-lg p-6 mt-8'>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Candidate Internal Information</h2>
        {candidateInternalInfo && candidateInternalInfo.length > 0 ? (
          <div className="relative">
            <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-300">Candidate ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-300">Candidate Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-300">Notice Period</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-300">Available to Join</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-300">Present Compensation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-300">Expected Compensation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-300">Proposed Compensation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-300">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {candidateInternalInfo.map((info: any, index: any) => (
                  <tr key={index} className="transition-colors duration-300 hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{info.candidateID}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{info.candidateStatus}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{info.noticePeriod}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{info.availableToJoin}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{info.presentCom}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{info.expectedCom}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{info.proposedCom}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{info.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No internal information found for this candidate.</p>
        )}
      </div>

      <div className='flex justify-center mt-8'>
        <button
          onClick={handleSubmit}
          className={`text-white ${mutationLoading ? 'bg-gray-400' : 'bg-gray-800 hover:bg-gray-700'} rounded-md py-2 px-6 shadow-md hover:shadow-lg duration-300`}
          disabled={mutationLoading}
        >
          {mutationLoading ? 'Posting...' : 'Post'}
        </button>
   
      </div>

      <HrStatusTable candidateID={params.id} />
      <InterviewTable candidateID={params.id} />
    </div>
  );
}

export default SingleCandidatePage;
