import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/userSlice.ts';
import { toast } from 'react-toastify';

// Login component definition
const Login: React.FC = () => {
    // Define the expected response shape from the login API
    type LoginResponse = {
        user: {
            _id: string;
            name: string;
            email: string;
            isAdmin: boolean;
            token: string;
        };
    };

    const dispatch = useDispatch();  // Redux dispatcher for state updates
    const navigate = useNavigate();  // React Router hook to navigate programmatically

    // Local state for form inputs
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Local state for validation and server errors
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        server: ''
    });

    // Validate the form inputs before submitting
    const validate = () => {
        let newErrors = { email: '', password: '', server: '' };
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle input change and clear corresponding error message
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear the error for the changed input and any server error
        setErrors({ ...errors, [e.target.name]: '', server: '' });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if validation fails
        if (!validate()) return;

        try {
            // Make API call to login endpoint with form data
            const response = await axios.post<LoginResponse>(
                '${import.meta.env.VITE_API_BASE_URL}/api/authentication/login',
                formData,
                { withCredentials: true } // Include cookies if needed
            );

            // Extract user data from the response
            const { _id, name, email, isAdmin, token } = response.data.user;

            // Dispatch Redux action to update user state on successful login
            dispatch(loginSuccess({ _id, name, email, isAdmin, token }));

            // Show success toast message welcoming the user
            toast.success(`התחברת בהצלחה - ברוך הבא ${name}`);

            // Redirect to homepage after successful login
            navigate('/');
        } catch (err: any) {
            // Extract error message from server response or fallback message
            const message = err.response?.data || 'Login failed';
            // Update server error state to display in the UI
            setErrors(prev => ({ ...prev, server: message }));
            // Show error toast notification
            toast.error(message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* Email input field */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {/* Display email validation error if any */}
                {errors.email && <span className={styles.error}>{errors.email}</span>}

                {/* Password input field */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {/* Display password validation error if any */}
                {errors.password && <span className={styles.error}>{errors.password}</span>}

                {/* Submit button */}
                <button type="submit">Login</button>

                {/* Display server error message if login fails */}
                {errors.server && <div className={styles.serverError}>{errors.server}</div>}
            </form>
        </div>
    );
};

export default Login;
