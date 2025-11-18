import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUserId } from '../../store/slices/resetPasswordSlice';
import { Toaster, toast } from 'react-hot-toast';
import {
  FiMail,
  FiKey,
  FiArrowRight,
  FiUserPlus,
  FiClock,
  FiRefreshCw,
  FiLogIn
} from 'react-icons/fi';

export const RequestOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otpRequested, setOtpRequested] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [otpResendTime, setOtpResendTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (otpCooldown) return;
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        'http://localhost:8080/user/requestotp',
        { email },
        { withCredentials: true }
      );
      if (response) {
        toast.success(response?.data?.message, { duration: 2000 });
        setOtpRequested(true);
        setOtpCooldown(true);
        setOtpResendTime(60);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!', { duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (otpCooldown) return;
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        'http://localhost:8080/user/requestotp',
        { email },
        { withCredentials: true }
      );
      if (response) {
        toast.success(response?.data?.message, { duration: 2000 });
        setOtpCooldown(true);
        setOtpResendTime(60);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP.', { duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        'http://localhost:8080/user/validateotp',
        { email, otp: otpCode },
        { withCredentials: true }
      );
      if (response) {
        toast.success(response?.data?.message, { duration: 2000 });
        dispatch(addUserId(response.data.userId));
        setTimeout(() => navigate('/resetpassword'), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP.', { duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  useEffect(() => {
    let timer;
    if (otpCooldown && otpResendTime > 0) {
      timer = setInterval(() => {
        setOtpResendTime((prev) => prev - 1);
      }, 1000);
    } else if (otpResendTime === 0) {
      setOtpCooldown(false);
    }
    return () => clearInterval(timer);
  }, [otpCooldown, otpResendTime]);

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
            <p className="text-gray-500 text-sm">
              {otpRequested ? 'Enter the OTP sent to your email' : 'Enter your email to receive OTP'}
            </p>
          </div>

          {/* OTP Form Card */}
          <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/10 p-8 shadow-2xl shadow-black/20 transition-all duration-700 hover:border-white/20">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 blur-xl group-hover:opacity-10 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <form onSubmit={handleRequestOtp}>
                {/* Email Input */}
                {!otpRequested && (
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* OTP Input Section */}
                {otpRequested && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Enter 6-digit OTP
                    </label>
                    <div className="flex justify-between space-x-2 mb-4">
                      {otp.map((value, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={value}
                          onChange={(e) => handleOtpChange(e, index)}
                          className="w-12 h-12 text-center bg-white/5 hover:bg-white/8 focus:bg-white/10 text-white border border-white/10 hover:border-white/20 focus:border-sky-400/30 rounded-2xl focus:outline-none transition-all duration-300 text-lg font-semibold placeholder-gray-400"
                          placeholder="•"
                        />
                      ))}
                    </div>
                    
                    {/* Success Message */}
                    <div className="flex items-center justify-center gap-3 p-4 bg-green-400/10 border border-green-400/20 rounded-2xl">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <FiKey className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-green-300 text-sm font-medium">
                        OTP has been sent to your email
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!otpRequested ? (
                  <button
                    type="submit"
                    disabled={otpCooldown || isSubmitting}
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
                          <span className="text-white font-semibold text-base">Sending OTP...</span>
                        </>
                      ) : otpCooldown ? (
                        <>
                          <FiClock className="w-5 h-5 text-white" />
                          <span className="text-white font-semibold text-base">Wait {otpResendTime}s</span>
                        </>
                      ) : (
                        <>
                          <FiMail className="w-5 h-5 text-white" />
                          <span className="text-white font-semibold text-base">Send OTP</span>
                          <FiArrowRight className="w-4 h-4 text-white opacity-0 group-hover/submit:opacity-100 -ml-2 group-hover/submit:ml-0 transition-all duration-300" />
                        </>
                      )}
                    </div>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSubmitOtp}
                      disabled={isSubmitting}
                      className="group/submit w-full relative overflow-hidden rounded-2xl transition-all duration-500 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
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
                            <span className="text-white font-semibold text-base">Verifying...</span>
                          </>
                        ) : (
                          <>
                            <FiKey className="w-5 h-5 text-white" />
                            <span className="text-white font-semibold text-base">Verify OTP</span>
                            <FiArrowRight className="w-4 h-4 text-white opacity-0 group-hover/submit:opacity-100 -ml-2 group-hover/submit:ml-0 transition-all duration-300" />
                          </>
                        )}
                      </div>
                    </button>

                    {/* Resend OTP */}
                    <div className="text-center pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 mb-3">
                        Didn't receive the code?
                      </p>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={otpCooldown || isSubmitting}
                        className="group/resend text-sky-400 hover:text-sky-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2 mx-auto disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        {otpCooldown ? (
                          <>
                            <FiClock className="w-4 h-4" />
                            <span>Resend in {otpResendTime}s</span>
                          </>
                        ) : (
                          <>
                            <FiRefreshCw className="w-4 h-4" />
                            <span>Resend OTP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
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
              <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
                <FiKey className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">Secure OTP Verification</h3>
            </div>
            <p className="text-xs text-gray-400">
              One-time passwords are securely generated and sent to your registered email. They expire after a short period for your security.
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