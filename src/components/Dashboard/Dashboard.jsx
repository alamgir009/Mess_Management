import React from 'react'
import { SideBar } from './SideBar'

export const Dashboard = () => {
  return (
    <div className='flex justify-center items-center'>
        <div>
            <SideBar/>
        </div>
        <div>
            <h1 className='text-center text-2xl'>Dashboard</h1>
        </div>
    </div>
  )
}
