import React, { useState } from 'react';
import '../../styles/pages/customer/MyDevices.css';

const MyDevices = () => {
    const [activeTab, setActiveTab] = useState('active');

    const repairs = [
        {
            id: 'FX-9021',
            device: 'iPhone 13 Pro',
            status: 'pending',
            statusText: 'Awaiting Response',
            requestedAt: '2h ago',
            note: 'Screen cracked after dropping on concrete. FaceID still works.',
            type: 'phone'
        },
        {
            id: 'FX-9022',
            device: 'Dell Inspiron 15',
            status: 'active',
            statusText: 'In Repair',
            orderId: '#FX-9021',
            progress: 50,
            techNote: 'Replacement hinges have been installed. We are currently performing stress tests to ensure structural integrity.',
            type: 'pc'
        },
        {
            id: 'FX-8842',
            device: 'Huawei P30 Pro',
            status: 'ready',
            statusText: 'Ready for Pickup',
            orderId: '#FX-8842',
            progress: 75,
            type: 'phone'
        },
        {
            id: 'FX-8800',
            device: 'Samsung Galaxy S22',
            status: 'completed',
            statusText: 'DONE',
            finishedAt: 'Aug 12, 2023',
            type: 'phone'
        }
    ];

    const filteredRepairs = activeTab === 'all'
        ? repairs
        : repairs.filter(r => {
            if (activeTab === 'pending') return r.status === 'pending';
            if (activeTab === 'active') return r.status === 'active' || r.status === 'ready';
            if (activeTab === 'completed') return r.status === 'completed';
            return true;
        });

    return (
        <div className="devices-page">
            <header className="devices-header">
                <h1 className="devices-title">My Devices</h1>
                <p className="devices-subtitle">Track all your repair requests in one place</p>
            </header>

            <div className="tabs-container">
                <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All (5)</button>
                <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending (1)</button>
                <button className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active (2)</button>
                <button className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>Completed (2)</button>
            </div>

            <div className="repairs-list">
                {activeTab === 'pending' || activeTab === 'all' ? (
                    <section className="repair-group">
                        <h2 className="group-title pending">Pending Requests</h2>
                        {repairs.filter(r => r.status === 'pending').map(repair => (
                            <div key={repair.id} className="repair-card pending">
                                <div className="repair-card-header">
                                    <div className="device-info">
                                        <h3>{repair.device}</h3>
                                        <span className="status-badge pending">{repair.statusText}</span>
                                    </div>
                                    <span className="time-ago">Requested {repair.requestedAt}</span>
                                </div>
                                <p className="repair-note">"{repair.note}"</p>
                                <div className="repair-actions">
                                    <button className="btn-cancel">Cancel Request</button>
                                    <button className="btn-details">View Details</button>
                                </div>
                            </div>
                        ))}
                    </section>
                ) : null}

                {activeTab === 'active' || activeTab === 'all' ? (
                    <section className="repair-group">
                        <h2 className="group-title active">Active Repairs</h2>
                        {repairs.filter(r => r.status === 'active' || r.status === 'ready').map(repair => (
                            <div key={repair.id} className={`repair-card active ${repair.status}`}>
                                <div className="repair-card-header">
                                    <div className="device-info">
                                        <h3>{repair.device}</h3>
                                        <span className={`status-badge ${repair.status}`}>{repair.statusText}</span>
                                    </div>
                                    <span className="order-id">Order {repair.orderId}</span>
                                </div>

                                <div className="repair-stepper">
                                    <div className={`step ${repair.progress >= 0 ? 'completed' : ''}`}>
                                        <div className="step-icon"><i className="fa-solid fa-check"></i></div>
                                        <span>REQUESTED</span>
                                    </div>
                                    <div className={`step ${repair.progress >= 25 ? 'completed' : ''}`}>
                                        <div className="step-icon"><i className="fa-solid fa-check"></i></div>
                                        <span>ACCEPTED</span>
                                    </div>
                                    <div className={`step ${repair.progress >= 50 ? 'completed' : ''} ${repair.status === 'active' ? 'current' : ''}`}>
                                        <div className="step-icon">
                                            {repair.status === 'active' ? <i className="fa-solid fa-pen-to-square"></i> : <i className="fa-solid fa-check"></i>}
                                        </div>
                                        <span>IN REPAIR</span>
                                    </div>
                                    <div className={`step ${repair.progress >= 75 ? 'completed' : ''} ${repair.status === 'ready' ? 'current' : ''}`}>
                                        <div className="step-icon">
                                            {repair.status === 'ready' ? <i className="fa-solid fa-box-open"></i> : <i className="fa-solid fa-circle"></i>}
                                        </div>
                                        <span>READY</span>
                                    </div>
                                    <div className={`step ${repair.progress >= 100 ? 'completed' : ''}`}>
                                        <div className="step-icon"><i className="fa-solid fa-circle"></i></div>
                                        <span>DONE</span>
                                    </div>
                                    <div className="stepper-line">
                                        <div className="stepper-line-fill" style={{ width: `${repair.progress}%` }}></div>
                                    </div>
                                </div>

                                {repair.techNote && (
                                    <div className="tech-note-box">
                                        <i className="fa-solid fa-comment-dots"></i>
                                        <div className="tech-note-content">
                                            <label>TECH NOTE FROM 'ELITE REPAIRS'</label>
                                            <p>{repair.techNote}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                ) : null}

                {activeTab === 'completed' || activeTab === 'all' ? (
                    <section className="repair-group">
                        <div className="group-header">
                            <h2 className="group-title completed">Completed</h2>
                            <i className="fa-solid fa-chevron-down"></i>
                        </div>
                        {repairs.filter(r => r.status === 'completed').map(repair => (
                            <div key={repair.id} className="repair-card completed-simple">
                                <div className="device-icon-small">
                                    <i className="fa-solid fa-mobile-screen"></i>
                                </div>
                                <div className="device-details">
                                    <h3>{repair.device}</h3>
                                    <div className="status-row">
                                        <span className="status-tag">DONE</span>
                                        <span className="finish-date">Finished {repair.finishedAt}</span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-review">Leave a Review</button>
                                    <button className="btn-details-small">View Details</button>
                                </div>
                            </div>
                        ))}
                    </section>
                ) : null}
            </div>
        </div>
    );
};

export default MyDevices;
