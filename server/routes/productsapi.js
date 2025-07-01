import { Router } from 'express';
import Product from '../db/models/product.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = Router();

// GET /products → list all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from DB
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error while fetching products');
    }
});

// GET /products/:id → get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Find product by ID
        if (!product) return res.status(404).send('Product not found');
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error while fetching product');
    }
});

// POST /products/create-product → create new product (Admin only)
router.post('/create-product', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const product = new Product({ name, price, description }); // Create new product instance
        await product.save(); // Save product to DB
        res.status(201).json(product);
    } catch (err) {
        res.status(500).send('Server error while creating product');
    }
});

// PUT /products/:id → update existing product (Admin only)
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        // Update product fields with data from req.body, return new updated doc
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).send('Product not found');
        res.json(updated);
    } catch (err) {
        res.status(500).send('Server error while updating product');
    }
});

// DELETE /products/:id → delete product by ID (Admin only)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send('Product not found');
        res.send({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).send('Server error while deleting product');
    }
});

export default router;
