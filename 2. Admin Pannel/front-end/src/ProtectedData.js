// src/ProtectedData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedData = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:3000/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setData(response.data);
                } catch (error) {
                    console.error('Error fetching protected data:', error);
                    setError('Error fetching data');
                }
            } else {
                setError('No token found');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-md shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Protected Data</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {data ? (
                <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p className="text-center">Loading...</p>
            )}
        </div>
    );
};

export default ProtectedData;
