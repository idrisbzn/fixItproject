import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import styles from './ReviewHistory.module.css';

const ReviewHistory = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get('/api/reviews/');
                const data = res.data.results || res.data;
                const mapped = data.map(r => ({
                    id: r.id,
                    shopName: r.shop_name || 'Unknown Shop',
                    shopAvatar: r.shop_avatar ? (r.shop_avatar.startsWith('http') ? r.shop_avatar : `http://127.0.0.1:8000${r.shop_avatar}`) : '/default-avatar.svg',
                    device: r.repair_model || r.repair_title || '',
                    rating: r.rating,
                    date: formatDate(r.created_at),
                    text: r.comment,
                }));
                setReviews(mapped);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const confirmRemove = (id) => {
        setSelectedReviewId(id);
        setShowModal(true);
    };

    const handleRemove = async () => {
        if (!selectedReviewId) return;
        try {
            await api.delete(`/api/reviews/${selectedReviewId}/`);
            setReviews(reviews.filter(review => review.id !== selectedReviewId));
            setShowModal(false);
            setSelectedReviewId(null);
        } catch (err) {
            console.error('Failed to delete review:', err);
        }
    };

    return (
        <div className={styles.reviewHistoryPage}>
            <button onClick={() => navigate(-1)} className={styles.backLink}>
                <i className="fa-solid fa-arrow-left"></i>
                Dashboard / My Reviews
            </button>
            <header className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.pageTitle}>My Reviews</h1>
                    <p className={styles.pageSubtitle}>History of reviews you've given — {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </div>
            </header>

            <div className={styles.reviewsList}>
                {loading ? (
                    <div className={styles.emptyState}>
                        <p>Loading reviews...</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.shopInfo}>
                                    <div className={styles.avatar}>
                                        <img src={review.shopAvatar} alt={review.shopName} onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }} />
                                    </div>
                                    <div className={styles.shopDetails}>
                                        <h3>{review.shopName}</h3>
                                        {review.device && (
                                            <span className={styles.deviceInfo}>
                                                <i className="fa-solid fa-mobile-screen-button"></i> {review.device}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.reviewMeta}>
                                    <div className={styles.rating}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <i key={star} className={`fa-solid fa-star ${star <= review.rating ? styles.activeStar : styles.inactiveStar}`}></i>
                                        ))}
                                    </div>
                                    <span className={styles.date}>{review.date}</span>
                                </div>
                            </div>
                            <p className={styles.reviewText}>{review.text}</p>
                            <div className={styles.cardActions}>
                                <button 
                                    className={styles.btnRemove} 
                                    onClick={() => confirmRemove(review.id)}
                                >
                                    <i className="fa-solid fa-trash-can"></i> Remove Review
                                </button>
                            </div>
                        </div>
                    ))
                )}
                
                {!loading && reviews.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <i className="fa-regular fa-comment-dots"></i>
                        </div>
                        <h3>No reviews yet</h3>
                        <p>You haven't reviewed any repairs yet.</p>
                    </div>
                )}
            </div>

            {/* Custom Confirmation Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}>
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <h3>Remove Review?</h3>
                        <p>Are you sure you want to delete this review? This action cannot be undone and your feedback will be removed from the shop's profile.</p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                            <button className={styles.confirmBtn} onClick={handleRemove}>Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewHistory;
