import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Middleware for parsing cookies
import authenticationRouter from './routes/auth.js';
import productRoutes from './routes/productsapi.js';
import orderRoutes from './routes/ordersapi.js';
import userRoutes from './routes/usersapi.js';
import cors from 'cors';

dotenv.config();

const app = express();

// Connect to MongoDB database using environment variable
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log("Error DB Connection:", error));

// Middleware to parse JSON request bodies
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    credentials: true                 // Allow sending cookies
}));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// User-related routes
app.use('/api/authentication', authenticationRouter); // User registration and login routes
app.use('/api/products', productRoutes);              // Product-related routes
app.use('/api/orders', orderRoutes);                  // Order-related routes
app.use('/api/users', userRoutes);                    // User management routes

// Start the server using the port from environment variable or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
