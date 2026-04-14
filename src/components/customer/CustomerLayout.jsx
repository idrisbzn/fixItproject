import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar';
import '../../styles/base.css';
import '../../styles/components/customer/CustomerLayout.css';

const CustomerLayout = () => {
    return (
        <div className="customer-layout">
            <CustomerNavbar />
            <main className="customer-main">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
