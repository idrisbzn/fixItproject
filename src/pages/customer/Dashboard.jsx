import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/customer/Dashboard.css';

const Dashboard = () => {
    const [deviceType, setDeviceType] = useState('phone');

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1 className="dashboard-welcome">Good morning, Youcef 👋</h1>
                <p className="dashboard-subtitle">What do you need repaired today?</p>
            </header>

            <section className="dashboard-search-card">
                <h2 className="card-title">Find a Repair Shop</h2>
                <div className="search-grid">
                    <div className="search-field">
                        <label>WILAYA</label>
                        <select defaultValue="">
                            <option value="" disabled>Select Wilaya</option>
                            <option value="oran">Oran</option>
                            <option value="algiers">Algiers</option>
                        </select>
                    </div>
                    <div className="search-field">
                        <label>CITY</label>
                        <select defaultValue="">
                            <option value="" disabled>Select City</option>
                            <option value="bir-el-djir">Bir El Djir</option>
                            <option value="hydra">Hydra</option>
                        </select>
                    </div>
                    <div className="search-field">
                        <label>DEVICE TYPE</label>
                        <div className="device-toggle-group">
                            <button
                                className={`toggle-btn ${deviceType === 'phone' ? 'active' : ''}`}
                                onClick={() => setDeviceType('phone')}
                            >
                                Phone
                            </button>
                            <button
                                className={`toggle-btn ${deviceType === 'pc' ? 'active' : ''}`}
                                onClick={() => setDeviceType('pc')}
                            >
                                PC
                            </button>
                        </div>
                    </div>
                </div>
                <Link to="/search" className="btn-find-shops">
                    Find Shops <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </section>

            <div className="stats-grid">
                <Link to="/devices" className="stat-card">
                    <div className="stat-icon-wrapper blue">
                        <i className="fa-solid fa-wrench"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">2</span>
                        <span className="stat-label">Active Repairs</span>
                    </div>
                </Link>
                <Link to="/saved" className="stat-card">
                    <div className="stat-icon-wrapper green">
                        <i className="fa-solid fa-bookmark"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">5</span>
                        <span className="stat-label">Saved Shops</span>
                    </div>
                </Link>
                <div className="stat-card">
                    <div className="stat-icon-wrapper amber">
                        <i className="fa-solid fa-comment-dots"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">3</span>
                        <span className="stat-label">Reviews Given</span>
                    </div>
                </div>
            </div>

            <section className="recent-repairs">
                <div className="section-header">
                    <h2 className="section-title">Recent Repairs</h2>
                    <Link to="/devices" className="btn-view-all">View All <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
                <div className="repair-card-simple">
                    <div className="repair-icon">
                        <i className="fa-solid fa-mobile-screen"></i>
                    </div>
                    <div className="repair-details">
                        <h3 className="device-name">Samsung Galaxy S22</h3>
                        <p className="repair-meta">Ticket #FX-9021 • TechFix Center</p>
                    </div>
                    <div className="repair-status-badge in-repair">
                        STATUS: IN REPAIR
                    </div>
                    <div className="repair-progress-bar">
                        <div className="progress-step active">
                            <div className="step-dot"></div>
                            <span>REQUESTED</span>
                        </div>
                        <div className="progress-step active">
                            <div className="step-dot"></div>
                            <span>ACCEPTED</span>
                        </div>
                        <div className="progress-step active current">
                            <div className="step-dot"></div>
                            <span>IN REPAIR</span>
                        </div>
                        <div className="progress-step">
                            <div className="step-dot"></div>
                            <span>READY</span>
                        </div>
                        <div className="progress-step">
                            <div className="step-dot"></div>
                            <span>DONE</span>
                        </div>
                        <div className="progress-line">
                            <div className="progress-line-fill" style={{ width: '50%' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="quick-links-grid">
                <Link to="/devices" className="quick-link-card">
                    <div className="quick-link-icon blue">
                        <i className="fa-solid fa-mobile-screen-button"></i>
                    </div>
                    <div className="quick-link-content">
                        <h3>My Devices</h3>
                        <p>Manage your hardware list</p>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                </Link>
                <Link to="/saved" className="quick-link-card">
                    <div className="quick-link-icon green">
                        <i className="fa-solid fa-shop"></i>
                    </div>
                    <div className="quick-link-content">
                        <h3>Saved Shops</h3>
                        <p>Access your favorite technicians</p>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                </Link>
                <Link to="/profile" className="quick-link-card">
                    <div className="quick-link-icon amber">
                        <i className="fa-solid fa-user-gear"></i>
                    </div>
                    <div className="quick-link-content">
                        <h3>My Profile</h3>
                        <p>Update your personal details</p>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
