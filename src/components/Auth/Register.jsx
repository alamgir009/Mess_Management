import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiLogIn,
  FiShield
} from 'react-icons/fi';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!", { duration: 2000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8080/user/register', formData, { withCredentials: true });
      if (response && response.data) {
        toast.success(response.data.message, { duration: 2000 });
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error';
      toast.error(errorMessage, { duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    {
      name: 'name',
      icon: FiUser,
      type: 'text',
      placeholder: 'Enter your full name'
    },
    {
      name: 'email',
      icon: FiMail,
      type: 'email',
      placeholder: 'username@email.com'
    },
    {
      name: 'phone',
      icon: FiPhone,
      type: 'tel',
      placeholder: '+91 1234567890'
    },
    {
      name: 'password',
      icon: FiLock,
      type: showPassword ? 'text' : 'password',
      placeholder: 'Create a strong password',
      hasToggle: true
    },
    {
      name: 'confirmPassword',
      icon: FiShield,
      type: showConfirmPassword ? 'text' : 'password',
      placeholder: 'Confirm your password',
      hasToggle: true
    }
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20">
      {/* Premium background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-[#0a0a0a]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      </div>

      {/* Dynamic ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-green-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/15 to-transparent rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">Join UnitedMess and start your journey</p>
          </div>

          {/* Register Form Card */}
          <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/10 p-8 shadow-2xl shadow-black/20 transition-all duration-700 hover:border-white/20">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-emerald-400 to-cyan-500 opacity-0 blur-xl group-hover:opacity-10 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <form onSubmit={handleSubmit}>
                {/* Form Inputs */}
                {inputFields.map((field) => (
                  <div key={field.name} className="mb-6">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-3">
                      {field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <field.icon className="w-5 h-5 text-gray-400 group-focus-within/input:text-emerald-400 transition-colors duration-300" />
                      </div>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="w-full pl-12 pr-12 py-4 bg-white/5 hover:bg-white/8 focus:bg-white/10 text-white border border-white/10 hover:border-white/20 focus:border-emerald-400/30 rounded-2xl focus:outline-none transition-all duration-300 text-base font-medium placeholder-gray-400"
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                      />
                      {field.hasToggle && (
                        <button
                          type="button"
                          onClick={() => 
                            field.name === 'password' 
                              ? setShowPassword(!showPassword)
                              : setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-300"
                        >
                          {(field.name === 'password' ? showPassword : showConfirmPassword) ? 
                            <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />
                          }
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group/submit w-full relative overflow-hidden rounded-2xl transition-all duration-500 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span className="text-white font-semibold text-base">Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="w-5 h-5 text-white" />
                        <span className="text-white font-semibold text-base">Create Account</span>
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signin')}
                    className="group/signin text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>Sign in</span>
                    <FiLogIn className="w-4 h-4 opacity-0 group-hover/signin:opacity-100 -ml-2 group-hover/signin:ml-0 transition-all duration-300" />
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="mt-6 relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-2xl rounded-[24px] border border-white/5 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <FiShield className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">Secure Registration</h3>
            </div>
            <p className="text-xs text-gray-400">
              Your information is protected with enterprise-grade encryption. UnitedMess ensures complete privacy and security for your account data.
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