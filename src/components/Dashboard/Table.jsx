import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAggeratedUsers } from '../../store/slices/userSlice';
import { SideBar } from './SideBar';
import {
  FaUsers,
  FaUtensils,
  FaShoppingCart,
  FaClock,
  FaChevronDown,
  FaChevronRight,
  FaUser,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaFire,
  FaInfoCircle,
  FaChartBar,
  FaChartPie,
  FaReceipt,
  FaCalendarDay,
  FaExclamationTriangle,
  FaWallet,
  FaDollarSign,
  FaStar,
  FaCog,
  FaSyncAlt,
  FaExpandAlt,
  FaFilter,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import {
  MdRestaurant,
  MdAccountBalanceWallet,
  MdPayment,
  MdLocalGasStation,
  MdAdminPanelSettings,
  MdPerson,
  MdVerified,
  MdOutlineMenu
} from 'react-icons/md';
import {
  HiUserGroup,
  HiCurrencyRupee
} from 'react-icons/hi';
import {
  IoStatsChart,
  IoReceiptSharp
} from 'react-icons/io5';

const Table = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userData);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Fetch users on initial load
  useEffect(() => {
    dispatch(getAggeratedUsers());
  }, [dispatch]);

  // ✅ Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ Close sidebar when clicking on overlay or link
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // ✅ Get the expanded user data directly from users array
  const expandedUser = useMemo(() => {
    if (!expandedUserId) return null;
    return users.find(user => user._id === expandedUserId);
  }, [users, expandedUserId]);

  // ✅ Calculate total statistics
  const totalStats = useMemo(() => {
    const totalMarket = users.reduce((sum, user) => sum + (user.totalAmount || 0), 0);
    const totalMeal = users.reduce((sum, user) => sum + (user.totalMeal || 0), 0);
    const totalUsers = users.filter(user => user.userStatus !== 'denied').length;
    const pendingPayments = users.filter(user => user.payment === 'pending' & user.userStatus !== 'denied').length;

    return {
      totalMarket,
      totalMeal,
      totalUsers,
      pendingPayments
    };
  }, [users]);

  // ✅ Optimized: Memoized utility functions
  const getRoleClass = useCallback((role) => {
    switch (role) {
      case 'admin':
        return 'text-purple-300 bg-purple-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit';
      case 'user':
        return 'text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit';
      default:
        return 'text-white bg-gray-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit';
    }
  }, []);

  const getStatusClass = useCallback((status) => {
    return status === 'approved'
      ? 'text-lime-400 bg-lime-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit'
      : 'text-red-400 bg-red-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit';
  }, []);

  const getPaymentClass = useCallback((payment) => {
    return payment === 'success'
      ? 'text-green-300 bg-green-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit'
      : 'text-orange-300 bg-orange-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit';
  }, []);

  const getGasClass = useCallback((gasBill) => {
    return gasBill === 'success'
      ? 'text-green-300 bg-green-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit'
      : 'text-orange-300 bg-orange-500/10 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit';
  }, []);

  // ✅ Optimized: Memoized filtered users
  const filteredUsers = useMemo(() =>
    users.filter(user => user.userStatus !== 'denied'),
    [users]
  );

  // ✅ Optimized: Toggle row expansion
  const handleRowClick = useCallback((userId) => {
    setExpandedUserId(current => current === userId ? null : userId);
  }, []);

  // Loading and error states
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-blue-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
        <p className="text-gray-300 text-lg font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-blue-950">
      <div className="flex flex-col items-center gap-3">
        <FaExclamationTriangle className="text-red-500 text-4xl" />
        <p className="text-red-500 text-xl font-light">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 min-h-screen relative">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="menu-button lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center shadow-lg hover:from-white/15 hover:to-white/10 transition-all duration-300"

      >
        {isSidebarOpen ? (
          <FiX className="text-white w-6 h-6" />
        ) : (
          <MdOutlineMenu className="text-white w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          sidebar fixed lg:relative z-40 h-screen lg:h-auto
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-80 lg:w-80 bg-black/60 rounded-md m-1 lg:m-1
          overflow-y-auto
        `}
      >
        <SideBar onLinkClick={closeSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-grow border border-gray-500 rounded-md m-1 p-4 overflow-auto lg:ml-0 mt-16 lg:mt-0">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <IoStatsChart className="text-cyan-400 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                User Overview
              </h1>
              <p className="text-gray-400 text-sm">Manage and monitor all user activities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded-lg transition-all duration-300">
              <FaFilter className="text-cyan-400" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg transition-all duration-300">
              <FaSyncAlt className="text-purple-400" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ✅ ENHANCED: Dashboard Cards Grid with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Market Card */}
          <div className="backdrop-blur-lg bg-green-500/10 border border-green-400/20 rounded-xl p-4 transition-all duration-300 hover:bg-green-500/15 hover:border-green-400/30 hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-300 text-sm font-medium mb-1 flex items-center gap-2">
                  <FaShoppingCart className="text-green-400" />
                  Total Market
                </div>
                <div className="text-2xl font-bold text-white">₹{totalStats.totalMarket}</div>
                <div className="text-green-400/70 text-xs mt-1">All users combined</div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <HiCurrencyRupee className="text-green-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Total Meal Card */}
          <div className="backdrop-blur-lg bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 transition-all duration-300 hover:bg-blue-500/15 hover:border-blue-400/30 hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-300 text-sm font-medium mb-1 flex items-center gap-2">
                  <MdRestaurant className="text-blue-400" />
                  Total Meal
                </div>
                <div className="text-2xl font-bold text-white">{totalStats.totalMeal}</div>
                <div className="text-blue-400/70 text-xs mt-1">Total meals consumed</div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <FaUtensils className="text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Total Users Card */}
          <div className="backdrop-blur-lg bg-purple-500/10 border border-purple-400/20 rounded-xl p-4 transition-all duration-300 hover:bg-purple-500/15 hover:border-purple-400/30 hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-300 text-sm font-medium mb-1 flex items-center gap-2">
                  <HiUserGroup className="text-purple-400" />
                  Total Users
                </div>
                <div className="text-2xl font-bold text-white">{totalStats.totalUsers}</div>
                <div className="text-purple-400/70 text-xs mt-1">Active members</div>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <FaUsers className="text-purple-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Pending Payments Card */}
          <div className="backdrop-blur-lg bg-orange-500/10 border border-orange-400/20 rounded-xl p-4 transition-all duration-300 hover:bg-orange-500/15 hover:border-orange-400/30 hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-orange-300 text-sm font-medium mb-1 flex items-center gap-2">
                  <FaClock className="text-orange-400" />
                  Pending
                </div>
                <div className="text-2xl font-bold text-white">{totalStats.pendingPayments}</div>
                <div className="text-orange-400/70 text-xs mt-1">Need action</div>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-full">
                <MdPayment className="text-orange-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <hr className="mb-4 border-gray-500" />

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-gray-500 font-inter shadow-2xl">
          <table className="min-w-full bg-gray-900/50 text-white">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-left">
                <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-cyan-400" />
                    Name
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-cyan-400" />
                    Phone
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-cyan-400" />
                    Market
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaUtensils className="text-cyan-400" />
                    Meals
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaCreditCard className="text-cyan-400" />
                    Payment
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaFire className="text-cyan-400" />
                    Gas Bill
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <React.Fragment key={user._id}>
                  {/* Main Table Row */}
                  <tr
                    className={`hover:bg-gray-600/50 text-gray-300 cursor-pointer transition-all duration-200 ${expandedUserId === user._id ? 'bg-gray-600/30' : ''
                      }`}
                    onClick={() => handleRowClick(user._id)}
                  >
                    <td className="py-4 px-4 border-t border-gray-700 font-medium">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cyan-500/20 rounded-full">
                            <FaUser className="text-cyan-400 text-sm" />
                          </div>
                          <span className="font-semibold">{user.name}</span>
                        </div>
                        {expandedUserId === user._id ? (
                          <FaChevronDown className="text-cyan-400 animate-bounce" />
                        ) : (
                          <FaChevronRight className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <FaPhoneAlt className="text-gray-400 text-xs" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="py-4 px-4 border-t border-gray-700 font-semibold">
                      <div className="flex items-center gap-2 text-green-400">
                        ₹ {user.totalAmount || 0}
                      </div>
                    </td>
                    <td className="py-4 px-4 border-t border-gray-700 font-semibold">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <MdRestaurant className="text-cyan-400" />
                        {user.totalMeal || 0}
                      </div>
                    </td>
                    <td className="py-4 px-4 border-t border-gray-700">
                      <div className={getPaymentClass(user.payment)}>
                        {user.payment === 'success' ? (
                          <MdAccountBalanceWallet className="inline mr-1" />
                        ) : (
                          <FaClock className="inline mr-1" />
                        )}
                        {user.payment}
                      </div>
                    </td>
                    <td className="py-4 px-4 border-t border-gray-700">
                      <div className={getGasClass(user.gasBill)}>
                        {user.gasBill === "success" ? (
                          <MdLocalGasStation className="inline mr-1 " />
                        ) : (
                          <FaClock className="inline mr-1 " />
                        )}
                        {user.gasBill}
                      </div>
                    </td>
                  </tr>

                  {/* ✅ ENHANCED: Expanded Row */}
                  {expandedUserId === user._id && expandedUser && (
                    <tr className="bg-gray-800/50 backdrop-blur-sm">
                      <td colSpan="6" className="px-4 py-4 border-t border-gray-600">
                        <div className="p-4 space-y-6 animate-fadeIn">
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-xl border border-cyan-500/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-3 text-cyan-200 flex items-center gap-2">
                                <FaChartBar className="text-cyan-400" />
                                Financial Summary
                              </h3>
                              <div className="space-y-2">
                                <p className="flex justify-between items-center py-2">
                                  <span className="text-gray-300 flex items-center gap-2">
                                    <HiCurrencyRupee className="text-green-400" />
                                    Total Market:
                                  </span>
                                  <span className="text-green-400 font-bold text-lg">₹{expandedUser.totalAmount || 0}</span>
                                </p>
                                <p className="flex justify-between items-center py-2">
                                  <span className="text-gray-300 flex items-center gap-2">
                                    <MdRestaurant className="text-cyan-400" />
                                    Total Meals:
                                  </span>
                                  <span className="text-cyan-400 font-bold text-lg">{expandedUser.totalMeal || 0}</span>
                                </p>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-xl border border-purple-500/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-3 text-purple-200 flex items-center gap-2">
                                <FaWallet className="text-purple-400" />
                                Account Status
                              </h3>
                              <div className="space-y-2">
                                <p className="flex justify-between items-center py-2">
                                  <span className="text-gray-300">Payment:</span>
                                  <span className={getPaymentClass(expandedUser.payment)}>
                                    {expandedUser.payment === 'success' ? (
                                      <MdAccountBalanceWallet className="inline mr-1" />
                                    ) : (
                                      <FaClock className="inline mr-1" />
                                    )}
                                    {expandedUser.payment}
                                  </span>
                                </p>
                                <p className="flex justify-between items-center py-2">
                                  <span className="text-gray-300">Gas Bill:</span>
                                  <span className={getGasClass(expandedUser.gasBill)}>
                                    {user.gasBill === "success" ? (
                                      <MdLocalGasStation className="inline mr-1" />
                                    ) : (
                                      <FaClock className="inline mr-1" />
                                    )}
                                    {expandedUser.gasBill}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* User Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Basic Information */}
                            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-xl border border-blue-500/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-3 text-blue-200 flex items-center gap-2">
                                <FaUser className="text-blue-400" />
                                Basic Information
                              </h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 py-1">
                                  <FaUser className="text-gray-400 text-xs" />
                                  <span className="font-semibold text-gray-300">Name:</span>
                                  <span className="text-white">{expandedUser.name}</span>
                                </div>
                                <div className="flex items-center gap-3 py-1">
                                  <FaPhoneAlt className="text-gray-400 text-xs" />
                                  <span className="font-semibold text-gray-300">Phone:</span>
                                  <span className="text-white">{expandedUser.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 py-1">
                                  <FaUser className="text-gray-400 text-xs" />
                                  <span className="font-semibold text-gray-300">Email:</span>
                                  <span className="text-white">{expandedUser.email}</span>
                                </div>
                                <div className="flex items-center gap-3 py-1">
                                  <span className="font-semibold text-gray-300">Role:</span>
                                  <span className={getRoleClass(expandedUser.role)}>
                                    {expandedUser.role === 'admin' ? (
                                      <MdAdminPanelSettings className="inline" />
                                    ) : (
                                      <MdPerson className="inline" />
                                    )}
                                    {expandedUser.role}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 py-1">
                                  <span className="font-semibold text-gray-300">Status:</span>
                                  <span className={getStatusClass(expandedUser.userStatus)}>
                                    <MdVerified className="inline" />
                                    {expandedUser.userStatus}
                                  </span>
                                </div>
                              </div>

                              {/* Notice Disclaimer */}
                              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-sm backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaInfoCircle className="text-yellow-300" />
                                  <span className="font-semibold text-yellow-300">Meal Count Info</span>
                                </div>
                                <p className="text-yellow-200 text-xs">
                                  "both" = 2 meals, "day" or "night" = 1 meal.
                                </p>
                              </div>
                            </div>

                            {/* Market Details */}
                            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-xl border border-green-500/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-3 text-green-200 flex items-center gap-2">
                                <FaShoppingCart className="text-green-400" />
                                Market Entries
                              </h3>
                              {expandedUser.marketDetails?.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                  {expandedUser.marketDetails.map((market) => (
                                    <div
                                      key={market._id}
                                      className="bg-gray-800/50 p-3 rounded-lg border border-gray-600 hover:border-green-400/30 transition-all duration-200"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <FaReceipt className="text-green-400 text-xs" />
                                          <span className="font-medium text-gray-200 capitalize">{market.items}</span>
                                        </div>
                                        <span className="text-green-400 font-bold flex items-center gap-1">
                                          <HiCurrencyRupee className="text-green-400" />
                                          {market.amount}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <FaCalendarDay className="text-gray-500" />
                                        {new Date(market.date).toLocaleDateString('en-GB')}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-400">
                                  <FaShoppingCart className="text-3xl mx-auto mb-2 opacity-50" />
                                  <p className="text-sm italic">No market entries found</p>
                                </div>
                              )}
                            </div>

                            {/* Meal Details */}
                            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-xl border border-cyan-500/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-3 text-cyan-200 flex items-center gap-2">
                                <MdRestaurant className="text-cyan-400" />
                                Meal Entries
                              </h3>
                              {expandedUser.mealDetails?.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                  {expandedUser.mealDetails.map((meal) => (
                                    <div
                                      key={meal._id}
                                      className="bg-gray-800/50 p-3 rounded-lg border border-gray-600 hover:border-cyan-400/30 transition-all duration-200"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <FaUtensils className="text-cyan-400 text-xs" />
                                          <span className="font-medium text-gray-200 capitalize">{meal.mealTime}</span>
                                        </div>
                                        <span className="text-cyan-400 text-sm flex items-center gap-1">
                                          <FaCalendarDay className="text-cyan-400" />
                                          {new Date(meal.date).toLocaleDateString('en-GB')}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-400">
                                  <MdRestaurant className="text-3xl mx-auto mb-2 opacity-50" />
                                  <p className="text-sm italic">No meal entries found</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;