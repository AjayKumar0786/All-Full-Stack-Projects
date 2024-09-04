import React from "react";
import { useNavigate } from 'react-router-dom';
import logo from './assets/TESLA-LOGO.webp';
import { FiLogOut } from "react-icons/fi";
import { FaClipboardList, FaUser, FaChartLine, FaCreditCard, FaCheckCircle, FaLock } from 'react-icons/fa';

function ButtonGroup({ buttons, isSelected, setIsSelected }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token'); 
        alert('Logout Successfully');
        navigate("/"); 
    };

    const handleNavigation = (index) => {
        setIsSelected(index);
    };

    const icons = [
        <FaClipboardList />, // Job Posts
        <FaUser />,          // All users
        <FaChartLine />,     // Report
        <FaCreditCard />,    // Subscription
        <FaCheckCircle />,   // Verify Users
        <FaLock />           // Change Password
    ];

    return (
        <div className="bg-white h-screen w-64 rounded-2xl">
        
            <div className="ml-5 mt-6">
                <a href="/dashboard">
                    <img className="h-28 max-w-full ml-1" src={logo} alt="Logo" />
                </a>
            </div>

            <div className="flex flex-col space-y-4 p-6 mt-6">
                {buttons.map((text, index) => (
                    <button
                        key={index}
                        className={`flex items-center space-x-3 overflow-hidden px-5 py-3 rounded-l-lg transition-colors duration-300 ${
                            isSelected === index ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                        }`}
                        onMouseEnter={(e) => e.currentTarget.classList.add(isSelected === index ? 'bg-blue-600' : 'bg-gray-300')}
                        onMouseLeave={(e) => e.currentTarget.classList.remove(isSelected === index ? 'bg-blue-600' : 'bg-gray-300')}
                        onClick={() => handleNavigation(index)}
                    >
                        {icons[index]}
                        <span>{text}</span>
                    </button>
                ))}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-5 py-3 mt-auto bg-white text-gray-700 rounded-l-lg transition-colors duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onMouseEnter={(e) => e.currentTarget.classList.add('bg-gray-300')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('bg-gray-300')}
                >
                    <FiLogOut />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default ButtonGroup;
