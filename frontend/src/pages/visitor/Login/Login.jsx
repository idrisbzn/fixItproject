import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoSrc from '../../../assets/logo.svg';
import GridAnimation from '../../../components/common/gridAnimation/GridAnimation';
import styles from './Login.module.css';
import api, { saveTokens } from '../../../api/axios';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState('customer'); // 'customer' or 'shop'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleToggle = (type) => {
        setUserType(type);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/accounts/auth/', {
                email,
                password
            });

            const { access, refresh, user } = response.data;

            // Verify if the role matches the selected login type
            const isCustomerPortal = userType === 'customer';
            const isClientRole = user.role === 'client';
            const isRepairerRole = user.role === 'repairer';

            if ((isCustomerPortal && !isClientRole) || (!isCustomerPortal && !isRepairerRole)) {
                setError(`Invalid login. This account is registered as a ${user.role}.`);
                setLoading(false);
                return;
            }

            // Save tokens and user info in session storage
            saveTokens(access, refresh);
            sessionStorage.setItem('userRole', user.role);
            sessionStorage.setItem('userData', JSON.stringify(user));

            // Redirect based on role
            if (user.role === 'repairer') {
                navigate('/shop/requests');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Invalid email or password');
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
                <h1 className={styles.authTitle}>Welcome Back</h1>

                <div className={styles.authToggle}>
                    <button
                        className={`${styles.toggleBtn} ${userType === 'customer' ? styles.active : ''}`}
                        onClick={() => handleToggle('customer')}
                    >
                        <i className="fa-solid fa-user"></i>
                        Customer
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${userType === 'shop' ? styles.active : ''}`}
                        onClick={() => handleToggle('shop')}
                    >
                        <i className="fa-solid fa-wrench"></i>
                        Repair Shop
                    </button>
                </div>

                <form className={styles.authForm} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage} style={{ marginBottom: '1rem', color: '#ff4d4d', fontSize: '0.875rem' }}>{error}</div>}
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
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

                    <div className={styles.formGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="password">Password</label>
                            <Link to="/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
                        </div>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${styles.btnPrimary} ${styles.authSubmit}`}
                    >
                        {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                </form>

                <p className={styles.authFooterText}>
                    Don't have an account? <Link to="/register">Register</Link>
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

export default Login;

