import React, { useState } from 'react';
import styles from './Register.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/userSlice.ts';
import { toast } from 'react-toastify';

// Type definition for the expected response from the server
type RegisterResponse = {
    user: {
        _id: string;
        name: string;
        email: string;
        isAdmin: boolean;
        token: string;
    };
};

const Register: React.FC = () => {
    // State for form input values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // State for client-side validation and server-side errors
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        server: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Client-side form validation logic
    const validate = () => {
        let newErrors = { name: '', email: '', password: '', server: '' };
        let isValid = true;

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Update error state
        setErrors(newErrors);
        return isValid;
    };

    // Handle input field changes and reset relevant error messages
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '', server: '' });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Run validation before submission
        if (!validate()) return;

        try {
            // Submit registration data to the server
            const response = await axios.post<RegisterResponse>(
                '${import.meta.env.VITE_API_BASE_URL}/api/authentication/signup',
                formData,
                { withCredentials: true } // Ensures cookie is stored if needed
            );

            // Save user in global state using Redux
            dispatch(loginSuccess(response.data.user));

            // Show success toast and redirect to homepage
            toast.success(`נרשמת בהצלחה – ברוך הבא ${formData.name}`);
            navigate('/');
        } catch (err: any) {
            // Capture and display server error
            const message = err.response?.data || 'Signup failed';
            setErrors(prev => ({ ...prev, server: message }));
            toast.error(message);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <h2>Create an Account</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* Name Input */}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}

                {/* Email Input */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}

                {/* Password Input */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <span className={styles.error}>{errors.password}</span>}

                {/* Submit Button */}
                <button type="submit">Register</button>

                {/* Server Error Message */}
                {errors.server && <div className={styles.serverError}>{errors.server}</div>}
            </form>
        </div>
    );
};

export default Register;
