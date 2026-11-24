import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import logoSrc from '../../../assets/logo.svg';
import GridAnimation from '../../../components/common/gridAnimation/GridAnimation';
import styles from './ResetPassword.module.css';
import api from '../../../api/axios';

const ResetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [linkValid, setLinkValid] = useState(false);

    // Validate the reset link on page load
    useEffect(() => {
        const validateLink = async () => {
            try {
                await api.get(`/accounts/reset_password/${uid}/${token}/`);
                setLinkValid(true);
            } catch (err) {
                setError('This reset link is invalid or has expired. Please request a new one.');
                setLinkValid(false);
            } finally {
                setValidating(false);
            }
        };
        validateLink();
    }, [uid, token]);

    const getPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getPasswordStrength(newPassword);
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newPassword) {
            setError('Please enter a new password.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/accounts/reset_password/${uid}/${token}/`, {
                new_password: newPassword
            });
            setSuccess(response.data.message || 'Password has been reset successfully!');
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Reset password error:', err);
            setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
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
                {validating ? (
                    <>
                        <h1 className={styles.authTitle}>Verifying Link...</h1>
                        <p className={styles.authSubtitle}>
                            Please wait while we verify your reset link.
                        </p>
                    </>
                ) : !linkValid ? (
                    <>
                        <h1 className={styles.authTitle}>Invalid Link</h1>
                        <p className={styles.authSubtitle}>
                            This password reset link is invalid or has expired.
                        </p>
                        {error && (
                            <div className={styles.errorMessage}>
                                <i className="fa-solid fa-circle-exclamation"></i>
                                {error}
                            </div>
                        )}
                        <div style={{ marginTop: '24px' }}>
                            <Link to="/forgot-password" className={styles.btnPrimary} style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                                REQUEST NEW LINK
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className={styles.authTitle}>Reset Password</h1>
                        <p className={styles.authSubtitle}>
                            Enter your new password below.
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
                                    {success} Redirecting to login...
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword">New Password</label>
                                <div className={styles.passwordInputWrapper}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={!!success}
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
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={confirmPassword && confirmPassword !== newPassword ? styles.error : ''}
                                        required
                                        disabled={!!success}
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

                            <button
                                type="submit"
                                disabled={loading || !!success}
                                className={styles.btnPrimary}
                            >
                                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                            </button>
                        </form>
                    </>
                )}

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

export default ResetPassword;
