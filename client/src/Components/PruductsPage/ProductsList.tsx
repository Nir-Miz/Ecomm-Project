import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/productSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/cartSlice';
import styles from './ProductsList.module.css';

const ProductsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Select products state and current user from Redux store
    const { products, loading, error } = useSelector((state: RootState) => state.products);
    const user = useSelector((state: RootState) => state.user.user);

    // Local state for pagination and search term
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const productsPerPage = 4;

    // Fetch products when component mounts
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Defensive check: ensure products is an array
    if (!Array.isArray(products)) {
        return <p>Products data is not in the expected format.</p>;
    }

    // Filter products based on search term (case-insensitive)
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate indices for pagination slicing
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Change current page handler
    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Handler to add product to cart; redirects to login if user is not authenticated
    const handleAddToCart = (product: any) => {
        if (!user) {
            toast.info('Please log in to add products to the cart');
            navigate('/login?redirect=/products');
            return;
        }

        dispatch(addToCart({ product, quantity: 1 }));
        toast.success('Product added to cart');
    };

    return (
        <div className={styles.container}>
            <h2>Products</h2>
            {/* Search input to filter products */}
            <input
                type="text"
                placeholder="Search products..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search change
                }}
            />

            {/* Show loading or error states */}
            {loading && <p>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.grid}>
                {/* Display message if no products match the search */}
                {currentProducts.length === 0 ? (
                    <p className={styles.noResults}>No products found matching "{searchTerm}"</p>
                ) : (
                    // Map through current page of products and display cards
                    currentProducts.map(product => (
                        <div key={product._id} className={styles.card}>
                            <img src={`/src/assets/${product.name}.webp`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>${product.price.toFixed(2)}</p>
                            <div className={styles.bottomContainer}>
                                {/* Link to product details */}
                                <Link to={`/products/${product._id}`} className={styles.detailsBtn}>Details</Link>
                                {/* Button to add product to cart */}
                                <button
                                    className={styles.addToCartBtn}
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination controls */}
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
                        onClick={() => goToPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductsList;
