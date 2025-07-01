import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Product } from '../Types/product';

// --- State Definition ---

// The shape of the product slice state
interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

// Initial state for the product slice
const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
};

// --- Async Thunk ---

// Async thunk to fetch the list of products from the API
export const fetchProducts = createAsyncThunk<Product[]>(
    'products/fetch',
    async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        return response.data as Product[];
    }
);

// --- Slice ---

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {}, // No synchronous reducers at the moment

    // Handle async thunk lifecycle with extraReducers
    extraReducers(builder) {
        builder
            // When fetch starts: set loading to true and clear any previous error
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // On success: store the fetched products and stop loading
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.loading = false;
            })

            // On failure: save the error and stop loading
            .addCase(fetchProducts.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

// Export the reducer to be included in the Redux store
export default productSlice.reducer;
