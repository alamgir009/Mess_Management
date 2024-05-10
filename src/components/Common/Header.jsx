import React from 'react'
import { Link } from 'react-router-dom'

export const Header = () => {
    return (
        <>
            <nav className='flex justify-between px-10 bg-black h-20 items-center font-inter'>
                <div>
                    <h1 className='font-sarina text-transparent bg-clip-text bg-gradient-to-b from-sky-300 to-white
                    text-xl'>B.Kitchen</h1>
                </div>
                <ul className='flex  text-gray-200 justify-center items-center gap-x-10'>
                    <li><Link to="/"> Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/food">Food</Link></li>
                    <li className=' bg-gradient-to-b from-gray-500 to-transparent rounded-3xl p-0.5'><Link to="/signin">
                        <div className='flex bg-black w-full h-full justify-center items-center rounded-2xl px-5 py-1'>Sign</div>
                    </Link></li>
                </ul>
            </nav>

        </>
    )
}
