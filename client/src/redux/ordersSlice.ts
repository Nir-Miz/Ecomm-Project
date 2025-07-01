import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Types ---

// Represents a single item in an order
interface OrderItem {
    product: {
        _id: string;
        name: string;
        price: number;
    };
    quantity: number;
}

// Represents the structure of an order
export interface Order {
    _id: string;
    items: OrderItem[];
    createdAt: string;
}

// Defines the shape of the orders slice state
interface OrdersState {
    orders: Order[];
    selectedOrder: Order | null;
    loading: boolean;
    error: string | null;
}

// --- Initial State ---

// Initial state for the orders slice
const initialState: OrdersState = {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
};

// --- Thunks ---

// Creates a new order
export const createOrder = createAsyncThunk<
    Order,
    { items: { product: string; quantity: number }[] },
    { rejectValue: string }
>('orders/createOrder', async (orderData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post<Order>(
            '${import.meta.env.VITE_API_BASE_URL}/api/orders',
            orderData,
            { withCredentials: true }
        );
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to create order');
    }
});

// Fetches all orders for the currently logged-in user
export const fetchUserOrders = createAsyncThunk<
    Order[],
    void,
    { rejectValue: string }
>('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<Order[]>(
            '${import.meta.env.VITE_API_BASE_URL}/api/orders/my',
            { withCredentials: true }
        );
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
});

// Fetches a single order by its ID
export const fetchOrderById = createAsyncThunk<
    Order,
    string,
    { rejectValue: string }
>('orders/fetchOrderById', async (orderId, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<Order>(
            `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`,
            { withCredentials: true }
        );
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch order');
    }
});

// Fetches all orders (admin-level access)
export const fetchAllOrders = createAsyncThunk<
    Order[],
    void,
    { rejectValue: string }
>('orders/fetchAllOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<Order[]>(
            '${import.meta.env.VITE_API_BASE_URL}/api/orders',
            { withCredentials: true }
        );
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch all orders');
    }
});

// --- Slice ---

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handles user orders fetch lifecycle
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch orders';
            })

            // Handles fetch by order ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch order';
            })

            // Handles fetch of all orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch all orders';
            })

            // Handles order creation
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create order';
            });
    },
});

// Export the reducer to be used in the Redux store
export default ordersSlice.reducer;
