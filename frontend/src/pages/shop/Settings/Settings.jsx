import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailSettings from '../../../components/shop/Settings/EmailSettings/EmailSettings';
import PasswordSettings from '../../../components/shop/Settings/PasswordSettings/PasswordSettings';
import DeleteAccount from '../../../components/shop/Settings/DeleteAccount/DeleteAccount';
import styles from './Settings.module.css';
import api, { clearTokens } from '../../../api/axios';

const Settings = () => {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Initialize email from sessionStorage
    const [email, setEmail] = useState(() => {
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        return userData.email || '';
    });

    const navigate = useNavigate();

    const handleSaveAll = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.put('/accounts/me/', { email });
            // Update session storage
            const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
            userData.email = res.data.email;
            sessionStorage.setItem('userData', JSON.stringify(userData));
            
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Failed to update settings:', err);
            setError('Failed to update email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearTokens();
        navigate('/login');
    };

    return (
        <div className={styles.settingsPage}>
            <header className={styles.settingsHeader}>
                <h1>Settings</h1>
                <p>Manage your account credentials and security preferences.</p>
            </header>

            <main className={styles.settingsMain}>
                <EmailSettings email={email} setEmail={setEmail} />
                <PasswordSettings />
                <DeleteAccount />

                <div className={styles.saveAllContainer}>
                    {error && (
                        <div style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
                            <i className="fa-solid fa-circle-exclamation"></i> {error}
                        </div>
                    )}
                    <button
                        className={`${styles.saveAllBtn} ${saved ? styles.savedState : ''}`}
                        onClick={handleSaveAll}
                        disabled={loading}
                    >
                        <span className={styles.icon}>
                            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : saved ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-floppy-disk"></i>}
                        </span>
                        {loading ? 'SAVING...' : saved ? 'CHANGES SAVED!' : 'SAVE ALL CHANGES'}
                    </button>
                </div>

                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <span className={styles.icon}><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                    Log Out
                </button>
            </main>
        </div>
    );
};

export default Settings;
