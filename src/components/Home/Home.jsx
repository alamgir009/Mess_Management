import React from 'react';
import mobileImage from "../../assets/Mob.png";
import Calendar from './Calender.jsx';
import secure from '../../assets/secure.png'



export const Home = () => {
  return (
    <div className='bg-gradient-to-b from-black to-blue-950 text-gray-200 mt-20'>
      <div className='flex flex-wrap justify-center items-center '>
        <div className='text-left w-full md:w-1/2 lg:w-2/5 p-5 md:pl-10'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white to-green-300'>
            Work
          </h1>
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-green-600 to-green-200'>
            smarter,
          </h1>
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-pink-50 to-purple-400'>
            faster
          </h1>
          <p className='mt-4'>
            Your culinary companion for seamless meal management. Track and handle your meals effortlessly with B.Kitchen's intuitive interface. Simplify your cooking routine with B.Kitchen, ensuring every meal is a breeze.
          </p>
          <div className='py-5'>
            <button className='bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 border-sky-200 border rounded-md p-2 text-black font-semibold shadow-black shadow-md'>
              Get Started
            </button>
          </div>
        </div>
        <div className=' w-full md:w-1/2 lg:w-2/5 p-5'>
          <img src={mobileImage} alt="mobileImage" className='w-full' />
        </div>
      </div>
      <div className='flex flex-wrap justify-center items-center md:mx-10 lg:mx-20 py-10 md:py-20 lg:gap-96'>
        <div className=' border border-gray-600 rounded-xl'>
          <Calendar />
          
        </div>
        <div className='w-full md:w-1/2 lg:w-1/3 my-5 h-auto p-5'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-inter font-semibold'>
            Calendar
          </h1>
          <p className='mt-5 font-inter'>
            Effortlessly manage schedules with B.kitchen's integrated calendar. Organize events, appointments, and tasks seamlessly for enhanced productivity and smoother workflow.
          </p>
          <button className='mt-5 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 border-sky-200 border rounded-md p-2 text-black font-semibold shadow-black shadow-md'>
            Get Started
          </button>
        </div>
      </div>

      <div className='flex flex-wrap-reverse lg:flex-wrap justify-center items-center gap-10 lg:gap-52 '>
        <div className='w-full p-5 lg:w-2/5'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-inter font-semibold mb-5'>Security</h1>
          <p className='font-inter'>
          B.Kitchen prioritizes robust security, encryption, and privacy. We ensure compliance with regulations, employ multi-factor authentication, and grant user control.
          </p>
        </div>
        <div className=' w-72 lg:w-96'>
          <img src={secure} alt="icon" className='w-full h-full secure' />
        </div>
      </div>

      <div className='flex justify-center items-center py-10'>
        <div className='w-1/2 md:w-1/4 lg:w-72 lg:h-72 bg-gradient-to-tr from-black/5 to-transparent  p-5 rounded-3xl
        border-2 border-sky-400/80 shadow-2xl '>
          <iframe className='w-full h-full' src="https://lottie.host/embed/7f01b565-c7fb-4731-bf30-fe51835d7471/AQq2ceZnIW.json"></iframe>
        </div>
      </div>
    </div>
  );
}
