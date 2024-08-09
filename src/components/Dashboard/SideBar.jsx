import React from 'react'
import { IoHome } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { TbTable } from "react-icons/tb";
import { MdShoppingCart } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { HiMiniUserCircle } from "react-icons/hi2";
import { IoNotifications } from "react-icons/io5";
import { MdOutlineChat } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../../store/slices/userLogSlice';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

export const SideBar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8080/user/signout', null, { withCredentials: true })
      if (response && response.data) {
        
        dispatch(logout(false))
        alert(`${response.data.message}`)
        return navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      return alert(`${errorMessage}`)
    }
  }

  return (
    <div className=''>
      <h1 className='font-saira text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 text-xl lg:text-2xl pb-3'>
        UnitedMess
      </h1><div className='border-t border-gray-600'>
        <Link className='flex pt-5 items-center hover:text-sky-400' to="/dashboard">
          <IoHome size={21} /><h1 className='pl-5'>Dashboard</h1>
        </Link>
      </div>
      <Link className='flex pt-5 items-center hover:text-sky-500' to="/table">
        <TbTable size={21} /><h1 className='pl-5'>Tables</h1>
      </Link>
      <Link className='flex pt-5 items-center hover:text-sky-500' to="/market">
        <MdShoppingCart size={21} /><h1 className='pl-5'>Markets</h1>
      </Link>
      <Link className='flex pt-5 items-center hover:text-sky-500' to="/meal">
        <GiMeal size={21} /><h1 className='pl-5'>Meals</h1>
      </Link>
      <Link className='flex pt-5 items-center hover:text-sky-500' to="/profile">
        <HiMiniUserCircle size={21} /><h1 className='pl-5'>Profile</h1>
      </Link>
      <Link className='flex pt-5 items-center hover:text-sky-500' to="/message">
        <MdOutlineChat size={21} /><h1 className='pl-5'>Messages</h1>
      </Link>
      <Link className='flex pt-5 items-center hover:text-sky-500' to="/notification">
        <IoNotifications size={21} /><h1 className='pl-5'>Notifications</h1>
      </Link>
      <div className='border-b border-gray-600 pb-5'>
        <Link className='flex pt-5 items-center hover:text-sky-500' to="/payment">
          <RiMoneyRupeeCircleFill size={21} /><h1 className='pl-5'>Payments</h1>
        </Link>
      </div>
      <div className='flex pt-5 items-center w-full hover:text-red-500 cursor-pointer'
        onClick={handleLogout}><MdLogout size={21} /><button className='pl-5'>Signout</button></div>
      <Toaster position='top-center' reverseOrder={false} />
    </div>
  )
}
