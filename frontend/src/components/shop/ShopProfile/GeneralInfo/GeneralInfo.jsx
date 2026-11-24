import React, { useMemo } from 'react';
import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import { ALGERIA_DATA } from '../../../../constants/AlgeriaData';
import styles from './GeneralInfo.module.css';

const GeneralInfo = ({ formData, onChange }) => {
    const wilayaOptions = useMemo(() => ALGERIA_DATA.map(w => w.name), []);

    const cityOptions = useMemo(() => {
        const wilaya = ALGERIA_DATA.find(w => w.name === formData.wilaya);
        return wilaya ? wilaya.cities : [];
    }, [formData.wilaya]);

    const handleWilayaSelect = (wilaya) => {
        onChange('wilaya', wilaya);
        onChange('city', '');
    };

    return (
        <div className={styles.generalInfoContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.icon}><i className="fa-solid fa-circle-info"></i></span>
                <h3>General Information</h3>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Shop Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter shop name" 
                        value={formData.name}
                        onChange={(e) => onChange('name', e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Business Email</label>
                    <input 
                        type="email" 
                        placeholder="contact@example.com" 
                        value={formData.business_email}
                        onChange={(e) => onChange('business_email', e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input 
                        type="text" 
                        placeholder="+213 000 00 00 00" 
                        value={formData.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Google Maps Link</label>
                    <input 
                        type="text" 
                        placeholder="https://maps.app.goo.gl/..." 
                        value={formData.google_maps_link}
                        onChange={(e) => onChange('google_maps_link', e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Wilaya</label>
                    <Autocomplete
                        options={wilayaOptions}
                        placeholder="Select Wilaya"
                        onSelect={handleWilayaSelect}
                        value={formData.wilaya}
                        className={styles.autocomplete}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>City</label>
                    <Autocomplete
                        options={cityOptions}
                        placeholder="Select City"
                        onSelect={(city) => onChange('city', city)}
                        value={formData.city}
                        className={styles.autocomplete}
                    />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Shop Description</label>
                    <textarea
                        placeholder="Describe your shop, services, and expertise..."
                        value={formData.description}
                        onChange={(e) => onChange('description', e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default GeneralInfo;
