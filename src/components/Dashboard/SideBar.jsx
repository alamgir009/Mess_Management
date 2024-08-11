import React from 'react';
import { IoHome, IoNotifications } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { TbTable } from "react-icons/tb";
import { MdShoppingCart, MdOutlineChat, MdLogout } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { HiMiniUserCircle } from "react-icons/hi2";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../../store/slices/userLogSlice';
import { Toaster, toast } from 'react-hot-toast';

export const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:8080/user/signout', null, { withCredentials: true });
      dispatch(logout(false));
      toast.success(data.message);
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      toast.error(errorMessage);
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
    <div>
      <h1 className="font-saira text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 text-xl lg:text-2xl pb-3">
        UnitedMess
      </h1>
      <div className="border-t border-gray-600">
        {menuItems.map((item, index) => (
          <Link key={index} className="flex pt-5 items-center hover:text-sky-500" to={item.to}>
            {item.icon}
            <h1 className="pl-5">{item.label}</h1>
          </Link>
        ))}
      </div>
      <div className="border-b border-gray-600 pb-5" />
      <div
        className="flex pt-5 items-center w-full hover:text-red-500 cursor-pointer"
        onClick={handleLogout}
      >
        <MdLogout size={21} />
        <button className="pl-5">Signout</button>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};
