import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { addUserId } from '../../store/slices/resetPasswordSlice'

export const ResetPassword = () => {
    const navigate = useNavigate()

    const userId = useSelector((state) => state.resetPassword.userId)
    const dispatch = useDispatch();

    const [reset, setReset] = useState({
        userId: userId,
        newPassword: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReset((prev) => ({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (reset.newPassword !== reset.confirmPassword) {
                return toast.error(`Password not matched!`)
            }
            const response = await axios.post(`http://localhost:8080/user/resetpassword`, (reset), { withCredentials: true })
            if (response && response.data) {
                toast.success(`${response.data.message}`, {
                    duration: 2000
                })
                dispatch(addUserId(null))
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'There was an error';
            return toast.error(errorMessage, { duration: 2000 });
        }
    }

    return (
        <div className='bg-gradient-to-b from-black to-blue-950 text-gray-50 h-screen mt-20 flex justify-center items-center'>
            <form className='bg-gray-500 bg-opacity-10 backdrop-blur-md border border-sky-300 p-8 rounded-lg shadow-lg w-full max-w-md -mt-20'
                onSubmit={handleSubmit}>
                <h1 className='text-3xl mb-6 text-center text-sky-200 font-bold'>Reset password</h1>

                <label htmlFor="newPassword" className='block text-sm font-medium text-gray-200 font-inter'>New Password
                    <input type="password" name='newPassword' placeholder='Enter new password' className='mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-100 bg-gray-700'
                        value={reset.newPassword} onChange={handleChange} />
                </label>

                <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-200 font-inter'>Confirm Password
                    <input type="password" name='confirmPassword' placeholder='Confirm password' className='mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-100 bg-gray-700'
                        value={reset.confirmPassword} onChange={handleChange} />
                </label>

                <button className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-md shadow transition duration-200" >Set Password</button>
                <p className='text-center p-5 font-light text-sm'>Don't have account? <span typeof='button' className='text-green-300 cursor-pointer' onClick={() => navigate('/signin')} >Sign up</span></p>
            </form>
            <Toaster />
        </div>
    )
}
