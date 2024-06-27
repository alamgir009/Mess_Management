import React from 'react';
import mobileImage from "../../assets/Mob.png";
import Calendar from './Calender.jsx';
import secure from '../../assets/secure.png'
import food1 from '../../assets/food1.jpg'
import food3 from '../../assets/food3.jpg'
import food6 from '../../assets/food6.jpg'
import { GiMeal } from "react-icons/gi";
import { MdOutlineTrackChanges } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { MdSecurity } from "react-icons/md";
import { CiPizza } from "react-icons/ci";



export const Home = () => {
  return (
    <div className='bg-gradient-to-b from-black to-blue-950 text-gray-200 mt-20 pb-10'>
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
            Your culinary companion for seamless meal management. Track and handle your meals effortlessly with UnitedMess's intuitive interface. Simplify your cooking routine with UnitedMess, ensuring every meal is a breeze.
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
            Effortlessly manage schedules with UnitedMess's integrated calendar. Organize events, appointments, and tasks seamlessly for enhanced productivity and smoother workflow.
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
            UnitedMess prioritizes robust security, encryption, and privacy. We ensure compliance with regulations, employ multi-factor authentication, and grant user control.
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

      <div>
        <div className='flex justify-center items-center text-center'>
          <div className='lg:w-1/2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-inter font-semibold mb-5'>Indulge in Culinary
              <span className='text-yellow-400'> Excellence</span></h1>
            <p className='font-inter text-center'>
              Experience culinary delight with UnitedMess's quality food a symphony of flavors crafted for discerning palates.
            </p>

          </div>
        </div>
        <ul className='flex justify-center items-center gap-5 flex-wrap w-full mt-10'>
          <li >
            <div className='card-list'>
              <img src={food1} alt="food1" className='card-img' />
            </div>
            <h1 className='text-center'>Breakfast</h1>
          </li>
          <li >
            <div className='card-list'>
              <img src={food3} alt="food2" className='card-img' />
            </div>
            <h1 className='text-center'>Lunch</h1>
          </li>
          <li >
            <div className='card-list'>
              <img src={food6} alt="food3" className='card-img' />
            </div>
            <h1 className='text-center'>Dinner</h1>
          </li>
        </ul>
      </div>

      <div className=' border-t-2 border-gray-500 mt-20 mx-5 rounded-lg px-5 py-5 shadow-sm shadow-black/50'>
        <div className='font-semibold text-xl lg:text-2xl mb-5 md:pl-10 '>
          <h1 className='text-transparent bg-clip-text bg-gradient-to-b from-white to-green-300'>
            Savor Healthy Dining:
          </h1>
          <h1 className='text-transparent bg-clip-text bg-gradient-to-b from-white to-green-400'>UnitedMess Online.</h1>
        </div>

        <ul className='flex flex-wrap gap-x-32 gap-y-10 md:justify-center md:items-center'>
          <li className='lg:w-1/4 md:w-1/3'>
              <GiMeal size={30} />
              <h1 className='text-lg lg:text-xl font-semibold mb-2'>Nutritious Cuisine Selection</h1>
              <p>Explore diverse menus curated for health-conscious individuals, ensuring a balance of flavors and essential nutrients for every meal.</p>
          </li>
          <li className='lg:w-1/4  md:w-1/3'>
              <MdOutlineTrackChanges size={30} />
              <h1 className='text-lg font-semibold mb-2'>Streamlined Meal Tracking </h1>
              <p>Effortlessly monitor your daily intake, nutritional values, and calorie counts through intuitive meal tracking features for enhanced dietary awareness.</p>
          </li>
          <li className='lg:w-1/4 md:w-1/3'>
              <MdOutlineShoppingCart size={30} />
              <h1 className='text-lg font-semibold mb-2'>Seamless Grocery Management</h1>
              <p>Simplify your shopping experience with convenient tools to plan, organize, and track your grocery purchases, promoting efficient meal preparation.</p>
          </li>
          <li className='lg:w-1/4 md:w-1/3'>
              <GoGraph size={30} />
              <h1 className='text-lg font-semibold mb-2'>Robust Market Analysis</h1>
              <p>Access insightful data and analytics to optimize your purchasing decisions, leveraging trends and cost-effective options for smarter shopping experiences.</p>
          </li>
          <li className='lg:w-1/4 md:w-1/3'>
              <MdSecurity size={30} />
              <h1 className='text-lg font-semibold mb-2'>Advanced Security Measures </h1>
              <p>Safeguard your personal information and transactions with state-of-the-art encryption protocols, ensuring the highest level of data protection and user privacy.</p>
          </li>
          <li className='lg:w-1/4 md:w-1/3'>
              <CiPizza size={30} />
              <h1 className='text-lg font-semibold mb-2'>Customized Dietary Preferences</h1>
              <p>Tailor your meal plans to accommodate specific dietary needs and preferences, empowering you to enjoy delicious and wholesome meals effortlessly.</p>
          </li>
          
        </ul>

      </div>

    </div>
  );
}
