import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addUserId } from '../../store/slices/resetPasswordSlice';

export const RequestOtp = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch()

  const [otpRequested, setOtpRequested] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/user/requestotp',
        { email },
        { withCredentials: true }
      );
      if (response) {
        toast.success(response.data.message, {
          duration: 2000,
        });
        setOtpRequested(true);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleResend = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/user/requestotp',
        { email },
        { withCredentials: true }
      );
      if (response) {
        toast.success(response.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    try {
      const response = await axios.post(
        'http://localhost:8080/user/validateotp',
        { email, otp: otpCode },
        { withCredentials: true }
      );
      console.log(response.data)
      if (response) {
        toast.success(response.data.message, {
          duration: 2000,
        });
        dispatch(addUserId(response.data.userId))
        setTimeout(()=>{
          navigate('/resetpassword');
        },3000)
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        duration: 2000,
      });
    }
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-blue-950 text-gray-50 h-screen flex justify-center items-center">
      <form
        className="border border-green-300 p-5 font-inter w-full md:w-80 lg:w-80 xl:w-96 rounded-md m-2 bg-green-400/10"
        onSubmit={handleRequestOtp}
      >
        <h1 className="text-4xl mb-5 text-center">Request OTP</h1>

        <label htmlFor="email" className="block mb-3">
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="username@email.com"
            className="inpt mt-1 w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </label>

        {!otpRequested && (
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 w-full rounded-md h-8 mt-2 font-semibold"
          >
            Request OTP
          </button>
        )}

        {otpRequested && (
          <div className="mt-5">
            <h2 className="text-2xl mb-3 text-center">Enter OTP</h2>
            <div className="flex justify-center space-x-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="text-black w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ))}
            </div>
            <p className="text-green-300 text-center mt-5 font-light text-sm lg:text-base">
              OTP has been sent to your email.
            </p>
          </div>
        )}

        {otpRequested && (
          <button
            type="button"
            className="bg-sky-500 hover:bg-sky-600 w-full rounded-md h-8 mt-5 font-semibold"
            onClick={handleSubmitOtp}
          >
            Submit OTP
          </button>
        )}

        <p className="text-center p-5 font-light text-sm lg:text-base">
          Didn't get OTP?{' '}
          <span
            className="text-green-300 cursor-pointer"
            onClick={handleResend}
          >
            Resend
          </span>
        </p>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};
