import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axios';
import styles from './LeaveReview.module.css';

const LeaveReview = () => {
    const { repairId } = useParams();
    const navigate = useNavigate();
    
    // Form state
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    // Real data state
    const [shop, setShop] = useState(null);
    const [repair, setRepair] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch repair details
                const repairRes = await api.get(`/api/repair_requests/${repairId}/`);
                const repairData = repairRes.data;
                setRepair(repairData);

                // 2. Fetch shop details using the shop ID from the repair
                const shopRes = await api.get(`/api/shops/${repairData.shop}/`);
                setShop(shopRes.data);
            } catch (err) {
                console.error("Failed to load details", err);
                setError('Failed to load details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [repairId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitted) return;
        
        try {
            await api.post('/api/reviews/', {
                shop: repair.shop,
                repair_request: parseInt(repairId),
                rating: rating,
                comment: review
            });
            setSubmitted(true);
            setError('');
            setTimeout(() => navigate('/reviews'), 1500); // Navigate to Review History
        } catch (err) {
            console.error('Failed to submit review:', err);
            const errorData = err.response?.data;
            let msg = 'Failed to submit review. Please try again.';
            if (errorData) {
                if (typeof errorData === 'string') msg = errorData;
                else if (errorData.detail) msg = errorData.detail;
                else if (errorData.non_field_errors) msg = errorData.non_field_errors[0];
                else if (Array.isArray(errorData)) msg = errorData[0];
                else if (typeof errorData === 'object') {
                   // Get the first error message from any field
                   const firstKey = Object.keys(errorData)[0];
                   msg = `${firstKey}: ${errorData[firstKey]}`;
                }
            }
            setError(msg);
        }
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loadingState}>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Loading details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <button onClick={() => navigate(-1)} className={styles.backLink}>
                <i className="fa-solid fa-arrow-left"></i>
                My Devices / {repair ? (repair.model_name || repair.title) : 'Repair'} / Leave Review
            </button>

            {repair && (
                <div className={styles.statusBanner}>
                    <div className={styles.statusLeft}>
                        <span className={styles.statusBadge}>Repair Completed</span>
                        <span className={styles.statusDevice}>{repair.model_name || repair.title}</span>
                        <span className={styles.statusShop}>Shop: {shop?.name}</span>
                    </div>
                    <div className={styles.statusRight}>
                        Completed {new Date(repair.updated_at || repair.created_at).toLocaleDateString()}
                    </div>
                </div>
            )}

            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <h1 className={styles.pageTitle}>Share Your Experience</h1>
                <p className={styles.pageSubtitle}>Your review helps other customers find good shops.</p>
                
                {shop && (
                    <div className={styles.shopCard}>
                        <img 
                            src={shop.profile_image ? (shop.profile_image.startsWith('http') ? shop.profile_image : `http://127.0.0.1:8000${shop.profile_image}`) : '/default-avatar.svg'} 
                            alt={shop.name} 
                            className={styles.shopAvatar}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }}
                        />
                        <div className={styles.shopDetails}>
                            <h3 className={styles.shopName}>{shop.name}</h3>
                            <div className={styles.shopMeta}>
                                <span><i className="fa-solid fa-location-dot"></i> {shop.wilaya}, {shop.city}</span>
                                <span>•</span>
                                <span><i className="fa-solid fa-star"></i> {shop.rating} / {shop.total_reviews} reviews</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.starRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`${styles.starBtn} ${(hoveredRating || rating) >= star ? styles.active : ''}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                        >
                            <i className={(hoveredRating || rating) >= star ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                        </button>
                    ))}
                </div>

                <div className={styles.reviewSection}>
                    <label className={styles.reviewLabel}>Your review</label>
                    <div className={styles.textareaWrapper}>
                        <textarea 
                            className={styles.formTextarea} 
                            placeholder="How was the service? Was the technician helpful?"
                            value={review}
                            onChange={(e) => setReview(e.target.value.substring(0, 300))}
                            required
                        ></textarea>
                        <span className={styles.charCount}>{review.length} / 300</span>
                    </div>
                </div>

                <div className={styles.deviceInfoRow}>
                    <span className={styles.deviceLabel}>Device repaired:</span>
                    <div className={styles.devicePill}>
                        <i className="fa-solid fa-mobile-screen-button"></i>
                        {repair ? (repair.model_name || repair.title) : 'Device'}
                    </div>
                </div>

                {error && <p className={styles.errorMsg} style={{ color: '#ff4d4d', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}
                
                <button
                    type="submit"
                    className={`${styles.submitBtn} ${submitted ? styles.submitBtnSuccess : ''}`}
                    disabled={rating === 0 || submitted}
                >
                    {submitted ? (
                        <><i className="fa-solid fa-check"></i> Review Submitted!</>
                    ) : (
                        <>Submit Review <i className="fa-solid fa-star"></i></>
                    )}
                </button>
                
                <div className={styles.footerNote}>
                    REVIEWS ARE PUBLIC AND CANNOT BE EDITED.
                </div>
            </form>
        </div>
    );
};

export default LeaveReview;
