import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Toaster,toast } from 'react-hot-toast'
import { addUserId } from '../../store/slices/resetPasswordSlice'

export const ResetPassword = () => {
    const navigate = useNavigate()

    const userId = useSelector((state)=> state.resetPassword.userId)
    const dispatch = useDispatch();

    const [reset,setReset] = useState({
        userId:userId,
        newPassword:"",
        confirmPassword:""
    })

    const handleChange = (e)=>{
        const{name,value} = e.target;
        setReset((prev)=>({
            ...prev,[name]:value
        }))
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            if(reset.newPassword !== reset.confirmPassword){
                return toast.error(`Password not matched!`)
            }
            const response = await axios.post(`http://localhost:8080/user/resetpassword`, (reset),{withCredentials:true})
            if(response && response.data){
                toast.success(`${response.data.message}`,{
                    duration:2000
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
            <form className='border border-green-300 p-5 font-inter w-full md:w-80 lg:w-80 xl:w-96 rounded-md m-2 -mt-20 lg:-mt-40 bg-green-400/10'
            onSubmit={handleSubmit}>
                <h1 className='text-3xl mb-5 text-center'>Reset password</h1>
                
                <label htmlFor="newPassword" className=''>New Password
                    <input type="password" name='newPassword' placeholder='Enter new password' className='inpt'
                    value={reset.newPassword} onChange={handleChange} />
                </label>
                
                <label htmlFor="confirmPassword" className=''>Confirm Password
                    <input type="password" name='confirmPassword' placeholder='Confirm password' className='inpt'
                    value={reset.confirmPassword} onChange={handleChange} />
                </label>
    
                <button className='bg-sky-500 hover:bg-sky-600 w-full rounded-md h-8 mt-2 font-semibold' >Set Password</button>
                <p className='text-center p-5 font-light text-sm'>Don't have account? <span typeof='button' className='text-green-300 cursor-pointer'onClick={() => navigate('/signin')} >Sign up</span></p>
            </form>
            <Toaster/>
        </div>
  )
}
