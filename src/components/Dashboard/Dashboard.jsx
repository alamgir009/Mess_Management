import React from 'react'
import { SideBar } from './SideBar'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import { logout } from '../../store/slices/userLogSlice'

export const Dashboard = () => {
  const userLog = useSelector((state)=>state.userLogs.userLog)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
        const response = await axios.post('http://localhost:8080/user/signout', null, {withCredentials:true})
        if (response && response.data) {
            toast.success(response.data.message, { duration: 2000 });
            setTimeout(() => {
              navigate('/');
            }, 2000);
            dispatch(logout(false))
          }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'There was an error';
        return  toast.error(errorMessage, { duration: 2000 });
    }
}

  return (
    <div className='flex justify-between text-white bg-gradient-to-b from-black to-blue-950 h-screen'>
        <div>
            <SideBar/>
        </div>
        <div className='border border-white w-lvw'>
            <h1 className='text-center text-2xl w-full'>Dashboard</h1> <hr />
            <button onClick={()=>console.log(userLog)} className='bg-sky-500 p-5'>log</button>
            <button onClick={handleLogout} className='bg-sky-500 p-5'>log out</button>
        </div>
        <Toaster position='top-center' reverseOrder={false}/>
    </div>
  )
}
