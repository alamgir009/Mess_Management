import React, { useState } from 'react';
import { SideBar } from './SideBar';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addMeal } from '../../store/slices/mealSlice';

const meal_OPTIONS = ['day', 'night', 'both'];

const Meal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mealTime: '',
    date: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!formData.mealTime || !formData.date) {
          toast.error("All fields are required");
          return;
        }
    
        try {
          const resultAction = await dispatch(addMeal(formData));
    
          if (addMeal.fulfilled.match(resultAction)) {
            toast.success("Meal added successfully", { duration: 2000 });
            setFormData({ mealTime: "", date: "" }); // Reset form
            setTimeout(() => navigate("/dashboard"), 2000);
          } else {
            // Handles rejectWithValue or API error message
            toast.error(resultAction.payload || "Failed to add meal.");
          }
        } catch (error) {
          toast.error(error.message || "Something went wrong");
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
