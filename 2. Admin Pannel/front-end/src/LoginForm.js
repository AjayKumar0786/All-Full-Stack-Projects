import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from "react-icons/io5";

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', formData);

            // Extract token from response headers
            const tokenFromHeader = response.headers['x-auth-token'];
            // Extract token from response data
            const tokenFromBody = response.data.data.token;

            const token = tokenFromHeader || tokenFromBody;

            if (token) {
                // Store token and user data
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('user', JSON.stringify(response.data.data)); // Store the user data

                setMessage('Login successful!');

                // Navigate to the dashboard after successful login
                navigate('/dashboard');
            } else {
                setMessage('Login failed: No token received');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Error logging in');
            }
        }
    };

    const handleSignupRedirect = () => {
        navigate('/SignupForm');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-md shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                    <button
                        type="button"
                        onClick={handleShowPassword}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                    >
                        {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </button>
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    onClick={handleSignupRedirect}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Signup
                </button>
            </div>
            {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
        </div>
    );
};

export default LoginForm;
