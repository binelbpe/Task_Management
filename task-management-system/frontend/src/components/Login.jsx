import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, X, User, Phone } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        Phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialStatus, setInitialStatus] = useState('Log In')
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (initialStatus === 'Log In') {
                response = await axios.post('http://localhost:5000/login', formData)
            } else {
                response = await axios.post('http://localhost:5000/signup', formData)
            }
            console.log('response>>>',response);
            
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
            <div className="w-full max-w-md px-6 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        <div className="flex justify-center">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Lock className="h-8 w-8" />
                            </div>
                        </div>
                        {initialStatus === 'Log In' ? <><h2 className="mt-6 text-3xl font-bold text-center">Welcome Back</h2>
                            <p className="mt-2 text-center text-indigo-200">Sign in to your admin dashboard</p></> : <><h2 className="mt-6 text-3xl font-bold text-center">Join Us Today</h2>
                            <p className="mt-2 text-center text-indigo-200">Create an account to get started</p></>}

                    </div>

                    <div className="px-8 py-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                                <div className="flex">
                                    <X className="h-5 w-5 text-red-500" />
                                    <p className="ml-3 text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {initialStatus === 'Sign Up' ?
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        User name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="name"
                                            name="name"
                                            required
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="your name"
                                            value={formData.username}
                                            onChange={(e)=>setFormData({...formData,username:e.target.value})}
                                            disabled={loading}
                                        />
                                    </div>
                                </div> : ''
                            }


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={(e)=>setFormData({...formData,email:e.target.value})}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {initialStatus === 'Sign Up' ?
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="+91"
                                            value={formData.Phone}
                                            onChange={(e)=>setFormData({...formData,Phone:e.target.value})}
                                            disabled={loading}
                                        />
                                    </div>
                                </div> : ''
                            }


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e)=>setFormData({...formData,password:e.target.value})}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>{initialStatus}...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <Lock className="w-5 h-5 mr-2" />
                                            {initialStatus}
                                        </span>
                                    )}
                                </button>
                                <div className="mt-4 text-center">
                                    {initialStatus === 'Sign Up' ? (
                                        <p className="text-sm text-[#d4d4d4]">
                                            Already have an account?
                                            <button
                                                type="button"
                                                onClick={() => setInitialStatus('Log In')}
                                                className="ml-1 text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
                                            >
                                                Log In
                                            </button>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-[#d4d4d4]">
                                            Don't have an account?
                                            <button
                                                type="button"
                                                onClick={() => setInitialStatus('Sign Up')}
                                                className="ml-1 text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
                                            >
                                                Sign Up
                                            </button>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;