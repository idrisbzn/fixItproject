import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompletedRepairCard.module.css';

const CompletedRepairCard = ({ repair }) => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.repairCard} ${styles.completedSimple}`}>
            <div className={styles.deviceIconSmall}>
                <i className={`fa-solid ${repair.type === 'pc' ? 'fa-laptop' : 'fa-mobile-screen'}`}></i>
            </div>
            <div className={styles.deviceDetails}>
                <h3>{repair.device}</h3>
                <p className={styles.shopName}><i className="fa-solid fa-shop"></i> {repair.shopName}</p>
                <div className={styles.statusRow}>
                    <span className={styles.statusTag}>DONE</span>
                    <span className={styles.finishDate}>Finished {repair.finishedAt}</span>
                </div>
            </div>
            <div className={styles.cardActions}>
                {!repair.is_reviewed && (
                    <button 
                        className={styles.btnReview}
                        onClick={() => navigate(`/repair/${repair.id}/review`)}
                    >
                        Leave a Review
                    </button>
                )}
                {repair.is_reviewed && (
                    <span className={styles.reviewedBadge}>
                        <i className="fa-solid fa-check-circle"></i> Reviewed
                    </span>
                )}
            </div>
        </div>
    );
};

export default CompletedRepairCard;
