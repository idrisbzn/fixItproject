import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VisitorNavbar from '../../../components/visitor/NavBar/VisitorNavbar';
import CustomerNavbar from '../../../components/customer/CustomerNavBar/CustomerNavbar';
import ShopCard from '../../../components/common/ShopCard/ShopCard';
import SearchFilter from '../../../components/common/SearchFilter/SearchFilter';
import styles from './Search.module.css';
import api, { clearTokens } from '../../../api/axios';

// ─── JWT helpers ────────────────────────────────────────────────────────────

/**
 * Decode a JWT payload without verifying the signature.
 * Verification MUST happen on the server — this is for UI purposes only.
 */
export const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        // Fix base64url padding
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

/**
 * Returns true if a JWT access token exists in localStorage and is not expired.
 */
export const isTokenValid = () => {
    const token = sessionStorage.getItem('access_token');
    const authFlag = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!token || !authFlag) return false;

    const payload = decodeToken(token);
    if (!payload || !payload.exp) return false;

    // exp is in seconds, Date.now() is in ms
    return payload.exp * 1000 > Date.now();
};

// ─── Component ───────────────────────────────────────────────────────────────

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const initialWilaya = queryParams.get('wilaya') || localStorage.getItem('search_wilaya') || 'Oran';
    const initialCity = queryParams.get('city') || localStorage.getItem('search_city') || '';
    const initialDevice = queryParams.get('device') ?? localStorage.getItem('search_deviceType');
    const initialDevices = initialDevice ? initialDevice.split(',').filter(Boolean) : [];

    // ── Auth state ──────────────────────────────────────────────────────────
    const [isAuthenticated, setIsAuthenticated] = useState(() => isTokenValid());

    // Re-check whenever the component mounts or the user navigates back to
    // this page (e.g. after logging in/out in another tab).
    useEffect(() => {
        const checkAuth = () => setIsAuthenticated(isTokenValid());
        checkAuth();

        // React to storage events (another tab) and custom auth events (same tab)
        window.addEventListener('storage', checkAuth);
        window.addEventListener('auth-changed', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-changed', checkAuth);
        };
    }, []);

    // ── Filter state ────────────────────────────────────────────────────────
    const [deviceTypes, setDeviceTypes] = useState(initialDevices);
    const [minRating, setMinRating] = useState(0);
    const [appliedWilaya, setAppliedWilaya] = useState(initialWilaya);
    const [appliedCity, setAppliedCity] = useState(initialCity);
    const [filterOpen, setFilterOpen] = useState(false);

    // ── Data state ──────────────────────────────────────────────────────────
    const [shops, setShops] = useState([]);
    const [savedShopIds, setSavedShopIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const shopsPerPage = 4;

    useEffect(() => {
        localStorage.setItem('last_home', '/search');
    }, []);

    // ── Fetch shops & saved list ─────────────────────────────────────────────
    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true);
            setError('');
            try {
                let url = `/api/shops/?wilaya=${appliedWilaya}`;
                if (appliedCity) url += `&city=${appliedCity}`;
                if (deviceTypes.length > 0) url += `&device=${deviceTypes.join(',')}`;

                const response = await api.get(url);
                const shopsData = response.data.results || response.data;

                const mappedShops = shopsData.map(shop => ({
                    id: shop.id,
                    name: shop.name,
                    is_open: shop.is_open,
                    hours: shop.hours || [],
                    location: `${shop.city}, ${shop.wilaya}`,
                    rating: shop.rating || 0,
                    reviews: shop.total_reviews || 0,
                    desc: shop.description || 'Professional repair services for all your devices.',
                    tags: (shop.device_types || [])
                        .map(dt => {
                            const name = dt.name.toLowerCase();
                            if (name.includes('phone') || name.includes('tablet')) return 'Phone/Tablet';
                            if (name.includes('pc') || name.includes('laptop')) return 'PC/Laptop';
                            return null;
                        })
                        .filter((val, idx, self) => val && self.indexOf(val) === idx),
                    avatar: shop.profile_image
                        ? (shop.profile_image.startsWith('http')
                            ? shop.profile_image
                            : `http://127.0.0.1:8000${shop.profile_image}`)
                        : '/default-avatar.svg',
                }));

                setShops(mappedShops);
            } catch (err) {
                console.error('Error fetching shops:', err);
                setError('Failed to load shops. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const fetchSavedShops = async () => {
            // Only fetch saved shops when the JWT is still valid
            if (!isAuthenticated) return;
            try {
                const listRes = await api.get('/api/list-shops/');
                const listData = listRes.data.results || listRes.data;
                if (listData?.length > 0) {
                    const savedIds = (listData[0].shop || []).map(s => s.id);
                    setSavedShopIds([...new Set(savedIds)]);
                }
            } catch (err) {
                console.error('Failed to fetch saved shops:', err);

                // If the server returns 401 the token is invalid/expired →
                // clear storage and update UI state immediately.
                if (err.response?.status === 401) {
                    clearTokens();
                    setIsAuthenticated(false);
                }
            }
        };

        fetchShops();
        fetchSavedShops();
    }, [appliedWilaya, appliedCity, deviceTypes, isAuthenticated]);

    // ── Rating filter + sort ─────────────────────────────────────────────────
    const filteredAndSortedShops = useMemo(() => (
        shops
            .filter(shop => shop.rating >= minRating)
            .sort((a, b) => b.rating - a.rating)
    ), [shops, minRating]);

    // ── Pagination ───────────────────────────────────────────────────────────
    const totalPages = Math.ceil(filteredAndSortedShops.length / shopsPerPage);
    const indexOfLast = currentPage * shopsPerPage;
    const indexOfFirst = indexOfLast - shopsPerPage;
    const currentShops = filteredAndSortedShops.slice(indexOfFirst, indexOfLast);

    useEffect(() => { setCurrentPage(1); }, [minRating, deviceTypes, appliedWilaya, appliedCity]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className={styles.searchPageContainer}>
            {isAuthenticated ? <CustomerNavbar /> : <VisitorNavbar />}

            <main className={styles.searchMain}>
                <SearchFilter
                    deviceTypes={deviceTypes}
                    minRating={minRating}
                    isOpen={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    initialWilaya={appliedWilaya}
                    initialCity={appliedCity}
                    onApply={(data) => {
                        setDeviceTypes(data.deviceTypes);
                        setMinRating(data.minRating);
                        setAppliedWilaya(data.wilaya);
                        setAppliedCity(data.city);

                        const params = new URLSearchParams();
                        params.set('wilaya', data.wilaya);
                        if (data.city) params.set('city', data.city);
                        if (data.deviceTypes.length > 0) params.set('device', data.deviceTypes.join(','));
                        navigate({ search: params.toString() }, { replace: true });
                    }}
                />

                <section className={styles.searchResults}>
                    <button
                        onClick={() => {
                            if (!isAuthenticated) return navigate('/');
                            const role = sessionStorage.getItem('userRole');
                            navigate(role === 'repairer' ? '/shop/requests' : '/dashboard');
                        }}
                        className={styles.backLink}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        {(() => {
                            if (!isAuthenticated) return 'Home';
                            const role = sessionStorage.getItem('userRole');
                            return role === 'repairer' ? 'Shop Panel' : 'Dashboard';
                        })()} / Search Results
                    </button>

                    <div className={styles.resultsHeader}>
                        <h1 className={styles.resultsCount}>
                            {filteredAndSortedShops.length} shops found in {appliedWilaya || 'Oran'}
                        </h1>
                        <div className={styles.resultsHeaderActions}>
                            <button className={styles.filterToggleBtn} onClick={() => setFilterOpen(true)}>
                                <i className="fa-solid fa-sliders"></i>
                                Filters
                            </button>
                            <div className={styles.sortLabel}>
                                <i className="fa-solid fa-arrow-down-wide-short"></i>
                                <span>Sorted by <strong>Best Rated</strong></span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.shopsGrid}>
                        {loading ? (
                            <div className={styles.loadingState}>
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                                <p>Searching for shops...</p>
                            </div>
                        ) : error ? (
                            <div className={styles.noResults}>
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p>{error}</p>
                            </div>
                        ) : currentShops.length > 0 ? (
                            currentShops.map(shop => (
                                <ShopCard
                                    key={shop.id}
                                    shop={shop}
                                    isInitiallySaved={savedShopIds.includes(shop.id)}
                                />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <p>No shops found matching your criteria.</p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageNav}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    className={`${styles.pageNum} ${currentPage === i + 1 ? styles.active : ''}`}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                className={styles.pageNav}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Search;