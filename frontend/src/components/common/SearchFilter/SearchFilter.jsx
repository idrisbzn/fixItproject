import React, { useState, useMemo } from 'react';
import styles from './SearchFilter.module.css';
import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { ALGERIA_DATA } from '../../../constants/AlgeriaData';

const SearchFilter = ({
    deviceTypes,
    minRating,
    isOpen,
    onClose,
    initialWilaya,
    initialCity,
    onApply
}) => {
    const [selectedWilaya, setSelectedWilaya] = useState(initialWilaya || 'Oran');
    const [selectedCity, setSelectedCity] = useState(initialCity || '');
    const [tempDeviceTypes, setTempDeviceTypes] = useState(deviceTypes);
    const [tempMinRating, setTempMinRating] = useState(minRating);

    // Sync temp state with actual applied state whenever the sidebar opens
    React.useEffect(() => {
        if (isOpen) {
            setSelectedWilaya(initialWilaya || 'Oran');
            setSelectedCity(initialCity || '');
            setTempDeviceTypes(deviceTypes);
            setTempMinRating(minRating);
        }
    }, [isOpen, initialWilaya, initialCity, deviceTypes, minRating]);

    const wilayaOptions = useMemo(() => ALGERIA_DATA.map(w => w.name), []);

    const cityOptions = useMemo(() => {
        const wilaya = ALGERIA_DATA.find(w => w.name === selectedWilaya);
        return wilaya ? wilaya.cities : [];
    }, [selectedWilaya]);

    const handleWilayaSelect = (wilaya) => {
        setSelectedWilaya(wilaya);
        setSelectedCity('');
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
    };

    const handleDeviceToggle = (type) => {
        if (tempDeviceTypes.includes(type)) {
            setTempDeviceTypes(tempDeviceTypes.filter(t => t !== type));
        } else {
            setTempDeviceTypes([...tempDeviceTypes, type]);
        }
    };

    const handleApply = () => {
        // Update persistent search state in localStorage
        localStorage.setItem('search_wilaya', selectedWilaya);
        localStorage.setItem('search_city', selectedCity);
        localStorage.setItem('search_deviceType', tempDeviceTypes.join(','));
        
        // Pass all values to parent to trigger re-fetch
        onApply({
            wilaya: selectedWilaya,
            city: selectedCity,
            deviceTypes: tempDeviceTypes,
            minRating: tempMinRating
        });
        onClose();
    };

    return (
        <>
            {/* Overlay backdrop for mobile */}
            <div
                className={`${styles.filterOverlay} ${isOpen ? styles.active : ''}`}
                onClick={onClose}
            />

            <aside className={`${styles.searchSidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeaderRow}>
                    <div className={styles.sidebarTitle}>
                        <i className="fa-solid fa-sliders"></i>
                        Filter Results
                    </div>
                    <button className={styles.filterCloseBtn} onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className={styles.filterSection}>
                    <label>LOCATION</label>
                    <Autocomplete
                        options={wilayaOptions}
                        placeholder="Select Wilaya"
                        onSelect={handleWilayaSelect}
                        value={selectedWilaya}
                        className={styles.filterAutocomplete}
                    />
                    <Autocomplete
                        options={cityOptions}
                        placeholder="Select City"
                        onSelect={handleCitySelect}
                        value={selectedCity}
                        className={styles.filterAutocomplete}
                    />
                </div>

                <div className={styles.filterSection}>
                    <label>DEVICE TYPE</label>
                    <div className={styles.deviceToggle}>
                        <button
                            className={`${styles.deviceBtn} ${tempDeviceTypes.includes('phone') ? styles.active : ''}`}
                            onClick={() => handleDeviceToggle('phone')}
                        >
                            <i className="fa-solid fa-mobile-screen-button"></i>
                            Phone/Tablet
                        </button>
                        <button
                            className={`${styles.deviceBtn} ${tempDeviceTypes.includes('pc') ? styles.active : ''}`}
                            onClick={() => handleDeviceToggle('pc')}
                        >
                            <i className="fa-solid fa-laptop"></i>
                            PC/Laptop
                        </button>
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <label>MINIMUM RATING</label>
                    <div className={styles.ratingButtons}>
                        <button
                            className={`${styles.ratingBtn} ${tempMinRating === 0 ? styles.active : ''}`}
                            onClick={() => setTempMinRating(0)}
                        >
                            Any
                        </button>
                        <button
                            className={`${styles.ratingBtn} ${tempMinRating === 4.5 ? styles.active : ''}`}
                            onClick={() => setTempMinRating(4.5)}
                        >
                            4.5 <i className="fa-solid fa-star"></i>
                        </button>
                        <button
                            className={`${styles.ratingBtn} ${tempMinRating === 4.0 ? styles.active : ''}`}
                            onClick={() => setTempMinRating(4.0)}
                        >
                            4.0 <i className="fa-solid fa-star"></i>
                        </button>
                        <button
                            className={`${styles.ratingBtn} ${tempMinRating === 3.0 ? styles.active : ''}`}
                            onClick={() => setTempMinRating(3.0)}
                        >
                            3.0+
                        </button>
                        <button
                            className={`${styles.ratingBtn} ${tempMinRating === 2.0 ? styles.active : ''}`}
                            onClick={() => setTempMinRating(2.0)}
                        >
                            2.0+
                        </button>
                    </div>
                </div>

                <button className={styles.btnApply} onClick={handleApply}>Apply Filters</button>
            </aside>
        </>
    );
};

export default SearchFilter;
