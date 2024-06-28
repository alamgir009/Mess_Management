import React from 'react';
import { VscGithubAlt } from "react-icons/vsc";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

export const Footer = () => {
    return (
        <footer className='footer_container'>
            <div className='footer'>
                <div className='text-gray-200 px-5 py-3 sm:px-10 sm:py-5 flex flex-col sm:flex-row justify-between items-center'>
                    <div className='mb-3 sm:mb-0'>
                        <h1 className='font-saira text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 text-lg sm:text-xl lg:text-2xl'>
                            UnitedMess
                        </h1>
                    </div>
                    <ul className='flex justify-center items-center gap-3 sm:gap-5'>
                        <li className='icon_card bg-gradient-to-bl from-gray-400 to-transparent p-0.5 rounded-full'>
                            <a href="https://github.com/alamgir009" target="_blank">
                                <div className='flex justify-center items-center h-full w-full bg-gradient-to-tl from-gray-600 to-black rounded-full p-2 sm:p-3'>
                                    <FaGithub />
                                </div>
                            </a>
                        </li>
                        <li className='icon_card bg-gradient-to-bl from-gray-400 to-transparent p-0.5 rounded-full'>
                            <a href="https://www.linkedin.com/in/md-alamgir-islam-8b08b41a3/" target="_blank">
                                <div className='flex justify-center items-center h-full w-full bg-gradient-to-tl from-gray-600 to-black rounded-full p-2 sm:p-3'>
                                    <FaLinkedinIn />
                                </div>
                            </a>
                        </li>
                        <li className='icon_card bg-gradient-to-bl from-gray-400 to-transparent p-0.5 rounded-full'>
                            <a href="https://twitter.com/Alamgir26434948" target="_blank">
                                <div className='flex justify-center items-center h-full w-full bg-gradient-to-tl from-gray-600 to-black rounded-full p-2 sm:p-3'>
                                    <BsTwitterX />
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='flex justify-center items-center px-5'>
                    <p className='text-center font-inter text-gray-300 border-t-2 border-gray-400 w-full sm:w-3/4 py-2'>
                        Copyright &copy;2024 All Right Reserved
                    </p>
                </div>
            </div>
        </footer>
    )
}
