import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userLogSlice';


export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    try {
      const response = await axios.post('http://localhost:8080/user/signin', formData, { withCredentials: true });
      if (response && response.data) {
        toast.success(response.data.message, { duration: 2000 });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        dispatch(login(true))
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      toast.error(errorMessage, { duration: 2000 });
    }
  };

  return (
    <div className='bg-gradient-to-b from-black to-blue-950 text-gray-50 mt-20 h-screen flex justify-center items-center'>
      <form
        className='bg-gray-500 bg-opacity-10 backdrop-blur-md border border-sky-300 p-8 rounded-lg shadow-lg w-full max-w-md -mt-20'
        onSubmit={handleSubmit}
      >
        <h1 className='text-3xl mb-6 text-center text-sky-300 font-bold'>Sign in</h1>

        <div className='mb-4'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-200 font-inter'>Email</label>
          <input
            type='email'
            name='email'
            placeholder='username@email.com'
            className='mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-100 bg-gray-700'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className='mb-6'>
          <label htmlFor='password' className='block text-sm font-medium text-gray-200 font-inter'>Password</label>
          <input
            type='password'
            name='password'
            placeholder='password'
            className='mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-100 bg-gray-700'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className='text-center'>
          <span className='text-sm text-center text-gray-200 cursor-pointer' onClick={() => navigate('/requestotp')}>
            Forgot password?
          </span>
        </div>

        <button className='w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-md shadow transition duration-200'>
          Sign in
        </button>

        <p className='text-center mt-6 text-sm text-gray-200'>
          Don't have an account?{' '}
          <span
            className='text-green-300 cursor-pointer hover:underline font-inter'
            onClick={() => navigate('/register')}
          >
            Sign up
          </span>
        </p>
      </form>
      <Toaster position='top-center' reverseOrder={false} />
    </div>
  );
};
