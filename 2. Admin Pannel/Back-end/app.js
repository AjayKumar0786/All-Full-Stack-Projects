const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies and enabling CORS
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'x-auth-token'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

//it parse incoming form data from front-end on submitt
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Use the imported route modules
app.use('/auth', authRoutes); 
app.use('/user', userRoutes); 

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
