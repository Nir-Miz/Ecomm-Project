
// Importing necessary functions and types from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// --- Type Definitions ---

// Defines the structure of a User object
interface User {
    _id: string;
    name: string;
    email: string;
    token: string;     // JWT or session token used for authenticated requests
    isAdmin: boolean;  // Indicates if the user has admin privileges
}

// Defines the structure of the user slice's state
interface UserState {
    user: User | null; // null means no user is currently logged in
}

// Initial state for the user slice
const initialState: UserState = {
    user: null, // No user logged in by default
};

// --- Slice Definition ---

const userSlice = createSlice({
    name: 'user',           // Name of the slice (used in Redux DevTools and action types)
    initialState,           // The initial state
    reducers: {
        // Called when login succeeds; updates state with the user data
        loginSuccess(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        // Called when user logs out; clears the user from the state
        logout(state) {
            state.user = null;
        },
    },
});

// Exporting the action creators so they can be dispatched from components
export const { loginSuccess, logout } = userSlice.actions;

// Exporting the reducer to be added to the Redux store
export default userSlice.reducer;
