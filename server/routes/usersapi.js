import { Router } from 'express';
import User from '../db/models/user.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = Router();

// GET /api/users → get all users (Admin only)
router.get('/', authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Fetch all users without passwords
        res.json(users);
    } catch (err) {
        res.status(500).send('Server error while fetching users');
    }
});

// GET /api/users/:id → get single user by ID (Admin only)
router.get('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Find user by ID without password
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error while fetching user');
    }
});

// PUT /api/users/:id → update user details (Admin only)
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { name, email, isAdmin } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, isAdmin },
            { new: true }
        ).select('-password'); // Update user and return updated data without password

        if (!updated) return res.status(404).send('User not found');
        res.json(updated);
    } catch (err) {
        res.status(500).send('Server error while updating user');
    }
});

// DELETE /api/users/:id → delete a user (Admin only)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send('User not found');
        res.send({ message: 'User deleted' });
    } catch (err) {
        res.status(500).send('Server error while deleting user');
    }
});

// POST /api/users/create-user → create new user by Admin only
router.post('/create-user', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send('Missing required fields');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User with this email already exists');
        }

        // Note: hashing password here before saving
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false
        });

        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        });
    } catch (err) {
        console.error('❌ Error creating user:', err);
        res.status(500).send('Server error while creating user');
    }
});

export default router;
