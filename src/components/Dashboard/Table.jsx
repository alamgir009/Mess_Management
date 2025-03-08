import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, getUserById } from '../../store/slices/userSlice';
import { SideBar } from './SideBar';

const Table = () => {
  const dispatch = useDispatch();
  const { users, loading, error, selectedUser } = useSelector((state) => state.userData);
  const [expandedUserId, setExpandedUserId] = useState(null);

  // Fetch users on initial load
  useEffect(() => {
    dispatch(getUsers());
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
              {users.map((user) => {
                const totalMarket = user.markets?.reduce((acc, market) => acc + Number(market), 0) || 0;
                const totalMeals = user.meals?.length || 0;

                return (
                  <React.Fragment key={user._id}>
                    <tr
                      className="hover:bg-gray-600 text-gray-300 cursor-pointer"
                      onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id)}
                    >
                      <td className="py-2 px-4 border-t border-gray-700">{user.name}</td>
                      <td className="py-2 px-4 border-t border-gray-700">{user.phone}</td>
                      <td className="py-2 px-4 border-t border-gray-700">₹{totalMarket}</td>
                      <td className="py-2 px-4 border-t border-gray-700">{totalMeals}</td>
                      <td className={`py-2 px-4 border-t border-gray-700 ${getPaymentClass(user.payment)}`}>
                        {user.payment}
                      </td>
                      <td className={`py-2 px-4 border-t border-gray-700 ${getGasClass(user.gasBill)}`}>
                        {user.gasBill}
                      </td>
                    </tr>

                    {expandedUserId === user._id && selectedUser && (
                      <tr className="bg-gray-800">
                        <td colSpan="6" className="px-4 py-2 border-t border-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div className="space-y-2">
                              <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                              <p>
                                <span className="font-semibold">Role:</span> {' '}
                                <span className={getRoleClass(selectedUser.role)}>{selectedUser.role}</span>
                              </p>
                              <p>
                                <span className="font-semibold">Status:</span> {' '}
                                <span className={getStatusClass(selectedUser.userStatus)}>{selectedUser.userStatus}</span>
                              </p>
                            </div>

                            <div>
                              <p className="font-semibold mb-2">Market Details:</p>
                              {selectedUser.markets?.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                  {selectedUser.markets.map((market, index) => (
                                    <li key={index} className="text-sm">₹{market}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm">No market entries</p>
                              )}
                            </div>

                            <div>
                              <p className="font-semibold mb-2">Meal Details:</p>
                              {selectedUser.meals?.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                  {selectedUser.meals.map((meal, index) => (
                                    <li key={index} className="text-sm">{meal}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm">No meal entries</p>
                              )}
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
