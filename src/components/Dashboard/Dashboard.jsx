import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, updateUserByAdmin, fetchProfile } from "../../store/slices/userSlice";
import { SideBar } from "./SideBar";
import { 
  FiUsers, 
  FiShield, 
  FiCheckCircle, 
  FiClock,
  FiSearch,
  FiUser,
  FiEdit,
  FiSave,
  FiX,
  FiMail,
  FiPhone,
  FiBarChart2
} from "react-icons/fi";
import { 
  HiOutlineUserGroup,
  HiOutlineKey,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineCurrencyRupee
} from "react-icons/hi2";
import { MdOutlineMenu } from 'react-icons/md';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error, profile } = useSelector((state) => state.userData);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(getUsers());
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

  const isAdmin = profile?.role === "admin";

  // Function to render user avatar
  const renderUserAvatar = (user, size = "w-10 h-10") => {
    if (user.image) {
      return (
        <img 
          src={user.image} 
          alt={user.name} 
          className={`${size} rounded-xl object-cover border border-cyan-400/30`}
        />
      );
    }
    return (
      <div className={`${size} bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-400/30`}>
        <FiUser className="text-cyan-300" />
      </div>
    );
  };

  // Function to render profile icon in top right corner
  const renderProfileIcon = () => {
    if (profile?.image) {
      return (
        <img 
          src={profile.image} 
          alt="Profile" 
          className="w-10 h-10 rounded-xl object-cover border border-gray-600/50"
        />
      );
    }
    return (
      <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center border border-gray-600/50">
        <FiUser className="text-gray-300" />
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-blue-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
        <p className="text-gray-300 text-lg font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-blue-950">
      <div className="bg-red-900/50 backdrop-blur-sm border border-red-500/30 rounded-2xl px-8 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <FiX className="text-white text-sm" />
          </div>
          <h3 className="text-red-200 font-semibold">Error Loading Data</h3>
        </div>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    </div>
  );

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-300 border border-purple-400/30";
      case "user":
        return "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-400/30";
    }
  };

  const getStatusBadgeClass = (status) => 
    status === "approved" 
      ? "bg-green-500/20 text-lime-400 border border-green-400/30" 
      : "bg-red-500/20 text-red-400 border border-red-400/30";

  const getPaymentBadgeClass = (payment) => 
    payment === "success" 
      ? "bg-emerald-500/20 text-green-300 border border-emerald-400/30" 
      : "bg-orange-500/20 text-orange-300 border border-orange-400/30";

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
        const successEvent = new CustomEvent('showToast', {
          detail: { message: 'User updated successfully!', type: 'success' }
        });
        window.dispatchEvent(successEvent);
      } else {
        const errorEvent = new CustomEvent('showToast', {
          detail: { message: 'Failed to update user', type: 'error' }
        });
        window.dispatchEvent(errorEvent);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-b from-black to-blue-950">
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
      <div className={`text-gray-200 sidebar fixed lg:relative w-80 bg-black/60 rounded-md lg:m-1 shadow-2xl border border-white/5 z-40 h-screen lg:h-auto transition-all duration-300 ${
        isSidebarOpen ? 'left-0' : '-left-80 lg:left-0'
      }`}>
        {/* Mobile Close Button inside Sidebar */}
        {/* <div className="lg:hidden absolute top-4 right-4 z-50">
          
        </div> */}
        
        {/* Sidebar Content with Top Padding for Mobile */}
        <div className="h-full lg:pt-0 overflow-y-auto">
          <SideBar />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:m-1 mt-16 lg:mt-1">
        {/* Header - iOS Style */}
        <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/60 rounded-t-lg sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <FiBarChart2 className="text-blue-400" />
                  User Management
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage user accounts and permissions</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm w-64"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {renderProfileIcon()}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-lg hover:border-cyan-400/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-semibold text-white">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-400/30">
                  <HiOutlineUserGroup className="text-cyan-300 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-lg hover:border-purple-400/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Admins</p>
                  <p className="text-2xl font-semibold text-white">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-400/30">
                  <HiOutlineKey className="text-purple-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-lg hover:border-green-400/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Approved</p>
                  <p className="text-2xl font-semibold text-white">
                    {users.filter(u => u.userStatus === 'approved').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-400/30">
                  <HiOutlineCheckBadge className="text-green-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-lg hover:border-orange-400/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-semibold text-white">
                    {users.filter(u => u.payment === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-400/30">
                  <HiOutlineClock className="text-orange-300 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="px-4 lg:px-6 py-4 border-b border-gray-700/50 bg-gray-800/30">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiUsers className="text-blue-400" />
                Users
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/30 border-b border-gray-700/50">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Gas Bill
                    </th>
                    {isAdmin && (
                      <th className="px-4 lg:px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {users.map((user) => (
                    <tr 
                      key={user._id} 
                      className="hover:bg-gray-800/40 transition-colors duration-150 group"
                    >
                      {/* User Info */}
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {renderUserAvatar(user)}
                          <div>
                            <div className="text-sm font-medium text-white">{user.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-white">
                            <FiMail className="text-gray-400 text-xs" />
                            <span className="hidden sm:inline">{user.email}</span>
                            <span className="sm:hidden text-xs">{user.email.split('@')[0]}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <FiPhone className="text-gray-400 text-xs" />
                            {user.phone}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editUserId === user._id && isAdmin ? (
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="text-sm rounded-xl border border-gray-600 px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                            {user.role === 'admin' ? <FiShield className="mr-1" /> : <FiUser className="mr-1" />}
                            {user.role}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editUserId === user._id && isAdmin ? (
                          <select
                            name="userStatus"
                            value={formData.userStatus}
                            onChange={handleChange}
                            className="text-sm rounded-xl border border-gray-600 px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="approved">approved</option>
                            <option value="denied">denied</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(user.userStatus)}`}>
                            {user.userStatus === 'approved' ? 
                              <FiCheckCircle className="mr-1" /> : 
                              <FiX className="mr-1" />
                            }
                            {user.userStatus}
                          </span>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editUserId === user._id && isAdmin ? (
                          <select
                            name="payment"
                            value={formData.payment}
                            onChange={handleChange}
                            className="text-sm rounded-xl border border-gray-600 px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="success">success</option>
                            <option value="pending">pending</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(user.payment)}`}>
                            {user.payment === 'success' ? 
                              <HiOutlineCurrencyRupee className="mr-1" /> : 
                              <HiOutlineClock className="mr-1" />
                            }
                            {user.payment}
                          </span>
                        )}
                      </td>

                      {/* Gas Bill */}
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {editUserId === user._id && isAdmin ? (
                          <select
                            name="gasBill"
                            value={formData.gasBill}
                            onChange={handleChange}
                            className="text-sm rounded-xl border border-gray-600 px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="success">success</option>
                            <option value="pending">pending</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(user.gasBill)}`}>
                            {user.gasBill === 'success' ? 
                              <HiOutlineCurrencyRupee className="mr-1" /> : 
                              <HiOutlineClock className="mr-1" />
                            }
                            {user.gasBill}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      {isAdmin && (
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
                          {editUserId === user._id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSave(user._id)}
                                className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-sm"
                              >
                                <FiSave className="mr-1" />
                                <span className="hidden sm:inline">Save</span>
                              </button>
                              <button
                                onClick={handleCancel}
                                className="inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                              >
                                <FiX className="mr-1" />
                                <span className="hidden sm:inline">Cancel</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(user)}
                              className="inline-flex items-center px-3 py-2 bg-blue-600 border border-blue-500 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-sm opacity-0 group-hover:opacity-100"
                            >
                              <FiEdit className="mr-1" />
                              <span className="hidden sm:inline">Edit</span>
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