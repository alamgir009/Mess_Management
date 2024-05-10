import React from 'react'
import { VscGithubAlt } from "react-icons/vsc";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

export const Footer = () => {
    return (
        <footer className='footer_container'>
            <div className='footer'>
                <div className=' text-gray-200 px-10 py-5 flex justify-between items-center'>
                    <div>
                        <h1 className='font-sarina text-transparent bg-clip-text bg-gradient-to-b from-sky-300 to-white
                    text-xl'>B.Kitchen</h1>
                    </div>
                    <ul className='flex justify-center items-center gap-5'>
                        <li className='icon_card bg-gradient-to-bl from-gray-400 to-transparent p-0.5 rounded-full'><a href="" target="_blank">
                            <div className='flex justify-center items-center h-full w-full
                    bg-gradient-to-tl from-gray-600 to-black rounded-full p-3'>
                                <FaGithub />
                            </div>
                        </a></li>
                        <li className='icon_card bg-gradient-to-bl from-gray-400 to-transparent p-0.5 rounded-full'><a href="" target="_blank">
                            <div className='flex justify-center items-center h-full w-full
                    bg-gradient-to-tl from-gray-600 to-black rounded-full p-3'>
                                <FaLinkedinIn />
                            </div>
                        </a></li>
                        <li className='icon_card bg-gradient-to-bl from-gray-400 to-transparent p-0.5 rounded-full'><a href="" target="_blank">
                            <div className='flex justify-center items-center h-full w-full
                    bg-gradient-to-tl from-gray-600 to-black rounded-full p-3'>
                                <BsTwitterX />
                            </div>
                        </a></li>

                    </ul>
                </div>
                <div className='flex justify-center items-center '>
                <p className='text-center font-inter text-gray-300 border-t-2 border-gray-400 w-3/4 py-2'>Copyright &copy;2024 All Right Reserved</p>
                </div>
            </div>
        </footer>
    )
}
