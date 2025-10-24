const User = require('../models/userModel');
const { generateToken } = require('../authUtils');
const { formatMongooseError } = require('../authUtils');
const bcrypt = require('bcrypt');

exports.getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }
        }
        const token = generateToken(user._id, user.role);
        const response = {
            userName: user.userName,
            role: user.role,
            token: token,
            id: user._id
        };
        res.status(200).json(response);
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            res.status(400).json({ message: formattedMessage });
        } else {
            res.status(500).json({ message: error.message});
        }
    }
};

exports.addUser = async (req, res) => {
    try {
        const { email, password, mobile, userName, role } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the user
        await User.create({
            email,
            password: hashedPassword,
            mobile,
            userName,
            role
        });
        
        res.status(200).json({ message: "User added successfully" });
    } catch (error) {
        console.log(error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const formattedMessage = formatMongooseError(error);
            return res.status(400).json({ message: formattedMessage });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const formattedMessage = formatMongooseError(error);
            return res.status(409).json({ message: formattedMessage });
        }
        
        // Handle other errors
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email address" });
        }

        res.status(200).json({ 
            message: "Email verified successfully. You can now reset your password.",
            email: email
        });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email address" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        res.status(200).json({ 
            message: "Password reset successfully. You can now login with your new password."
        });
    } catch (error) {
        console.error('Error in reset password:', error);
        const formattedMessage = formatMongooseError(error);
        res.status(500).json({ message: formattedMessage });
    }
};