import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoSrc from '../../assets/logo.svg';
import GridAnimation from '../../components/common/gridAnimation/GridAnimation';

const Register = () => {
    const [userType, setUserType] = useState('customer'); // 'customer' or 'shop'
    const [emailError, setEmailError] = useState(false); // For demonstrating the error state

    const handleToggle = (type) => {
        setUserType(type);
        setEmailError(false); // Reset error when switching
    };

    return (
        <div className="auth-page">
            <div className="auth-canvas-wrapper">
                <GridAnimation />
            </div>
            <div className="auth-overlay" />

            <div className="auth-header">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-circle">
                        <img src={logoSrc} alt="FixIt logo" />
                    </div>
                    <span className="navbar-wordmark">FixIt</span>
                </Link>
            </div>

            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join the future of repair services</p>

                <div className="auth-toggle">
                    <button
                        className={`toggle-btn ${userType === 'customer' ? 'active' : ''}`}
                        onClick={() => handleToggle('customer')}
                    >
                        <i className="fa-solid fa-user"></i>
                        I'm a Customer
                    </button>
                    <button
                        className={`toggle-btn ${userType === 'shop' ? 'active' : ''}`}
                        onClick={() => handleToggle('shop')}
                    >
                        <i className="fa-solid fa-wrench"></i>
                        Repair Shop
                    </button>
                </div>

                <form className="auth-form">
                    {userType === 'customer' ? (
                        <>
                            <div className="form-group">
                                <label htmlFor="fullName">FULL NAME</label>
                                <input type="text" id="fullName" placeholder="John Doe" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="name@company.com"
                                    className={emailError ? 'error' : ''}
                                    defaultValue={emailError ? 'john@example' : ''}
                                    required
                                />
                                {emailError && (
                                    <div className="error-message">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                        Invalid email format
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor="shopName">SHOP NAME</label>
                                <input type="text" id="shopName" placeholder="Electronics Hub" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="managerName">MANAGER FULL NAME</label>
                                <input type="text" id="managerName" placeholder="John Doe" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="businessEmail">BUSINESS EMAIL</label>
                                <input type="email" id="businessEmail" placeholder="contact@shop.com" required />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="phone">PHONE NUMBER</label>
                        <input type="tel" id="phone" placeholder="+1 (555) 000-0000" required />
                    </div>

                    {userType === 'shop' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="wilaya">WILAYA</label>
                                <select id="wilaya" required>
                                    <option value="">Select Wilaya</option>
                                    <option value="31">Oran (31)</option>
                                    <option value="16">Alger (16)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">CITY</label>
                                <select id="city" required>
                                    <option value="">Select City</option>
                                    <option value="oran">Oran</option>
                                    <option value="bir-el-djir">Bir El Djir</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">PASSWORD</label>
                            <input type="password" id="password"
                                placeholder="password" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">CONFIRM</label>
                            <input type="password" id="confirmPassword" placeholder="password" required />
                        </div>
                    </div>

                    <div className="form-checkbox">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                            By creating an account, you agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
                        </label>
                    </div>

                    <Link to="/dashboard" className="btn-primary auth-submit">
                        Create Account
                    </Link>

                    {/* Button to toggle error state for demonstration */}
                    {userType === 'customer' && (
                        <button
                            type="button"
                            className="btn-debug"
                            onClick={() => setEmailError(!emailError)}
                            style={{ marginTop: '10px', fontSize: '10px', opacity: 0.5 }}
                        >
                            Toggle Error State
                        </button>
                    )}
                </form>

                <p className="auth-footer-text">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>

            <div className="auth-page-footer">
                <Link to="/support">SUPPORT</Link>
                <span className="dot">•</span>
                <Link to="/status">STATUS</Link>
                <span className="dot">•</span>
                <Link to="/pricing">PRICING</Link>
            </div>
        </div>
    );
};

export default Register;
