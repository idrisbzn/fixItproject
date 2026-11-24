import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import styles from './DeleteAccount.module.css';

const DeleteAccountPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        
        if (!password) {
            setError('Password is required to delete your account.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/accounts/delete_account/', { password });
            
            // Clear local storage and redirect
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
            navigate('/');
        } catch (err) {
            console.error('Failed to delete account:', err);
            setError('Incorrect password or failed to delete account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.deleteAccountPage}>
            <div className={styles.breadcrumb}>
                <button onClick={() => navigate(-1)} className={styles.backLink}>
                    <i className="fa-solid fa-chevron-left"></i> Back / Delete Account
                </button>
            </div>

            <div className={styles.deleteCard}>
                <div className={styles.iconContainer}>
                    <i className="fa-solid fa-trash-can"></i>
                </div>

                <h1 className={styles.title}>Delete Your Account</h1>
                <p className={styles.subtitle}>This action is permanent and cannot be undone.</p>

                <div className={styles.warningBox}>
                    <h3 className={styles.warningTitle}>The following data will be erased:</h3>
                    <ul className={styles.warningList}>
                        <li>Your personal profile and preferences</li>
                        <li>Repair history and active tickets</li>
                        <li>Saved repair shops and bookmarks</li>
                    </ul>
                </div>

                <form className={styles.form} onSubmit={handleDelete}>
                    <label className={styles.formLabel}>ENTER YOUR CREDENTIALS TO CONFIRM</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>

                    {error && <p className={styles.errorText} style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
                    <div className={styles.actionButtons}>
                        <button type="submit" className={styles.confirmBtn} disabled={loading}>
                            {loading ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </form>
            </div>

            <footer className={styles.footer}>
                © 2026 FixIt Digital Services Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default DeleteAccountPage;
