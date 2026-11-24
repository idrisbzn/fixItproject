import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeleteAccount.module.css';

const DeleteAccount = () => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.settingsCard} ${styles.deleteAccount}`}>
            <div className={styles.deleteContent}>
                <div className={styles.deleteInfo}>
                    <div className={styles.cardHeader}>
                        <span className={styles.icon}><i className="fa-solid fa-trash-can"></i></span>
                        <h3>Delete Shop Account</h3>
                    </div>
                    <p>Permanently remove your shop, portfolio, and all task history. This action is irreversible and all encrypted diagnostic logs will be purged from the central network.</p>
                    <button className={styles.deleteBtn} onClick={() => navigate('/shop/delete-account')}>DELETE MY ACCOUNT</button>
                </div>
                <div className={styles.warningIcon}><i className="fa-solid fa-triangle-exclamation"></i></div>
            </div>
        </div>
    );
};

export default DeleteAccount;
