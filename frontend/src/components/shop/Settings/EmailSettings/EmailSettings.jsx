import React from 'react';
import styles from './EmailSettings.module.css';

const EmailSettings = ({ email, setEmail }) => {
    return (
        <div className={`${styles.settingsCard} ${styles.emailSettings}`}>
            <div className={styles.cardHeader}>
                <span className={styles.icon}><i className="fa-solid fa-envelope"></i></span>
                <h3>Business Email</h3>
            </div>
            <div className={styles.formGroup}>
                <label>CURRENT EMAIL ADDRESS</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
        </div>
    );
};

export default EmailSettings;
