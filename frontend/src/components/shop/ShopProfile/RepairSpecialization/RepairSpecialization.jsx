import React from 'react';
import styles from './RepairSpecialization.module.css';

const AVAILABLE_DEVICE_TYPES = [
    { value: 'Phone', label: 'Phone/Tablet', icon: 'fa-mobile-screen' },
    { value: 'Laptop', label: 'PC/Laptop', icon: 'fa-laptop' },
];

const RepairSpecialization = ({ deviceTypes, setDeviceTypes }) => {
    const toggleDeviceType = (type) => {
        if (deviceTypes.includes(type)) {
            setDeviceTypes(deviceTypes.filter(d => d !== type));
        } else {
            setDeviceTypes([...deviceTypes, type]);
        }
    };

    return (
        <div className={styles.repairSpecializationContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.icon}><i className="fa-solid fa-screwdriver-wrench"></i></span>
                <h3>Repair Specialization</h3>
            </div>

            <div className={styles.specializationContent}>
                <div className={styles.specGroup}>
                    <label>Device Types</label>
                    <div className={styles.tagContainer}>
                        {AVAILABLE_DEVICE_TYPES.map(type => (
                            <span
                                key={type.value}
                                className={`${styles.tag} ${deviceTypes.includes(type.value) ? styles.active : ''}`}
                                onClick={() => toggleDeviceType(type.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className={`fa-solid ${type.icon}`}></i>
                                {type.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepairSpecialization;
