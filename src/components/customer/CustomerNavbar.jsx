import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logoSrc from '../../assets/logo.svg';
import './CustomerNavbar.css';

const CustomerNavbar = () => {
    return (
        <nav className="customer-navbar">
            <div className="customer-navbar-inner">
                <Link to="/dashboard" className="customer-navbar-logo">
                    <div className="customer-navbar-logo">
                        <img src={logoSrc} alt="FixIt" />
                    </div>
                </Link>

                <div className="customer-navbar-links">
                    <NavLink to="/dashboard" className={({ isActive }) => `customer-nav-item ${isActive ? 'active' : ''}`}>
                        <i className="fa-solid fa-house"></i>
                    </NavLink>
                    <NavLink to="/devices" className={({ isActive }) => `customer-nav-item ${isActive ? 'active' : ''}`}>
                        <i className="fa-solid fa-mobile-screen-button"></i>
                    </NavLink>
                    <NavLink to="/saved" className={({ isActive }) => `customer-nav-item ${isActive ? 'active' : ''}`}>
                        <i className="fa-solid fa-bookmark"></i>
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `customer-nav-item ${isActive ? 'active' : ''}`}>
                        <i className="fa-solid fa-user"></i>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default CustomerNavbar;
