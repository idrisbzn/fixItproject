import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import GeneralInfo from '../../../components/shop/ShopProfile/GeneralInfo/GeneralInfo';
import PreviousWork from '../../../components/shop/ShopProfile/PreviousWork/PreviousWork';
import WorkingHours from '../../../components/shop/ShopProfile/WorkingHours/WorkingHours';
import RepairSpecialization from '../../../components/shop/ShopProfile/RepairSpecialization/RepairSpecialization';
import styles from './ShopProfile.module.css';

const ShopProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [saveError, setSaveError] = useState('');
    const sectionRefs = useRef({});
    const isScrollingToSection = useRef(false);

    // Local form state
    const [formData, setFormData] = useState({
        name: '',
        business_email: '',
        phone: '',
        google_maps_link: '',
        wilaya: '',
        city: '',
        description: '',
        is_open: true,
    });
    const [hoursData, setHoursData] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [shopData, setShopData] = useState(null);
    const [shopLogo, setShopLogo] = useState('/default-avatar.svg');
    const fileInputRef = useRef(null);

    const fetchShop = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/api/shops/my_shop/');
            const shop = res.data;

            if (!shop) throw new Error("No shop data received.");

            setShopData(shop);
            setFormData({
                name: shop.name || '',
                business_email: shop.business_email || '',
                phone: shop.phone || '',
                google_maps_link: shop.google_maps_link || '',
                wilaya: shop.wilaya || '',
                city: shop.city || '',
                description: shop.description || '',
                is_open: shop.is_open !== undefined ? shop.is_open : true,
            });

            if (shop.profile_image) {
                setShopLogo(shop.profile_image.startsWith('http') ? shop.profile_image : `http://127.0.0.1:8000${shop.profile_image}`);
            }

            const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const dayLabels = {
                monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
                thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
            };

            const hours = shop.hours || [];
            const initHours = allDays.map(day => {
                const found = hours.find(h => h.day === day);
                if (found) {
                    return {
                        day,
                        label: dayLabels[day],
                        active: true,
                        open_time: (found.open_time || '09:00').slice(0, 5),
                        close_time: (found.close_time || '18:00').slice(0, 5)
                    };
                }
                return { day, label: dayLabels[day], active: false, open_time: '09:00', close_time: '18:00' };
            });
            setHoursData(initHours);

            if (shop.device_types) {
                setDeviceTypes(shop.device_types.map(dt => dt.name));
            } else {
                setDeviceTypes([]);
            }
        } catch (err) {
            console.error('Failed to fetch shop profile:', err);
            const msg = err.response?.data?.error || 'Failed to load shop profile data. Please check your internet connection.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShop();
    }, []);

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setSaveError('');
            const payload = {
                ...formData,
                device_types_names: deviceTypes,
                hours_data: hoursData.filter(h => h.active).map(h => ({
                    day: h.day,
                    open_time: h.open_time,
                    close_time: h.close_time
                }))
            };
            const res = await api.patch('/api/shops/my_shop/', payload);

            // Update local state with fresh data from server instead of reloading
            const updatedShop = res.data;
            setShopData(updatedShop);
            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (err) {
            console.error('Failed to save shop profile:', err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Failed to save changes. Please try again.';
            setSaveError(errorMsg);
            setTimeout(() => setSaveError(''), 5000);
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('profile_picture', file);

            const res = await api.put('/accounts/me/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.profile_picture) {
                const newLogoUrl = res.data.profile_picture.startsWith('http')
                    ? res.data.profile_picture
                    : `http://127.0.0.1:8000${res.data.profile_picture}`;
                setShopLogo(newLogoUrl);

                // Update sessionStorage for the navbar
                const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
                userData.avatar = newLogoUrl;
                sessionStorage.setItem('userData', JSON.stringify(userData));
            }
        } catch (error) {
            console.error('Failed to upload shop logo:', error);
            setSaveError('Failed to upload logo. Please try again.');
            setTimeout(() => setSaveError(''), 5000);
        } finally {
            setSaving(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const checkIsOpenNow = () => {
        if (!hoursData || hoursData.length === 0) return false;

        const now = new Date();
        const currentDayIndex = now.getDay();
        const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDayStr = daysMap[currentDayIndex];

        const todayHours = hoursData.find(h => h.day === currentDayStr);
        if (!todayHours || !todayHours.active) return false;

        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const openTime = todayHours.open_time.slice(0, 5);
        const closeTime = todayHours.close_time.slice(0, 5);

        return currentTime >= openTime && currentTime <= closeTime;
    };

    if (loading) {
        return (
            <div className={styles.shopProfilePage}>
                <div className={styles.loadingState}>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.shopProfilePage}>
                <div className={styles.errorState}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <p>{error}</p>
                    <button onClick={fetchShop}>Try Again</button>
                </div>
            </div>
        );
    }

    const isOpenNow = checkIsOpenNow();

    return (
        <div className={styles.shopProfilePage}>
            <header className={styles.shopHeader}>
                <div className={styles.shopHeaderContent}>
                    <div className={styles.shopLogoContainer} onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', position: 'relative' }}>
                        <img src={shopLogo} alt="Shop Logo" className={styles.shopLogo} onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }} />
                        <div className={styles.logoEditOverlay}>
                            <i className="fa-solid fa-camera"></i>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleLogoUpload}
                        />
                    </div>
                    <div className={styles.shopTitleInfo}>
                        <h1>{formData.name || 'Your Shop'}</h1>
                        <div className={styles.shopMeta}>
                            <span className={styles.location}><i className="fa-solid fa-location-dot"></i> {formData.wilaya}{formData.city ? `, ${formData.city}` : ''}</span>
                            <span className={`${styles.statusBadge} ${isOpenNow ? styles.open : styles.closed}`}>
                                {isOpenNow ? 'OPEN NOW' : 'CLOSED'}
                            </span>
                        </div>
                    </div>
                    {shopData && (
                        <button className={styles.previewBtn} onClick={() => navigate(`/shop-profile/${shopData.id}`)}>
                            <i className="fa-regular fa-eye"></i> Preview Customer View
                        </button>
                    )}
                </div>

                <nav className={styles.shopNav}>
                    <button className={`${styles.navItem} ${styles.active}`} onClick={() => {
                        sectionRefs.current['general']?.scrollIntoView({ behavior: 'smooth' });
                    }}>General Information</button>
                    <button className={styles.navItem} onClick={() => {
                        sectionRefs.current['work']?.scrollIntoView({ behavior: 'smooth' });
                    }}>Previous Work</button>
                    <button className={styles.navItem} onClick={() => {
                        sectionRefs.current['hours']?.scrollIntoView({ behavior: 'smooth' });
                    }}>Working Hours</button>
                    <button className={styles.navItem} onClick={() => {
                        sectionRefs.current['specialization']?.scrollIntoView({ behavior: 'smooth' });
                    }}>Repair Specialization</button>
                </nav>
            </header>

            <main className={styles.shopProfileMain}>
                <section className={styles.section} ref={el => sectionRefs.current['general'] = el} id="general">
                    <GeneralInfo formData={formData} onChange={handleFormChange} />
                </section>

                <section className={styles.section} ref={el => sectionRefs.current['work'] = el} id="work">
                    <PreviousWork portfolio={shopData?.portfolio || []} shopId={shopData?.id} onUpdate={fetchShop} />
                </section>

                <section className={styles.section} ref={el => sectionRefs.current['hours'] = el} id="hours">
                    <WorkingHours hoursData={hoursData} setHoursData={setHoursData} />
                </section>

                <section className={styles.section} ref={el => sectionRefs.current['specialization'] = el} id="specialization">
                    <RepairSpecialization deviceTypes={deviceTypes} setDeviceTypes={setDeviceTypes} />
                </section>

                <div className={styles.saveActionContainer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '20px' }}>
                    {saveError && (
                        <span style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '12px' }}>
                            <i className="fa-solid fa-circle-exclamation"></i> {saveError}
                        </span>
                    )}
                    <button
                        className={`${styles.saveChangesBtn} ${saved ? styles.saved : ''}`}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> SAVING...</>
                        ) : saved ? (
                            <><i className="fa-solid fa-check"></i> SAVED</>
                        ) : (
                            'SAVE PROFILE CHANGES'
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ShopProfile;
