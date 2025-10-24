const express = require('express');
const { getUserByEmailAndPassword, addUser, forgotPassword, resetPassword } = require('../controllers/userController');
const router = express.Router();

router.post('/login', getUserByEmailAndPassword);
router.post('/signup', addUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;