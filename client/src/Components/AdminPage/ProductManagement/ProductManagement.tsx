import React, { useEffect, useState } from 'react';
import styles from './ProductManagement.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../redux/productSlice';
import axios from 'axios';
import type { RootState } from '../../../redux/store';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Interface for the product form structure
interface ProductFormData {
    _id?: string;
    name: string;
    price: number;
    description: string;
}

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state: RootState) => state.products);

    // State for modal visibility
    const [showModal, setShowModal] = useState(false);

    // State for form inputs
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        price: 0,
        description: '',
    });

    // Fetch products when component mounts
    useEffect(() => {
        dispatch(fetchProducts() as any);
    }, [dispatch]);

    // Handle input changes for both <input> and <textarea>
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' ? parseFloat(value) : value
        });
    };

    // Handle product form submission (create or update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData._id) {
                // Update existing product
                await axios.put(
                    `http://localhost:3000/api/products/${formData._id}`,
                    formData,
                    { withCredentials: true }
                );
                toast.success('Product updated');
            } else {
                // Create new product
                await axios.post(
                    'http://localhost:3000/api/products/create-product',
                    formData,
                    { withCredentials: true }
                );
                toast.success('Product created');
            }

            // Refresh products list and reset form/modal
            dispatch(fetchProducts() as any);
            setShowModal(false);
            setFormData({ name: '', price: 0, description: '' });
        } catch (err) {
            toast.error('Error saving product');
        }
    };

    // Fill form with selected product data for editing
    const handleEdit = (product: ProductFormData) => {
        setFormData(product);
        setShowModal(true);
    };

    // Delete a product by ID
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/products/${id}`, {
                withCredentials: true,
            });
            toast.success('Product deleted');
            dispatch(fetchProducts() as any);
        } catch (err) {
            toast.error('Error deleting product');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Product Management</h2>
                <button className={styles.createBtn} onClick={() => setShowModal(true)}>
                    <FaPlus /> Create Product
                </button>
            </div>

            {/* Product Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td data-label="Name">{product.name}</td>
                                <td data-label="Price">${product.price.toFixed(2)}</td>
                                <td data-label="Description">{product.description}</td>
                                <td data-label="Actions">
                                    <button
                                        className={styles.iconBtn}
                                        onClick={() => handleEdit(product)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className={styles.iconBtn}
                                        onClick={() => handleDelete(product._id!)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal for Create/Edit Form */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{formData._id ? 'Edit Product' : 'Create Product'}</h3>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                step="0.01"
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                            <div className={styles.formButtons}>
                                <button type="submit" className={styles.saveBtn}>
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({ name: '', price: 0, description: '' });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
