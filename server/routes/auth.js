import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';

const router = Router();

// User Registration endpoint
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send('Email already in use');
        }

        // Hash the user's password before saving to DB
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance with hashed password
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        // Generate JWT token for the new user
        const token = jwt.sign(
            { userId: user._id, name: user.name, isAdmin: user.isAdmin },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: '1h' } // Token valid for 1 hour
        );

        // Send the JWT token as a secure HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // only send cookie over HTTPS in production
            sameSite: 'Strict', // protect against CSRF
            maxAge: 3600000 // cookie expires in 1 hour
        });

        // Respond with success message and user info (excluding password)
        res.status(201).send({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token
            }
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).send('Server error during signup');
    }
});

// User logout endpoint
router.post('/logout', (req, res) => {
    // Clear the token cookie to log the user out
    res.clearCookie('token');
    res.status(200).send('Logged out successfully');
});

// User Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in DB by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        // Generate JWT token for the authenticated user
        const token = jwt.sign(
            { userId: user._id, name: user.name, isAdmin: user.isAdmin },
            process.env.AUTH_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Send token as secure HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000
        });

        // Respond with success message and user info (excluding password)
        res.status(200).send({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Server error during login');
    }
});

export default router;
