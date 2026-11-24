import React from 'react';
import { Outlet } from 'react-router-dom';
import ShopNavbar from '../ShopNavbar/ShopNavbar';
import styles from './ShopLayout.module.css';

const ShopLayout = () => {
    return (
        <div className={styles.shopLayout}>
            <ShopNavbar />
            <main className={styles.shopMain}>
                <Outlet />
            </main>
        </div>
    );
};

export default ShopLayout;
