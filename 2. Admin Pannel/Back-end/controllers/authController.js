const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const BASE_URL = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}/api`;

// Signup
exports.signup = async (req, res) => {
    const { name, email, phone, password } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        User.findByEmail(email, async (err, results) => {
            if (err) {
                return res.status(500).json({
                    Code: 500,
                    status: 'error',
                    message: 'Error checking email'
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    Code: 400,
                    status: 'error',
                    message: 'Email already in use'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { name, email, phone, password: hashedPassword, image };

            User.createUser(user, async (err, result) => {
                if (err) {
                    return res.status(500).json({
                        Code: 500,
                        status: 'error',
                        message: 'Error registering user'
                    });
                }

                const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '1h' });

                User.updateUserToken(result.insertId, token, (err) => {
                    if (err) {
                        return res.status(500).json({
                            Code: 500,
                            status: 'error',
                            message: 'Error updating JWT token'
                        });
                    }

                    const imageUrl = image ? `${BASE_URL}/uploads/${image}` : null;

                    res.setHeader('x-auth-token', token);
                    res.status(200).json({
                        Code: 200,
                        status: 'success',
                        message: 'User registered successfully',
                        data: {
                            id: result.insertId,
                            name,
                            email,
                            phone,
                            image: imageUrl,
                            token
                        }
                    });
                });
            });
        });
    } catch (err) {
        res.status(500).json({
            Code: 500,
            status: 'error',
            message: 'Error registering user'
        });
    }
};

// Login
exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, async (err, results) => {
        if (err) {
            return res.status(500).json({
                Code: 500,
                status: 'error',
                message: 'Error logging in'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                Code: 401,
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const user = results[0];

        if (user.blocked) {
            return res.status(403).json({
                Code: 403,
                status: 'error',
                message: 'Your account is blocked. Please contact support.'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                Code: 401,
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        User.updateUserToken(user.id, token, (err) => {
            if (err) {
                return res.status(500).json({
                    Code: 500,
                    status: 'error',
                    message: 'Error updating JWT token'
                });
            }

            const imageUrl = user.image ? `${BASE_URL}/uploads/${user.image}` : null;

            res.setHeader('x-auth-token', token);
            res.status(200).json({
                Code: 200,
                status: 'success',
                message: 'Login successful',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    image: imageUrl,
                    token
                },
            });
        });
    });
};
