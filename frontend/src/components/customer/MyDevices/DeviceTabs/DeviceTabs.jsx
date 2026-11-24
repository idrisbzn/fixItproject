import React from 'react';
import styles from './DeviceTabs.module.css';

const DeviceTabs = ({ activeTab, onTabChange, counts }) => {
    return (
        <div className={styles.tabsContainer}>
            <button 
                className={`${styles.tabBtn} ${activeTab === 'all' ? styles.active : ''}`} 
                onClick={() => onTabChange('all')}
            >
                All ({counts.all})
            </button>
            <button 
                className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.active : ''}`} 
                onClick={() => onTabChange('pending')}
            >
                Pending ({counts.pending})
            </button>
            <button 
                className={`${styles.tabBtn} ${activeTab === 'active' ? styles.active : ''}`} 
                onClick={() => onTabChange('active')}
            >
                Active ({counts.active})
            </button>
            <button 
                className={`${styles.tabBtn} ${activeTab === 'completed' ? styles.active : ''}`} 
                onClick={() => onTabChange('completed')}
            >
                Completed ({counts.completed})
            </button>
        </div>
    );
};

export default DeviceTabs;
