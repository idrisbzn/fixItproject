import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logoSrc from '../../../../assets/logo.svg';
import styles from './ShopNavbar.module.css';

const ShopNavbar = () => {
    return (
        <nav className={styles.shopNavbar}>
            <div className={styles.shopNavbarInner}>
                <Link to="/shop/requests" className={styles.shopNavbarLogo}>
                    <img src={logoSrc} alt="FixIt logo" />
                </Link>

                <div className={styles.shopNavbarLinks}>
                    <NavLink
                        to="/shop/requests"
                        className={({ isActive }) => `${styles.shopNavItem} ${isActive ? styles.active : ''}`}
                        title="Service Requests"
                    >
                        <i className="fa-solid fa-clipboard-list"></i>
                    </NavLink>
                    <NavLink
                        to="/shop/tasks"
                        className={({ isActive }) => `${styles.shopNavItem} ${isActive ? styles.active : ''}`}
                        title="Active Tasks"
                    >
                        <i className="fa-solid fa-list-check"></i>
                    </NavLink>
                    <NavLink
                        to="/shop/reviews"
                        className={({ isActive }) => `${styles.shopNavItem} ${isActive ? styles.active : ''}`}
                        title="Customer Reviews"
                    >
                        <i className="fa-solid fa-star"></i>
                    </NavLink>
                    <NavLink
                        to="/shop/profile"
                        className={({ isActive }) => `${styles.shopNavItem} ${isActive ? styles.active : ''}`}
                        title="Shop Profile"
                    >
                        <i className="fa-solid fa-shop"></i>
                    </NavLink>
                    <NavLink
                        to="/shop/settings"
                        className={({ isActive }) => `${styles.shopNavItem} ${isActive ? styles.active : ''}`}
                        title="Settings"
                    >
                        <i className="fa-solid fa-gear"></i>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default ShopNavbar;
