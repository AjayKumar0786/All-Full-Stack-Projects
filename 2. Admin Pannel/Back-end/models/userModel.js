const db = require('../config/db');

const User = {
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], callback);
    },
    findById: (id, callback) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    },
    createUser: (userData, callback) => {
        const sql = 'INSERT INTO users SET ?';
        db.query(sql, userData, callback);
    },
    updateUserToken: (id, token, callback) => {
        const sql = 'UPDATE users SET jwt_token = ? WHERE id = ?';
        db.query(sql, [token, id], callback);
    },
    getAllUsers: (callback) => {
        const sql = 'SELECT * FROM users';
        db.query(sql, callback);
    },
    blockUser: (id, callback) => {
        const sql = 'UPDATE users SET blocked = 1 WHERE id = ?';
        db.query(sql, [id], callback);
    },
    unblockUser: (id, callback) => {
        const sql = 'UPDATE users SET blocked = 0 WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Update user profile in the database
    updateUserProfile: (userId, name, imagePaths, callback) => {
        let query = `UPDATE users SET `;
        const values = [];

        if (imagePaths && imagePaths.length > 0) {
            query += `image = ?, `;
            values.push(imagePaths.join(','));
        }

        if (name) {
            query += `name = ? `;
            values.push(name);
        }

        query += `WHERE id = ?`;
        values.push(userId);

        db.query(query, values, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },
};

module.exports = User;
