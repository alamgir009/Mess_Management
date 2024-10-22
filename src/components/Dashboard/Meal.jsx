import React, { useState } from 'react';
import { SideBar } from './SideBar';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const meal_OPTIONS = ['day', 'night', 'both'];

const Meal = () => {
  const [formData, setFormData] = useState({
    mealTime: '',
    date: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/meal/addmeal", formData, { withCredentials: true });
      const successMessage = response?.data?.message || 'Meal added successfully';
      toast.success(successMessage, { duration: 2000 });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      toast.error(errorMessage, { duration: 2000 });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between bg-gradient-to-b from-gray-900 to-blue-950 h-screen text-gray-100">
      {/* Sidebar */}
      <div className="sidebar w-full lg:w-80 bg-gray-950 rounded-md lg:m-1 shadow-lg">
        <SideBar />
      </div>

      {/* Form Container */}
      <div className="flex-grow flex flex-col justify-center items-center p-4 lg:ml-5">
        <div className="w-full max-w-lg bg-black/50 border border-gray-600 rounded-lg shadow-xl p-8 backdrop-blur-md">
          <h1 className="text-3xl text-center font-bold text-sky-200 mb-8">Add Meal</h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Meal Time Selection */}
            <div className="flex flex-col">
              <label htmlFor="mealTime" className="text-sm font-medium text-gray-300 mb-2">Meal Time</label>
              <select
                id="mealTime"
                name="mealTime"
                value={formData.mealTime}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a meal</option>
                {meal_OPTIONS.map((option) => (
                  <option key={option} value={option} className="text-gray-300 bg-gray-900">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="flex flex-col">
              <label htmlFor="date" className="text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Meal
              </button>
            </div>

          </form>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Meal;
