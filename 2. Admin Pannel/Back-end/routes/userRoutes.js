const express = require('express');
const multer = require('multer');

const userController = require('../controllers/userController');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.get('/users', userController.getAllUsers);
router.post('/blockUser', userController.blockUser);
router.post('/unblockUser', userController.unblockUser);
router.get('/loggedInUser', userController.getLoggedInUser);
router.post('/profile/update', ensureAuthenticated, userController.updateProfile);

module.exports = router;
