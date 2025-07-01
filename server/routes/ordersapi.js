import { Router } from "express";
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';
import Order from '../db/models/order.js';

const router = Router();

// GET /api/orders → Get all orders (Admin only)
router.get('/', authMiddleware, isAdmin, async (req, res) => {
    try {
        // Fetch all orders, populate customer info and product details in items
        const orders = await Order.find()
            .populate('customer', 'name email')
            .populate('items.product', 'name price');
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server error while fetching orders');
    }
});

// POST /api/orders → Create a new order
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;

        // Validate that items exist and is a non-empty array
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).send('Invalid order data');
        }

        // Create a new order with the authenticated user as customer
        const newOrder = await Order.create({
            customer: req.user._id,
            items
        });

        // Re-fetch the created order with populated customer and product details
        const populatedOrder = await Order.findById(newOrder._id)
            .populate('customer')         // populate customer info
            .populate('items.product');   // populate product info for each item

        // Return the created order with populated data
        res.status(201).json(populatedOrder);
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ error: 'Error creating order' });
    }
});

// GET /api/orders/my → Get orders for the logged-in user
router.get('/my', authMiddleware, async (req, res) => {
    console.log("📥 GET /api/orders/my started");
    console.log("👤 Logged-in user:", req.user);

    try {
        // Find orders where the customer matches the logged-in user
        // Populate product details in each order item
        const orders = await Order.find({ customer: req.user._id })
            .populate('items.product');

        res.json(orders);
    } catch (error) {
        console.error("❌ Server error fetching user's orders:", error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
});

// GET /api/orders/:id → Get a specific order by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        // Find the order by ID and populate customer and product details
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('items.product', 'name price');

        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Authorization: allow access only if order belongs to user or user is admin
        if (order.customer._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).send('Access denied');
        }

        res.json(order);
    } catch (err) {
        res.status(500).send('Server error while fetching order');
    }
});

// PUT /api/orders/:id → Update an order (Admin only)
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { items } = req.body;

        // Update order's items and return the updated order with populated fields
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { items },
            { new: true }
        )
            .populate('customer', 'name email')
            .populate('items.product', 'name price');

        if (!updated) return res.status(404).send('Order not found');

        res.json(updated);
    } catch (err) {
        console.error('Order update error:', err);
        res.status(500).send('Error updating order');
    }
});

// DELETE /api/orders/:id → Delete an order (Admin only)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send('Order not found');

        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Order delete error:', err);
        res.status(500).send('Error deleting order');
    }
});

export default router;
