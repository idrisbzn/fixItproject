import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DangerZone.module.css';

const DangerZone = () => {
    const navigate = useNavigate();
    return (
        <section className={styles.profileSection}>
            <div className={`${styles.dangerCard} ${styles.deleteAccount}`}>
                <div className={styles.deleteContent}>
                    <div className={styles.deleteInfo}>
                        <div className={styles.cardHeader}>
                            <span className={styles.icon}><i className="fa-solid fa-trash-can"></i></span>
                            <h3 className={styles.dangerTitle}>Delete Account</h3>
                        </div>
                        <p className={styles.dangerDesc}>Permanently remove your account, history, and all repair data. This action is irreversible.</p>
                        <button className={styles.btnDeleteAccount} onClick={() => navigate('/delete-account')}>DELETE MY ACCOUNT</button>
                    </div>
                    <div className={styles.warningIcon}><i className="fa-solid fa-triangle-exclamation"></i></div>
                </div>
            </div>
        </section>
    );
};


export default DangerZone;
