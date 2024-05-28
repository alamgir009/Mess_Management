import React, { useState } from 'react';
import { FaUtensils, FaLeaf, FaDrumstickBite, FaFish, FaCarrot, FaPizzaSlice, FaIceCream, FaAppleAlt } from "react-icons/fa";

const foodImages = [
  {
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Delicious Dessert',
    description: 'A mouth-watering dessert that will satisfy your sweet tooth.',
    icon: FaIceCream,
  },
  {
    url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Gourmet Pizza',
    description: 'A delicious pizza with a variety of toppings to choose from.',
    icon: FaPizzaSlice,
  },
  {
    url: 'https://images.unsplash.com/photo-1633383718081-22ac93e3db65?q=80&w=1958&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Fresh Salad',
    description: 'A refreshing salad made with crisp lettuce, tomatoes, and cucumbers.',
    icon: FaLeaf,
  },
  {
    url: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Juicy Steak',
    description: 'A perfectly grilled steak seasoned to perfection.',
    icon: FaDrumstickBite,
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1694699355770-8eddcab92a26?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Seafood Delight',
    description: 'A delectable assortment of seafood including shrimp, mussels, and crab legs.',
    icon: FaFish,
  },
  {
    url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Fresh Vegetables',
    description: 'A colorful array of fresh vegetables including bell peppers, carrots, and broccoli.',
    icon: FaCarrot,
  },
 
];


export const Food = () => {
  const [selectedFood, setSelectedFood] = useState(null);

  const handleFoodClick = (food) => {
    setSelectedFood(food);
  };

  const handleClosePopup = () => {
    setSelectedFood(null);
  };

  return (
    <div className='bg-gradient-to-b from-black to-blue-950 text-gray-200 mt-20 pb-10'>
      <div className='flex flex-col justify-center items-center text-center p-5 md:p-10'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-blue-400'>
          Our Food Gallery
        </h1>
        <p className='mt-4 text-lg md:text-xl lg:text-2xl max-w-2xl md:max-w-3xl lg:max-w-4xl'>
          Explore our delicious and beautifully presented food items. Each dish is crafted with love and passion to provide you with an unforgettable culinary experience.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 lg:px-12 py-10'>
        {foodImages.map((food, index) => (
          <div key={index} className='relative bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300' onClick={() => handleFoodClick(food)}>
            <img src={food.url} alt={food.title} className='w-full h-64 object-cover'/>
            <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 transition-opacity duration-300 hover:opacity-85'>
              <food.icon size={50} className='text-yellow-400 mb-3'/>
              <h2 className='text-2xl md:text-3xl font-semibold text-white'>{food.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {selectedFood && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/45 backdrop-blur-sm  z-50">
          <div className="bg-black/15 rounded-xl shadow-xl p-8 max-w-md backdrop-filter backdrop-blur-xl border-t-2 border-b-2 border-sky-300 ">
            <img src={selectedFood.url} alt={selectedFood.title} className='w-full h-60 object-cover rounded-lg'/>
            <h2 className='text-2xl md:text-3xl font-semibold text-gray-200'>{selectedFood.title}</h2>
            <p className="text-gray-200 mt-2">{selectedFood.description}</p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
