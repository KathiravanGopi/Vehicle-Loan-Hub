const jwt = require('jsonwebtoken');

const SECRET_KEY = 'asdfgewlnclnlhjkl';

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '1h' });
};

const validateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: "Authentication failed" });
        }
        
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Authentication failed" });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }
        next();
    };
};

function formatMongooseError(error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return messages[0]; 
    }
    
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        
        const fieldMessages = {
            email: `Email is already registered`,
            userName: `Username is already taken`,
            mobile: `Mobile number is already registered`
        };
        
        return fieldMessages[field] || `${field} already exists`;
    }
    
    return error.message;
}

module.exports = { generateToken, validateToken, authorizeRoles, formatMongooseError };