import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/axios';
import VisitorNavbar from '../../../components/visitor/NavBar/VisitorNavbar';
import CustomerNavbar from '../../../components/customer/CustomerNavBar/CustomerNavbar';
import ShopNavbar from '../../../components/shop/common/ShopNavbar/ShopNavbar';
import styles from './ShopPublicProfile.module.css';

// ─── JWT helpers (no longer imported from Search.jsx) ────────────────────────

const decodeToken = (token) => {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

const isTokenValid = () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return false;
    const payload = decodeToken(token);
    if (!payload?.exp) return false;
    return payload.exp * 1000 > Date.now();
};

// Read role directly from JWT payload — tab-safe, not shared via localStorage
const getRoleFromToken = () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return null;
    const payload = decodeToken(token);
    return payload?.role || null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const tabs = [
    { key: 'about', label: 'About' },
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'details', label: 'Details' },
    { key: 'location', label: 'Location' },
    { key: 'reviews', label: 'Reviews' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ShopPublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ── UI state ──────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('about');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showRequestPrompt, setShowRequestPrompt] = useState(false);

    // ── Data state ────────────────────────────────────────────────────────────
    const [shop, setShop] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // ── Auth state ────────────────────────────────────────────────────────────
    // Role comes from the JWT token — NOT localStorage — so two tabs with
    // different logins never overwrite each other.
    const [isAuthenticated, setIsAuthenticated] = useState(() => isTokenValid());
    const [userRole, setUserRole] = useState(() => getRoleFromToken());
    const [userData, setUserData] = useState(null);

    // ── Refs ──────────────────────────────────────────────────────────────────
    const sectionRefs = useRef({});
    const navRef = useRef(null);
    const isScrollingToSection = useRef(false);

    // ── Sync auth on mount + cross-tab changes ────────────────────────────────
    useEffect(() => {
        const checkAuth = async () => {
            const valid = isTokenValid();
            setIsAuthenticated(valid);

            if (valid) {
                // Derive role from token first (instant, tab-safe)
                setUserRole(getRoleFromToken());

                // Then confirm with the backend for full user data (shop_id etc.)
                try {
                    const res = await api.get('/accounts/me/');
                    setUserData(res.data);
                    setUserRole(res.data.role); // backend is the source of truth
                } catch (err) {
                    console.error('Failed to fetch user info:', err);
                    // Keep the token-derived role as fallback
                }
            } else {
                setUserRole(null);
                setUserData(null);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        window.addEventListener('auth-changed', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-changed', checkAuth);
        };
    }, []);

    // ── Derived auth flags ────────────────────────────────────────────────────
    const isOwnerPreview = isAuthenticated
        && userRole === 'repairer'
        && userData?.shop_id === parseInt(id);

    const canInteract = !isAuthenticated || userRole === 'client';

    // ── Fetch shop, saved status, reviews ────────────────────────────────────
    useEffect(() => {
        const fetchShop = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/shops/${id}/`);
                setShop(res.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch shop:', err);
                setError('Shop not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        const fetchSavedStatus = async () => {
            if (!isAuthenticated || userRole !== 'client') return;
            try {
                const listRes = await api.get('/api/list-shops/');
                const listData = listRes.data.results || listRes.data;
                if (listData?.length > 0) {
                    const shopsList = listData[0].shop || [];
                    setIsSaved(shopsList.some(s => String(s.id) === String(id)));
                }
            } catch (err) {
                console.error('Failed to fetch saved shops:', err);
            }
        };

        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const res = await api.get(`/api/reviews/?shop=${id}`);
                setReviews(res.data.results || res.data);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchShop();
        fetchSavedStatus();
        fetchReviews();
    }, [id, isAuthenticated, userRole]);

    // ── Scroll to section on tab click ────────────────────────────────────────
    const handleTabClick = (key) => {
        setActiveTab(key);
        const section = sectionRefs.current[key];
        if (section) {
            isScrollingToSection.current = true;
            const navHeight = navRef.current?.offsetHeight || 0;
            const top = section.getBoundingClientRect().top + window.scrollY - navHeight - 24;
            window.scrollTo({ top, behavior: 'smooth' });
            setTimeout(() => { isScrollingToSection.current = false; }, 800);
        }
    };

    // ── Scroll-spy ────────────────────────────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => {
            if (isScrollingToSection.current) return;
            const navHeight = navRef.current?.offsetHeight || 0;
            const scrollPos = window.scrollY + navHeight + 60;
            let currentSection = 'about';
            for (const tab of tabs) {
                const section = sectionRefs.current[tab.key];
                if (section && section.offsetTop <= scrollPos) {
                    currentSection = tab.key;
                }
            }
            setActiveTab(currentSection);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const renderStars = (rating) =>
        [1, 2, 3, 4, 5].map(i => (
            <i key={i} className={`fa-solid fa-star ${i <= rating ? styles.activeStar : styles.inactiveStar}`} />
        ));

    const getWorkingHours = () => {
        if (!shop?.hours) return [];
        const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayLabels = {
            monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
            thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
        };
        return allDays.map(day => {
            const found = shop.hours.find(h => h.day === day);
            if (found) {
                return {
                    day: dayLabels[day],
                    hours: `${found.open_time.slice(0, 5)} - ${found.close_time.slice(0, 5)}`,
                    active: true,
                };
            }
            return { day: dayLabels[day], hours: 'Closed', active: false };
        });
    };

    const checkIsOpenNow = () => {
        if (!shop?.is_open) return false;
        if (!Array.isArray(shop.hours) || shop.hours.length === 0) return false;

        const now = new Date();
        const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const todayHours = shop.hours.find(h => h.day === daysMap[now.getDay()]);
        if (!todayHours) return false;

        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        return currentTime >= todayHours.open_time.slice(0, 5)
            && currentTime <= todayHours.close_time.slice(0, 5);
    };

    const handleSave = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            setTimeout(() => setShowLoginPrompt(false), 3000);
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
            console.error('Failed to update saved status:', err);
        }
    };

    const handleRequest = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setShowRequestPrompt(true);
            setTimeout(() => setShowRequestPrompt(false), 3000);
            return;
        }
        navigate(`/shop/${shop.id}/request`);
    };

    // ── Navbar helper ─────────────────────────────────────────────────────────
    const renderNavbar = () => {
        if (isOwnerPreview) return null;
        if (!isAuthenticated) return <VisitorNavbar />;
        if (userRole === 'repairer') return <ShopNavbar />;
        return <CustomerNavbar />;
    };

    // ── Loading state ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className={styles.publicProfilePage}>
                {renderNavbar()}
                <div className={styles.loadingState}>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Loading shop profile...</p>
                </div>
            </div>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────────
    if (error || !shop) {
        return (
            <div className={styles.publicProfilePage}>
                {renderNavbar()}
                <div className={styles.errorState}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <p>{error || 'Shop not found'}</p>
                    <button onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        );
    }

    // ── Derived display values ────────────────────────────────────────────────
    const workingHours = getWorkingHours();
    const isOpenNow = checkIsOpenNow();
    const location = `${shop.wilaya}${shop.city ? `, ${shop.city}` : ''}`;
    const shopAvatar = shop.profile_image
        ? (shop.profile_image.startsWith('http') ? shop.profile_image : `http://127.0.0.1:8000${shop.profile_image}`)
        : '/default-avatar.svg';
    const devices = (shop.device_types || [])
        .map(dt => {
            const name = dt.name.toLowerCase();
            if (name.includes('phone') || name.includes('tablet')) return 'Phone/Tablet';
            if (name.includes('pc') || name.includes('laptop')) return 'PC/Laptop';
            return null;
        })
        .filter((val, idx, self) => val && self.indexOf(val) === idx);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className={styles.publicProfilePage}>
            {renderNavbar()}

            {/* Back Bar */}
            <div className={styles.backBar}>
                <button className={styles.backLink} onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to previous page
                </button>
                {isOwnerPreview && (
                    <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 'bold', color: 'var(--cyan)', background: 'rgba(6,182,212,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                        PREVIEW MODE
                    </span>
                )}
            </div>

            {/* Hero Header */}
            <header className={styles.profileHeader}>
                <div className={styles.headerInner}>
                    <div className={styles.headerLeft}>
                        <div className={styles.shopAvatar}>
                            <img src={shopAvatar} alt={shop.name} onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }} />
                        </div>
                        <div className={styles.shopIdentity}>
                            <div className={styles.nameRow}>
                                <h1>{shop.name}</h1>
                                <span className={`${styles.statusBadge} ${isOpenNow ? styles.open : styles.closed}`}>
                                    {isOpenNow ? 'OPEN NOW' : 'CLOSED'}
                                </span>
                            </div>
                            <div className={styles.ratingRow}>
                                <div className={styles.stars}>{renderStars(Math.floor(shop.rating || 0))}</div>
                                <span className={styles.ratingValue}>{shop.rating || '0.0'}</span>
                                <span className={styles.reviewCount}>({shop.total_reviews || 0} reviews)</span>
                            </div>
                            <span className={styles.locationText}>
                                <i className="fa-solid fa-location-dot"></i> {location}
                            </span>
                        </div>
                    </div>

                    {canInteract && (
                        <div className={styles.headerActions}>
                            <div className={styles.saveBtnWrapper}>
                                <button
                                    className={`${styles.btnSave} ${isSaved ? styles.saved : ''}`}
                                    onClick={handleSave}
                                >
                                    <i className={isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}
                                        style={isSaved ? { color: 'var(--cyan)' } : {}} />
                                    {isSaved ? 'Saved' : 'Save Shop'}
                                </button>
                                {showLoginPrompt && (
                                    <div className={styles.loginPrompt}>
                                        Please <Link to="/login">Login</Link> or <Link to="/register">Sign Up</Link> to save shops
                                    </div>
                                )}
                            </div>
                            <div className={styles.saveBtnWrapper}>
                                <button className={styles.btnRequest} onClick={handleRequest}>
                                    <i className="fa-solid fa-paper-plane"></i> Send Repair Request
                                </button>
                                {showRequestPrompt && (
                                    <div className={styles.loginPrompt}>
                                        Please <Link to="/login">Login</Link> or <Link to="/register">Sign Up</Link> to send requests
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tab Nav */}
                <nav className={styles.profileNav} ref={navRef}>
                    <div className={styles.navInner}>
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`${styles.navTab} ${activeTab === tab.key ? styles.active : ''}`}
                                onClick={() => handleTabClick(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </nav>
            </header>

            {/* ── Main Content ── */}
            <main className={styles.profileContent}>

                {/* ABOUT */}
                <section className={styles.section} ref={el => sectionRefs.current['about'] = el} id="about">
                    <h2 className={styles.sectionTitle}>
                        <i className="fa-solid fa-circle-info"></i> About Us
                    </h2>
                    <div className={styles.aboutCard}>
                        <p className={styles.aboutText}>{shop.description || 'No description provided yet.'}</p>
                        <div className={styles.aboutMeta}>
                            <div className={styles.metaItem}>
                                <i className="fa-solid fa-phone"></i>
                                <span>{shop.phone || 'N/A'}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <i className="fa-brands fa-whatsapp"></i>
                                <span>{shop.phone || 'N/A'}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <i className="fa-solid fa-envelope"></i>
                                <span>{shop.business_email || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PORTFOLIO */}
                <section className={styles.section} ref={el => sectionRefs.current['portfolio'] = el} id="portfolio">
                    <h2 className={styles.sectionTitle}>
                        <i className="fa-solid fa-images"></i> Portfolio
                    </h2>
                    <div className={styles.portfolioGrid}>
                        {shop.portfolio?.length > 0 ? (
                            shop.portfolio.map(item => (
                                <div key={item.id} className={styles.portfolioItem}>
                                    <img src={item.image} alt={item.caption || 'Portfolio'} />
                                    {item.caption && (
                                        <div className={styles.portfolioOverlay}>
                                            <span>{item.caption}</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyPortfolio}>
                                <i className="fa-solid fa-images"></i>
                                <p>No portfolio images yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* DETAILS */}
                <section className={styles.section} ref={el => sectionRefs.current['details'] = el} id="details">
                    <h2 className={styles.sectionTitle}>
                        <i className="fa-solid fa-list-check"></i> Details
                    </h2>
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailsCard}>
                            <h3 className={styles.detailsCardTitle}>
                                <i className="fa-solid fa-clock"></i> Working Hours
                            </h3>
                            <div className={styles.hoursList}>
                                {workingHours.map(wh => (
                                    <div key={wh.day} className={`${styles.hoursRow} ${!wh.active ? styles.closed : ''}`}>
                                        <span className={styles.dayName}>{wh.day}</span>
                                        <span className={styles.hoursValue}>{wh.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.detailsCard}>
                            <h3 className={styles.detailsCardTitle}>
                                <i className="fa-solid fa-mobile-screen-button"></i> Devices
                            </h3>
                            <div className={styles.tagList}>
                                {devices.length > 0 ? (
                                    devices.map(d => (
                                        <span key={d} className={styles.deviceTag}>{d}</span>
                                    ))
                                ) : (
                                    <span className={styles.noData}>No device types specified.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* LOCATION */}
                <section className={styles.section} ref={el => sectionRefs.current['location'] = el} id="location">
                    <h2 className={styles.sectionTitle}>
                        <i className="fa-solid fa-map-location-dot"></i> Location
                    </h2>
                    <div className={styles.locationCard}>
                        <div className={styles.locationHeader}>
                            <i className="fa-solid fa-location-dot"></i>
                            <div>
                                <h4>{location}</h4>
                                <p>{shop.address || location}</p>
                            </div>
                        </div>
                        <div className={styles.mapPlaceholder}>
                            {shop.google_maps_link ? (
                                <a href={shop.google_maps_link} target="_blank" rel="noopener noreferrer" className={styles.mapBtn}>
                                    <i className="fa-solid fa-diamond-turn-right"></i> Open in Google Maps
                                </a>
                            ) : (
                                <span className={styles.noData}>No Google Maps link provided.</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* REVIEWS */}
                <section className={styles.section} ref={el => sectionRefs.current['reviews'] = el} id="reviews">
                    <h2 className={styles.sectionTitle}>
                        <i className="fa-solid fa-star"></i> Reviews
                    </h2>
                    <div className={styles.ratingSummary}>
                        <div className={styles.ratingBig}>
                            <span className={styles.ratingNumber}>{shop.rating || '0.0'}</span>
                            <div className={styles.ratingStarsBig}>{renderStars(Math.floor(shop.rating || 0))}</div>
                            <span className={styles.totalReviews}>{shop.total_reviews || 0} reviews</span>
                        </div>
                    </div>
                    <div className={styles.reviewsList}>
                        {reviewsLoading ? (
                            <div className={styles.loadingReviews}>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <p>Loading reviews...</p>
                            </div>
                        ) : reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.reviewerInfo}>
                                            <div className={styles.reviewerAvatar}>
                                                <img 
                                                    src={review.user_avatar ? (review.user_avatar.startsWith('http') ? review.user_avatar : `http://127.0.0.1:8000${review.user_avatar}`) : '/default-avatar.svg'} 
                                                    alt={review.user_name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }}
                                                />
                                            </div>
                                            <div className={styles.reviewerNameRow}>
                                                <h4>{review.user_name}</h4>
                                                <div className={styles.reviewStars}>{renderStars(review.rating)}</div>
                                            </div>
                                        </div>
                                        <span className={styles.reviewDate}>
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={styles.reviewText}>{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyReviews}>
                                <i className="fa-solid fa-comment-dots"></i>
                                <p>No reviews yet. Be the first to leave a review!</p>
                            </div>
                        )}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default ShopPublicProfile;