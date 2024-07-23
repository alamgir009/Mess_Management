import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

export const Login = () => {
  const navigate = useNavigate();
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
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      toast.error(errorMessage, { duration: 2000 });
    }
  };

  return (
    <div className='bg-gradient-to-b from-black to-blue-950 text-gray-50 mt-20 h-screen flex justify-center items-center'>
      <form
        className='border border-green-300 p-5 font-inter w-full md:w-80 lg:w-80 xl:w-96 rounded-md m-2 lg:-mt-20 bg-green-400/10'
        onSubmit={handleSubmit}
      >
        <h1 className='text-4xl mb-5 text-center'>Sign in</h1>
        <label htmlFor='email'>
          Email
          <input
            type='email'
            name='email'
            placeholder='username@email.com'
            className='inpt'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            type='password'
            name='password'
            placeholder='password'
            className='inpt'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <p className='cursor-pointer' onClick={() => navigate('/requestotp')}>Forgot password?</p>
        <button className='bg-sky-500 hover:bg-sky-600 w-full rounded-md h-8 mt-2 font-semibold'>Sign in</button>
        <p className='text-center p-5 font-light text-sm'>
          Don't have an account?{' '}
          <span
            className='text-green-300 cursor-pointer'
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
