import { useEffect, useState } from 'react';
import styles from './OrderManagement.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import axios from 'axios';
import { fetchAllOrders } from '../../../redux/ordersSlice';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrderManagement = () => {
    const dispatch = useDispatch();

    // Extract orders and loading state from Redux
    const { orders, loading } = useSelector((state: RootState) => state.orders);

    // Local state for tracking edited order and updated item quantities
    const [editOrderId, setEditOrderId] = useState<string | null>(null);
    const [updatedItems, setUpdatedItems] = useState<any[]>([]);

    // Fetch all orders on component mount
    useEffect(() => {
        dispatch(fetchAllOrders() as any);
    }, [dispatch]);

    // Handle order deletion
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/orders/${id}`, {
                withCredentials: true,
            });
            toast.success('Order deleted');
            dispatch(fetchAllOrders() as any); // Refresh orders
        } catch {
            toast.error('Error deleting order');
        }
    };

    // Start editing an order
    const handleEditClick = (order: any) => {
        setEditOrderId(order._id);
        setUpdatedItems(
            order.items.map((item: any) => ({
                product: item.product._id,
                quantity: item.quantity,
            }))
        );
    };

    // Update quantity of a specific item
    const handleItemChange = (index: number, value: number) => {
        const updated = [...updatedItems];
        updated[index].quantity = value;
        setUpdatedItems(updated);
    };

    // Submit updated order data
    const handleUpdate = async () => {
        if (!editOrderId) return;
        try {
            await axios.put(
                `http://localhost:3000/api/orders/${editOrderId}`,
                { items: updatedItems },
                { withCredentials: true }
            );
            toast.success('Order updated');
            setEditOrderId(null);
            dispatch(fetchAllOrders() as any); // Refresh orders
        } catch {
            toast.error('Error updating order');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Order Management</h2>
            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p className={styles.noResults}>No orders found</p>
            ) : (
                <div className={styles.grid}>
                    {orders.map((order) => (
                        <div key={order._id} className={styles.card}>
                            <h3>Order ID: {order._id}</h3>
                            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                            <div>
                                {order.items.map((item, i) => {
                                    const product = item.product;
                                    return (
                                        <p key={product?._id || i}>
                                            {product?.name || 'Unknown Product'} - $
                                            {product?.price?.toFixed(2) || '0.00'} ×{' '}
                                            {editOrderId === order._id ? (
                                                <input
                                                    type="number"
                                                    value={updatedItems[i]?.quantity || 0}
                                                    min={1}
                                                    onChange={(e) =>
                                                        handleItemChange(i, parseInt(e.target.value))
                                                    }
                                                    className={styles.quantityInput}
                                                />
                                            ) : (
                                                item.quantity
                                            )}
                                        </p>
                                    );
                                })}
                            </div>

                            {/* Action buttons: Edit/Save/Delete */}
                            <div className={styles.bottomContainer}>
                                {editOrderId === order._id ? (
                                    <>
                                        <button onClick={handleUpdate} className={styles.detailsBtn}>
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditOrderId(null)}
                                            className={styles.addToCartBtn}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(order)}
                                            className={styles.detailsBtn}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className={styles.addToCartBtn}
                                        >
                                            <FaTrash />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
