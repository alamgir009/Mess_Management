// components/Common/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      <h1 className="text-8xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-4">Page Not Found</p>
      <Link to="/" className="text-blue-500 hover:underline">Go back to Home</Link>
    </div>
  );
};

export default NotFoundPage;
