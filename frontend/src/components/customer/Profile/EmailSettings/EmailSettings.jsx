import React from 'react';
import styles from './EmailSettings.module.css';

const EmailSettings = ({ user, onChange }) => {
    return (
        <section className={styles.profileSection}>
            <div className={`${styles.settingsCard} ${styles.emailSettings}`}>
                <div className={styles.cardHeader}>
                    <span className={styles.icon}><i className="fa-solid fa-envelope"></i></span>
                    <h3>Email Address</h3>
                </div>
                <div className={styles.formGroup}>
                    <label>CURRENT EMAIL ADDRESS</label>
                    <input 
                        type="email" 
                        value={user.email} 
                        onChange={(e) => onChange('email', e.target.value)}
                        placeholder="example@email.com" 
                    />
                </div>
                <p className={styles.helperText}>Used for sign-in and account notifications.</p>
            </div>
        </section>
    );
};

export default EmailSettings;
