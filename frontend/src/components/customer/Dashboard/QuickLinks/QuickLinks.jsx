import React from 'react';
import { Link } from 'react-router-dom';
import styles from './QuickLinks.module.css';

const QuickLinks = () => {
    const links = [
        {
            title: 'My Devices',
            description: 'Manage your hardware list',
            icon: 'fa-mobile-screen-button',
            color: 'blue',
            to: '/devices'
        },
        {
            title: 'Saved Shops',
            description: 'Access your favorite technicians',
            icon: 'fa-shop',
            color: 'green',
            to: '/saved'
        },
        {
            title: 'My Profile',
            description: 'Update your personal details',
            icon: 'fa-user-gear',
            color: 'amber',
            to: '/profile'
        }
    ];

    return (
        <div className={styles.quickLinksGrid}>
            {links.map((link, index) => (
                <Link key={index} to={link.to} className={styles.quickLinkCard}>
                    <div className={`${styles.quickLinkIcon} ${styles[link.color]}`}>
                        <i className={`fa-solid ${link.icon}`}></i>
                    </div>
                    <div className={styles.quickLinkContent}>
                        <h3>{link.title}</h3>
                        <p>{link.description}</p>
                    </div>
                    <i className={`${styles.arrow} fa-solid fa-chevron-right`}></i>
                </Link>
            ))}
        </div>
    );
};

export default QuickLinks;
