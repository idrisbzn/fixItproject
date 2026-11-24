import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import logoSrc from '../../../assets/logo.svg';
import styles from './CustomerNavbar.module.css';

const CustomerNavbar = () => {
    const location = useLocation();
    const homePath = localStorage.getItem('last_home') || '/dashboard';
    const isHomeActive = location.pathname === '/dashboard' || location.pathname === '/search';

    return (
        <nav className={styles.customerNavbar}>
            <div className={styles.customerNavbarInner}>
                <Link to={homePath} className={styles.customerNavbarLogo}>
                    <div className={styles.customerNavbarLogo}>
                        <img src={logoSrc} alt="FixIt" />
                    </div>
                </Link>

                <div className={styles.customerNavbarLinks}>
                    <NavLink 
                        to={homePath} 
                        className={`${styles.customerNavItem} ${isHomeActive ? styles.active : ''}`}
                    >
                        <i className="fa-solid fa-house"></i>
                    </NavLink>
                    <NavLink to="/devices" className={({ isActive }) => `${styles.customerNavItem} ${isActive ? styles.active : ''}`}>
                        <i className="fa-solid fa-mobile-screen-button"></i>
                    </NavLink>
                    <NavLink to="/saved" className={({ isActive }) => `${styles.customerNavItem} ${isActive ? styles.active : ''}`}>
                        <i className="fa-solid fa-bookmark"></i>
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `${styles.customerNavItem} ${isActive ? styles.active : ''}`}>
                        <i className="fa-solid fa-user"></i>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default CustomerNavbar;
