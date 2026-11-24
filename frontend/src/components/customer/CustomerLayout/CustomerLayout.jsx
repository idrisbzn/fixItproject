import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../CustomerNavBar/CustomerNavbar';
import styles from './CustomerLayout.module.css';

const CustomerLayout = () => {
    return (
        <div className={styles.customerLayout}>
            <CustomerNavbar />
            <main className={styles.customerMain}>
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
