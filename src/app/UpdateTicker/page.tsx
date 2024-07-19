"use client"
import { Add_TICKER, DELETE_TICKER } from '@/utils/gql/GQL_MUTATION';
import { MY_TICKER } from '@/utils/gql/GQL_QUERIES';
import { useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';

const UpdateTicker = () => {
  const client = useApolloClient();
  const [fetchedNewsItems, setFetchedNewsItems] = useState<string[]>([]); // Change NewsItem to string if you are only fetching ticker names
  const [deleteticker] = useMutation(DELETE_TICKER);
  const handleTickerSubmit = async (tickerToDelete:any) => {
    try {
      const { data } = await deleteticker({
        variables: {
          name: tickerToDelete,
        }
        
      });
      alert('Ticker Deleted Successfully');
      // Refetch data to update the ticker list after deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting ticker:', error);
      // Handle error state here if needed
    }
  };
  
  const fetchData = async () => {
    try {
      const { data } = await client.query({
        query: MY_TICKER,
      });
      console.log("data", data);
      if (data && data.tickerInfo) {
        setFetchedNewsItems(data.tickerInfo); // Assuming 'name' is the property holding ticker names
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error state here if needed
    }
  };
console.log(fetchedNewsItems)
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []); // Empty dependency array ensures useEffect runs only once

  const [formData, setFormData] = useState({ tickername: "" });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [addticker, { loading: mutationLoading }] = useMutation(Add_TICKER);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const { data } = await addticker({
        variables: {
          name: formData.tickername.toString(),
        }
      });
      alert('Ticker Updated successfully!');
      // Clear form data after successful submission
      setFormData({
        ...formData,
        tickername: ""
      });
      // Refetch data to update the ticker list after submission
      fetchData();
    } catch (error) {
      console.error('Error adding ticker:', error);
      // Handle error state here if needed
    }
  };

  return (
    <div>
      <div className='bg-pink-200 p-6 flex justify-center'>
        Write what you want to display on Ticker Like new job posting, wishes, or any notice information
      </div>
      <div className='mt-10'>
        <form onSubmit={handleSubmit}>
          <label htmlFor='tickername' className='flex justify-center text-3xl font-bold'>
            Ticker Title
          </label>
          <input
            type='text'
            id='tickername'
            name='tickername'
            placeholder='Write Ticker text you want to display'
            value={formData.tickername}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-black-800 rounded-md h-40"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
          >
            Submit
          </button>
        </form>
      </div>
      <div className='flex justify-center w-screen'>
        <div className='w-1/2'>
          <table className='w-full gap-6 border-collapse border-2 border-black p-10'>
            <thead>
              <tr>
                <th className="border border-black p-2">Ticker Name</th>
                <th className="border border-black p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchedNewsItems.map((ticker, index) => (
                <tr key={index} className="border border-black">
                
                  <td className="border border-black text-black p-2">{ticker}</td>
                  <td className="border border-black p-2">
                    <button onClick={() => handleTickerSubmit(ticker)} className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Delete Ticker
                    </button>
                  </td>
                </tr>
              ))}
              {/* Placeholder row for empty data */}
              {fetchedNewsItems.length === 0 && (
                <tr className="border border-black">
                  <td className="border border-black p-2" colSpan={2}>No tickers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateTicker;
