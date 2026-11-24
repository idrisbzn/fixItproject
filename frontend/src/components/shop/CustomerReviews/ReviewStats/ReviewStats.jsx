import React from 'react';
import styles from './ReviewStats.module.css';

const ReviewStats = ({ reviews = [] }) => {
    const totalReviews = reviews.length;
    
    // Calculate average rating
    const avgRating = totalReviews > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : '0.0';

    // Calculate distribution
    const distribution = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.rating === stars).length;
        const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return { stars, count, percentage };
    });

    // How many full stars to render
    const fullStars = Math.round(parseFloat(avgRating));

    return (
        <div className={styles.reviewStatsContainer}>
            <div className={styles.totalReputation}>
                <span className={styles.label}>TOTAL REPUTATION</span>
                <div className={styles.ratingValue}>{avgRating}</div>
                <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className={styles.star}>
                            <i className={`fa-solid fa-star`} style={{ opacity: i <= fullStars ? 1 : 0.25 }}></i>
                        </span>
                    ))}
                </div>
                <span className={styles.reviewCount}>Based on {totalReviews} diagnostic review{totalReviews !== 1 ? 's' : ''}</span>
            </div>

            <div className={styles.signalDistribution}>
                <span className={styles.label}>SIGNAL DISTRIBUTION</span>
                <div className={styles.distList}>
                    {distribution.map((item) => (
                        <div key={item.stars} className={styles.distRow}>
                            <span className={styles.starLabel}>{item.stars} <i className="fa-solid fa-star"></i></span>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${item.percentage}%` }}></div>
                            </div>
                            <span className={styles.countLabel}>{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewStats;
