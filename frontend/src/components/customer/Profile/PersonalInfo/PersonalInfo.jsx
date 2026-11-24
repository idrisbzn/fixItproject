import React, { useMemo } from 'react';
import styles from './PersonalInfo.module.css';
import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import { ALGERIA_DATA } from '../../../../constants/AlgeriaData';

const PersonalInfo = ({ user, onChange }) => {
    const wilayaOptions = useMemo(() => ALGERIA_DATA.map(w => w.name), []);

    const cityOptions = useMemo(() => {
        const wilaya = ALGERIA_DATA.find(w => w.name.toLowerCase() === (user.wilaya || '').toLowerCase());
        return wilaya ? wilaya.cities : [];
    }, [user.wilaya]);

    const handleWilayaSelect = (wilaya) => {
        onChange('wilaya', wilaya);
        onChange('city', '');
    };

    return (
        <section className={styles.profileSection}>
            <h2 className={styles.sectionLabel}>YOUR INFORMATION</h2>
            <div className={styles.profileCard}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            value={user.name} 
                            onChange={(e) => onChange('name', e.target.value)} 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone</label>
                        <input 
                            type="text" 
                            value={user.phone} 
                            onChange={(e) => onChange('phone', e.target.value)} 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Wilaya</label>
                        <Autocomplete
                            options={wilayaOptions}
                            placeholder="Select Wilaya"
                            onSelect={handleWilayaSelect}
                            value={user.wilaya}
                            className={styles.profileAutocomplete}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>City</label>
                        <Autocomplete
                            options={cityOptions}
                            placeholder="Select City"
                            onSelect={(city) => onChange('city', city)}
                            value={user.city}
                            className={styles.profileAutocomplete}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};



export default PersonalInfo;
