import React, { useState } from 'react';
import styles from './ReviewCard.module.css';

const ReviewCard = ({ review }) => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                    <img 
                        src={review.avatar || "/default-avatar.svg"} 
                        alt={review.userName} 
                        className={styles.avatar}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }}
                    />
                    <div>
                        <h4 className={styles.userName}>{review.userName}</h4>
                        <span className={styles.reviewDate}>{review.date}</span>
                    </div>
                </div>
                <div className={styles.ratingBadge}>
                    <i className="fa-solid fa-star"></i>
                    <span>{review.rating.toFixed(1)}</span>
                </div>
            </div>

            <div className={styles.reviewMeta}>
                <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                            <i className="fa-solid fa-star"></i>
                        </span>
                    ))}
                </div>
                <span className={styles.repairTag}>REPAIRED: {review.device}</span>
            </div>

            <p className={styles.reviewText}>{review.text}</p>

            <button className={styles.reportBtn} onClick={() => setIsReportModalOpen(true)}>REPORT REVIEW</button>

            {isReportModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Report Review</h3>
                        <div className={styles.reportMessage}>
                            <p>To report this review, please contact our support team at:</p>
                            <a href="mailto:fixIt@gmail.com" className={styles.contactEmail}>fixIt@gmail.com</a>
                            <p className={styles.messageNote}>Our team will investigate your report as soon as possible.</p>
                        </div>
                        <div className={styles.modalActions}>
                            <button 
                                type="button" 
                                className={styles.sendReportBtn} 
                                onClick={() => setIsReportModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
