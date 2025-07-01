// src/pages/Cart.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { createOrder } from '../../redux/ordersSlice';
import type { AppDispatch } from '../../redux/store';

import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} from '../../redux/cartSlice';

import styles from './Cart.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart: React.FC = () => {
    // Select cart items and user from Redux store
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const user = useSelector((state: RootState) => state.user.user);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Calculate total cart value
    const total = cartItems.reduce((sum, item) => {
        if (!item.product) return sum;
        return sum + item.product.price * item.quantity;
    }, 0);

    // Redirect unauthenticated users to login page
    useEffect(() => {
        if (!user) {
            toast.info('עליך להתחבר כדי לצפות בעגלת הקניות');
            navigate('/login?redirect=/cart');
        }
    }, [user, navigate]);

    // Handle placing an order
    const handlePlaceOrder = () => {
        const itemsToSend = cartItems
            .filter(item => item.product) // Filter only available products
            .map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            }));

        dispatch(createOrder({ items: itemsToSend }))
            .unwrap()
            .then(() => {
                toast.success('ההזמנה בוצעה בהצלחה!');
                dispatch(clearCart());
                navigate('/orders');
            })
            .catch((err) => {
                toast.error('הייתה שגיאה בשליחת ההזמנה: ' + err);
            });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>🛒 Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p className={styles.empty}>Your cart is empty.</p>
            ) : (
                <div className={styles.cartContent}>
                    <ul className={styles.cartList}>
                        {cartItems.map(item => (
                            <li
                                key={item.product?._id || Math.random()}
                                className={styles.cartItem}
                            >
                                {item.product ? (
                                    <>
                                        <img
                                            src={`/src/assets/${item.product.name}.webp`}
                                            alt={item.product.name}
                                            className={styles.itemImage}
                                        />
                                        <div className={styles.itemDetails}>
                                            <h3>{item.product.name}</h3>
                                            <p>${item.product.price.toFixed(2)}</p>
                                            <div className={styles.quantityControls}>
                                                <button
                                                    onClick={() =>
                                                        dispatch(decreaseQuantity(item.product._id))
                                                    }
                                                >
                                                    −
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        dispatch(increaseQuantity(item.product._id))
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className={styles.removeBtn}
                                                onClick={() =>
                                                    dispatch(removeFromCart(item.product._id))
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.itemDetails}>
                                        <h3>מוצר זה כבר לא זמין</h3>
                                        <p>× {item.quantity}</p>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() =>
                                                dispatch(removeFromCart('' + item.product?._id))
                                            }
                                        >
                                            הסר
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className={styles.summary}>
                        <p>
                            Total: <strong>${total.toFixed(2)}</strong>
                        </p>
                        <button
                            className={styles.placeOrderBtn}
                            onClick={handlePlaceOrder}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
