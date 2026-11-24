import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import styles from './MyDevices.module.css';
import DeviceTabs from '../../../components/customer/MyDevices/DeviceTabs/DeviceTabs';
import PendingRepairCard from '../../../components/customer/MyDevices/PendingRepairCard/PendingRepairCard';
import ActiveRepairCard from '../../../components/customer/MyDevices/ActiveRepairCard/ActiveRepairCard';
import CompletedRepairCard from '../../../components/customer/MyDevices/CompletedRepairCard/CompletedRepairCard';

const MyDevices = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, requestId: null });

    const fetchRepairs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/repair_requests/');
            const data = res.data.results || res.data;
            if (!Array.isArray(data)) {
                setRepairs([]);
                return;
            }
            const mapped = data.map(r => {
                let statusText = 'Pending';
                let progress = 0;
                let status = r.status;

                if (r.status === 'pending') {
                    statusText = 'Awaiting Response';
                    progress = 0;
                } else if (r.status === 'accepted') {
                    statusText = 'Accepted';
                    progress = 25;
                    status = 'active'; // Use active for card styling
                } else if (r.status === 'in_repair') {
                    statusText = 'In Repair';
                    progress = 50;
                    status = 'active';
                } else if (r.status === 'ready') {
                    statusText = 'Ready for Pickup';
                    progress = 75;
                    status = 'ready';
                } else if (r.status === 'completed') {
                    statusText = 'DONE';
                    progress = 100;
                    status = 'completed';
                }

                return {
                    id: r.id,
                    orderId: `#FX-${r.id}`,
                    device: r.model_name || r.title,
                    shopId: r.shop,
                    shopName: r.shop_name,
                    status: status,
                    statusText: statusText,
                    requestedAt: new Date(r.created_at).toLocaleDateString(),
                    finishedAt: r.status === 'completed' ? new Date(r.updated_at || r.created_at).toLocaleDateString() : null,
                    progress: progress,
                    note: r.description,
                    techNote: r.shop_note,
                    type: r.device_type
                };
            });
            setRepairs(mapped);
        } catch (err) {
            console.error('Failed to fetch repairs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepairs();
    }, []);

    const handleCancelClick = (id) => {
        setModalConfig({ isOpen: true, requestId: id });
    };

    const confirmCancel = async () => {
        const { requestId } = modalConfig;
        if (!requestId) return;

        try {
            await api.delete(`/api/repair_requests/${requestId}/`);
            setRepairs(prev => prev.filter(r => r.id !== requestId));
            setModalConfig({ isOpen: false, requestId: null });
        } catch (err) {
            console.error('Failed to cancel request:', err);
            // Optionally show an error modal here too, but for now we close
            setModalConfig({ isOpen: false, requestId: null });
        }
    };

    const closeIdModal = () => {
        setModalConfig({ isOpen: false, requestId: null });
    };

    const counts = {
        all: repairs.length,
        pending: repairs.filter(r => r.status === 'pending').length,
        active: repairs.filter(r => r.status === 'active' || r.status === 'ready').length,
        completed: repairs.filter(r => r.status === 'completed').length
    };

    return (
        <div className={styles.devicesPage}>
            <header className={styles.devicesHeader}>
                <div className={styles.headerTitleRow}>
                    <h1 className={styles.devicesTitle}>My Devices</h1>
                    <Link to="/reviews" className={styles.btnMyReviews}>
                        <i className="fa-solid fa-star"></i> My Reviews
                    </Link>
                </div>
                <p className={styles.devicesSubtitle}>Track all your repair requests in one place</p>
            </header>

            <DeviceTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                counts={counts} 
            />

            <div className={styles.repairsList}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <p>Loading your devices...</p>
                    </div>
                ) : (
                    <>
                        {(activeTab === 'pending' || activeTab === 'all') && (
                            <section className={styles.repairGroup}>
                                <h2 className={`${styles.groupTitle} ${styles.pending}`}>Pending Requests</h2>
                                {repairs.filter(r => r.status === 'pending').length > 0 ? (
                                    repairs.filter(r => r.status === 'pending').map(repair => (
                                        <PendingRepairCard 
                                            key={repair.id} 
                                            repair={repair} 
                                            onCancel={handleCancelClick}
                                        />
                                    ))
                                ) : (
                                    <p className={styles.emptyGroup}>No pending requests.</p>
                                )}
                            </section>
                        )}

                        {(activeTab === 'active' || activeTab === 'all') && (
                            <section className={styles.repairGroup}>
                                <h2 className={`${styles.groupTitle} ${styles.active}`}>Active Repairs</h2>
                                {repairs.filter(r => r.status === 'active' || r.status === 'ready').length > 0 ? (
                                    repairs.filter(r => r.status === 'active' || r.status === 'ready').map(repair => (
                                        <ActiveRepairCard key={repair.id} repair={repair} />
                                    ))
                                ) : (
                                    <p className={styles.emptyGroup}>No active repairs.</p>
                                )}
                            </section>
                        )}

                        {(activeTab === 'completed' || activeTab === 'all') && (
                            <section className={styles.repairGroup}>
                                <div className={styles.groupHeader}>
                                    <h2 className={`${styles.groupTitle} ${styles.completed}`}>Completed</h2>
                                    <i className="fa-solid fa-chevron-down"></i>
                                </div>
                                {repairs.filter(r => r.status === 'completed').length > 0 ? (
                                    repairs.filter(r => r.status === 'completed').map(repair => (
                                        <CompletedRepairCard key={repair.id} repair={repair} />
                                    ))
                                ) : (
                                    <p className={styles.emptyGroup}>No completed repairs yet.</p>
                                )}
                            </section>
                        )}
                    </>
                )}
            </div>
            {/* Custom Confirmation Modal */}
            {modalConfig.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h3>Cancel Request?</h3>
                        <p>Are you sure you want to cancel this repair request? This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={closeIdModal}>No, Keep it</button>
                            <button className={styles.confirmBtn} onClick={confirmCancel}>Yes, Cancel Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDevices;
