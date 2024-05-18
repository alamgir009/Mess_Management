import React from 'react'
import mobileImage from "../../assets/Mob.png"
import Calendar from './Calender.jsx'
import torus from "../../assets/torus.png"
import cube from "../../assets/cube.png"
import sphere from "../../assets/Sphere_R.png"

export const Home = () => {
  return (
    <div className='bg-gradient-to-b from-black to-blue-950 text-gray-200'>
      <div className='flex justify-center items-center border border-white'>
        <div className='text-left border border-white w-1/2 pl-10'>
          <h1 className='text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-green-300'>Work</h1>
          <h1 className='text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-green-600 to-green-200'>smarter,</h1>
          <h1 className='text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-pink-50 to-purple-400'>faster</h1>
          <p className='pt-5 w-4/5'>
            Your culinary companion for seamless meal management.
            Track and handle your meals effortlessly with B.Kitchen's intuitive interface.
            Simplify your cooking routine with B.Kitchen, ensuring every meal is a breeze.
          </p>
          <div className='py-5'>
            <button className='bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 border-sky-200 border rounded-md p-2 text-black font-semibold shadow-black shadow-md'>
              Get Started
            </button>
          </div>
        </div>
        <div className='border border-white w-1/2'>
          <img src={mobileImage} alt="mobileImage" />
        </div>
      </div>
      <div className='flex justify-center items-center'>
        <div className='relative border border-gray-600 rounded-xl m-20'>
          <Calendar />
          <img src={torus} alt="torus" className='absolute top-0 right-0 w-40 h-40 transform translate-x-1/2 -translate-y-1/2 rotate-12 filter grayscale' />
          <img src={cube} alt="cube" className='absolute bottom-0 left-0 w-40 h-40 transform -translate-x-1/2 translate-y-1/2 rotate-12 filter hue-rotate-330 brightness-150' />
          <img src={sphere} alt="sphere" className='absolute bottom-0 right-0 w-40 h-40 transform translate-x-1/2 translate-y-1/2 rotate-12 filter hue-rotate-60 brightness-150' />
        </div>
        <div className='w-2/4 border border-gray-400 h-64'>
          <h1 className='text-5xl font-inter font-semibold'>Calender</h1>
          <p className='w-1/2 mt-5'>
            Effortlessly manage schedules with B.kitchen's integrated calendar. Organize events, appointments, and tasks seamlessly for enhanced productivity and smoother workflow.
          </p>
          <button className='mt-5 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 border-sky-200 border rounded-md p-2 text-black font-semibold shadow-black shadow-md'>
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
