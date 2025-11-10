import React, { useState, useEffect } from 'react';
import { SideBar } from './SideBar';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMeal } from '../../store/slices/mealSlice';
import { fetchProfile } from "../../store/slices/userSlice";
import {
  FiClock,
  FiCalendar,
  FiArrowRight,
  FiCheck,
  FiSun,
  FiMoon,
  FiWatch,
  FiAlertCircle,
  FiEdit,
  FiUser,
  FiZap,
  FiX
} from 'react-icons/fi';
import { MdOutlineMenu } from 'react-icons/md';

const MEAL_OPTIONS = [
  {
    value: 'day',
    label: 'Day Meal',
    icon: FiSun,
    count: 1,
    gradient: 'from-amber-400 via-yellow-400 to-orange-500',
    glowColor: 'shadow-amber-500/30',
    bgGradient: 'from-amber-50/5 to-orange-50/5'
  },
  {
    value: 'night',
    label: 'Night Meal',
    icon: FiMoon,
    count: 1,
    gradient: 'from-indigo-400 via-purple-400 to-blue-500',
    glowColor: 'shadow-indigo-500/30',
    bgGradient: 'from-indigo-50/5 to-purple-50/5'
  },
  {
    value: 'both',
    label: 'Both Meals',
    icon: FiWatch,
    count: 2,
    gradient: 'from-violet-400 via-fuchsia-400 to-pink-500',
    glowColor: 'shadow-violet-500/30',
    bgGradient: 'from-violet-50/5 to-pink-50/5'
  }
];

const Meal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user profile data from Redux store
  const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.userData);

  const [formData, setFormData] = useState({
    mealTime: '',
    date: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animationState, setAnimationState] = useState({
    day: false,
    night: false,
    both: false
  });

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleMealTimeSelect = (mealTime) => {
    setFormData(prev => ({ ...prev, mealTime }));

    // Reset all animations first
    setAnimationState({
      day: false,
      night: false,
      both: false
    });

    // Set animation for selected meal time
    setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        [mealTime]: true
      }));
    }, 50);
  };

  // Check if meal already exists for the same date
  const checkMealExists = (date, mealTime) => {
    if (!profile?.mealDetails || !date) return false;

    const existingMeal = profile.mealDetails.find(meal => {
      const mealDate = new Date(meal.date).toISOString().split('T')[0];
      const inputDate = new Date(date).toISOString().split('T')[0];

      return mealDate === inputDate && meal.mealTime === mealTime;
    });

    return !!existingMeal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.mealTime || !formData.date) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    // Check for existing meals
    if (formData.mealTime === 'both') {
      const dayExists = checkMealExists(formData.date, 'day');
      const nightExists = checkMealExists(formData.date, 'night');
      const bothExists = checkMealExists(formData.date, 'both');

      if (dayExists || nightExists || bothExists) {
        toast.error(
          <div>
            Meal already exists for this date!
            <br />
            <button
              onClick={() => navigate('/profile')}
              className="underline hover:text-blue-300 mt-1"
            >
              Go to Profile to edit
            </button>
          </div>,
          { duration: 5000 }
        );
        setIsSubmitting(false);
        return;
      }
    } else {
      const mealExists = checkMealExists(formData.date, formData.mealTime);
      const bothExists = checkMealExists(formData.date, 'both');

      if (mealExists || bothExists) {
        toast.error(
          <div>
            {formData.mealTime} meal already exists for this date!
            <br />
            <button
              onClick={() => navigate('/profile')}
              className="underline hover:text-blue-300 mt-1"
            >
              Go to Profile to edit
            </button>
          </div>,
          { duration: 5000 }
        );
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Calculate count based on selection
      const count = formData.mealTime === 'both' ? 2 : 1;
      const submitData = { ...formData, count };

      const resultAction = await dispatch(addMeal(submitData));

      if (addMeal.fulfilled.match(resultAction)) {
        toast.success("Meal added successfully!", { duration: 2000 });
        setFormData({ mealTime: "", date: "" });
        // Refresh profile to get updated meal details
        dispatch(fetchProfile());
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(resultAction.payload || "Failed to add meal");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleQuickDate = () => {
    setFormData(prev => ({ ...prev, date: getTodayDate() }));
  };

  const selectedOption = MEAL_OPTIONS.find(opt => opt.value === formData.mealTime);
  const mealCount = formData.mealTime === 'both' ? 2 : formData.mealTime ? 1 : 0;

  // Get existing meals for the selected date
  const getExistingMealsForDate = (date) => {
    if (!profile?.mealDetails || !date) return [];

    const inputDate = new Date(date).toISOString().split('T')[0];
    return profile.mealDetails.filter(meal => {
      const mealDate = new Date(meal.date).toISOString().split('T')[0];
      return mealDate === inputDate;
    });
  };

  const existingMeals = getExistingMealsForDate(formData.date);

  // macOS/iOS Style Animation Components
  const SunriseAnimation = () => (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm border border-amber-500/30 transition-all duration-1000 ${animationState.day ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`relative w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full shadow-lg shadow-amber-400/50 transition-all duration-1000 ${animationState.day ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className={`absolute inset-0 rounded-full bg-amber-400/30 blur-xl transition-all duration-1500 ${animationState.day ? 'scale-150 opacity-40' : 'scale-100 opacity-0'}`} />
        </div>
      </div>
      <div className="absolute inset-0">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
          <div
            key={rotation}
            className={`absolute w-1 h-3 bg-amber-400/60 rounded-full left-1/2 top-1/2 origin-center transition-all duration-1000 ${animationState.day ? 'opacity-60 scale-y-100' : 'opacity-0 scale-y-0'}`}
            style={{
              transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-20px)`,
              transitionDelay: `${index * 100}ms`
            }}
          />
        ))}
      </div>
    </div>
  );

  const NightAnimation = () => (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 transition-all duration-1000 ${animationState.night ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`relative w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-300 rounded-full shadow-lg shadow-indigo-400/50 transition-all duration-1000 ${animationState.night ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="absolute w-4 h-4 bg-blue-200/50 rounded-full -top-1 -right-1" />
          <div className={`absolute inset-0 rounded-full bg-indigo-400/30 blur-xl transition-all duration-1500 ${animationState.night ? 'scale-150 opacity-30' : 'scale-100 opacity-0'}`} />
        </div>
      </div>
      {[
        { top: '25%', left: '30%', delay: 200 },
        { top: '35%', left: '70%', delay: 400 },
        { top: '60%', left: '20%', delay: 600 },
        { top: '70%', left: '60%', delay: 800 }
      ].map((star, index) => (
        <div
          key={index}
          className={`absolute w-1 h-1 bg-white rounded-full transition-all duration-700 ${animationState.night ? 'opacity-80 scale-100' : 'opacity-0 scale-0'}`}
          style={{
            top: star.top,
            left: star.left,
            transitionDelay: `${star.delay}ms`
          }}
        />
      ))}
    </div>
  );

  const BothAnimation = () => (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-600/20 backdrop-blur-sm border border-violet-500/30 transition-all duration-1000 ${animationState.both ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} />
      <div className="absolute inset-4 rounded-xl overflow-hidden">
        <div className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-amber-500/30 to-orange-600/20 transition-all duration-1000 ${animationState.both ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <div className={`absolute top-2 left-2 w-6 h-6 bg-amber-400 rounded-full shadow-lg shadow-amber-400/30 transition-all duration-700 ${animationState.both ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
        </div>
        <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-indigo-500/30 to-purple-600/20 transition-all duration-1000 ${animationState.both ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className={`absolute top-2 right-2 w-5 h-5 bg-indigo-200 rounded-full shadow-lg shadow-indigo-400/30 transition-all duration-700 ${animationState.both ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <div className="absolute w-2 h-2 bg-indigo-300/50 rounded-full -top-0.5 -right-0.5" />
          </div>
        </div>
      </div>
      <div className={`absolute top-1/2 left-1/2 w-0.5 h-8 bg-gradient-to-br from-amber-400 to-indigo-400 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${animationState.both ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`} />
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${animationState.both ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <FiWatch className="w-8 h-8 text-violet-400" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row bg-[#0a0a0a] min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="menu-button lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center shadow-lg hover:from-white/15 hover:to-white/10 transition-all duration-300"
      >
        {isSidebarOpen ? (
          <FiX className="w-6 h-6 text-white" />
        ) : (
          <MdOutlineMenu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Sidebar - Desktop and Mobile */}
      <div className={`sidebar fixed lg:relative w-80 bg-black/40 rounded-md lg:m-1 shadow-2xl border border-white/5 z-40 h-screen lg:h-auto transition-all duration-300 ${
        isSidebarOpen ? 'left-0' : '-left-80 lg:left-0'
      }`}>
        <SideBar />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-grow relative overflow-hidden">
        {/* Premium background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-[#0a0a0a]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        </div>

        {/* Dynamic ambient lighting */}
        {formData.mealTime && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {formData.mealTime === 'day' && (
              <>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-[120px] animate-ambient-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-yellow-500/15 to-transparent rounded-full blur-[100px] animate-ambient-drift"></div>
              </>
            )}
            {formData.mealTime === 'night' && (
              <>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-purple-600/10 rounded-full blur-[120px] animate-ambient-pulse"></div>
                <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full blur-[100px] animate-ambient-drift"></div>
              </>
            )}
            {formData.mealTime === 'both' && (
              <>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/20 to-fuchsia-600/10 rounded-full blur-[120px] animate-ambient-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-pink-500/15 to-transparent rounded-full blur-[100px] animate-ambient-drift"></div>
              </>
            )}
          </div>
        )}

        <div className="relative z-10 p-6 lg:p-10 max-w-5xl mx-auto mt-16 lg:mt-0">
          {/* Modern Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedOption ? selectedOption.gradient : 'from-gray-700 to-gray-800'} flex items-center justify-center shadow-2xl ${selectedOption ? selectedOption.glowColor : ''} transition-all duration-700`}>
                    <FiClock className="w-7 h-7 text-white" />
                  </div>
                  {selectedOption && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a] animate-scale-in-bounce"></div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                    Add Meal Entry
                  </h1>
                  <p className="text-gray-500 text-xs md:text-sm">Track your nutritional journey</p>
                </div>
              </div>
              {selectedOption && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-full border border-white/10 backdrop-blur-xl animate-slide-in-right">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400 font-medium">Active Selection</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meal Selection Card */}
              <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/10 p-6 md:p-8 shadow-2xl shadow-black/20 transition-all duration-700 hover:border-white/20">
                {selectedOption && (
                  <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-r ${selectedOption.gradient} opacity-0 blur-xl animate-border-glow`}></div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-white">Choose Meal Type</h3>
                    <FiZap className="w-5 h-5 text-gray-500" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {MEAL_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const isSelected = formData.mealTime === option.value;
                      const isDisabled = formData.date && checkMealExists(formData.date, option.value);

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => !isDisabled && handleMealTimeSelect(option.value)}
                          disabled={isDisabled}
                          className={`relative group/card overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                            isDisabled
                              ? 'border-red-500/30 bg-red-500/10 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'border-white/30 shadow-2xl scale-[1.02]'
                              : 'border-white/5 hover:border-white/15 hover:scale-[1.01]'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} transition-opacity duration-500 ${
                            isSelected ? 'opacity-100' : isDisabled ? 'opacity-0' : 'opacity-0 group-hover/card:opacity-50'
                          }`}></div>

                          {isSelected && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-20 animate-pulse-slow`}></div>
                          )}

                          <div className="relative p-4 md:p-6 flex flex-col items-center justify-center space-y-3">
                            <div className={`relative p-3 md:p-4 rounded-2xl transition-all duration-500 ${
                              isSelected
                                ? `bg-gradient-to-br ${option.gradient} shadow-lg ${option.glowColor}`
                                : isDisabled
                                ? 'bg-red-500/20'
                                : 'bg-white/5 group-hover/card:bg-white/10'
                            }`}>
                              <Icon className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-500 ${
                                isSelected ? 'text-white' : isDisabled ? 'text-red-400' : 'text-gray-400 group-hover/card:text-gray-300'
                              }`} />
                            </div>

                            <div className="text-center space-y-1">
                              <p className={`text-sm md:text-base font-semibold transition-colors duration-500 ${
                                isSelected ? 'text-white' : isDisabled ? 'text-red-400' : 'text-gray-400 group-hover/card:text-gray-300'
                              }`}>
                                {option.label}
                              </p>
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-500 ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : isDisabled
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-white/5 text-gray-500 group-hover/card:bg-white/10 group-hover/card:text-gray-400'
                              }`}>
                                <FiCheck className="w-3 h-3" />
                                Count: {option.count}
                              </div>
                            </div>

                            {isSelected && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in-bounce">
                                <FiCheck className="w-4 h-4 text-black" strokeWidth={3} />
                              </div>
                            )}
                            {isDisabled && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in-bounce">
                                <FiUser className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Date Card */}
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/10 p-6 md:p-8 shadow-2xl shadow-black/20 transition-all duration-700 hover:border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
                      <FiCalendar className="w-5 h-5" />
                      Select Date
                    </h3>
                    <button
                      type="button"
                      onClick={handleQuickDate}
                      className="group/btn px-3 md:px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 rounded-xl text-xs md:text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2"
                    >
                      <FiCalendar className="w-3 md:w-4 h-3 md:h-4" />
                      <span>Today</span>
                      <FiArrowRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 -ml-2 group-hover/btn:ml-0 transition-all duration-300" />
                    </button>
                  </div>

                  <div className="relative group/input">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/5 hover:bg-white/8 focus:bg-white/10 text-white border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl focus:outline-none transition-all duration-300 text-sm md:text-base font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Existing Meals Warning */}
              {existingMeals.length > 0 && (
                <div className="relative bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-2xl rounded-[28px] border border-red-500/20 p-6 shadow-2xl shadow-black/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                      <FiAlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-white">Existing Meals Found</h3>
                  </div>

                  <div className="space-y-3">
                    <p className="text-red-300 text-sm">
                      The following meals already exist for {formData.date}:
                    </p>
                    <div className="space-y-2">
                      {existingMeals.map((meal) => (
                        <div key={meal._id} className="flex justify-between items-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                          <span className="text-red-300 text-sm capitalize">{meal.mealTime} meal</span>
                          <span className="text-red-400 text-sm font-medium">Already exists</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                    >
                      <FiEdit className="w-4 h-4" />
                      Go to Profile to Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || existingMeals.length > 0 || !formData.mealTime || !formData.date}
                className={`group/submit w-full relative overflow-hidden rounded-2xl transition-all duration-500 ${
                  formData.mealTime && formData.date && !isSubmitting && existingMeals.length === 0
                    ? `bg-gradient-to-r ${selectedOption?.gradient || 'from-gray-600 to-gray-700'} hover:shadow-2xl ${selectedOption?.glowColor || ''} hover:scale-[1.02] active:scale-[0.98]`
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed opacity-50'
                }`}
              >
                {formData.mealTime && formData.date && !isSubmitting && existingMeals.length === 0 && (
                  <div className="absolute inset-0 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                )}

                <div className="relative px-6 md:px-8 py-4 md:py-5 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-white font-semibold text-sm md:text-base">Processing...</span>
                    </>
                  ) : existingMeals.length > 0 ? (
                    <>
                      <FiUser className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold text-sm md:text-base">Meal Exists - Edit in Profile</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-semibold text-sm md:text-base">Add Meal Entry</span>
                      <FiArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover/submit:translate-x-1" />
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Status Card */}
              {formData.mealTime && (
                <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl rounded-[24px] border border-white/10 p-6 shadow-xl animate-slide-in-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                      <FiCheck className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <h3 className="text-base font-semibold text-white">Summary</h3>
                  </div>

                  {/* Animation Display */}
                  <div className="mb-4">
                    {formData.mealTime === 'day' && <SunriseAnimation />}
                    {formData.mealTime === 'night' && <NightAnimation />}
                    {formData.mealTime === 'both' && <BothAnimation />}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-sm text-gray-400">Type</span>
                      <span className="text-sm text-white font-medium capitalize">{formData.mealTime}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-sm text-gray-400">Count</span>
                      <span className={`text-sm font-bold bg-gradient-to-r ${selectedOption?.gradient} bg-clip-text text-transparent`}>
                        {mealCount}
                      </span>
                    </div>
                    {formData.date && (
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-sm text-gray-400">Date</span>
                        <span className="text-sm text-white font-medium">{formData.date}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-sm text-gray-400">Status</span>
                      <span className={`text-sm font-bold ${existingMeals.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {existingMeals.length > 0 ? 'Meal Exists' : 'Ready to Add'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-2xl rounded-[24px] border border-white/5 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <FiAlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Quick Guide</h3>
                </div>

                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-start gap-3 p-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mt-1.5 flex-shrink-0"></div>
                    <p className="leading-relaxed"><span className="text-gray-300 font-medium">Day</span> & <span className="text-gray-300 font-medium">Night</span> meals count as <span className="text-white font-semibold">1</span> entry</p>
                  </div>
                  <div className="flex items-start gap-3 p-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-pink-500 mt-1.5 flex-shrink-0"></div>
                    <p className="leading-relaxed"><span className="text-gray-300 font-medium">Both</span> option counts as <span className="text-white font-semibold">2</span> entries</p>
                  </div>
                  <div className="flex items-start gap-3 p-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mt-1.5 flex-shrink-0"></div>
                    <p className="leading-relaxed">Consistent tracking builds better habits</p>
                  </div>
                </div>
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
        @keyframes ambient-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes ambient-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        
        @keyframes border-glow {
          0% { opacity: 0; }
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        
        @keyframes scale-in-bounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          0% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-left {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        .animate-ambient-pulse {
          animation: ambient-pulse 4s ease-in-out forwards;
        }
        
        .animate-ambient-drift {
          animation: ambient-drift 6s ease-in-out 0.5s forwards;
        }
        
        .animate-border-glow {
          animation: border-glow 1.5s ease-out forwards;
        }
        
        .animate-scale-in-bounce {
          animation: scale-in-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out forwards;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7);
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          filter: invert(1);
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Meal;