import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import styles from './ShopCard.module.css';

const ShopCard = ({ shop, isInitiallySaved = false }) => {
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [isSaved, setIsSaved] = useState(isInitiallySaved);
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    const checkIsOpen = () => {
        // Primary override: if manual toggle is off, shop is closed
        if (!shop.is_open) return false;

        // Ensure we have hours and it's an array
        if (shop.hours && Array.isArray(shop.hours) && shop.hours.length > 0) {
            const now = new Date();
            const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const currentDayStr = daysMap[now.getDay()];
            
            // Find the hours for the current day
            const todayHours = shop.hours.find(h => h.day === currentDayStr);
            
            if (todayHours) {
                const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                const openTime = todayHours.open_time.slice(0, 5);
                const closeTime = todayHours.close_time.slice(0, 5);
                
                // Compare current time with open and close times
                return currentTime >= openTime && currentTime <= closeTime;
            }
        }
        
        // If no hours are set for today, or no hours set at all, shop is closed
        return false;
    };

    const isOpen = checkIsOpen();

    React.useEffect(() => {
        setIsSaved(isInitiallySaved);
    }, [isInitiallySaved]);

    const handleSave = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            setTimeout(() => setShowLoginPrompt(false), 3000); // Hide after 3s
            return;
        }
        
        try {
            if (isSaved) {
                await api.post('/api/list-shops/remove_shop/', { shop_id: shop.id });
                setIsSaved(false);
            } else {
                await api.post('/api/list-shops/add_shop/', { shop_id: shop.id });
                setIsSaved(true);
            }
        } catch (err) {
            console.error('Failed to update saved status', err);
        }
    };

    return (
        <div className={styles.shopCard}>
            <div className={styles.shopCardHeader}>
                <div className={styles.shopInfo}>
                    <img src={shop.avatar || '/default-avatar.svg'} alt={shop.name} className={styles.shopAvatar} onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }} />
                    <div>
                        <div className={styles.shopNameRow}>
                            <h3 className={styles.shopName}>{shop.name}</h3>
                            <span className={`${styles.statusBadge} ${isOpen ? styles.open : styles.closed}`}>
                                {isOpen ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>
                        <p className={styles.shopLocation}>
                            <i className="fa-solid fa-location-dot"></i>
                            {shop.location}
                        </p>
                    </div>
                </div>
                <div className={styles.bookmarkWrapper}>
                    <button className={`${styles.bookmarkBtn} ${isSaved ? styles.saved : ''}`} onClick={handleSave}>
                        <i className={isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"} style={isSaved ? { color: 'var(--cyan)' } : {}}></i>
                    </button>
                    {showLoginPrompt && (
                        <div className={styles.loginPrompt}>
                            Please <Link to="/login">Login</Link> or <Link to="/register">Sign Up</Link> to save shops
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.shopRating}>
                <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fa-solid fa-star ${i < Math.floor(shop.rating) ? styles.active : ''}`}></i>
                    ))}
                </div>
                <span className={styles.ratingText}>{shop.rating} ({shop.reviews} reviews)</span>
            </div>

            <p className={styles.shopDesc}>{shop.desc}</p>

            <div className={styles.shopTags}>
                {shop.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                ))}
            </div>

            <Link to={`/shop-profile/${shop.id}`} className={styles.btnViewProfile}>View Profile</Link>
        </div>
    );
};

export default ShopCard;
