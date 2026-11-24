import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoSrc from '../../../assets/logo.svg';
import GridAnimation from '../../../components/common/gridAnimation/GridAnimation';
import styles from './ForgotPassword.module.css';
import api from '../../../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/accounts/forget_password/', { email });
            setSuccess(response.data.message || 'Password reset link has been sent to your email.');
        } catch (err) {
            console.error('Forgot password error:', err);
            if (err.response?.status === 404) {
                setError('No account found with this email address.');
            } else {
                setError(err.response?.data?.error || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCanvasWrapper}>
                <GridAnimation />
            </div>
            <div className={styles.authOverlay} />

            <div className={styles.authHeader}>
                <Link to="/" className={styles.authLogo}>
                    <img src={logoSrc} alt="FixIt logo" />
                </Link>
            </div>

            <div className={styles.authCard}>
                <h1 className={styles.authTitle}>Forgot Password</h1>
                <p className={styles.authSubtitle}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form className={styles.authForm} onSubmit={handleSubmit}>
                    {error && (
                        <div className={styles.errorMessage}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className={styles.successMessage}>
                            <i className="fa-solid fa-circle-check"></i>
                            {success}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={error && error.includes('email') ? styles.error : ''}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!success}
                        className={styles.btnPrimary}
                    >
                        {loading ? 'SENDING...' : 'SEND RESET LINK'}
                    </button>

                    {success && (
                        <button
                            type="button"
                            className={styles.btnSecondary}
                            onClick={() => {
                                setSuccess('');
                                setLoading(false);
                            }}
                        >
                            Resend Link
                        </button>
                    )}
                </form>

                <p className={styles.authFooterText}>
                    Remember your password? <Link to="/login">Sign In</Link>
                </p>
            </div>

            <div className={styles.authPageFooter}>
                <Link to="/privacy">Privacy Policy</Link>
                <span className={styles.dot}>•</span>
                <Link to="/terms">Terms of Service</Link>
                <span className={styles.dot}>•</span>
                <Link to="/help">Help Center</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
