"use client"
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_JOB_INFO, DELETE_JOBS } from '@/utils/gql/GQL_MUTATION';

const JobForm = () => {
  const [formData, setFormData] = useState({
    jobId: '',
    jobTitle: '',
    jobBrief: '',
    jobResponsibility: '',
    jobRequirement: '',
    jobSalary: '',
    jobLocation: '',
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
  });

  const [formDataDelete, setFormDataDelete] = useState({
    jobIdDelete: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData) {
      setFormData({ ...formData, [name]: value });
    } else if (name in formDataDelete) {
      setFormDataDelete({ ...formDataDelete, [name]: value });
    }
  };

  const [addJob, { loading: mutationLoadingAdd }] = useMutation(ADD_JOB_INFO);
  const [deleteJob, { loading: mutationLoadingDelete }] = useMutation(DELETE_JOBS);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Set loading state while waiting for the mutation to complete
      // This applies to the addJob mutation
      const { data } = await addJob({
        variables: {
          jobId: formData.jobId.toString(),
          jobTitle: formData.jobTitle.toString(),
          jobBrief: formData.jobBrief.toString(),
          jobResponsibility: formData.jobResponsibility.toString(),
          jobRequirement: formData.jobRequirement.toString(),
          jobSalary: formData.jobSalary.toString(),
          jobLocation: formData.jobLocation.toString(),
          question1: formData.question1.toString(),
          question2: formData.question2.toString(),
          question3: formData.question3.toString(),
          question4: formData.question4.toString(),
          question5: formData.question5.toString(),
        },
      });

      console.log('Job added:', data);
      alert('Form submitted successfully!');
      setFormData({
        jobId: '',
        jobTitle: '',
        jobBrief: '',
        jobResponsibility: '',
        jobRequirement: '',
        jobSalary: '',
        jobLocation: '',
        question1: '',
        question2: '',
        question3: '',
        question4: '',
        question5: '',
      });
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to submit form. Please try again.'); // Optional: Handle error with user feedback
    }
  };

  const handleDelete = async () => {
    try {
      // Implement delete logic here, using formDataDelete.jobIdDelete
      const { data } = await deleteJob({
        variables: {
          job_id: formDataDelete.jobIdDelete,
        }
      });
      alert('Job deleted successfully.');
      setFormDataDelete({ jobIdDelete: '' }); // Clear jobIdDelete after deletion
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.'); // Optional: Handle error with user feedback
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Delete Job Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <label htmlFor="jobIdDelete" className="block text-sm font-medium text-black">
            Job ID
          </label>
          <input
            type="text"
            id="jobIdDelete"
            name="jobIdDelete"
            value={formDataDelete.jobIdDelete}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md py-2 px-4"
            placeholder="Enter Job ID"
          />
        </div>
        <div>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={mutationLoadingDelete} // Disable button while deleting
          >
            {mutationLoadingDelete ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Job Posting Instructions */}
      <div className="text-center mx-auto bg-[#ffe4e6] p-4">
        <h1 className="font-bold text-lg mb-2">Instructions for Job Posting:</h1>
        <ul className="list-disc list-inside">
          <li>
            To post the job on the career page, follow these steps:
            <ul className="list-disc list-inside ml-4">
              <li>Fill out the form with all required information.</li>
              <li>Ensure accuracy and completeness in filling out the form.</li>
            </ul>
          </li>
          <li className="mt-4">
            <span className="font-bold">For the job description:</span>
            <ul className="list-disc list-inside ml-4">
              <li>Include a full stop to end each sentence.</li>
              <li>Avoid unnecessary full stops as they can create unintended paragraph breaks.</li>
            </ul>
          </li>
          <li className="mt-4">
            <span className="font-bold">Regarding the question section of the form:</span>
            <ul className="list-disc list-inside ml-4">
              <li>List the questions clearly and concisely.</li>
              <li>Format them in bullet points for clarity and organization.</li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Job Posting Form */}
      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 mt-10">
        {/* Job Details Inputs */}
        <div className="space-y-8 divide-y divide-gray-200">
          {/* Job Id */}
          <div className="py-4">
            <label htmlFor="jobId" className="block text-sm font-medium flex justify-center text-black text-2xl">
              Job Id
            </label>
            <input
              type="text"
              id="jobId"
              name="jobId"
              placeholder="Enter the job Id"
              value={formData.jobId}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
            />
          </div>

          {/* Job Title */}
          <div className="py-4">
            <label htmlFor="jobTitle" className="block text-sm font-medium flex justify-center text-black text-2xl">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              placeholder="Enter Title of job"
              value={formData.jobTitle}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
            />
          </div>

          {/* Job Brief */}
          <div className="py-4">
            <label htmlFor="jobBrief" className="block text-sm font-medium flex justify-center text-black text-2xl">
              Job Brief
            </label>
            <textarea
              id="jobBrief"
              name="jobBrief"
              placeholder="Enter Brief about Job role"
              value={formData.jobBrief}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
            />
          </div>

          {/* Job Responsibility */}
          <div className="py-4">
            <label htmlFor="jobResponsibility" className="block text-sm font-medium flex justify-center text-black text-2xl">
              Job Responsibility
            </label>
            <textarea
              id="jobResponsibility"
              name="jobResponsibility"
              placeholder="Enter Responsibility of the role"
              value={formData.jobResponsibility}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
            />
          </div>

          {/* Job Requirement */}
          <div className="py-4">
            <label htmlFor="jobRequirement" className="block text-sm font-medium flex justify-center text-black text-2xl">
              Job Requirement
            </label>
            <textarea
              id="jobRequirement"
              name="jobRequirement"
              placeholder="Enter Requirements for the job"
              value={formData.jobRequirement}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
            />
          </div>

          {/* Job Salary */}
          <div className="py-4">
            <label htmlFor="jobSalary" className="block text-sm font-medium flex justify-center text-black text-2xl">
              Job Salary
            </label>
            <input
             
             type="text"
             id="jobSalary"
             name="jobSalary"
             placeholder="Enter Salary for the role"
             value={formData.jobSalary}
             onChange={handleChange}
             className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
           />
         </div>

         {/* Job Location */}
         <div className="py-4">
           <label htmlFor="jobLocation" className="block text-sm font-medium flex justify-center text-black text-2xl">
             Job Location
           </label>
           <input
             type="text"
             id="jobLocation"
             name="jobLocation"
             placeholder="Location of the role"
             value={formData.jobLocation}
             onChange={handleChange}
             className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
           />
         </div>

         {/* Questions */}
         {[1, 2, 3, 4, 5].map((num) => (
           <div className="py-4" key={`question${num}`}>
             <label htmlFor={`question${num}`} className="block text-sm font-medium flex justify-center text-black text-2xl">
               Question {num}
             </label>
             <textarea
               id={`question${num}`}
               name={`question${num}`}
               placeholder={`Enter Question ${num}`}
               value={formData[`question${num}`]}
               onChange={handleChange}
               className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
             />
           </div>
         ))}
       </div>

       {/* Submit Button */}
       <div className="pt-5">
         <button
           type="submit"
           className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
           disabled={mutationLoadingAdd} // Disable button while adding job
         >
           {mutationLoadingAdd ? 'Please wait...' : 'Submit'}
         </button>
       </div>
     </form>
   </div>
 );
};

export default JobForm;
