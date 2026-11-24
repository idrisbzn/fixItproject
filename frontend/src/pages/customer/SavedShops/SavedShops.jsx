import React, { useState, useEffect } from 'react';
import styles from './SavedShops.module.css';
import SavedShopCard from '../../../components/customer/SavedShops/SavedShopCard/SavedShopCard';
import api from '../../../api/axios';
import { Link } from 'react-router-dom';

const SavedShops = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSavedShops = async () => {
        setLoading(true);
        try {
            const listRes = await api.get('/api/list-shops/');
            const listData = listRes.data.results || listRes.data;

            if (listData && listData.length > 0) {
                const shopEntries = listData[0].shop || [];
                
                if (shopEntries.length === 0) {
                    setShops([]);
                    setLoading(false);
                    return;
                }

                const shopPromises = shopEntries.map(entry => api.get(`/api/shops/${entry.id}/`));
                const shopResponses = await Promise.all(shopPromises);

                const mappedShops = shopResponses.map((res, index) => {
                    const shop = res.data;
                    return {
                        id: shop.id,
                        name: shop.name,
                        rating: shop.rating || 0,
                        location: `${shop.city}, ${shop.wilaya}`,
                        is_open: shop.is_open,
                        hours: shop.hours || [],
                        tags: shop.device_types ? shop.device_types.map(dt => dt.name) : [],
                        avatar: shop.profile_image ? (shop.profile_image.startsWith('http') ? shop.profile_image : `http://127.0.0.1:8000${shop.profile_image}`) : '/default-avatar.svg',
                        reviews: shop.total_reviews || 0,
                        desc: shop.description || "No description provided.",
                        note: shopEntries[index].note || ''
                    };
                });

                setShops(mappedShops);
            } else {
                setShops([]);
            }
        } catch (err) {
            console.error("Failed to fetch saved shops", err);
            setError("Failed to load your saved shops. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedShops();
    }, []);

    const handleRemoveShop = async (shopId) => {
        try {
            await api.post('/api/list-shops/remove_shop/', { shop_id: shopId });
            setShops(prevShops => prevShops.filter(shop => shop.id !== shopId));
        } catch (err) {
            console.error('Failed to remove shop', err);
        }
    };

    if (loading) {
        return (
            <div className={styles.savedShopsPage}>
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--cyan)' }}></i>
                    <p>Loading your saved shops...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.savedShopsPage}>
                <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4d' }}>
                    <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '24px', marginBottom: '12px' }}></i>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.savedShopsPage}>
            <header className={styles.savedShopsHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.savedShopsTitle}>Saved Shops</h1>
                    <p className={styles.savedShopsSubtitle}>Your bookmarked repair shops — {shops.length} saved</p>
                </div>
            </header>

            <div className={styles.shopsGrid}>
                {shops.length > 0 ? (
                    shops.map(shop => (
                        <SavedShopCard key={shop.id} shop={shop} onRemove={() => handleRemoveShop(shop.id)} />
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                        <i className="fa-regular fa-bookmark" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
                        <h3>No shops saved yet</h3>
                        <p style={{ marginTop: '8px' }}>
                            Explore and save your favorite repair shops to find them easily later.
                        </p>
                        <Link to="/search" style={{
                            display: 'inline-block',
                            marginTop: '24px',
                            padding: '10px 20px',
                            background: 'var(--cyan)',
                            color: 'var(--bg)',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>
                            Find Shops
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedShops;
