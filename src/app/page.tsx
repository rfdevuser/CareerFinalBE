'use client';
import { useState } from "react";
import Hero from '@/component/Hero';

const SECRET_CODE = 'wetailor4u_2024'; // Replace with your hardcoded secret code

export default function Home() {
  const [code, setCode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (code === SECRET_CODE) {
      setAuthenticated(true); // Mark as authenticated
    } else {
      alert('Invalid secret code');
    }
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-3xl font-bold mb-6">Enter the Secret Code</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
          <input
            type="text"
            placeholder="Secret Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4 text-black"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  // Render the Hero component if authenticated
  return (
    <>
      <Hero />
    </>
  );
}
