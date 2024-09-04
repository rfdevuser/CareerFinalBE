"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CANDIDATE_INFO } from '@/utils/gql/GQL_QUERIES';
import { DELETE_CANDIDATE_RESPONSE, UPDATE_CANDIDATE_STATUS } from '@/utils/gql/GQL_MUTATION';
import { BallTriangle } from 'react-loader-spinner';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import Link from 'next/link';
import {sendEmail} from '@/email/email'
import { useRouter } from 'next/navigation';
// Define the Candidate interface
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
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    answer5: string;
    resume: string;
    submission_date: string;
    status: 'selected' | 'unselected' | 'hold' | 'Ongoing Process' | 'Onboarded';
    // Added 'hold' status
}

const StudentDataTable: React.FC = () => {
    const router = useRouter();
    const [contactNumber, setContactNumber] = useState<string>("");
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [loadingCandidateId, setLoadingCandidateId] = useState<string | null>(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    // State for filters
    const [jobIdFilter, setJobIdFilter] = useState<string>('');
    const [experienceFilter, setExperienceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 20 });
    const [contactFilter, setContactFilter] = useState<string>('');
    const [cityFilter, setCityFilter] = useState<string>('');
    const [keyFilter, setKeyFilter] = useState<string>(''); // Added key filter state
    const [nameFilter, setNameFilter] = useState<string>('');

    const { loading, error, data, refetch } = useQuery(CANDIDATE_INFO);
    const [deleteCandidate] = useMutation(DELETE_CANDIDATE_RESPONSE);
    const [updateCandidateStatus] = useMutation(UPDATE_CANDIDATE_STATUS);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const storedCandidateId = localStorage.getItem('selectedCandidateId');
        if (storedCandidateId) {
            setSelectedCandidateId(storedCandidateId);
        }
    }, []);
    useEffect(() => {
        if (selectedCandidateId) {
            localStorage.setItem('selectedCandidateId', selectedCandidateId);
        }
    }, [selectedCandidateId]);
  
    useEffect(() => {
        const storedJobIdFilter = localStorage.getItem('jobIdFilter');
        const storedExperienceFilter = localStorage.getItem('experienceFilter');
        const storedContactFilter = localStorage.getItem('contactFilter');
        const storedCityFilter = localStorage.getItem('cityFilter');
        const storedKeyFilter = localStorage.getItem('keyFilter');
        
        if (storedJobIdFilter) setJobIdFilter(storedJobIdFilter);
        if (storedExperienceFilter) setExperienceFilter(JSON.parse(storedExperienceFilter));
        if (storedContactFilter) setContactFilter(storedContactFilter);
        if (storedCityFilter) setCityFilter(storedCityFilter);
        if (storedKeyFilter) setKeyFilter(storedKeyFilter);

        const storedCandidateId = localStorage.getItem('selectedCandidateId');
        if (storedCandidateId) {
            setSelectedCandidateId(storedCandidateId);
        }
    }, []);

    // Save filters to local storage
    useEffect(() => {
        localStorage.setItem('jobIdFilter', jobIdFilter);
    }, [jobIdFilter]);

    useEffect(() => {
        localStorage.setItem('experienceFilter', JSON.stringify(experienceFilter));
    }, [experienceFilter]);

    useEffect(() => {
        localStorage.setItem('contactFilter', contactFilter);
    }, [contactFilter]);

    useEffect(() => {
        localStorage.setItem('cityFilter', cityFilter);
    }, [cityFilter]);

    useEffect(() => {
        localStorage.setItem('keyFilter', keyFilter);
    }, [keyFilter]);

    useEffect(() => {
        if (selectedCandidateId) {
            localStorage.setItem('selectedCandidateId', selectedCandidateId);
        }
    }, [selectedCandidateId]);


   
    

    const viewResume = (contact: string) => {
        const resumeRef = ref(storage, `images/${contact}`);
        getDownloadURL(resumeRef)
            .then((url) => {
                window.open(url, "_blank");
            })
            .catch((error) => {
                console.error("Error fetching resume: ", error);
                // Handle errors here
            });
    };

    const handleDelete = async (contact: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete the candidate with contact: ${contact}?`);
        if (!confirmed) return;
        try {
            await deleteCandidate({ variables: { contact } });
            refetch();
        } catch (error) {
            console.error('Error deleting candidate:', error);
        }
    };
    const handleReject = async (candidate: Candidate) => {
        const confirmed = window.confirm(`Are you sure you want to send a rejection email to ${candidate.name}?`);
        if (!confirmed) return;
    try{
        const emailData = {
            to_email: candidate.email,
            to_name: candidate.name,
            to_jobid:candidate.job_id,
            from_name: 'RAKHIS FASHIONS',
            reply_to: 'no-reply@rakhisfashions.com',
            subject: 'Application Status Update',
            message: 'We wish you the best of luck in your job search and future career endeavors.',
        };
    
       
            await sendEmail(emailData);
            try {
                await updateCandidateStatus({
                    variables: { id: candidate.id, status: "hold" }
                });
    
                refetch(); // Ensure that refetch is indeed working as expected
            } catch (error) {
                console.error('Error updating candidate status:', error);
            } finally {
                setLoadingCandidateId(null); // Reset loading state
            }
    }catch{

    }
       
          
        };

    const handleStatusChange = async (candidateId: string, newStatus: 'selected' | 'unselected' | 'hold' | 'Ongoing Process' | 'Onboarded') => {
        setLoadingCandidateId(candidateId); // Set loading state to true

        try {
            await updateCandidateStatus({
                variables: { id: candidateId, status: newStatus }
            });

            refetch(); // Ensure that refetch is indeed working as expected
        } catch (error) {
            console.error('Error updating candidate status:', error);
        } finally {
            setLoadingCandidateId(null); // Reset loading state
        }
    };

    // Filter candidates
    let filteredCandidates: Candidate[] = data ? data.candidatesInfo : [];

    if (jobIdFilter) {
        filteredCandidates = filteredCandidates.filter(candidate => candidate.job_id === jobIdFilter);
    }

    if (experienceFilter.min !== 0 || experienceFilter.max !== 20) {
        filteredCandidates = filteredCandidates.filter(candidate =>
            candidate.year_of_experience >= experienceFilter.min &&
            candidate.year_of_experience <= experienceFilter.max
        );
    }

    if (contactFilter) {
        filteredCandidates = filteredCandidates.filter(candidate =>
            candidate.contact.includes(contactFilter)
        );
    }

    if (cityFilter) {
        filteredCandidates = filteredCandidates.filter(candidate =>
            candidate.city.toLowerCase().includes(cityFilter.toLowerCase())
        );
    }

    if (keyFilter) {
        filteredCandidates = filteredCandidates.filter(candidate =>
            candidate.id.includes(keyFilter) || candidate.job_id.includes(keyFilter)
        );
    }
    if (nameFilter) {
        filteredCandidates = filteredCandidates.filter(candidate =>
            candidate.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
    }
    
    filteredCandidates = [...filteredCandidates].reverse();

  
    if (loading) {
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

    if (error) return <p className="text-center mt-4">Error: {error.message}</p>;
    const handleOnClick = (candidateId: string) => {
        setSelectedCandidateId(candidateId);
    };
    return (
    <> 
   <div className=' fixed top-0 left-0 right-0 bg-red-200 z-50'>
     <div className="  mb-4 flex items-center justify-between bg-red-200">
    <div className="flex items-center space-x-4">
        <div>
            <label htmlFor="jobIdFilter" className="block text-sm font-medium text-gray-700">Filter by Job ID:</label>
            <input
                type="text"
                id="jobIdFilter"
                value={jobIdFilter}
                onChange={(e) => setJobIdFilter(e.target.value)}
                className='border-2 border-gray-300 rounded-md px-3 py-2 w-48'
            />
        </div>
        <div>
    <label htmlFor="nameFilter" className="block text-sm font-medium text-gray-700">Filter by Name:</label>
    <input
        type="text"
        id="nameFilter"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        className='border-2 border-gray-300 rounded-md px-3 py-2 w-48'
    />
</div>

        <div>
            <label htmlFor="contactFilter" className="block text-sm font-medium text-gray-700">Search by Contact Number:</label>
            <input
                type="text"
                id="contactFilter"
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
                className='border-2 border-gray-300 rounded-md px-3 py-2 w-48'
            />
        </div>
        <div>
            <label htmlFor="cityFilter" className="block text-sm font-medium text-gray-700">Filter by City:</label>
            <input
                type="text"
                id="cityFilter"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className='border-2 border-gray-300 rounded-md px-3 py-2 w-48'
            />
        </div>
        <div>
            <label htmlFor="keyFilter" className="block text-sm font-medium text-gray-700">Filter by Key:</label>
            <input
                type="text"
                id="keyFilter"
                value={keyFilter}
                onChange={(e) => setKeyFilter(e.target.value)}
                className='border-2 border-gray-300 rounded-md px-3 py-2 w-48'
            />
        </div>
    </div>
    <div className="flex items-center space-x-4">
        <div>
            <label htmlFor="experienceRange" className="block text-sm font-medium text-gray-700">Filter by Experience:</label>
            <div className="flex items-center space-x-4">
                <input
                    type="number"
                    placeholder="Min"
                    value={experienceFilter.min}
                    onChange={(e) => setExperienceFilter({ ...experienceFilter, min: parseInt(e.target.value) || 0 })}
                    className='border-2 border-gray-300 rounded-md px-3 py-2 w-20'
                />
                <span className="text-gray-500">-</span>
                <input
                    type="number"
                    placeholder="Max"
                    value={experienceFilter.max}
                    onChange={(e) => setExperienceFilter({ ...experienceFilter, max: parseInt(e.target.value) || 20 })}
                    className='border-2 border-gray-300 rounded-md px-3 py-2 w-20'
                />
              
            </div>
        </div>
    </div>
</div>
</div>

        <div className="container mx-auto  bg-white h-screen mt-10">
            {/* Filter controls */}
           
            {/* Table */}
            <div  className="mt-20  ">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-20 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job-ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Resume</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Professional</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passing Year</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year of Experience</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer 1</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer 2</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer 3</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer 4</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer 5</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linkedin/Portfolio</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCandidates.length > 0 ? (
                            filteredCandidates.map((candidate) => (
                                <tr key={candidate.id} className={selectedCandidateId === candidate.id ? 'bg-[#fed7aa]' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(candidate.contact)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                        
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                             onClick={() => handleReject(candidate)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Reject
                                        </button>
                                        
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.job_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <select
  onChange={(e) => handleStatusChange(candidate.id, e.target.value as 'selected' | 'unselected' | 'hold' | 'Ongoing Process' | 'Onboarded')}
  value={loadingCandidateId === candidate.id ? 'loading' : candidate.status}
  disabled={loadingCandidateId === candidate.id}
  className={`px-2 py-1 rounded text-white ${
    loadingCandidateId === candidate.id
      ? 'bg-gray-400'
      : candidate.status === 'selected'
      ? 'bg-green-500'
      : candidate.status === 'hold'
      ? 'bg-yellow-500'
      : candidate.status === 'Ongoing Process'
      ? 'bg-blue-500' // Choose a suitable color for "Ongoing Process"
      : candidate.status === 'Onboarded'
      ? 'bg-teal-500' // Choose a suitable color for "Onboarded"
      : 'bg-gray-500'
  }`}
>
  <option value="selected">Selected</option>
  <option value="unselected">Unselected</option>
  <option value="hold">Hold</option>
  <option value="Ongoing Process">Ongoing Process</option>
  <option value="Onboarded">Onboarded</option>
</select>

                                        {loadingCandidateId === candidate.id && (
                                            <BallTriangle
                                                height={20}
                                                width={20}
                                                radius={5}
                                                color="#fff"
                                                ariaLabel="ball-triangle-loading"
                                                wrapperStyle={{ marginLeft: '10px' }}
                                                wrapperClass=""
                                                visible={true}
                                            />
                                        )}
                                    </td>
                                    <Link  href={`/SingleCandidatePage?id=${candidate.id}`} as={`/SingleCandidatePage/${candidate.id}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm sticky left-0 bg-[#64748b] text-white"    onClick={() => handleOnClick(candidate.id)} > <button
                                    className={`text-white-600 ${selectedCandidateId === candidate.id ? 'text-red-500' : ''}`}
                                
                                >
                                    {candidate.name}
                                </button></td>
                                    </Link>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.contact}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.city}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button
                                            onClick={() => viewResume(candidate.contact)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            View Resume
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.submission_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.qualification}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.student ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.working_professional ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.passing_year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.year_of_experience}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.answer1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.answer2}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.answer3}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.answer4}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.answer5}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.resume && (
                                        <a
                                            href={candidate.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            View here
                                        </a>
                                    )}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" colSpan={20}>
                                    No candidates found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default StudentDataTable;
