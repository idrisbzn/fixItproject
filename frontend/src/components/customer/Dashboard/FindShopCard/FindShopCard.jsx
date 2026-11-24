import React from 'react';
import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import styles from './FindShopCard.module.css';

const FindShopCard = ({ 
    wilayaOptions, 
    cityOptions, 
    selectedWilaya, 
    selectedCity, 
    deviceTypes, 
    onWilayaSelect, 
    onCitySelect, 
    onDeviceTypesChange, 
    onFindShops, 
    error 
}) => {
    const handleDeviceToggle = (type) => {
        if (deviceTypes.includes(type)) {
            onDeviceTypesChange(deviceTypes.filter(t => t !== type));
        } else {
            onDeviceTypesChange([...deviceTypes, type]);
        }
    };
    return (
        <section className={styles.dashboardSearchCard}>
            <h2 className={styles.cardTitle}>Find a Repair Shop</h2>
            <div className={styles.searchGrid}>
                <div className={styles.searchField}>
                    <label>WILAYA</label>
                    <Autocomplete
                        options={wilayaOptions}
                        placeholder="Select Wilaya"
                        onSelect={onWilayaSelect}
                        value={selectedWilaya}
                        className={`${styles.dashboardAutocomplete} ${error ? styles.error : ''}`}
                    />
                </div>
                <div className={styles.searchField}>
                    <label>CITY</label>
                    <Autocomplete
                        options={cityOptions}
                        placeholder="Select City"
                        onSelect={onCitySelect}
                        value={selectedCity}
                        className={styles.dashboardAutocomplete}
                    />
                </div>
                <div className={styles.searchField}>
                    <label>DEVICE TYPE</label>
                    <div className={styles.deviceToggleGroup}>
                        <button
                            type="button"
                            className={`${styles.toggleBtn} ${deviceTypes.includes('phone') ? styles.active : ''}`}
                            onClick={() => handleDeviceToggle('phone')}
                        >
                            Phone
                        </button>
                        <button
                            type="button"
                            className={`${styles.toggleBtn} ${deviceTypes.includes('pc') ? styles.active : ''}`}
                            onClick={() => handleDeviceToggle('pc')}
                        >
                            PC
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.dashboardSearchFooter}>
                {error && <p className={styles.searchErrorMessage}> {error} </p>}
                <button onClick={onFindShops} className={styles.btnFindShops}>
                    Find Shops <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </section>
    );
};

export default FindShopCard;
