// redux/store.ts

// Importing the Redux Toolkit function for creating a store
import { configureStore } from '@reduxjs/toolkit';

// Importing individual slice reducers
import userReducer from './userSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';

// Creating the Redux store and combining all the reducers
export const store = configureStore({
    reducer: {
        user: userReducer,       // Handles user authentication and data
        products: productReducer, // Manages the list of products
        cart: cartReducer,       // Manages the shopping cart
        orders: ordersReducer,   // Manages orders (user/admin)
    },
});

// Type alias for the root state of the Redux store
// Useful for useSelector: (state: RootState) => state.someSlice
export type RootState = ReturnType<typeof store.getState>;

// Type alias for the dispatch function with thunk support
// Useful for useDispatch with proper type inference
export type AppDispatch = typeof store.dispatch;
