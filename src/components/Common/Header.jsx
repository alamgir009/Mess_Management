import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for the menu button

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <nav className={`flex justify-between items-center px-5 lg:px-10 h-20 font-inter fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-sm' : 'bg-black'}`}>
                <div>
                    <h1 className='font-sarina text-transparent bg-clip-text bg-gradient-to-b from-sky-300 to-white text-xl'>
                        B.Kitchen
                    </h1>
                </div>
                <div className='md:hidden'>
                    <button onClick={toggleMenu} className='text-gray-200'>
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                <ul className={`flex-col md:flex-row text-gray-200 justify-center items-center gap-x-10 md:flex ${isMenuOpen ? 'flex && bg-black/80 backdrop-blur-sm' : 'hidden'} md:block absolute md:relative top-20 md:top-0 left-0 w-full md:w-auto md:bg-transparent`}>
                    <li className='p-5 md:p-0'><Link to="/" onClick={toggleMenu}> Home</Link></li>
                    <li className='p-5 md:p-0'><Link to="/about" onClick={toggleMenu}>About</Link></li>
                    <li className='p-5 md:p-0'><Link to="/food" onClick={toggleMenu}>Food</Link></li>
                    <li className='p-0.5 mb-5 md:mb-0 md:p-0 bg-gradient-to-b from-gray-500 to-transparent rounded-full'><Link to="/signin" onClick={toggleMenu}>
                        <div className='flex bg-black w-full h-full justify-center items-center rounded-full px-5 py-2'>Sign in</div>
                    </Link></li>
                </ul>
            </nav>
        </>
    );
};
