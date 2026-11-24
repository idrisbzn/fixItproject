import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import ReviewStats from '../../../components/shop/CustomerReviews/ReviewStats/ReviewStats';
import ReviewCard from '../../../components/shop/CustomerReviews/ReviewCard/ReviewCard';
import styles from './CustomerReviews.module.css';

const sortOptions = ['Newest First', 'Highest Rated', 'Lowest Rated'];

const CustomerReviews = () => {
    const [sort, setSort] = useState('Newest First');
    const [visibleCount, setVisibleCount] = useState(3);
    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                // The backend automatically filters reviews for the logged-in repairer's shop
                const res = await api.get('/api/reviews/');
                const data = res.data.results || res.data;

                if (Array.isArray(data)) {
                    const mapped = data.map(r => ({
                        id: r.id,
                        userName: r.user_name || 'Anonymous',
                        avatar: r.user_avatar ? (r.user_avatar.startsWith('http') ? r.user_avatar : `http://127.0.0.1:8000${r.user_avatar}`) : '/default-avatar.svg',
                        date: formatDate(r.created_at),
                        rating: r.rating,
                        device: r.repair_model || r.repair_title || 'General Service',
                        text: r.comment,
                    }));
                    setAllReviews(mapped);
                } else {
                    console.error('API response is not an array:', data);
                    setAllReviews([]);
                }
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
                setAllReviews([]);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const sorted = [...allReviews].sort((a, b) => {
        if (sort === 'Highest Rated') return b.rating - a.rating;
        if (sort === 'Lowest Rated') return a.rating - b.rating;
        return b.id - a.id;
    });

    const visibleReviews = sorted.slice(0, visibleCount);

    return (
        <div className={styles.customerReviewsPage}>
            <header className={styles.reviewsHeader}>
                <h1>Customer Reviews</h1>
                <p>Track your shop's performance and feedback through real-time diagnostic data.</p>
            </header>

            <ReviewStats reviews={allReviews} />

            <section className={styles.recentFeedback}>
                <div className={styles.sectionHeader}>
                    <h3>Recent Feedback</h3>
                    <div className={styles.sortDropdown}>
                        <select value={sort} onChange={e => setSort(e.target.value)}>
                            {sortOptions.map(opt => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.reviewsList}>
                    {loading ? (
                        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Loading reviews...</p>
                    ) : allReviews.length === 0 ? (
                        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>No reviews yet. Reviews from customers will appear here.</p>
                    ) : (
                        visibleReviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    )}
                </div>

                <div className={styles.btnContainer}>
                    {visibleCount < allReviews.length && (
                        <button
                            className={styles.loadMoreBtn}
                            onClick={() => setVisibleCount(c => c + 3)}
                        >
                            LOAD MORE DATA POINTS <span className={styles.icon}><i className="fa-solid fa-chevron-down"></i></span>
                        </button>
                    )}
                    {visibleCount > 3 && allReviews.length > 3 && (
                        <button
                            className={styles.loadMoreBtn}
                            onClick={() => setVisibleCount(3)}
                        >
                            SHOW LESS DATA POINTS <span className={styles.icon}><i className="fa-solid fa-chevron-up"></i></span>
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CustomerReviews;
