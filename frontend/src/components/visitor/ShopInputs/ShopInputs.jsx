import React, { useMemo } from 'react';
import styles from './ShopInputs.module.css';
import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { ALGERIA_DATA } from '../../../constants/AlgeriaData';

const ShopInputs = ({ 
    formData, 
    setFormData, 
    emailError 
}) => {
    const wilayaOptions = useMemo(() => ALGERIA_DATA.map(w => w.name), []);

    const cityOptions = useMemo(() => {
        const wilaya = ALGERIA_DATA.find(w => w.name === formData.wilaya);
        return wilaya ? wilaya.cities : [];
    }, [formData.wilaya]);

    const handleWilayaSelect = (wilaya) => {
        setFormData(prev => ({
            ...prev,
            wilaya,
            city: ''
        }));
    };

    const handleCitySelect = (city) => {
        setFormData(prev => ({
            ...prev,
            city
        }));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleDeviceToggle = (device) => {
        setFormData(prev => {
            const currentDevices = prev.devicesRepaired || [];
            if (currentDevices.includes(device)) {
                return { ...prev, devicesRepaired: currentDevices.filter(d => d !== device) };
            } else {
                return { ...prev, devicesRepaired: [...currentDevices, device] };
            }
        });
    };

    return (
        <div className={styles.shopInputs}>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="shopName">Shop Name</label>
                    <input 
                        type="text" 
                        id="shopName" 
                        placeholder="Electronics Hub" 
                        value={formData.shopName}
                        onChange={handleInputChange}
                        required 
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="managerName">Manager Full Name</label>
                    <input 
                        type="text" 
                        id="managerName" 
                        placeholder="John Doe" 
                        value={formData.managerName}
                        onChange={handleInputChange}
                        required 
                    />
                </div>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email">Business Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="contact@shop.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={emailError ? styles.error : ''}
                    required
                />
                {emailError && (
                    <div className={styles.errorMessage}>
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {emailError}
                    </div>
                )}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input 
                    type="tel" 
                    id="phone" 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                />
            </div>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="wilaya">Wilaya</label>
                    <Autocomplete
                        options={wilayaOptions}
                        placeholder="Select Wilaya"
                        onSelect={handleWilayaSelect}
                        value={formData.wilaya}
                        className={styles.shopAutocomplete}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <Autocomplete
                        options={cityOptions}
                        placeholder="Select City"
                        onSelect={handleCitySelect}
                        value={formData.city}
                        className={styles.shopAutocomplete}
                    />
                </div>
            </div>
            
            <div className={styles.formGroup}>
                <label>What do you repair?</label>
                <div className={styles.deviceToggleGroup}>
                    <button
                        type="button"
                        className={`${styles.deviceToggleBtn} ${(formData.devicesRepaired || []).includes('phone') ? styles.active : ''}`}
                        onClick={() => handleDeviceToggle('phone')}
                    >
                        <i className="fa-solid fa-mobile-screen-button"></i>
                        Phone/Tablet
                    </button>
                    <button
                        type="button"
                        className={`${styles.deviceToggleBtn} ${(formData.devicesRepaired || []).includes('pc') ? styles.active : ''}`}
                        onClick={() => handleDeviceToggle('pc')}
                    >
                        <i className="fa-solid fa-laptop"></i>
                        PC/Laptop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopInputs;

