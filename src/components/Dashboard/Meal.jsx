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
    <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 h-screen">
      <div className="sidebar w-screen m-1 rounded-md text-white lg:w-80 bg-gray-950">
        <SideBar />
      </div>
      <div className="flex-grow border rounded-md border-gray-500 m-1 p-4">
        <h1 className="text-center text-xl sm:text-2xl w-full mb-4">Meals</h1>
        <hr className="mb-4" />
        <div className="flex justify-center gap-4">
          <form
            className="border border-green-300 p-5 font-inter w-full md:w-80 lg:w-80 xl:w-96 rounded-md lg:mt-20 bg-green-400/10"
            onSubmit={handleSubmit}
          >
            <h1 className="text-4xl mb-5 text-center">Add Meal</h1>

            <label htmlFor="mealTime" className="block mb-2">
              Meal Time
              <select
                id="mealTime"
                name="mealTime"
                value={formData.mealTime}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-black"
                required
              >
                <option value="">Select an meal</option>
                {meal_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>


            <label htmlFor="date" className="block mb-2">
              Date
              <input
                type="date"
                id="date"
                name="date"
                placeholder="02/10/24"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-black"
                required
              />
            </label>

            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 w-full rounded-md p-2 mt-4 font-semibold"
            >
              Add Meal
            </button>
          </form>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Meal;