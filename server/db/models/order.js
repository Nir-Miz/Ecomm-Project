import mongoose from 'mongoose';

// Define the schema for an order
const orderSchema = new mongoose.Schema({
    // Reference to the customer who placed the order
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Array of items included in the order
    items: [
        {
            // Reference to the ordered product
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

            // Quantity of the product ordered
            quantity: Number
        }
    ],

    // Timestamp when the order was created, defaults to current date/time
    createdAt: { type: Date, default: Date.now }
});

// Create the Order model using the schema
const Order = mongoose.model("Order", orderSchema);

export default Order;
