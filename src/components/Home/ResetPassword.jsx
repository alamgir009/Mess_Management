import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addUserId } from '../../store/slices/resetPasswordSlice';
import { Toaster, toast } from 'react-hot-toast';
import {
  FiLock,
  FiCheck,
  FiArrowRight,
  FiLogIn,
  FiShield
} from 'react-icons/fi';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.resetPassword.userId);
    const dispatch = useDispatch();

    const [reset, setReset] = useState({
        userId: userId,
        newPassword: '',
        confirmPassword: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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
            toast.error("Password mismatch. Please retry.", { duration: 2000 });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                'http://localhost:8080/user/resetpassword',
                reset,
                { withCredentials: true }
            );

            if (response?.data?.message) {
                toast.success(response.data.message, { duration: 2000 });
                dispatch(addUserId(null));
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                toast.success('Password reset successful.', { duration: 2000 });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'There was an error';
            toast.error(errorMessage, { duration: 2000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen pt-20">
            {/* Premium background pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-[#0a0a0a]"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
            </div>

            {/* Dynamic ambient lighting */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-sky-500/20 to-blue-600/10 rounded-full blur-[120px] "></div>
                <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/15 to-transparent rounded-full blur-[100px] "></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-md">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            Reset Password
                        </h1>
                        <p className="text-gray-500 text-sm">Create a new secure password for your account</p>
                    </div>

                    {/* Reset Password Form Card */}
                    <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/10 p-8 shadow-2xl shadow-black/20 transition-all duration-700 hover:border-white/20">
                        {/* Animated border glow */}
                        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 blur-xl group-hover:opacity-10 transition-opacity duration-700"></div>
                        
                        <div className="relative z-10">
                            <form onSubmit={handleSubmit}>
                                {/* New Password Input */}
                                <div className="mb-6">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-3">
                                        New Password
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FiLock className="w-5 h-5 text-gray-400 group-focus-within/input:text-sky-400 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 hover:bg-white/8 focus:bg-white/10 text-white border border-white/10 hover:border-white/20 focus:border-sky-400/30 rounded-2xl focus:outline-none transition-all duration-300 text-base font-medium placeholder-gray-400"
                                            value={reset.newPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="mb-6">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-3">
                                        Confirm Password
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FiCheck className="w-5 h-5 text-gray-400 group-focus-within/input:text-sky-400 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm your password"
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 hover:bg-white/8 focus:bg-white/10 text-white border border-white/10 hover:border-white/20 focus:border-sky-400/30 rounded-2xl focus:outline-none transition-all duration-300 text-base font-medium placeholder-gray-400"
                                            value={reset.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group/submit w-full relative overflow-hidden rounded-2xl transition-all duration-500 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    
                                    <div className="relative px-8 py-5 flex items-center justify-center gap-3">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                <span className="text-white font-semibold text-base">Resetting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiShield className="w-5 h-5 text-white" />
                                                <span className="text-white font-semibold text-base">Reset Password</span>
                                                <FiArrowRight className="w-4 h-4 text-white opacity-0 group-hover/submit:opacity-100 -ml-2 group-hover/submit:ml-0 transition-all duration-300" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>

                            {/* Back to Login Link */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-center text-sm text-gray-400">
                                    Remember your password?{' '}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/signin')}
                                        className="group/back text-sky-400 hover:text-sky-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <span>Back to login</span>
                                        <FiLogIn className="w-4 h-4 opacity-0 group-hover/back:opacity-100 -ml-2 group-hover/back:ml-0 transition-all duration-300" />
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Card */}
                    <div className="mt-6 relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-2xl rounded-[24px] border border-white/5 p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <FiShield className="w-3 h-3 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-white">Password Requirements</h3>
                        </div>
                        <p className="text-xs text-gray-400">
                            Create a strong password with at least 8 characters including uppercase, lowercase, numbers, and special characters for maximum security.
                        </p>
                    </div>
                </div>
            </div>

            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'rgba(0, 0, 0, 0.9)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '16px',
                        backdropFilter: 'blur(24px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
        </div>
    );
};