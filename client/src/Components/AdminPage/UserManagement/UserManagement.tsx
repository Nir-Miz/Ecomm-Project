import React, { useEffect, useState } from 'react';
import styles from './UserManagement.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// User interface definition
interface User {
    _id?: string;
    name: string;
    email: string;
    isAdmin: boolean;
    password?: string;
}

// Initial form state used for create mode
const initialFormState: User = {
    name: '',
    email: '',
    isAdmin: false,
    password: '', // Password is required only for user creation
};

const UserManagement: React.FC = () => {
    // Component state definitions
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<User>(initialFormState);
    const [editMode, setEditMode] = useState(false);

    // Fetch all users from the backend
    const fetchUsers = async () => {
        try {
            const res = await axios.get<User[]>('${import.meta.env.VITE_API_BASE_URL}/api/users', { withCredentials: true });
            setUsers(res.data);
        } catch {
            toast.error('שגיאה בעת טעינת המשתמשים'); // Error loading users
        } finally {
            setLoading(false);
        }
    };

    // Delete user by ID with confirmation prompt
    const handleDelete = async (id?: string) => {
        if (!id || !window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, { withCredentials: true });
            setUsers(users.filter(user => user._id !== id));
            toast.success('משתמש נמחק בהצלחה'); // User deleted successfully
        } catch {
            toast.error('שגיאה במחיקת המשתמש'); // Error deleting user
        }
    };

    // Set form to edit mode and populate with selected user data
    const handleEdit = (user: User) => {
        setFormData(user);
        setEditMode(true);
        setShowForm(true);
    };

    // Reset form to initial state for user creation
    const handleCreate = () => {
        setFormData(initialFormState);
        setEditMode(false);
        setShowForm(true);
    };

    // Handle form input changes (text, email, checkbox)
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value, type } = target;

        const updatedValue = type === 'checkbox'
            ? (target as HTMLInputElement).checked
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: updatedValue
        }));
    };

    // Handle form submission for both create and edit modes
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMode && formData._id) {
                // Update existing user
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/${formData._id}`, formData, { withCredentials: true });
                toast.success('משתמש עודכן בהצלחה'); // User updated
            } else {
                // Create new user
                const res = await axios.post<User>('${import.meta.env.VITE_API_BASE_URL}/api/users/create-user', formData, { withCredentials: true });
                setUsers(prev => [...prev, res.data]);
                toast.success('משתמש נוצר בהצלחה'); // User created
            }
            setShowForm(false);
            fetchUsers(); // Refresh user list
        } catch {
            toast.error('שגיאה בשמירת המשתמש'); // Error saving user
        }
    };

    // Fetch users on initial component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.header}>
                <h2>ניהול משתמשים</h2>
                <button className={styles.createBtn} onClick={handleCreate}>
                    <FaPlus /> הוסף משתמש
                </button>
            </div>

            {/* Loading state */}
            {loading ? (
                <p>טוען נתונים...</p>
            ) : (
                // User table
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>שם</th>
                            <th>אימייל</th>
                            <th>תפקיד</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td data-label="שם">{user.name}</td>
                                <td data-label="אימייל">{user.email}</td>
                                <td data-label="תפקיד">{user.isAdmin ? 'מנהל' : 'משתמש'}</td>
                                <td data-label="פעולות">
                                    <button className={styles.iconBtn} onClick={() => handleEdit(user)}><FaEdit /></button>
                                    <button className={styles.iconBtn} onClick={() => handleDelete(user._id)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal Form for Create / Edit */}
            {showForm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{editMode ? 'עריכת משתמש' : 'יצירת משתמש'}</h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {/* Name input */}
                            <input
                                type="text"
                                name="name"
                                placeholder="שם"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                            />
                            {/* Email input */}
                            <input
                                type="email"
                                name="email"
                                placeholder="אימייל"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                            />
                            {/* Password input shown only on create */}
                            {!editMode && (
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="סיסמה"
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    required
                                />
                            )}
                            {/* Admin checkbox */}
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={formData.isAdmin}
                                    onChange={handleFormChange}
                                />
                                מנהל מערכת
                            </label>
                            {/* Submit & Cancel buttons */}
                            <div className={styles.formButtons}>
                                <button type="submit" className={styles.saveBtn}>
                                    {editMode ? 'שמור שינויים' : 'צור משתמש'}
                                </button>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>בטל</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
