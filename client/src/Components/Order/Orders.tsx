import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../../redux/ordersSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Orders.module.css';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Select the current user and orders state from the Redux store
    const user = useSelector((state: RootState) => state.user.user);
    const { orders, loading, error } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        if (!user) {
            // Redirect to login if user is not authenticated
            toast.info('You need to log in to view orders');
            navigate('/login?redirect=/orders');
        } else {
            // Fetch the authenticated user's orders
            dispatch(fetchUserOrders());
        }
    }, [user, dispatch, navigate]);

    // Render loading state
    if (loading) return <p className={styles.message}>Loading orders...</p>;
    // Render error state
    if (error) return <p className={`${styles.message} ${styles.error}`}>{error}</p>;
    // Render empty state when no orders exist
    if (!loading && orders.length === 0) {
        return <p className={styles.message}>No previous orders found.</p>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                Your Order History ({orders.length})
            </h2>

            {orders.map(order => {
                // Calculate total quantity of items in the order
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                // Format order creation date and time
                const date = new Date(order.createdAt);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                return (
                    <div key={order._id} className={styles.orderCard}>
                        <p><strong>Date:</strong> {formattedDate} at {formattedTime}</p>
                        <p><strong>Total Items:</strong> {totalItems}</p>
                        <ul className={styles.itemList}>
                            {order.items.map((item, index) => {
                                const product = item.product;
                                return (
                                    <li key={index}>
                                        {product ? (
                                            <>
                                                {product.name} × {item.quantity} — ₪{(product.price * item.quantity).toFixed(2)}
                                            </>
                                        ) : (
                                            <>
                                                Product unavailable × {item.quantity}
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        <p className={styles.total}>
                            <strong>Total Price:</strong> ₪
                            {order.items.reduce((sum, item) => {
                                return sum + (item.product?.price || 0) * item.quantity;
                            }, 0).toFixed(2)}
                        </p>
                        {/* Link to order details page */}
                        <Link to={`/orders/${order._id}`} className={styles.detailsButton}>
                            View Details
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default Orders;
