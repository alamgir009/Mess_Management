import React from 'react';
import { FaUsers, FaLightbulb, FaAward, FaRocket, FaHeart, FaPaintBrush, FaEnvelope, FaPhone } from "react-icons/fa";

export const About = () => {
  return (
    <div className='bg-gradient-to-b from-black to-blue-950 text-gray-200 mt-20 pb-10'>
      <div className='flex flex-col justify-center items-center text-center p-5 md:p-10'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-green-300'>
          About Us
        </h1>
        <p className='mt-4 text-lg md:text-xl lg:text-2xl max-w-2xl md:max-w-3xl lg:max-w-4xl'>
          Discover the story behind UnitedMess, a dedicated team passionate about revolutionizing meal management. Learn more about our journey, values, and commitment to excellence.
        </p>
      </div>

      <div className='flex flex-wrap justify-center items-center gap-5 md:gap-10 lg:gap-20 py-10'>
        <div className='flex flex-col justify-center items-center p-5 text-center bg-gradient-to-br from-blue-800 to-purple-600 rounded-lg shadow-lg w-full md:w-5/12 lg:w-1/3'>
          <FaLightbulb size={60} className='text-yellow-400 mb-5' />
          <h2 className='text-3xl md:text-4xl font-inter font-semibold mb-5 text-white'>Our Mission</h2>
          <p className='font-inter text-lg text-gray-200'>
            Our mission is to simplify your cooking routine with seamless meal management solutions. At UnitedMess, we strive to make every meal a delightful experience.
          </p>
        </div>
        <div className='flex flex-col justify-center items-center p-5 text-center bg-gradient-to-br from-green-800 to-teal-600 rounded-lg shadow-lg w-full md:w-5/12 lg:w-1/3'>
          <FaAward size={60} className='text-red-400 mb-5' />
          <h2 className='text-3xl md:text-4xl font-inter font-semibold mb-5 text-white'>Our Values</h2>
          <p className='font-inter text-lg text-gray-200'>
            Integrity, innovation, and customer satisfaction are at the heart of UnitedMess. We believe in creating solutions that enhance your culinary experience while upholding our commitment to quality.
          </p>
        </div>
        <div className='flex flex-col justify-center items-center p-5 text-center bg-gradient-to-br from-yellow-800 to-orange-600 rounded-lg shadow-lg w-full md:w-5/12 lg:w-1/3'>
          <FaRocket size={60} className='text-blue-400 mb-5' />
          <h2 className='text-3xl md:text-4xl font-inter font-semibold mb-5 text-white'>Our Vision</h2>
          <p className='font-inter text-lg text-gray-200'>
            At UnitedMess, our vision is to revolutionize meal management with cutting-edge technology, ensuring that every meal is an enjoyable and stress-free experience.
          </p>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center text-center py-10 px-5'>
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-inter font-semibold mb-5 text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-red-400'>
          Meet Our Team
        </h2>
        <p className='font-inter text-lg max-w-2xl md:max-w-3xl lg:max-w-4xl mb-10'>
          Our diverse and dedicated team is the backbone of UnitedMess. Each member brings unique expertise and passion, driving us towards our shared goal of culinary excellence.
        </p>
        <div className='flex flex-wrap justify-center items-center gap-5 md:gap-10'>
          <div className='flex flex-col justify-center items-center bg-purple-900 p-5 rounded-lg shadow-lg w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52'>
            <FaUsers size={50} className='text-blue-400 mb-3' />
            <h3 className='text-xl font-semibold text-white'>Teamwork</h3>
          </div>
          <div className='flex flex-col justify-center items-center bg-pink-900 p-5 rounded-lg shadow-lg w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52'>
            <FaLightbulb size={50} className='text-yellow-400 mb-3' />
            <h3 className='text-xl font-semibold text-white'>Innovation</h3>
          </div>
          <div className='flex flex-col justify-center items-center bg-indigo-900 p-5 rounded-lg shadow-lg w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52'>
            <FaAward size={50} className='text-green-400 mb-3' />
            <h3 className='text-xl font-semibold text-white'>Excellence</h3>
          </div>
          <div className='flex flex-col justify-center items-center bg-green-900 p-5 rounded-lg shadow-lg w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52'>
            <FaHeart size={50} className='text-red-400 mb-3' />
            <h3 className='text-xl font-semibold text-white'>Passion</h3>
          </div>
          <div className='flex flex-col justify-center items-center bg-blue-900 p-5 rounded-lg shadow-lg w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52'>
            <FaPaintBrush size={50} className='text-orange-400 mb-3' />
            <h3 className='text-xl font-semibold text-white'>Creativity</h3>
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center text-center py-10 px-5'>
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-inter font-semibold mb-5 text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-blue-400'>
          Contact Us
        </h2>
        <div className='flex flex-col items-center'>
          <div className='flex items-center mb-3'>
            <FaEnvelope className='text-yellow-400 mr-2' />
            <a href="mailto:unitedmess96@gmail.com" className='text-lg md:text-xl text-gray-200'>unitedmess96@gmail.com</a>
          </div>
          <div className='flex items-center'>
            <FaPhone className='text-green-400 mr-2' />
            <a href="tel:+9052920326" className='text-lg md:text-xl text-gray-200'>+91-9052920326</a>
          </div>
        </div>
      </div>
    </div>
  );
}
