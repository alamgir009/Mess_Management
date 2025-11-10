import React, { useState } from 'react';
import { IoHome, IoNotifications } from "react-icons/io5";
import { NavLink, useNavigate } from 'react-router-dom';
import { TbTable } from "react-icons/tb";
import { MdShoppingCart, MdOutlineChat, MdLogout } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { HiMiniUserCircle } from "react-icons/hi2";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../../store/slices/userLogSlice';

// ✅ Custom alert box
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const AlertBox = ({ message, type, onClose }) => {
  const icon = type === 'success' ? (
    <AiOutlineCheckCircle className="text-green-300 text-xl" />
  ) : (
    <AiOutlineCloseCircle className="text-red-300 text-xl" />
  );

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 
      px-6 py-4 rounded-xl shadow-lg max-w-md w-[90%]
      ${type === 'success' ? 'bg-green-400/10 border border-green-400/30 text-green-300 font-semibold' : 'bg-red-400/10 border border-red-400/30 text-red-300 font-semibold'} 
      backdrop-blur-md`}>
      <div className="flex items-center justify-center ">
        <div className="flex items-center gap-3">
          {icon}
          <p className="text-sm">{message}</p>
        </div>
        {/* <button onClick={onClose} className="text-white hover:text-gray-300 font-bold text-lg leading-none">
          &times;
        </button> */}
      </div>
    </div>
  );
};



export const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Alert state
  const [alert, setAlert] = useState({ message: '', type: '' });

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: '', type: '' });
    }, 5000);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:8080/user/signout', null, { withCredentials: true });
      if (data) {
        showAlert(data.message, 'success');
        setTimeout(() => {
          dispatch(logout(false));
          navigate('/signin');
        }, 2000)
        // setTimeout(() => navigate('/'), 2000); // wait for alert to show
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      showAlert(errorMessage, 'error');
    }
  };

  const menuItems = [
    { to: "/dashboard", icon: <IoHome size={21} />, label: "Dashboard" },
    { to: "/table", icon: <TbTable size={21} />, label: "Tables" },
    { to: "/market", icon: <MdShoppingCart size={21} />, label: "Markets" },
    { to: "/meal", icon: <GiMeal size={21} />, label: "Meals" },
    { to: "/profile", icon: <HiMiniUserCircle size={21} />, label: "Profile" },
    { to: "/message", icon: <MdOutlineChat size={21} />, label: "Messages" },
    { to: "/notification", icon: <IoNotifications size={21} />, label: "Notifications" },
    { to: "/payment", icon: <RiMoneyRupeeCircleFill size={21} />, label: "Payments" },
  ];

  return (
    <>
      {alert.message && (
        <AlertBox message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
      )}
      <div>
        <h1 className="text-center font-saira text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 text-xl lg:text-2xl p-5">
          UnitedMess
        </h1>
        <div className="border-t border-gray-600 text-gray-300">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex lg:font-semibold p-3 lg:p-5 items-center ${isActive ? 'bg-teal-400/20' : 'hover:bg-teal-400/10'}`
              }
            >
              {item.icon}
              <h1 className="pl-5">{item.label}</h1>
            </NavLink>
          ))}
        </div>
        <div className="border-b border-gray-600" />
        <div
          className="flex p-5 items-center w-full lg:font-semibold hover:bg-red-400/20 cursor-pointer"
          onClick={handleLogout}
        >
          <MdLogout size={21} />
          <button className="pl-5">Signout</button>
        </div>
      </div>
    </>
  );
};
