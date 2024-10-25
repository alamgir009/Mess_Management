import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers } from '../../store/slices/userSlice';
import { SideBar } from './SideBar';
// import { Toaster } from 'react-hot-toast';

export const Dashboard = () => {

  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userData);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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

  return (
    <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 h-screen">
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
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Markets &#8377;</th>
                <th className="py-2 px-4">Meals</th>
                <th className="py-2 px-1">Payment &#8377;</th>
                <th className="py-2 px-4">Gas &#8377;</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-600 text-gray-100">
                  <td className="py-2 px-4 border-t border-gray-700">{user.name}</td>
                  <td className="py-2 px-4 border-t border-gray-700">{user.email}</td>
                  <td className="py-2 px-4 border-t border-gray-700">{user.phone}</td>
                  <td className={`py-2 px-4 border-t border-gray-700 ${getRoleClass(user.role)}`}>
                    {user.role}
                  </td>
                  <td className={`py-2 px-4 border-t border-gray-700 ${getStatusClass(user.userStatus)}`}>
                    {user.userStatus}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-700">
                    {user.markets && user.markets.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {user.markets.map((market, index) => (
                          <li key={index} className="text-sm">{market}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">No markets</p>
                    )}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-700">
                    {user.meals && user.meals.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {user.meals.map((meal, index) => (
                          <li key={index} className="text-sm text-white">{meal}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">No meals</p>
                    )}
                  </td>
                  <td className={`py-2 px-4 border-t border-gray-700 ${getPaymentClass(user.payment)}`}>
                    {user.payment}
                  </td>
                  <td className={`py-2 px-4 border-t border-gray-700 ${getGasClass(user.gasBill)}`}>
                    {user.gasBill}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
    </div>
  );
};
