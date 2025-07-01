import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/userSlice';
import type { RootState } from '../../redux/store';
import { FaBars, FaTimes } from 'react-icons/fa';

const NavBar: React.FC = () => {
    // State to control the mobile hamburger menu open/close
    const [menuOpen, setMenuOpen] = useState(false);
    // State to control admin submenu in the mobile view
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Access user data from Redux store
    const user = useSelector((state: RootState) => state.user.user);

    // Handler for logout functionality
    const handleLogout = () => {
        dispatch(logout());        // Dispatch logout action to clear user data
        navigate('/');             // Navigate to homepage
        window.location.reload();  // Reload page to reset app state (optional but common for full reset)
    };

    return (
        <nav className={styles.navbar}>
            {/* Logo linking to home */}
            <Link to="/" className={styles.logo}>
                GadgetGear
            </Link>

            {/* Hamburger menu icon for mobile view */}
            <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />} {/* Toggle between close and bars icon */}
            </div>

            {/* Desktop navigation links */}
            <div className={styles.links}>
                <Link to="/products" className={styles.link}>Products</Link>
                <Link to="/cart" className={styles.link}>Cart</Link>
                <Link to="/orders" className={styles.link}>Orders</Link>

                {/* Admin dropdown menu shown only if user is admin */}
                {user?.isAdmin && (
                    <div className={styles.dropdown}>
                        <button className={styles.link}>פעולות מנהל ▾</button>
                        <div className={styles.dropdownContent}>
                            <Link to="/admin/users" className={styles.link}>ניהול משתמשים</Link>
                            <Link to="/admin/products" className={styles.link}>ניהול מוצרים</Link>
                            <Link to="/admin/orders" className={styles.link}>ניהול הזמנות</Link>
                        </div>
                    </div>
                )}

                {/* Show Login/Register if not logged in */}
                {!user ? (
                    <>
                        <Link to="/login" className={styles.link}>Login</Link>
                        <Link to="/register" className={styles.link}>Register</Link>
                    </>
                ) : (
                    // Show welcome message and logout button if logged in
                    <>
                        <span className={styles.userInfo}>Welcome, {user.name}</span>
                        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>

            {/* Mobile menu - visible when hamburger menu is open */}
            <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
                {/* Mobile navigation links with close menu on click */}
                <Link to="/products" className={styles.link} onClick={() => setMenuOpen(false)}>Products</Link>
                <Link to="/cart" className={styles.link} onClick={() => setMenuOpen(false)}>Cart</Link>
                <Link to="/orders" className={styles.link} onClick={() => setMenuOpen(false)}>Orders</Link>

                {/* Mobile admin menu toggle */}
                {user?.isAdmin && (
                    <div className={styles.mobileAdminSection}>
                        <button
                            className={styles.link}
                            onClick={() => setAdminMenuOpen(prev => !prev)}
                        >
                            פעולות מנהל {adminMenuOpen ? '▲' : '▼'}
                        </button>
                        {/* Admin submenu links */}
                        {adminMenuOpen && (
                            <div className={styles.mobileAdminLinks}>
                                <Link to="/admin/users" className={styles.link} onClick={() => setMenuOpen(false)}>ניהול משתמשים</Link>
                                <Link to="/admin/products" className={styles.link} onClick={() => setMenuOpen(false)}>ניהול מוצרים</Link>
                                <Link to="/admin/orders" className={styles.link} onClick={() => setMenuOpen(false)}>ניהול הזמנות</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Show Login/Register or welcome/logout based on user login state */}
                {!user ? (
                    <>
                        <Link to="/login" className={styles.link} onClick={() => setMenuOpen(false)}>Login</Link>
                        <Link to="/register" className={styles.link} onClick={() => setMenuOpen(false)}>Register</Link>
                    </>
                ) : (
                    <>
                        <span className={styles.userInfo}>Welcome, {user.name}</span>
                        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
