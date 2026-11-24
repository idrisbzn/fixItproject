import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StatCards.module.css';

const StatCards = ({ stats = [] }) => {
    const defaultStats = [
        {
            label: 'Active Repairs',
            value: '0',
            icon: 'fa-wrench',
            color: 'blue',
            link: '/devices'
        },
        {
            label: 'Saved Shops',
            value: '0',
            icon: 'fa-bookmark',
            color: 'green',
            link: '/saved'
        },
        {
            label: 'Reviews Given',
            value: '0',
            icon: 'fa-comment-dots',
            color: 'amber',
            link: '/reviews'
        }
    ];

    const displayStats = stats.length > 0 ? stats : defaultStats;

    return (
        <div className={styles.statsGrid}>
            {displayStats.map((stat, index) => {
                const CardContent = (
                    <>
                        <div className={`${styles.statIconWrapper} ${styles[stat.color]}`}>
                            <i className={`fa-solid ${stat.icon}`}></i>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{stat.value}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    </>
                );

                if (stat.link) {
                    return (
                        <Link key={index} to={stat.link} className={styles.statCard}>
                            {CardContent}
                        </Link>
                    );
                }

                return (
                    <div key={index} className={styles.statCard}>
                        {CardContent}
                    </div>
                );
            })}
        </div>
    );
};

export default StatCards;
