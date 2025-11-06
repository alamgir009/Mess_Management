import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, getUserById, getAggeratedUsers } from '../../store/slices/userSlice';
import { SideBar } from './SideBar';

const Table = () => {
  const dispatch = useDispatch();
  const { users, loading, error, selectedUser } = useSelector((state) => state.userData);
  const [expandedUserId, setExpandedUserId] = useState(null);

  // ✅ Fetch users on initial load
  useEffect(() => {
    dispatch(getAggeratedUsers());
  }, [dispatch]);

  // ✅ Optimized: Fetch selected user's details when expanded
  useEffect(() => {
    if (expandedUserId && (!selectedUser || selectedUser._id !== expandedUserId)) {
      dispatch(getUserById(expandedUserId));
    }
  }, [dispatch, expandedUserId, selectedUser]);

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
                // ✅ FIXED: Using proper unique key for Fragment
                <React.Fragment key={user._id}>
                  {/* Main Table Row */}
                  <tr
                    className="hover:bg-gray-600 text-gray-300 cursor-pointer transition-colors duration-200"
                    onClick={() => handleRowClick(user._id)}
                  >
                    <td className="py-3 px-4 border-t border-gray-700 font-medium">{user.name}</td>
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

                  {/* ✅ FIXED: Expanded Row with proper conditional rendering */}
                  {expandedUserId === user._id && (
                    <tr className="bg-gray-800/80">
                      <td colSpan="6" className="px-4 py-3 border-t border-gray-600">
                        {selectedUser && selectedUser._id === user._id ? (
                          <div className="p-4 space-y-6 animate-fadeIn">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                <h3 className="text-lg font-semibold mb-3 text-cyan-200">Financial Summary</h3>
                                <p className="flex justify-between py-1">
                                  <span className="text-gray-300">Total Market:</span>
                                  <span className="text-green-400 font-semibold">₹{selectedUser.totalAmount || 0}</span>
                                </p>
                                <p className="flex justify-between py-1">
                                  <span className="text-gray-300">Total Meals:</span>
                                  <span className="text-cyan-400 font-semibold">{selectedUser.totalMeal || 0}</span>
                                </p>
                              </div>

                              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                <h3 className="text-lg font-semibold mb-3 text-cyan-200">Account Status</h3>
                                <p className="flex justify-between py-1">
                                  <span className="text-gray-300">Payment:</span>
                                  <span className={getPaymentClass(selectedUser.payment) + " font-semibold"}>
                                    {selectedUser.payment}
                                  </span>
                                </p>
                                <p className="flex justify-between py-1">
                                  <span className="text-gray-300">Gas Bill:</span>
                                  <span className={getGasClass(selectedUser.gasBill) + " font-semibold"}>
                                    {selectedUser.gasBill}
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
                                  <p><span className="font-semibold text-gray-300">Name:</span> {selectedUser.name}</p>
                                  <p><span className="font-semibold text-gray-300">Phone:</span> {selectedUser.phone}</p>
                                  <p><span className="font-semibold text-gray-300">Email:</span> {selectedUser.email}</p>
                                  <p>
                                    <span className="font-semibold text-gray-300">Role:</span>{' '}
                                    <span className={getRoleClass(selectedUser.role) + " font-medium"}>
                                      {selectedUser.role}
                                    </span>
                                  </p>
                                  <p>
                                    <span className="font-semibold text-gray-300">Status:</span>{' '}
                                    <span className={getStatusClass(selectedUser.userStatus) + " font-medium"}>
                                      {selectedUser.userStatus}
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
                                {selectedUser.marketDetails?.length > 0 ? (
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedUser.marketDetails.map((market) => (
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
                                {selectedUser.mealDetails?.length > 0 ? (
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedUser.mealDetails.map((meal) => (
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
                        ) : (
                          // Loading state for expanded row
                          <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                            <span className="ml-3 text-gray-300">Loading user details...</span>
                          </div>
                        )}
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