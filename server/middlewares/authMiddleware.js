import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../db/models/user.js'; // ← Import User model

dotenv.config();

const authMiddleware = async (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.token;

    // If no token found, deny access
    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);

        // Fetch the actual user from the DB by ID (exclude password)
        const user = await User.findById(decoded.userId).select('-password');

        // If user does not exist, deny access
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }

        // Attach user info to the request object and proceed
        req.user = user;
        next();
    } catch (error) {
        // If token is invalid or expired, deny access
        res.status(401).send({ message: 'Invalid or expired token.' });
    }
};

export default authMiddleware;
