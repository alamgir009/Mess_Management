import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addUserId } from '../../store/slices/resetPasswordSlice';
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi'; // Importing icons

export const ResetPassword = () => {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.resetPassword.userId);
    const dispatch = useDispatch();

    const [reset, setReset] = useState({
        userId: userId,
        newPassword: '',
        confirmPassword: ''
    });

    const [alert, setAlert] = useState({ message: '', type: '' });

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReset((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reset.newPassword !== reset.confirmPassword) {
            showAlert("Password mismatch. Please retry.", 'error');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/user/resetpassword',
                reset,
                { withCredentials: true }
            );

            if (response?.data?.message) {
                showAlert(response.data.message, 'success');
                dispatch(addUserId(null));
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                showAlert('Password reset successful.', 'success');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'There was an error';
            showAlert(errorMessage, 'error');
        }
    };

    const getAlertStyles = (type) => {
        const base = `
          fixed top-5 left-1/2 transform -translate-x-1/2 
          px-6 py-3 rounded-xl shadow-md z-50 
          flex items-center gap-3 
          backdrop-blur-md bg-white/10 border transition-all duration-300
        `;

        const color = {
            success: 'border-green-400/30 text-green-300',
            error: 'border-red-400/30 text-red-300',
            info: 'border-blue-400/30 text-blue-300'
        };

        return `${base} ${color[type] || color.info}`;
    };



    const getAlertIcon = (type) => {
        switch (type) {
            case 'success':
                return <FiCheckCircle className="text-xl text-green-600" />;
            case 'error':
                return <FiXCircle className="text-xl text-red-600" />;
            default:
                return <FiInfo className="text-xl text-blue-600" />;
        }
    };

    return (
        <div className="bg-gradient-to-b from-black to-blue-950 text-gray-50 h-screen mt-20 flex justify-center items-center">
            {alert.message && (
                <div className={getAlertStyles(alert.type)}>
                    {getAlertIcon(alert.type)}
                    <p className="text-sm font-medium">{alert.message}</p>
                </div>
            )}

            <form
                className="bg-gray-500 bg-opacity-10 backdrop-blur-md border border-sky-300 p-8 rounded-lg shadow-lg w-full max-w-md -mt-20"
                onSubmit={handleSubmit}
            >
                <h1 className="text-3xl mb-6 text-center text-sky-200 font-bold">Reset password</h1>

                <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-200 font-inter"
                >
                    New Password
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        className="mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-100 bg-gray-700"
                        value={reset.newPassword}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-200 font-inter"
                >
                    Confirm Password
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        className="mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-100 bg-gray-700"
                        value={reset.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-md shadow transition duration-200"
                >
                    Set Password
                </button>

                <p className="text-center p-5 font-light text-sm">
                    Don't have account?{' '}
                    <span
                        role="button"
                        className="text-green-300 cursor-pointer"
                        onClick={() => navigate('/signin')}
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
};
