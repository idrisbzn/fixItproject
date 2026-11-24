import React from 'react';
import styles from './PendingRepairCard.module.css';

const PendingRepairCard = ({ repair, onCancel }) => {
    return (
        <div className={`${styles.repairCard} ${styles.pending}`}>
            <div className={styles.repairCardHeader}>
                <div className={styles.deviceInfo}>
                    <h3>{repair.device}</h3>
                    <p className={styles.shopName}><i className="fa-solid fa-shop"></i> {repair.shopName}</p>
                    <span className={`${styles.statusBadge} ${styles.pending}`}>{repair.statusText}</span>
                </div>
                <span className={styles.timeAgo}>Requested {repair.requestedAt}</span>
            </div>
            <p className={styles.repairNote}>"{repair.note}"</p>
            <div className={styles.repairActions}>
                <button 
                    className={styles.btnCancel}
                    onClick={() => onCancel && onCancel(repair.id)}
                >
                    Cancel Request
                </button>
            </div>
        </div>
    );
};

export default PendingRepairCard;
