import React, { useState, useEffect } from "react";
import { SideBar } from "./SideBar";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMarket, fetchMarketAmounts } from "../../store/slices/marketSlice";
import { fetchProfile } from "../../store/slices/userSlice";
import { 
  FiShoppingCart, 
  FiDollarSign, 
  FiCalendar, 
  FiArrowRight,
  FiPackage,
  FiCheck,
  FiPlus,
  FiX,
  FiTag,
  FiTrendingUp,
  FiPieChart,
  FiClock,
  FiAlertCircle
} from "react-icons/fi";
import { BiLeaf } from "react-icons/bi";
import { GiFishbone, GiChickenOven, GiCow } from "react-icons/gi";
import { MdOutlineEgg } from "react-icons/md";
import { PiShoppingCart } from "react-icons/pi";

const items_OPTIONS = [
  { value: "Chicken", icon: GiChickenOven, color: "text-orange-400" },
  { value: "Fish", icon: GiFishbone, color: "text-cyan-400" },
  { value: "Beef", icon: GiCow, color: "text-red-400" },
  { value: "Egg", icon: MdOutlineEgg, color: "text-yellow-400" },
  { value: "Veg", icon: BiLeaf, color: "text-green-400" },
  { value: "Grocery", icon: FiPackage, color: "text-purple-400" }
];

const Market = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get market data from Redux store
  const { markets, loading, error } = useSelector((state) => state.market || { markets: [], loading: false, error: null });
  
  // Get user profile data from Redux store
  const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.userData);

  const [formData, setFormData] = useState({
    items: "",
    amount: "",
    date: "",
    customItem: "",
    notes: "",
    quantity: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch user profile and market data on component mount
  useEffect(() => {
    dispatch(fetchProfile());
    // dispatch(fetchMarketAmounts());
  }, [dispatch]);

  // Use profile.marketDetails directly for recent entries
  const recentEntries = profile?.marketDetails
    ?.slice(-3)
    .reverse()
    .map(market => ({
      item: market.items,
      amount: market.amount,
      date: market.date ? new Date(market.date).toISOString().split('T')[0] : '',
    })) || [];

  // Calculate today's total from profile.marketDetails
  const todayDate = new Date().toISOString().split('T')[0];
  const todayTotal = profile?.marketDetails
    ?.filter(market => {
      const marketDate = market.date ? new Date(market.date).toISOString().split('T')[0] : '';
      return marketDate === todayDate;
    })
    .reduce((sum, market) => sum + parseFloat(market.amount || 0), 0) || 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const itemToSubmit = showCustomItem && formData.customItem ? formData.customItem : formData.items;

    if (!itemToSubmit || !formData.amount || !formData.date) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        items: itemToSubmit,
        amount: formData.amount,
        date: formData.date,
        ...(formData.notes && { notes: formData.notes }),
        ...(formData.quantity && { quantity: formData.quantity }),
      };

      const resultAction = await dispatch(addMarket(submitData));

      if (addMarket.fulfilled.match(resultAction)) {
        toast.success("Market entry added successfully!", { duration: 2000 });
        setFormData({ items: "", amount: "", date: "", customItem: "", notes: "", quantity: "" });
        setShowCustomItem(false);
        setShowAdvanced(false);
        // Refresh the profile data to update recent entries
        dispatch(fetchProfile());
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(resultAction.payload || "Failed to add market entry");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (entry) => {
    setFormData(prev => ({
      ...prev,
      items: entry.item,
      amount: entry.amount,
      date: new Date().toISOString().split('T')[0]
    }));
    setShowCustomItem(false);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const selectedOption = items_OPTIONS.find(opt => opt.value === formData.items);
  const totalAmount = parseFloat(formData.amount) || 0;

  return (
    <div className="flex flex-col lg:flex-row bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 min-h-screen">
      {/* Sidebar */}
      <div className="sidebar w-full lg:w-80 bg-gray-950 rounded-md lg:m-1 shadow-lg">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-grow relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slower"></div>

        <div className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                <PiShoppingCart  className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">Add Market Entry</h1>
                <p className="text-gray-400">Track and manage your market expenses</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today's Total</p>
                    <p className="text-2xl font-bold text-white mt-1">₹{todayTotal.toFixed(2)}</p>
                  </div>
                  <FiTrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Entries</p>
                    <p className="text-2xl font-bold text-white mt-1">{profile?.marketDetails?.length || 0}</p>
                  </div>
                  <FiPieChart className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700/50 p-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FiTag className="w-5 h-5" />
                    Entry Details
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Category Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-300">
                        Select Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCustomItem(!showCustomItem)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        {showCustomItem ? <FiX className="w-3 h-3" /> : <FiPlus className="w-3 h-3" />}
                        {showCustomItem ? "Use Preset" : "Add Custom"}
                      </button>
                    </div>

                    {!showCustomItem ? (
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {items_OPTIONS.map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.items === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, items: option.value }))}
                              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-700/50'
                              }`}
                            >
                              <Icon className={`w-7 h-7 mb-2 ${isSelected ? option.color : 'text-gray-400'}`} />
                              <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                {option.value}
                              </span>
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                  <FiCheck className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          name="customItem"
                          placeholder="Enter custom item name"
                          value={formData.customItem}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-700/50 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Amount and Quantity Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                        Amount (Required)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiDollarSign className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-gray-700/50 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">
                        Quantity (Optional)
                      </label>
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        placeholder="e.g., 2 kg, 5 units"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700/50 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="date" className="block text-sm font-medium text-gray-300">
                        Date
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, date: getTodayDate() }))}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        <FiClock className="w-3 h-3" />
                        Use Today
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiCalendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-700/50 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Advanced Options Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-2 transition-colors"
                  >
                    {showAdvanced ? <FiX className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                    {showAdvanced ? "Hide" : "Show"} Additional Options
                  </button>

                  {/* Advanced Section */}
                  {showAdvanced && (
                    <div className="space-y-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                      <div className="space-y-3">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          placeholder="Add any additional notes..."
                          value={formData.notes}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-3 bg-gray-700/50 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Add Market Entry
                        <FiArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Quick Summary */}
              {(formData.items || formData.customItem) && formData.amount && (
                <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiCheck className="w-5 h-5 text-green-400" />
                    Quick Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                      <span className="text-gray-400 text-sm">Item</span>
                      <span className="text-white font-medium">
                        {formData.customItem || formData.items}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                      <span className="text-gray-400 text-sm">Amount</span>
                      <span className="text-white font-medium">₹{formData.amount}</span>
                    </div>
                    {formData.quantity && (
                      <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                        <span className="text-gray-400 text-sm">Quantity</span>
                        <span className="text-white font-medium">{formData.quantity}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-300 font-medium">Total</span>
                      <span className="text-white text-xl font-bold">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Entries */}
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Entries</h3>
                <div className="space-y-3">
                  {profileLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  ) : recentEntries.length === 0 ? (
                    <div className="text-center py-8">
                      <FiPackage className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No recent entries</p>
                      <p className="text-gray-500 text-xs mt-1">Add your first entry above</p>
                    </div>
                  ) : (
                    recentEntries.map((entry, index) => {
                      const option = items_OPTIONS.find(opt => opt.value === entry.item);
                      const Icon = option?.icon || FiPackage;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleQuickFill(entry)}
                          className="w-full flex items-center justify-between p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                              <Icon className={`w-5 h-5 ${option?.color || 'text-gray-400'}`} />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-white">{entry.item}</p>
                              <p className="text-xs text-gray-400">{entry.date}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-blue-400 group-hover:text-blue-300">
                            ₹{entry.amount}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FiAlertCircle className="w-5 h-5 text-blue-400" />
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Click recent entries to quickly add similar items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Use custom items for one-time purchases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Add notes for better expense tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f3f4f6',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f3f4f6',
            },
          },
        }}
      />

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.6);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Market;