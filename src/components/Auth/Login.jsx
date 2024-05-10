import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
    const navigate = useNavigate()
    return (
        <div className='text-center'>
            <h1 className='text-4xl'>Login Here</h1>
            <button className='bg-sky-200' onClick={()=>navigate('/register')}>Register</button>
        </div>
    )
}
