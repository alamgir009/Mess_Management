import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
    const navigate = useNavigate()
    return (
        <div className='bg-gradient-to-b from-black to-blue-950 text-gray-50 mt-20 h-screen flex justify-center items-center'>
            <form className='border border-green-300 p-5 font-inter w-full md:w-80 lg:w-80 xl:w-96 rounded-md m-2 lg:-mt-20 bg-green-400/10'>
                <h1 className='text-4xl mb-5 text-center'>Sign in</h1>
                
                <label htmlFor="email" className=''>Email
                    <input type="email" name='email' placeholder='username@email.com' className='inpt' />
                </label>
                
                <label htmlFor="password" className=''>Password
                    <input type="password" name='password' placeholder='password' className='inpt' />
                </label>
                <p className='cursor-pointer' onClick={()=>navigate('/requestotp')}>Forgot password?</p>
                <button className='bg-sky-500 hover:bg-sky-600 w-full rounded-md h-8 mt-2 font-semibold' >Sign in</button>
                <p className='text-center p-5 font-light text-sm'>Don't have account? <span typeof='button' className='text-green-300 cursor-pointer'onClick={() => navigate('/register')} >Sign up</span></p>
            </form>
        </div>
    )
}
