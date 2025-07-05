// src/pages/ProductDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetails.module.css';

// Define the Product interface for type safety
interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
}

const ProductDetails: React.FC = () => {
    // Extract product ID from URL parameters
    const { id } = useParams<{ id: string }>();

    // State to store product data
    const [product, setProduct] = useState<Product | null>(null);
    // Loading state indicator
    const [loading, setLoading] = useState(true);
    // Error message state
    const [error, setError] = useState<string | null>(null);

    // Fetch product details when component mounts or 'id' changes
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await res.json();
                setProduct(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Render loading state
    if (loading) return <p className={styles.loading}>Loading...</p>;
    // Render error message if fetching failed
    if (error) return <p className={styles.error}>{error}</p>;
    // Render message if product not found
    if (!product) return <p className={styles.error}>Product not found</p>;

    // Render product details once loaded successfully
    return (
        <div className={styles.container}>
            <img
                src={`/assets/${product.name}.webp`}
                alt={product.name}
                className={styles.image}
            />
            <div className={styles.details}>
                <h2>{product.name}</h2>
                <p className={styles.description}>{product.description}</p>
                <p className={styles.price}>${product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductDetails;
