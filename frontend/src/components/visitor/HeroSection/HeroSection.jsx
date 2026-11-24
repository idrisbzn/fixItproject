import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GridAnimation from '../../common/gridAnimation/GridAnimation';
import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { ALGERIA_DATA } from '../../../constants/AlgeriaData';
import styles from './Hero.module.css';

export default function HeroSection() {
    const navigate = useNavigate();
    const [selectedDevices, setSelectedDevices] = useState(() => {
        const saved = localStorage.getItem('search_deviceType');
        return saved ? saved.split(',').filter(Boolean) : ['phone'];
    });
    const [selectedWilaya, setSelectedWilaya] = useState(() => localStorage.getItem('search_wilaya') || '');
    const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem('search_city') || '');
    const [error, setError] = useState('');

    const wilayaOptions = useMemo(() => ALGERIA_DATA.map(w => w.name), []);

    const cityOptions = useMemo(() => {
        const wilaya = ALGERIA_DATA.find(w => w.name === selectedWilaya);
        return wilaya ? wilaya.cities : [];
    }, [selectedWilaya]);

    const handleWilayaSelect = (wilaya) => {
        setSelectedWilaya(wilaya);
        setSelectedCity(''); // Reset city when wilaya changes
        setError(''); // Clear error when user selects a wilaya
    };

    const toggleDevice = (device) => {
        setSelectedDevices(prev => {
            if (prev.includes(device)) {
                return prev.filter(d => d !== device);
            } else {
                return [...prev, device];
            }
        });
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

        // Save to localStorage
        localStorage.setItem('search_wilaya', selectedWilaya);
        localStorage.setItem('search_city', selectedCity);
        localStorage.setItem('search_deviceType', selectedDevices.join(','));

        setError('');
        navigate(`/search?wilaya=${encodeURIComponent(selectedWilaya)}&city=${encodeURIComponent(selectedCity)}&device=${encodeURIComponent(selectedDevices.join(','))}`);
    };

    return (
        <section className={styles.heroSection} id="hero">
            {/* Animated grid canvas behind the title */}
            <div className={styles.heroCanvasWrapper}>
                <GridAnimation />
            </div>
            <div className={styles.heroOverlay} />

            <div className={styles.heroPanel}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Find a Trusted<br />
                        Repair Shop<br />
                        <span className={styles.heroTitleAccent}>Near You</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Compare shops, track your device, and get it fixed — hassle-free.
                    </p>
                </div>

                <div className={styles.heroSearchContainer}>
                    <div className={styles.heroSearch} id="hero-search">
                        <Autocomplete
                            options={wilayaOptions}
                            placeholder="Select Wilaya"
                            onSelect={handleWilayaSelect}
                            value={selectedWilaya}
                            className={`${styles.heroAutocomplete} ${error ? styles.error : ''}`}
                        />

                        <Autocomplete
                            options={cityOptions}
                            placeholder="Select City"
                            onSelect={setSelectedCity}
                            value={selectedCity}
                            className={styles.heroAutocomplete}
                        />

                        <div className={styles.heroToggleGroup}>
                            <button
                                className={`${styles.heroToggleBtn} ${selectedDevices.includes('phone') ? styles.active : ''}`}
                                onClick={() => toggleDevice('phone')}
                                id="toggle-phone"
                            >
                                Phone
                            </button>
                            <button
                                className={`${styles.heroToggleBtn} ${selectedDevices.includes('pc') ? styles.active : ''}`}
                                onClick={() => toggleDevice('pc')}
                                id="toggle-pc"
                            >
                                PC
                            </button>
                        </div>

                        <button
                            onClick={handleFindShops}
                            className={styles.btnFindShops}
                            id="btn-find-shops"
                        >
                            Find Shops
                        </button>
                    </div>
                    {error && <p className={styles.searchErrorMessage}>{error}</p>}
                </div>
            </div>
        </section>
    );
}
