import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUserId } from '../../store/slices/resetPasswordSlice';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const AlertBox = ({ message, type }) => {
  const icon =
    type === 'success' ? (
      <AiOutlineCheckCircle className="text-green-300 text-xl" />
    ) : (
      <AiOutlineCloseCircle className="text-red-300 text-xl" />
    );

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg max-w-md w-[90%] backdrop-blur-md transition-all duration-300 ease-out
        ${type === 'success'
          ? 'bg-green-400/10 border border-green-400/30 text-green-300 font-semibold'
          : 'bg-red-400/10 border border-red-400/30 text-red-300 font-semibold'
        }`}
    >
      <div className="flex items-center justify-center gap-3">
        {icon}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export const RequestOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otpRequested, setOtpRequested] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [otpResendTime, setOtpResendTime] = useState(0);
  const [alert, setAlert] = useState(null); // { message: '', type: 'success' | 'error' }

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (otpCooldown) return;
    try {
      const response = await axios.post(
        'http://localhost:8080/user/requestotp',
        { email },
        { withCredentials: true }
      );
      if (response) {
        showAlert(response?.data?.message, 'success');
        setOtpRequested(true);
        setOtpCooldown(true);
        setOtpResendTime(60);
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Something went wrong!', 'error');
    }
  };

  const handleResend = async () => {
    if (otpCooldown) return;
    try {
      const response = await axios.post(
        'http://localhost:8080/user/requestotp',
        { email },
        { withCredentials: true }
      );
      if (response) {
        showAlert(response?.data?.message, 'success');
        setOtpCooldown(true);
        setOtpResendTime(60);
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to resend OTP.', 'error');
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    try {
      const response = await axios.post(
        'http://localhost:8080/user/validateotp',
        { email, otp: otpCode },
        { withCredentials: true }
      );
      if (response) {
        showAlert(response?.data?.message, 'success');
        dispatch(addUserId(response.data.userId));
        setTimeout(() => navigate('/resetpassword'), 3000);
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Invalid OTP.', 'error');
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
    <div className="bg-gradient-to-b from-black to-blue-950 text-gray-50 mt-20 h-screen flex justify-center items-center relative">
      {alert && <AlertBox message={alert.message} type={alert.type} />}

      <form
        className="bg-gray-500 bg-opacity-10 backdrop-blur-md border border-sky-300 p-8 rounded-lg shadow-lg w-full max-w-md -mt-20"
        onSubmit={handleRequestOtp}
      >
        <h1 className="text-3xl mb-6 text-center text-sky-200 font-bold">Request OTP</h1>

        <label htmlFor="email" className="block text-sm font-medium text-gray-200 font-inter">
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="username@email.com"
            className="mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-100 bg-gray-700"
            required
          />
        </label>

        {!otpRequested && (
          <button
            type="submit"
            className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-md shadow transition duration-200"
            disabled={otpCooldown}
          >
            {otpCooldown ? `Wait ${otpResendTime}s` : 'Request OTP'}
          </button>
        )}

        {otpRequested && (
          <>
            <div className="mt-5">
              <h2 className="text-2xl mb-3 text-center font-bold text-sky-200">Enter OTP</h2>
              <div className="flex justify-center space-x-2">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="text-gray-200 w-10 h-10 text-center border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-700"
                  />
                ))}
              </div>
              <p className="text-green-300 text-center mt-5 font-light text-sm lg:text-base">
                OTP has been sent to your email.
              </p>
            </div>

            <button
              type="button"
              className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-md shadow transition duration-200"
              onClick={handleSubmitOtp}
            >
              Submit OTP
            </button>

            <p className="text-center p-5 font-light text-sm lg:text-base">
              Didn't get OTP?{' '}
              <span
                className={`${otpCooldown ? 'text-gray-400' : 'text-green-300 cursor-pointer'}`}
                onClick={handleResend}
              >
                {otpCooldown ? `Resend in ${otpResendTime}s` : 'Resend'}
              </span>
            </p>
          </>
        )}
      </form>
    </div>
  );
};
