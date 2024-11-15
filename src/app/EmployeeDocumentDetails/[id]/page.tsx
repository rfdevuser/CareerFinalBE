"use client"
import React, { useEffect, useState } from 'react';

// Import Firebase storage functions
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_EMPLOYEE_VERIFICATION } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_VERIFICATION } from '@/utils/gql/GQL_QUERIES';

// Firebase config for this project
const firebaseConfig = {
  apiKey: "AIzaSyBZPdFrSUkPpQWQikvZ9HoINwQ26ddbgxU",
  authDomain: "employeedoc-78a70.firebaseapp.com",
  projectId: "employeedoc-78a70",
  storageBucket: "employeedoc-78a70.appspot.com",
  messagingSenderId: "65450646993",
  appId: "1:65450646993:web:e36bf81ec2a3aa901654f0",
  measurementId: "G-1XWM03WWXP"
};

// Initialize Firebase app and get the storage instance
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Page = ({ params }: { params: { id: string } }) => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [mutationLoading, setMutationLoading] = useState<boolean>(false);
  const [mutationError, setMutationError] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError('');

      try {
        // Reference to the Firebase Storage folder for the given `id`
        const directoryRef = ref(storage, `uploads/${params.id}/`);

        // List all files in the directory
        const res = await listAll(directoryRef);

        // Map through the file items and get their download URLs
        const filePromises = res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        });

        // Wait for all promises to resolve and update the state with the file list
        const filesWithUrls = await Promise.all(filePromises);
        setFiles(filesWithUrls);
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('There was an error fetching the documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [params.id]); // Re-fetch documents when the `id` changes
  const [addEmployeeVerification] = useMutation(ADD_EMPLOYEE_VERIFICATION, {
    onError: (error) => {
      setMutationError('There was an error verifying the employee.');
      console.error('Mutation Error:', error);
    },
    onCompleted: (data) => {
      console.log('Mutation success:', data);
      alert('Employee successfully verified!');
    }
  });

  const handleVerifyClick = async () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to verify this employee?');

    if (!isConfirmed) return; // Exit if the user cancels

    setMutationLoading(true);
    setMutationError('');

    try {
      // Call the mutation to update the verification status
      const response = await addEmployeeVerification({
        variables: {
          employeeID: params.id,  // Use params.id as the employee ID
          verificationStatus: '1', // Set verificationStatus to "1"
        },
      });

      console.log('Verification Response:', response.data);
    } catch (error) {
      setMutationError('Error during verification. Please try again.');
      console.error('Verification Error:', error);
    } finally {
      setMutationLoading(false);
    }
  };
  const { loading:queryloading, error:queryerror, data } = useQuery(GET_EMPLOYEE_VERIFICATION, {
    variables: {     employeeID: params.id, },
  });

  useEffect(() => {
    if (data && data.employeeVerificationByID) {
      // Check if verificationStatus is 1 (Verified)
      if (data.employeeVerificationByID.verificationStatus === '1') {
        setVerificationStatus('Verified');
      } else {
        setVerificationStatus('Not Verified');
      }
    } else {
      setVerificationStatus('Not Verified');
    }
  }, [data]);
  return (
    <>
     <div>
      <h3>verification status</h3>
      {data && data.employeeVerificationByID ? (
        <div>
          <p><strong>Employee ID:</strong> {data.employeeVerificationByID.empID}</p>
          <p><strong>Verification Status:</strong> {verificationStatus}</p>
          <p><strong>verified At:</strong> {data.employeeVerificationByID.submittedAt}</p>
     
        </div>
      ) : (
        <p>Employee is not verified </p>
      )}
    </div>
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg">
      {loading && <p className="text-center text-xl text-gray-500">Loading documents...</p>}
      {error && <p className="text-center text-xl text-red-600">{error}</p>}

      {!loading && !error && files.length === 0 && (
        <p className="text-center text-lg text-gray-700">No documents found for this ID.</p>
      )}

      {!loading && !error && files.length > 0 && (
        <div>
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Documents for ID: {params.id}
          </h2>
          <ul className="space-y-4">
            {files.map(({ name, url }) => (
              <li key={name} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md">
                <span className="text-lg font-medium text-gray-700">{name}</span>
                <button
                  onClick={() => window.open(url, '_blank')}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <div className='flex justify-center mt-8 mb-8'>
    <button
          onClick={handleVerifyClick}
          className="bg-green-800 px-8 py-3 rounded-md text-white hover:bg-green-600"
          disabled={mutationLoading}
        >
          {mutationLoading ? 'Verifying...' : 'Verify'}
        </button>
    </div>
    </>
  );
};

export default Page;
