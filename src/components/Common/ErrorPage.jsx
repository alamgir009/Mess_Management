// components/Common/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ message }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      <h1 className="text-5xl font-bold text-red-500 mb-4">Error</h1>
      <p className="text-xl text-gray-700 mb-4">{message}</p>
      <Link to="/" className="text-blue-500 hover:underline">Go back to Home</Link>
    </div>
  );
};

export default ErrorPage;
