import React from 'react';
import styles from './ActiveRepairCard.module.css';

const ActiveRepairCard = ({ repair }) => {
    return (
        <div className={`${styles.repairCard} ${styles.active} ${styles[repair.status]}`}>
            <div className={styles.repairCardHeader}>
                <div className={styles.deviceInfo}>
                    <h3>{repair.device}</h3>
                    <p className={styles.shopName}><i className="fa-solid fa-shop"></i> {repair.shopName}</p>
                    <span className={`${styles.statusBadge} ${styles[repair.status]}`}>{repair.statusText}</span>
                </div>
                <span className={styles.orderId}>Order {repair.orderId}</span>
            </div>

            <div className={styles.repairStepper}>
                <div className={`${styles.step} ${repair.progress >= 0 ? styles.completed : ''}`}>
                    <div className={styles.stepIcon}><i className="fa-solid fa-check"></i></div>
                    <span>REQUESTED</span>
                </div>
                <div className={`${styles.step} ${repair.progress >= 25 ? styles.completed : ''}`}>
                    <div className={styles.stepIcon}><i className="fa-solid fa-check"></i></div>
                    <span>ACCEPTED</span>
                </div>
                <div className={`${styles.step} ${repair.progress >= 50 ? styles.completed : ''} ${repair.status === 'active' ? styles.current : ''}`}>
                    <div className={styles.stepIcon}>
                        {repair.status === 'active' ? <i className="fa-solid fa-pen-to-square"></i> : <i className="fa-solid fa-check"></i>}
                    </div>
                    <span>IN REPAIR</span>
                </div>
                <div className={`${styles.step} ${repair.progress >= 75 ? styles.completed : ''} ${repair.status === 'ready' ? styles.current : ''}`}>
                    <div className={styles.stepIcon}>
                        {repair.status === 'ready' ? <i className="fa-solid fa-box-open"></i> : <i className="fa-solid fa-circle"></i>}
                    </div>
                    <span>READY</span>
                </div>
                <div className={`${styles.step} ${repair.progress >= 100 ? styles.completed : ''}`}>
                    <div className={styles.stepIcon}><i className="fa-solid fa-circle"></i></div>
                    <span>DONE</span>
                </div>
                <div className={styles.stepperLine}>
                    <div className={styles.stepperLineFill} style={{ width: `${repair.progress}%` }}></div>
                </div>
            </div>

            {repair.techNote && (
                <div className={styles.techNoteBox}>
                    <i className="fa-solid fa-comment-dots"></i>
                    <div className={styles.techNoteContent}>
                        <label>TECH NOTE FROM '{(repair.shopName || 'ELITE REPAIRS').toUpperCase()}'</label>
                        <p>{repair.techNote}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveRepairCard;
