const jwt = require('jsonwebtoken');
const upload = require('../config/multerConfig');
const User = require('../models/userModel');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const BASE_URL = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}/api`;

// Get all users
exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            return res.status(500).json({
                Code: 500,
                status: 'error',
                message: 'Error fetching users',
            });
        }

        const users = results.map(user => ({
            ...user,
            image: user.image ? `${BASE_URL}/uploads/${user.image}` : null,
        }));

        res.status(200).json({
            Code: 200,
            status: 'success',
            message: 'Users fetched successfully',
            data: users,
        });
    });
};

exports.blockUser = (req, res) => {
    const token = req.headers['x-auth-token'];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        const currentUserId = decoded.id; // ID of the logged-in user
        const { id: userIdToBlock } = req.body;

        if (userIdToBlock === currentUserId) {
            return res.status(400).json({ message: "You cannot block yourself." });
        }

        User.blockUser(userIdToBlock, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error blocking user' });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User blocked successfully' });
        });
    });
};

// Unblock user
exports.unblockUser = (req, res) => {
    const { id } = req.body;
    User.unblockUser(id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error unblocking user' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User unblocked successfully' });
    });
};

// Get logged-in user
exports.getLoggedInUser = (req, res) => {
    const token = req.headers['x-auth-token'];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        User.findById(decoded.id, (err, results) => {
            if (err) return res.status(500).json({ message: 'Error fetching user' });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });

            const user = results[0];
            const imageUrl = user.image ? `${BASE_URL}/uploads/${user.image}` : null;

            res.json({ user: { ...user, image: imageUrl } });
        });
    });
};

// Update user profile
exports.updateProfile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Error uploading files:', err); // Log error on server-side
            return res.status(400).json([{ Code: 400, message: 'Error uploading files', error: err.message }]);
        }

        const userId = req.user.id; // Ensure req.user is not undefined
        const { name } = req.body;
        const imagePaths = req.files ? req.files.map(file => file.path) : null;

        if (!userId) return res.status(400).json([{ Code: 400, message: 'User ID is missing' }]);

        // Generate URLs for the images using BASE_URL
        const imageUrls = imagePaths ? imagePaths.map(filePath => ({ url: `${BASE_URL}/uploads/${path.basename(filePath)}` })) : [];

        User.updateUserProfile(userId, name, imageUrls.map(obj => obj.url), (err, result) => {
            if (err) {
                console.error('Database error:', err); // Log error on server-side
                return res.status(500).json([{ Code: 500, message: 'Database error occurred', error: err.message }]);
            }

            // Response formatted as an array of objects
            res.status(200).json([{
                Code: 200,
                message: 'Profile updated successfully',
                name,
                imageUrls
            }]);
        });
    });
};
