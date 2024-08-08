"use client";
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CANDIDATE_INFO } from '@/utils/gql/GQL_QUERIES';
import { DELETE_CANDIDATE_RESPONSE } from '@/utils/gql/GQL_MUTATION';
import { BallTriangle } from 'react-loader-spinner';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

// Define the Candidate interface here
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
    // Add any other fields you might have
}

const StudentDataTable: React.FC = () => {
    const [contactNumber, setContactNumber] = useState<string>("");
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    const { loading, error, data, refetch } = useQuery(CANDIDATE_INFO);
    const [deleteCandidate] = useMutation(DELETE_CANDIDATE_RESPONSE);

    // State for filters
    const [jobIdFilter, setJobIdFilter] = useState<string>('');
    const [experienceFilter, setExperienceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 20 });
    const [contactFilter, setContactFilter] = useState<string>('');
    const [cityFilter, setCityFilter] = useState<string>('');

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

    // Handle delete function
    const handleDelete = async (contact: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete the candidate with contact: ${contact}?`);
        if (!confirmed) return;
        try {
            const { data } = await deleteCandidate({
                variables: { contact },
            });

            // Optionally, handle response data here

            // Refetch candidate info after deletion
            refetch();
        } catch (error) {
            console.error('Error deleting candidate:', error);
            // Handle error as needed
        }
    };

    // Filtered candidates based on jobIdFilter, experience range, contact number, and city
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

    return (
        <div className="container mx-auto mt-4 bg-white h-screen">
            {/* Filter controls */}
            <div className="mb-4 flex items-center justify-between">
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
            {/* Table */}
            <div className="overflow-x-auto max-h-[calc(100vh-200px)]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job-ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Resume</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCandidates.length > 0 ? (
                            filteredCandidates.map((candidate) => (
                                <tr key={candidate.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(candidate.contact)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.job_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.contact}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.city}</td>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button
                                            onClick={() => viewResume(candidate.contact)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            View Resume
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.submission_date}</td>
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
    );
};

export default StudentDataTable;
