import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoSrc from '../../assets/logo.svg';
import GridAnimation from '../../components/visitor/GridAnimation';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

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
                <h1 className="auth-title">Welcome Back</h1>

                <form className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="label-row">
                            <label htmlFor="password">Password</label>
                            <Link to="/forgot-password" id="forgot-password">Forgot password?</Link>
                        </div>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password" placeholder="password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <Link to="/dashboard" className="btn-primary auth-submit">
                        SIGN IN
                    </Link>
                </form>

                <p className="auth-footer-text">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>

            <div className="auth-page-footer">
                <Link to="/privacy">Privacy Policy</Link>
                <span className="dot">•</span>
                <Link to="/terms">Terms of Service</Link>
                <span className="dot">•</span>
                <Link to="/help">Help Center</Link>
            </div>
        </div>
    );
};

export default Login;
