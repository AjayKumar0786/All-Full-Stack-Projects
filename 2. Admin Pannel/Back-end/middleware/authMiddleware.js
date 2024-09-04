const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = function ensureAuthenticated(req, res, next) {
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Failed to authenticate token' });
        }

        req.user = decoded; // Set the user data to req.user
        next();
    });
};
