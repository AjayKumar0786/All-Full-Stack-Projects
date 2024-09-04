import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from "react-icons/io5";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        image: null,
    });
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // Set the preview image
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('password', formData.password);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await axios.post('http://localhost:3000/auth/signup', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response data:', response.data);

            const { token } = response.data.data; // Adjust according to the actual response structure

            if (token) {
                sessionStorage.setItem('token', token);
                setMessage('Signup successful! Token stored in sessionStorage.');
                navigate('/dashboard');
            } else {
                setMessage('Signup failed. Token not received.');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Error signing up');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-md shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mt-4">Phone</label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">Password</label>
                <div className="relative mt-1">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                        {showPassword ? <IoEyeOff size={20}/> : <IoEye size={20}/>}
                    </button>

                </div>

                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mt-4">Profile Image</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500"
                    accept="image/*"
                />
                
                <div className='flex justify-between mt-4'>

                {/* Preview Image */}
                {previewImage && (
                    <div className=''>
                        <img
                            src={previewImage}
                            alt="Image Preview"
                            className="w-32 h-32 object-cover rounded-md border border-gray-300 flex justify-end"
                        />
                    </div>
                )}

                <div className="flex flex-col space-y-2">

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{ minWidth: '100px' }}
                    >
                        LogIn
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ minWidth: '100px' }}
                    >
                        Signup
                    </button>

                  
                </div>

                </div>

            </form>

        

            {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
        </div>
    );
};

export default SignupForm;
