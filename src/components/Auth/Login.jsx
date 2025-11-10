import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userLogSlice';
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiKey,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:8080/user/signin', formData, { withCredentials: true });
      if (response && response.data) {
        toast.success(response.data.message, { duration: 2000 });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        dispatch(login(true));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      toast.error(errorMessage, { duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20"> {/* Added pt-20 for header spacing */}
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
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm">Sign in to your UnitedMess account</p>
          </div>

          {/* Login Form Card */}
          <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/10 p-8 shadow-2xl shadow-black/20 transition-all duration-700 hover:border-white/20">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 blur-xl group-hover:opacity-10 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                    Email Address
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="w-5 h-5 text-gray-400 group-focus-within/input:text-sky-400 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="username@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 hover:bg-white/8 focus:bg-white/10 text-white border border-white/10 hover:border-white/20 focus:border-sky-400/30 rounded-2xl focus:outline-none transition-all duration-300 text-base font-medium placeholder-gray-400"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                    Password
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="w-5 h-5 text-gray-400 group-focus-within/input:text-sky-400 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-4 bg-white/5 hover:bg-white/8 focus:bg-white/10 text-white border border-white/10 hover:border-white/20 focus:border-sky-400/30 rounded-2xl focus:outline-none transition-all duration-300 text-base font-medium placeholder-gray-400"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-300"
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end mb-6">
                  <button
                    type="button"
                    onClick={() => navigate('/requestotp')}
                    className="group/forgot flex items-center gap-2 text-sm text-gray-400 hover:text-sky-400 transition-all duration-300"
                  >
                    <FiKey className="w-4 h-4" />
                    <span>Forgot password?</span>
                    <FiLogIn className="w-3 h-3 opacity-0 group-hover/forgot:opacity-100 -ml-2 group-hover/forgot:ml-0 transition-all duration-300" />
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group/submit w-full relative overflow-hidden rounded-2xl transition-all duration-500 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 hover:shadow-2xl hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span className="text-white font-semibold text-base">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <FiLogIn className="w-5 h-5 text-white" />
                        <span className="text-white font-semibold text-base">Sign in</span>
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="group/signup text-sky-400 hover:text-sky-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>Create account</span>
                    <FiUserPlus className="w-4 h-4 opacity-0 group-hover/signup:opacity-100 -ml-2 group-hover/signup:ml-0 transition-all duration-300" />
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="mt-6 relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-2xl rounded-[24px] border border-white/5 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                <FiKey className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">Secure Login</h3>
            </div>
            <p className="text-xs text-gray-400">
              Your credentials are encrypted and securely transmitted. UnitedMess ensures the highest level of security for your account.
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