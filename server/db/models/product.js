import mongoose from 'mongoose';

// Define the schema for a product
const productSchema = new mongoose.Schema({
    // Name of the product
    name: String,

    // Price of the product
    price: Number,

    // Description of the product
    description: String
});

// Create the Product model using the schema
// Note: The model name is singular and matches the collection name in lowercase plural form in MongoDB
const Product = mongoose.model("Product", productSchema);

export default Product;
