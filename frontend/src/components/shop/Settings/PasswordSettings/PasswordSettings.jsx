import React, { useState } from 'react';
import api from '../../../../api/axios';
import styles from './PasswordSettings.module.css';

const PasswordSettings = () => {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUpdate = async () => {
        if (!current || !next || !confirm) {
            setStatus('error');
            return;
        }
        if (next !== confirm) {
            setStatus('mismatch');
            return;
        }

        setLoading(true);
        setStatus('');

        try {
            await api.post('/accounts/change_password/', {
                old_password: current,
                new_password: next
            });

            setStatus('success');
            setCurrent('');
            setNext('');
            setConfirm('');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error('Password update failed:', error);
            const errorMsg = error.response?.data?.old_password?.[0] || 'Failed to update password. Please check your current password.';
            // Quick hack to show the backend message using the existing status state (we can add a new one if needed)
            // But let's just create a custom error state. Actually, I'll just change the status logic to include a string.
            // Wait, the status is currently used as exactly 'mismatch', 'error', 'success'. Let's stick to 'api_error'
            setStatus('api_error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.settingsCard} ${styles.passwordSettings}`}>
            <div className={styles.cardHeader}>
                <span className={styles.icon}><i className="fa-solid fa-shield-halved"></i></span>
                <h3>Change Password</h3>
            </div>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>CURRENT PASSWORD</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showCurrent ? "text" : "password"}
                            placeholder="password"
                            value={current}
                            onChange={e => setCurrent(e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowCurrent(!showCurrent)}
                        >
                            <i className={`fa-regular ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>NEW PASSWORD</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showNext ? "text" : "password"}
                            placeholder="password"
                            value={next}
                            onChange={e => setNext(e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowNext(!showNext)}
                        >
                            <i className={`fa-regular ${showNext ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>CONFIRM NEW PASSWORD</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            <i className={`fa-regular ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {status === 'mismatch' && (
                <p className={styles.errorMsg}>Passwords do not match.</p>
            )}
            {status === 'error' && (
                <p className={styles.errorMsg}>Please fill in all fields.</p>
            )}
            {status === 'success' && (
                <p className={styles.successMsg}>Password updated successfully.</p>
            )}
            {status === 'api_error' && (
                <p className={styles.errorMsg}>Failed to update password. Check your current password.</p>
            )}

            <div className={styles.cardFooter}>
                <button className={styles.updateBtn} onClick={handleUpdate} disabled={loading}>
                    {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                </button>
            </div>
        </div>
    );
};

export default PasswordSettings;
