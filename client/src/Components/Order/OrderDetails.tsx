import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../redux/ordersSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import styles from './OrderDetails.module.css';

const OrderDetails: React.FC = () => {
    // Extract 'id' param from URL using React Router
    const { id } = useParams<{ id: string }>();
    // Initialize dispatch function with proper type
    const dispatch = useDispatch<AppDispatch>();
    // Select required pieces of state from Redux store
    const { selectedOrder, loading, error } = useSelector((state: RootState) => state.orders);

    // Fetch order details when component mounts or 'id' changes
    useEffect(() => {
        if (id) dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    // Render loading state
    if (loading) return <p className={styles.message}>טוען פרטי הזמנה...</p>;

    // Render error message if fetching failed
    if (error) return <p className={`${styles.message} ${styles.error}`}>{error}</p>;

    // Handle case where order is not found
    if (!selectedOrder) return <p className={styles.message}>הזמנה לא נמצאה.</p>;

    // Calculate total order amount by summing up (price * quantity) for each item
    const total = selectedOrder.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    // Format order creation date to Hebrew locale with short date and time style
    const formattedDate = new Date(selectedOrder.createdAt).toLocaleString('he-IL', {
        dateStyle: 'short',
        timeStyle: 'short',
    });

    // Extract last 7 characters of order ID to display as order number
    const orderNumber = selectedOrder._id.slice(-7);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h2 className={styles.title}>פרטי ההזמנה</h2>

                {/* Order number display */}
                <div className={styles.orderNumberWrapper}>
                    <p className={styles.orderNumber}>{orderNumber} :מספר הזמנה</p>
                </div>

                {/* Order creation date */}
                <p className={styles.date}><strong>תאריך:</strong> {formattedDate}</p>

                {/* List of order items */}
                <ul className={styles.itemList}>
                    {selectedOrder.items.map((item, i) => (
                        <li key={i} className={styles.item}>
                            {item.product ? (
                                <>
                                    <span className={styles.productName}>{item.product.name}</span>
                                    <span className={styles.quantity}>× {item.quantity}</span>
                                    <span className={styles.price}>₪{(item.product.price * item.quantity).toFixed(2)}</span>
                                </>
                            ) : (
                                // Display if product no longer available
                                <span className={styles.unavailable}>מוצר זה כבר לא זמין × {item.quantity}</span>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Total amount to pay */}
                <p className={styles.total}>סה״כ שולם: <strong>₪{total.toFixed(2)}</strong></p>
            </div>
        </div>
    );
};

export default OrderDetails;
