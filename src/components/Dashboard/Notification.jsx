import React from 'react'
import { SideBar } from './SideBar';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { logout } from '../../store/slices/userLogSlice';

const Notification = () => {
  const userLog = useSelector((state) => state.userLogs.userLog);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/user/signout',
        null,
        { withCredentials: true }
      );
      if (response && response.data) {
        dispatch(logout(false));
        navigate('/signin');
        return alert(`${response.data.message}`)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      toast.error(errorMessage, { duration: 2000 });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 h-screen">
      <div className="sidebar w-screen m-1 rounded-md text-white lg:w-80 bg-gray-950">
        <SideBar />
      </div>
      <div className="flex-grow border rounded-md border-gray-500 m-1 p-4">
        <h1 className="text-center text-xl sm:text-2xl w-full mb-4">Notifications</h1>
        <hr className="mb-4" />
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => console.log(userLog)} className="bg-sky-500 p-3 sm:p-5 rounded-md">
            Log
          </button>
          <button onClick={handleLogout} className="bg-sky-500 p-3 sm:p-5 rounded-md">
            Log out
          </button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default Notification