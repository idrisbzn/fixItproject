import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoSrc from '../../../assets/logo.svg';
import GridAnimation from '../../../components/common/gridAnimation/GridAnimation';
import CustomerInputs from '../../../components/visitor/CustomerInputs/CustomerInputs';
import ShopInputs from '../../../components/visitor/ShopInputs/ShopInputs';
import styles from './Register.module.css';
import api, { saveTokens } from '../../../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('customer'); // 'customer' or 'shop'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        shopName: '',
        managerName: '',
        phone: '',
        wilaya: '',
        city: ''
    });
    
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleToggle = (type) => {
        setUserType(type);
        setEmailError('');
        setPasswordError('');
        setError('');
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        let hasError = false;

        if (!validateEmail(formData.email)) {
            setEmailError('Please enter a valid email address');
            hasError = true;
        } else {
            setEmailError('');
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            hasError = true;
        } else {
            setPasswordError('');
        }

        if (hasError) return;

        setLoading(true);
        try {
            // Extract first and last name from the appropriate field
            const nameToSplit = userType === 'customer' ? formData.fullName : formData.managerName;
            const nameParts = (nameToSplit || '').trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Prepare data for backend
            const payload = {
                email: formData.email,
                username: formData.email, // Using email as username for uniqueness
                password: formData.password,
                phone_number: formData.phone,
                role: userType === 'customer' ? 'client' : 'repairer',
                wilaya: formData.wilaya,
                city: formData.city,
                first_name: firstName,
                last_name: lastName
            };

            // If repairer, we need to handle shop details or backend might auto-create it
            // Based on backend seiralizer.py, it expects these for repairer:
            if (userType === 'shop') {
                payload.shop_name = formData.shopName;
                if (formData.devicesRepaired && formData.devicesRepaired.length > 0) {
                    payload.device_type = formData.devicesRepaired.map(d => d === 'phone' ? 'Phone' : 'Laptop');
                }
            }

            const response = await api.post('/accounts/signup/', payload);

            const { access, refresh, user } = response.data;

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
            console.error('Registration error:', err);
            const backendErrors = err.response?.data;
            if (backendErrors && typeof backendErrors === 'object' && !Array.isArray(backendErrors)) {
                // Map backend errors to UI
                if (backendErrors.email) setEmailError(backendErrors.email[0]);
                if (backendErrors.password) setPasswordError(backendErrors.password[0]);
                setError(Object.values(backendErrors).flat()[0] || 'Registration failed');
            } else if (typeof backendErrors === 'string') {
                setError(backendErrors.substring(0, 50) + '...');
            } else {
                setError('Network error or server unavailable');
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
                <h1 className={styles.authTitle}>Create Account</h1>
                <p className={styles.authSubtitle}>Join the future of repair services</p>

                <div className={styles.authToggle}>
                    <button
                        className={`${styles.toggleBtn} ${userType === 'customer' ? styles.active : ''}`}
                        onClick={() => handleToggle('customer')}
                    >
                        <i className="fa-solid fa-user"></i>
                        I'm a Customer
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
                    
                    {userType === 'customer' ? (
                        <CustomerInputs
                            formData={formData}
                            setFormData={setFormData}
                            emailError={emailError}
                        />
                    ) : (
                        <ShopInputs
                            formData={formData}
                            setFormData={setFormData}
                            emailError={emailError}
                        />
                    )}

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.passwordInputWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className={styles.passwordInputWrapper}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={passwordError ? styles.error : ''}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}

                    <div className={styles.formCheckbox}>
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                            By creating an account, you agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${styles.btnPrimary} ${styles.authSubmit}`}
                    >
                        {loading ? 'CREATING ACCOUNT...' : 'Create Account'}
                    </button>
                </form>

                <p className={styles.authFooterText}>
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>

            <div className={styles.authPageFooter}>
                <Link to="/support">SUPPORT</Link>
                <span className={styles.dot}>•</span>
                <Link to="/status">STATUS</Link>
                <span className={styles.dot}>•</span>
                <Link to="/pricing">PRICING</Link>
            </div>
        </div>
    );
};

export default Register;

