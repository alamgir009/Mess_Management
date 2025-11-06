import React, { useState } from "react";
import { SideBar } from "./SideBar";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addMarket } from "../../store/slices/marketSlice"; // ✅ Correct import path

const items_OPTIONS = ["Chicken", "Fish", "Beef", "Egg", "Veg", "Grocery"];

const Market = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    items: "",
    amount: "",
    date: "",
  });

  // ✅ Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ Handle form submit using Redux thunk
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.items || !formData.amount || !formData.date) {
      toast.error("All fields are required");
      return;
    }

    try {
      const resultAction = await dispatch(addMarket(formData));

      if (addMarket.fulfilled.match(resultAction)) {
        toast.success("Market added successfully", { duration: 2000 });
        setFormData({ items: "", amount: "", date: "" }); // Reset form
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        // Handles rejectWithValue or API error message
        toast.error(resultAction.payload || "Failed to add market");
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
        <div className="w-full max-w-lg bg-black/45 border border-gray-600 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl text-center font-bold text-sky-200 mb-8">
            Add Market
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Items Selection */}
            <div>
              <label
                htmlFor="items"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Items
              </label>
              <select
                id="items"
                name="items"
                value={formData.items}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select an item
                </option>
                {items_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="text-gray-300 bg-black/70"
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="₹"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date Input */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-gray-100 font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                Add Market
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Market;
