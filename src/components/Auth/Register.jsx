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
    <div className='bg-gradient-to-b from-black to-blue-950 text-gray-50 mt-20 h-screen flex justify-center items-center'>
      <form
        onSubmit={handleSubmit}
        className='border border-green-300 p-5 font-inter w-full md:w-80 lg:w-80 xl:w-96 rounded-md m-2 lg:-mt-20 bg-green-400/10'
      >
        <h1 className='text-4xl mb-5 text-center'>Sign up</h1>
        <label htmlFor='name'>
          Name
          <input
            type='text'
            name='name'
            placeholder='Enter your name'
            className='inpt'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
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
        <label htmlFor='phone'>
          Phone
          <input
            type='tel'
            name='phone'
            placeholder='+91'
            className='inpt'
            value={formData.phone}
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
        <label htmlFor='confirmPassword'>
          Confirm Password
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm password'
            className='inpt'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>
        <button className='bg-sky-500 hover:bg-sky-600 w-full rounded-md h-8 mt-2 font-semibold'>
          Sign up
        </button>
        <p className='text-center p-5 font-light text-sm'>
          Already have an account?{' '}
          <span
            className='text-green-300 cursor-pointer'
            onClick={() => navigate('/signin')}
          >
            Sign in
          </span>
        </p>
      </form>
      <Toaster position='top-center' reverseOrder={false} />
    </div>
  );
};
