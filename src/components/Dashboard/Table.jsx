import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, getUserById, getAggeratedUsers } from '../../store/slices/userSlice';
import { SideBar } from './SideBar';

const Table = () => {
  const dispatch = useDispatch();
  const { users, loading, error, selectedUser } = useSelector((state) => state.userData);
  const [expandedUserId, setExpandedUserId] = useState(null);

  // Fetch users on initial load
  useEffect(() => {
    dispatch(getAggeratedUsers());
  }, [dispatch]);

  // Fetch selected user's details when expanded and log immediately
  useEffect(() => {
    if (expandedUserId && (!selectedUser || selectedUser._id !== expandedUserId)) {
      dispatch(getUserById(expandedUserId));
    }
  }, [dispatch, expandedUserId, selectedUser]);

  // Log selectedUser when expandedUserId changes
  useEffect(() => {
    if (expandedUserId && selectedUser && selectedUser._id === expandedUserId) {
      console.log(selectedUser); // Log the selected user immediately
    }
  }, [expandedUserId, selectedUser]);

  const getRoleClass = (role) => {
    switch (role) {
      case 'admin':
        return 'text-purple-300';
      case 'user':
        return 'text-cyan-300';
      default:
        return 'text-white';
    }
  };

  const getStatusClass = (status) => {
    return status === 'approved' ? 'text-lime-400' : 'text-red-400';
  };

  const getPaymentClass = (payment) => {
    return payment === 'success' ? 'text-green-300' : 'text-orange-300';
  };

  const getGasClass = (gasBill) => {
    return gasBill === 'success' ? 'text-green-300' : 'text-orange-300';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 min-h-screen">
      <div className="sidebar w-screen m-1 rounded-md text-white lg:w-80 bg-gray-950">
        <SideBar />
      </div>

      <div className="flex-grow border rounded-md border-gray-500 m-1 p-4 overflow-auto">
        <h1 className="text-center text-xl sm:text-2xl w-full mb-4">User Overview</h1>
        <hr className="mb-4" />

        <div className="overflow-x-auto rounded-md border border-gray-500 font-inter">
          <table className="min-w-full bg-gray-900/50 text-white">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Market ₹</th>
                <th className="py-2 px-4">Meals</th>
                <th className="py-2 px-4">Payment</th>
                <th className="py-2 px-4">Gas Bill</th>
              </tr>
            </thead>

            <tbody>
              {users.filter(user => user.userStatus !== 'denied')
                .map((user) => {

                  return (
                    <React.Fragment key={user._id && user.status !== 'denied'}>
                      <tr
                        className="hover:bg-gray-600 text-gray-300 cursor-pointer"
                        onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id)}
                      >
                        <td className="py-2 px-4 border-t border-gray-700">{user.name}</td>
                        <td className="py-2 px-4 border-t border-gray-700">{user.phone}</td>
                        <td className="py-2 px-4 border-t border-gray-700">₹ {user.totalAmount}</td>
                        <td className="py-2 px-4 border-t border-gray-700">{user.totalMeal}</td>
                        <td className={`py-2 px-4 border-t border-gray-700 ${getPaymentClass(user.payment)}`}>
                          {user.payment}
                        </td>
                        <td className={`py-2 px-4 border-t border-gray-700 ${getGasClass(user.gasBill)}`}>
                          {user.gasBill}
                        </td>
                      </tr>

                      {expandedUserId === user._id && selectedUser && (
                        <tr className="bg-gray-900">
                          <td colSpan="6" className="px-4 py-2 border-t border-gray-700">
                            <div className="p-4 space-y-6">
                              {/* Summary Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-700 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold mb-2">Financial Summary</h3>
                                  <p className="flex justify-between">
                                    <span>Total Market:</span>
                                    <span className="text-green-400">₹{selectedUser.totalAmount}</span>
                                  </p>
                                  <p className="flex justify-between">
                                    <span>Total Meals:</span>
                                    <span className="text-cyan-400">{selectedUser.totalMeal}</span>
                                  </p>
                                </div>

                                <div className="bg-gray-700 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold mb-2">Account Status</h3>
                                  <p className="flex justify-between">
                                    <span>Payment:</span>
                                    <span className={getPaymentClass(selectedUser.payment)}>
                                      {selectedUser.payment}
                                    </span>
                                  </p>
                                  <p className="flex justify-between">
                                    <span>Gas Bill:</span>
                                    <span className={getGasClass(selectedUser.gasBill)}>
                                      {selectedUser.gasBill}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* User Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-gray-700 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                                  <p><span className="font-semibold">Name:</span> {selectedUser.name}</p>
                                  <p><span className="font-semibold">Phone:</span> {selectedUser.phone}</p>
                                  <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                                  <p>
                                    <span className="font-semibold">Role:</span>{' '}
                                    <span className={getRoleClass(selectedUser.role)}>
                                      {selectedUser.role}
                                    </span>
                                  </p>
                                  <p>
                                    <span className="font-semibold">Status:</span>{' '}
                                    <span className={getStatusClass(selectedUser.userStatus)}>
                                      {selectedUser.userStatus}
                                    </span>
                                  </p>

                                  {/* 📢 Noticeable Disclaimer */}
                                  <div className="mt-4 p-3 bg-yellow-200 text-yellow-900 rounded-md text-sm font-medium">
                                    📢 <strong>Meal Count Info:</strong> "both" = 2 meals, "day" or "night" = 1 meal.
                                  </div>
                                </div>


                                {/* Market Details */}
                                <div className="bg-gray-700 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold mb-2">Market Entries</h3>
                                  {selectedUser.marketDetails?.length > 0 ? (
                                    <div className="space-y-2">
                                      {selectedUser.marketDetails.map((market, index) => (
                                        <div key={market._id} className="bg-gray-800 p-3 rounded-md">
                                          <p className="flex justify-between">
                                            <span className="font-medium">{market.items}</span>
                                            <span className="text-green-400">₹{market.amount}</span>
                                          </p>
                                          <p className="text-sm text-gray-400">
                                            {new Date(market.date).toLocaleDateString('en-GB')}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400 text-sm">No market entries found</p>
                                  )}
                                </div>

                                {/* Meal Details */}
                                <div className="bg-gray-700 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold mb-2">Meal Entries</h3>
                                  {selectedUser.mealDetails?.length > 0 ? (
                                    <div className="space-y-2">
                                      {selectedUser.mealDetails.map((meal, index) => (
                                        <div key={meal._id} className="bg-gray-800 p-3 rounded-md">
                                          <p className="flex justify-between">
                                            <span className="capitalize font-medium">{meal.mealTime}</span>
                                            <span className="text-cyan-400">
                                              {new Date(meal.date).toLocaleDateString('en-GB')}
                                            </span>
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400 text-sm">No meal entries found</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
