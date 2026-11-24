import React, { useMemo } from 'react';
import styles from './CustomerInputs.module.css';
import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { ALGERIA_DATA } from '../../../constants/AlgeriaData';

const CustomerInputs = ({ 
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

    return (
        <div className={styles.customerInputs}>
            <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input 
                    type="text" 
                    id="fullName" 
                    placeholder="John Doe" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required 
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="name@company.com"
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
                    <label>Wilaya (Optional)</label>
                    <Autocomplete
                        options={wilayaOptions}
                        placeholder="Select Wilaya"
                        onSelect={handleWilayaSelect}
                        value={formData.wilaya}
                        className={styles.authAutocomplete}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>City (Optional)</label>
                    <Autocomplete
                        options={cityOptions}
                        placeholder="Select City"
                        onSelect={handleCitySelect}
                        value={formData.city}
                        className={styles.authAutocomplete}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerInputs;

