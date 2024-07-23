import React from 'react'
import { SideBar } from './SideBar'

export const Dashboard = () => {
  return (
    <div className='flex justify-between text-white mt-20 bg-gradient-to-b from-black to-blue-950'>
        <div>
            <SideBar/>
        </div>
        <div className='border border-white w-lvw'>
            <h1 className='text-center text-2xl w-full'>Dashboard</h1> <hr />
        </div>
    </div>
  )
}
