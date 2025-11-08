import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, updateUserByAdmin, fetchProfile } from "../../store/slices/userSlice";
import { SideBar } from "./SideBar";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error, profile } = useSelector((state) => state.userData);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(getUsers());
  }, [dispatch]);

  const isAdmin = profile?.role === "admin";

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-blue-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-blue-950">
      <div className="bg-red-900/30 border border-red-500/50 rounded-xl px-6 py-4 backdrop-blur-sm">
        <p className="text-red-400 text-sm font-medium">Error: {error}</p>
      </div>
    </div>
  );

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-300 border-purple-400/30";
      case "user":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  const getStatusBadgeClass = (status) => 
    status === "approved" 
      ? "bg-green-500/20 text-lime-400 border-green-400/30" 
      : "bg-red-500/20 text-red-400 border-red-400/30";

  const getPaymentBadgeClass = (payment) => 
    payment === "success" 
      ? "bg-emerald-500/20 text-green-300 border-emerald-400/30" 
      : "bg-orange-500/20 text-orange-300 border-orange-400/30";

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setFormData({
      role: user.role,
      userStatus: user.userStatus,
      payment: user.payment,
      gasBill: user.gasBill,
    });
  };

  const handleCancel = () => {
    setEditUserId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (id) => {
    try {
      const updatedData = {
        role: formData.role,
        userStatus: formData.userStatus,
        payment: formData.payment,
        gasBill: formData.gasBill,
      };

      const resultAction = await dispatch(updateUserByAdmin({ id, updatedData }));

      if (updateUserByAdmin.fulfilled.match(resultAction)) {
        await dispatch(getUsers());
        setEditUserId(null);
        setFormData({});
        alert("User updated successfully!");
      } else {
        alert("Failed to update user. Please check your API or data structure.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 h-screen">
      <div className="sidebar w-screen m-1 rounded-md text-white lg:w-80 bg-gray-950">
        <SideBar />
      </div>

      <div className="flex-grow border rounded-md border-gray-500 m-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 px-8 py-5">
          <h1 className="text-2xl font-semibold text-white">User Overview</h1>
          <p className="text-sm text-gray-400 mt-1">Manage user accounts and permissions</p>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Payment ₹
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Gas ₹
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-gray-900/20 divide-y divide-gray-700/30">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-800/40 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.phone}</div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editUserId === user._id && isAdmin ? (
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="text-sm rounded-lg border border-gray-600 px-3 py-1.5 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editUserId === user._id && isAdmin ? (
                          <select
                            name="userStatus"
                            value={formData.userStatus}
                            onChange={handleChange}
                            className="text-sm rounded-lg border border-gray-600 px-3 py-1.5 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="approved">approved</option>
                            <option value="denied">denied</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusBadgeClass(user.userStatus)}`}>
                            {user.userStatus}
                          </span>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editUserId === user._id && isAdmin ? (
                          <select
                            name="payment"
                            value={formData.payment}
                            onChange={handleChange}
                            className="text-sm rounded-lg border border-gray-600 px-3 py-1.5 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="success">success</option>
                            <option value="pending">pending</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getPaymentBadgeClass(user.payment)}`}>
                            {user.payment}
                          </span>
                        )}
                      </td>

                      {/* Gas Bill */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editUserId === user._id && isAdmin ? (
                          <select
                            name="gasBill"
                            value={formData.gasBill}
                            onChange={handleChange}
                            className="text-sm rounded-lg border border-gray-600 px-3 py-1.5 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="success">success</option>
                            <option value="pending">pending</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getPaymentBadgeClass(user.gasBill)}`}>
                            {user.gasBill}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editUserId === user._id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSave(user._id)}
                                className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(user)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};