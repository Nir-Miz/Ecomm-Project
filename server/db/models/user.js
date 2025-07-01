import mongoose from 'mongoose';

// Define the schema for a user
const userSchema = new mongoose.Schema({
    // User's full name
    name: String,

    // User's email address (must be unique)
    email: { type: String, unique: true },

    // User's hashed password
    password: String,

    // Flag to determine if the user has admin privileges, default is false
    isAdmin: { type: Boolean, default: false }
});

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

export default User;
