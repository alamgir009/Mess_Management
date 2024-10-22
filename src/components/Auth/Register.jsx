import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!", { duration: 2000 });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/user/register', formData, { withCredentials: true });
      if (response && response.data) {
        toast.success(response.data.message, { duration: 2000 });
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      toast.error(errorMessage, { duration: 2000 });
    }
  };

  return (
    <div className='bg-gradient-to-b from-black to-blue-950 text-white min-h-screen flex justify-center items-center mt-20'>
      <form
        onSubmit={handleSubmit}
        className='bg-gray-500 bg-opacity-10 backdrop-blur-md border border-sky-300 p-8 rounded-lg shadow-lg w-full max-w-md -mt-20'
      >
        <h1 className='text-3xl mb-6 text-center text-sky-300 font-bold'>Sign Up</h1>

        {/* Form Fields */}
        {['name', 'email', 'phone', 'password', 'confirmPassword'].map((field, index) => (
          <div key={field} className='mb-4'>
            <label htmlFor={field} className='block text-sm font-medium text-gray-200'>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={field.includes('password') ? 'password' : field === 'phone' ? 'tel' : 'text'}
              name={field}
              placeholder={field === 'phone' ? '+91' : `Enter your ${field}`}
              className='mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-100 bg-gray-700'
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button className='bg-sky-500 hover:bg-sky-600 w-full rounded-md h-10 mt-4 font-semibold transition duration-200'>
          Sign Up
        </button>

        <p className='text-center mt-4 text-sm text-gray-200'>
          Already have an account?{' '}
          <span
            className='text-green-300 cursor-pointer hover:underline font-inter'
            onClick={() => navigate('/signin')}
          >
            Sign In
          </span>
        </p>
      </form>
      <Toaster position='top-center' reverseOrder={false} />
    </div>
  );
};
