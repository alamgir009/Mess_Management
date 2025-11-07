import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAggeratedUsers } from '../../store/slices/userSlice';
import { SideBar } from './SideBar';

const Table = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userData);
  const [expandedUserId, setExpandedUserId] = useState(null);

  // ✅ Fetch users on initial load
  useEffect(() => {
    dispatch(getAggeratedUsers());
  }, [dispatch]);

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
        return 'text-purple-300';
      case 'user':
        return 'text-cyan-300';
      default:
        return 'text-white';
    }
  }, []);

  const getStatusClass = useCallback((status) => {
    return status === 'approved' ? 'text-lime-400' : 'text-red-400';
  }, []);

  const getPaymentClass = useCallback((payment) => {
    return payment === 'success' ? 'text-green-300' : 'text-orange-300';
  }, []);

  const getGasClass = useCallback((gasBill) => {
    return gasBill === 'success' ? 'text-green-300' : 'text-orange-300';
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-blue-950">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-blue-950">
      <p className="text-red-500 text-xl">Error: {error}</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 min-h-screen">
      {/* Sidebar */}
      <div className="sidebar w-full lg:w-80 bg-gray-950 rounded-md m-1">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-grow border border-gray-500 rounded-md m-1 p-4 overflow-auto">
        <h1 className="text-center text-xl sm:text-2xl w-full mb-4">User Overview</h1>
        
        {/* ✅ ADDED: Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Market Card */}
          <div className="backdrop-blur-lg bg-green-500/10 border border-green-400/20 rounded-xl p-4 text-center transition-all duration-300 hover:bg-green-500/15 hover:border-green-400/30">
            <div className="text-green-300 text-sm font-medium mb-1">Total Market</div>
            <div className="text-2xl font-bold text-white">₹{totalStats.totalMarket}</div>
            <div className="text-green-400/70 text-xs mt-1">All users combined</div>
          </div>

          {/* Total Meal Card */}
          <div className="backdrop-blur-lg bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 text-center transition-all duration-300 hover:bg-blue-500/15 hover:border-blue-400/30">
            <div className="text-blue-300 text-sm font-medium mb-1">Total Meal</div>
            <div className="text-2xl font-bold text-white">{totalStats.totalMeal}</div>
            <div className="text-blue-400/70 text-xs mt-1">Total meals consumed</div>
          </div>

          {/* Total Users Card */}
          <div className="backdrop-blur-lg bg-purple-500/10 border border-purple-400/20 rounded-xl p-4 text-center transition-all duration-300 hover:bg-purple-500/15 hover:border-purple-400/30">
            <div className="text-purple-300 text-sm font-medium mb-1">Total Users</div>
            <div className="text-2xl font-bold text-white">{totalStats.totalUsers}</div>
            <div className="text-purple-400/70 text-xs mt-1">Active members</div>
          </div>

          {/* Pending Payments Card */}
          <div className="backdrop-blur-lg bg-orange-500/10 border border-orange-400/20 rounded-xl p-4 text-center transition-all duration-300 hover:bg-orange-500/15 hover:border-orange-400/30">
            <div className="text-orange-300 text-sm font-medium mb-1">Pending</div>
            <div className="text-2xl font-bold text-white">{totalStats.pendingPayments}</div>
            <div className="text-orange-400/70 text-xs mt-1">Need action</div>
          </div>
        </div>

        <hr className="mb-4 border-gray-500" />

        <div className="overflow-x-auto rounded-md border border-gray-500 font-inter">
          <table className="min-w-full bg-gray-900/50 text-white">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">Market ₹</th>
                <th className="py-3 px-4 font-semibold">Meals</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Gas Bill</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <React.Fragment key={user._id}>
                  {/* Main Table Row */}
                  <tr
                    className={`hover:bg-gray-600 text-gray-300 cursor-pointer transition-colors duration-200 ${
                      expandedUserId === user._id ? 'bg-gray-600' : ''
                    }`}
                    onClick={() => handleRowClick(user._id)}
                  >
                    <td className="py-3 px-4 border-t border-gray-700 font-medium">
                      <div className="flex items-center">
                        {user.name}
                        {expandedUserId === user._id && (
                          <span className="ml-2 text-cyan-400">▼</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-t border-gray-700">{user.phone}</td>
                    <td className="py-3 px-4 border-t border-gray-700">₹ {user.totalAmount || 0}</td>
                    <td className="py-3 px-4 border-t border-gray-700">{user.totalMeal || 0}</td>
                    <td className={`py-3 px-4 border-t border-gray-700 font-medium ${getPaymentClass(user.payment)}`}>
                      {user.payment}
                    </td>
                    <td className={`py-3 px-4 border-t border-gray-700 font-medium ${getGasClass(user.gasBill)}`}>
                      {user.gasBill}
                    </td>
                  </tr>

                  {/* ✅ FIXED: Expanded Row using data directly from users array */}
                  {expandedUserId === user._id && expandedUser && (
                    <tr className="bg-gray-800/80">
                      <td colSpan="6" className="px-4 py-3 border-t border-gray-600">
                        <div className="p-4 space-y-6 animate-fadeIn">
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                              <h3 className="text-lg font-semibold mb-3 text-cyan-200">Financial Summary</h3>
                              <p className="flex justify-between py-1">
                                <span className="text-gray-300">Total Market:</span>
                                <span className="text-green-400 font-semibold">₹{expandedUser.totalAmount || 0}</span>
                              </p>
                              <p className="flex justify-between py-1">
                                <span className="text-gray-300">Total Meals:</span>
                                <span className="text-cyan-400 font-semibold">{expandedUser.totalMeal || 0}</span>
                              </p>
                            </div>

                            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                              <h3 className="text-lg font-semibold mb-3 text-cyan-200">Account Status</h3>
                              <p className="flex justify-between py-1">
                                <span className="text-gray-300">Payment:</span>
                                <span className={getPaymentClass(expandedUser.payment) + " font-semibold"}>
                                  {expandedUser.payment}
                                </span>
                              </p>
                              <p className="flex justify-between py-1">
                                <span className="text-gray-300">Gas Bill:</span>
                                <span className={getGasClass(expandedUser.gasBill) + " font-semibold"}>
                                  {expandedUser.gasBill}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* User Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Basic Information */}
                            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                              <h3 className="text-lg font-semibold mb-3 text-cyan-200">Basic Information</h3>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-semibold text-gray-300">Name:</span> {expandedUser.name}</p>
                                <p><span className="font-semibold text-gray-300">Phone:</span> {expandedUser.phone}</p>
                                <p><span className="font-semibold text-gray-300">Email:</span> {expandedUser.email}</p>
                                <p>
                                  <span className="font-semibold text-gray-300">Role:</span>{' '}
                                  <span className={getRoleClass(expandedUser.role) + " font-medium"}>
                                    {expandedUser.role}
                                  </span>
                                </p>
                                <p>
                                  <span className="font-semibold text-gray-300">Status:</span>{' '}
                                  <span className={getStatusClass(expandedUser.userStatus) + " font-medium"}>
                                    {expandedUser.userStatus}
                                  </span>
                                </p>
                              </div>

                              {/* Notice Disclaimer */}
                              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-md text-sm">
                                <span className="font-semibold text-yellow-300">📢 Meal Count Info:</span>
                                <p className="text-yellow-200 mt-1">
                                  "both" = 2 meals, "day" or "night" = 1 meal.
                                </p>
                              </div>
                            </div>

                            {/* Market Details */}
                            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                              <h3 className="text-lg font-semibold mb-3 text-cyan-200">Market Entries</h3>
                              {expandedUser.marketDetails?.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {expandedUser.marketDetails.map((market) => (
                                    <div 
                                      key={market._id} 
                                      className="bg-gray-800 p-3 rounded-md border border-gray-600"
                                    >
                                      <p className="flex justify-between items-center">
                                        <span className="font-medium text-gray-200 capitalize">{market.items}</span>
                                        <span className="text-green-400 font-semibold">₹{market.amount}</span>
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {new Date(market.date).toLocaleDateString('en-GB')}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-400 text-sm italic">No market entries found</p>
                              )}
                            </div>

                            {/* Meal Details */}
                            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                              <h3 className="text-lg font-semibold mb-3 text-cyan-200">Meal Entries</h3>
                              {expandedUser.mealDetails?.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {expandedUser.mealDetails.map((meal) => (
                                    <div 
                                      key={meal._id} 
                                      className="bg-gray-800 p-3 rounded-md border border-gray-600"
                                    >
                                      <p className="flex justify-between items-center">
                                        <span className="font-medium text-gray-200 capitalize">{meal.mealTime}</span>
                                        <span className="text-cyan-400 text-sm">
                                          {new Date(meal.date).toLocaleDateString('en-GB')}
                                        </span>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-400 text-sm italic">No meal entries found</p>
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