import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Type definition for a single cart item
type CartItem = {
    product: {
        _id: string;
        name: string;
        price: number;
    },
    quantity: number;
};

// Type definition for the cart's state structure
interface CartState {
    items: CartItem[];
}

// Initial state for the cart
const initialState: CartState = {
    items: [],
};

// Create a Redux slice for the cart functionality
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Adds a product to the cart.
        // If it already exists, increase its quantity.
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = state.items.find(i => i.product._id === action.payload.product._id);
            if (item) {
                item.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },

        // Removes a product from the cart by product ID
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i.product._id !== action.payload);
        },

        // Increases the quantity of a specific product in the cart
        increaseQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.product._id === action.payload);
            if (item) item.quantity++;
        },

        // Decreases the quantity of a specific product, ensuring it doesn't go below 1
        decreaseQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.product._id === action.payload);
            if (item && item.quantity > 1) item.quantity--;
        },

        // Empties the entire cart
        clearCart: (state) => {
            state.items = [];
        },
    },
});

// Exporting action creators for use in components
export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;

// Exporting the reducer to be used in the store
export default cartSlice.reducer;
