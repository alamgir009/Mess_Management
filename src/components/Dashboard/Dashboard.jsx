import React from 'react'
import { SideBar } from './SideBar'
import { useSelector } from 'react-redux'

export const Dashboard = () => {
  const userLog = useSelector((state)=>state.userLogs.userLog)

  return (
    <div className='flex justify-between text-white mt-20 bg-gradient-to-b from-black to-blue-950'>
        <div>
            <SideBar/>
        </div>
        <div className='border border-white w-lvw'>
            <h1 className='text-center text-2xl w-full'>Dashboard</h1> <hr />
            <button onClick={()=>console.log(userLog)} className='bg-sky-500 p-5'>log</button>
        </div>
    </div>
  )
}
