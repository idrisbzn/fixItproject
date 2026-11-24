import React from 'react';
import styles from './RecentRepairCard.module.css';

const RecentRepairCard = ({ repair }) => {
    return (
        <div className={styles.repairCardSimple}>
            <div className={styles.repairIcon}>
                <i className={`fa-solid ${repair.type === 'pc' ? 'fa-laptop' : 'fa-mobile-screen'}`}></i>
            </div>
            <div className={styles.repairDetails}>
                <h3 className={styles.deviceName}>{repair.deviceName}</h3>
                <p className={styles.repairMeta}>Ticket #{repair.id} • {repair.shopName}</p>
            </div>
            <div className={`${styles.repairStatusBadge} ${styles[repair.status.toLowerCase().replace(' ', '')]}`}>
                STATUS: {repair.status}
            </div>
            <div className={styles.repairProgressBar}>
                <div className={`${styles.progressStep} ${repair.progress >= 0 ? styles.active : ''}`}>
                    <div className={styles.stepDot}></div>
                    <span>REQUESTED</span>
                </div>
                <div className={`${styles.progressStep} ${repair.progress >= 25 ? styles.active : ''}`}>
                    <div className={styles.stepDot}></div>
                    <span>ACCEPTED</span>
                </div>
                <div className={`${styles.progressStep} ${repair.progress >= 50 ? styles.active : ''} ${repair.progress === 50 ? styles.current : ''}`}>
                    <div className={styles.stepDot}></div>
                    <span>IN REPAIR</span>
                </div>
                <div className={`${styles.progressStep} ${repair.progress >= 75 ? styles.active : ''} ${repair.progress === 75 ? styles.current : ''}`}>
                    <div className={styles.stepDot}></div>
                    <span>READY</span>
                </div>
                <div className={`${styles.progressStep} ${repair.progress >= 100 ? styles.active : ''}`}>
                    <div className={styles.stepDot}></div>
                    <span>DONE</span>
                </div>
                <div className={styles.progressLine}>
                    <div className={styles.progressLineFill} style={{ width: `${repair.progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default RecentRepairCard;
