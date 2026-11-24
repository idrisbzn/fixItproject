import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { ALGERIA_DATA } from '../../../constants/AlgeriaData';
import FindShopCard from '../../../components/customer/Dashboard/FindShopCard/FindShopCard';
import StatCards from '../../../components/customer/Dashboard/StatCards/StatCards';
import RecentRepairCard from '../../../components/customer/Dashboard/RecentRepairCard/RecentRepairCard';
import QuickLinks from '../../../components/customer/Dashboard/QuickLinks/QuickLinks';
import api from '../../../api/axios';

const Dashboard = () => {
    const navigate = useNavigate();

    // UI state
    const [deviceTypes, setDeviceTypes] = useState(() => {
        const saved = localStorage.getItem('search_deviceType');
        return saved !== null ? saved.split(',').filter(Boolean) : [];
    });
    const [selectedWilaya, setSelectedWilaya] = useState(localStorage.getItem('search_wilaya') || '');
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('search_city') || '');
    const [error, setError] = useState('');

    // Backend data state
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState([]);
    const [recentRepair, setRecentRepair] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('last_home', '/dashboard');
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Parallel fetching:
            // - /api/repair_requests/ → first page of all repairs (for recent repair card)
            // - /api/repair_requests/?status=pending,accepted,in_repair,ready → count of active repairs
            // - /api/list-shops/ → user's saved shops list (Favoris)
            // - /api/reviews/ → count of reviews
            const [userRes, repairRes, activeRepairRes, savedRes, reviewRes] = await Promise.all([
                api.get('/accounts/me/'),
                api.get('/api/repair_requests/'),
                api.get('/api/repair_requests/?status=pending,accepted,in_repair,ready'),
                api.get('/api/list-shops/'),
                api.get('/api/reviews/')
            ]);

            setUser(userRes.data);

            // Process Repairs — use first page for the recent repair card
            const repairs = repairRes.data.results || repairRes.data;
            const activeRepairsPage = activeRepairRes.data.results || activeRepairRes.data;
            const activeRepairsCount = activeRepairRes.data.count ?? (Array.isArray(activeRepairsPage) ? activeRepairsPage.length : 0);

            // Latest active repair for the card
            if (Array.isArray(activeRepairsPage) && activeRepairsPage.length > 0) {
                const latest = activeRepairsPage[0]; // API returns sorted by date desc
                const statusMap = {
                    'pending': { label: 'PENDING', progress: 0 },
                    'accepted': { label: 'ACCEPTED', progress: 25 },
                    'in_repair': { label: 'IN REPAIR', progress: 50 },
                    'ready': { label: 'READY', progress: 75 },
                    'completed': { label: 'DONE', progress: 100 }
                };
                const s = statusMap[latest.status] || { label: latest.status.toUpperCase(), progress: 0 };

                setRecentRepair({
                    id: latest.id,
                    deviceName: latest.model_name || latest.title,
                    shopName: latest.shop_name,
                    status: s.label,
                    progress: s.progress,
                    type: latest.device_type === 'pc' ? 'pc' : 'phone'
                });
            } else if (Array.isArray(repairs) && repairs.length > 0) {
                // Show latest completed if no active ones
                const latest = repairs[0];
                setRecentRepair({
                    id: latest.id,
                    deviceName: latest.model_name || latest.title,
                    shopName: latest.shop_name,
                    status: 'DONE',
                    progress: 100,
                    type: latest.device_type === 'pc' ? 'pc' : 'phone'
                });
            }

            // Process Stats
            // Saved shops: /api/list-shops/ returns paginated results where each
            // item is a ListShop object with a `shop` array of {id, note}.
            // A user has at most one ListShop, so the saved count = length of that shop array.
            const listShopData = savedRes.data.results || savedRes.data;
            let savedShopsCount = 0;
            if (Array.isArray(listShopData) && listShopData.length > 0) {
                const shopList = listShopData[0].shop || [];
                savedShopsCount = shopList.length;
            }
            const reviewsCount = reviewRes.data.count ?? (reviewRes.data.results || reviewRes.data).length;

            setStats([
                {
                    label: 'Active Repairs',
                    value: activeRepairsCount.toString(),
                    icon: 'fa-wrench',
                    color: 'blue',
                    link: '/devices'
                },
                {
                    label: 'Saved Shops',
                    value: savedShopsCount.toString(),
                    icon: 'fa-bookmark',
                    color: 'green',
                    link: '/saved'
                },
                {
                    label: 'Reviews Given',
                    value: reviewsCount.toString(),
                    icon: 'fa-comment-dots',
                    color: 'amber',
                    link: '/reviews'
                }
            ]);

        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const wilayaOptions = useMemo(() => ALGERIA_DATA.map(w => w.name), []);

    const cityOptions = useMemo(() => {
        const wilaya = ALGERIA_DATA.find(w => w.name === selectedWilaya);
        return wilaya ? wilaya.cities : [];
    }, [selectedWilaya]);

    const handleWilayaSelect = (wilaya) => {
        setSelectedWilaya(wilaya);
        setSelectedCity('');
        setError('');
    };

    const handleFindShops = () => {
        const isValidWilaya = ALGERIA_DATA.some(w => w.name.toLowerCase() === selectedWilaya.toLowerCase());

        if (!selectedWilaya) {
            setError('Please select a wilaya');
            return;
        }

        if (!isValidWilaya) {
            setError('Please enter a valid wilaya name');
            return;
        }

        setError('');
        const devices = deviceTypes.join(',');

        localStorage.setItem('search_wilaya', selectedWilaya);
        localStorage.setItem('search_city', selectedCity);
        localStorage.setItem('search_deviceType', devices);

        navigate(`/search?wilaya=${selectedWilaya}&city=${selectedCity}&device=${devices}`);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className={styles.dashboardPage}>
            <header className={styles.dashboardHeader}>
                <h1 className={styles.dashboardWelcome}>
                    {getGreeting()}, {user?.first_name || user?.username || 'Customer'} 👋
                </h1>
                <p className={styles.dashboardSubtitle}>What do you need repaired today?</p>
            </header>

            <FindShopCard
                wilayaOptions={wilayaOptions}
                cityOptions={cityOptions}
                selectedWilaya={selectedWilaya}
                selectedCity={selectedCity}
                deviceTypes={deviceTypes}
                onWilayaSelect={handleWilayaSelect}
                onCitySelect={setSelectedCity}
                onDeviceTypesChange={setDeviceTypes}
                onFindShops={handleFindShops}
                error={error}
            />

            <StatCards stats={stats} />

            <section className={styles.recentRepairs}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Repairs</h2>
                    <Link to="/devices" className={styles.btnViewAll}>View All <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
                {recentRepair ? (
                    <RecentRepairCard repair={recentRepair} />
                ) : (
                    <div className={styles.emptyRepairState}>
                        <p>No repair requests yet. Find a shop to get started!</p>
                    </div>
                )}
            </section>

            <QuickLinks />
        </div>
    );
};

export default Dashboard;
