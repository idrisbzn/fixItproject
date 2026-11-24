import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import RequestCard from '../../../components/shop/ServiceRequests/RequestCard/RequestCard';
import styles from './ServiceRequests.module.css';

const ServiceRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, requestId: null, actionType: null });
    const [viewingImage, setViewingImage] = useState(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/repair_requests/');
            const data = res.data.results || res.data;
            // Backend filters based on role, so we just filter for pending here to be sure
            setRequests(Array.isArray(data) ? data.filter(r => r.status === 'pending') : []);
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleActionClick = (id, type) => {
        setModalConfig({ isOpen: true, requestId: id, actionType: type });
    };

    const confirmAction = async () => {
        if (modalConfig.requestId && modalConfig.actionType) {
            try {
                const newStatus = modalConfig.actionType === 'accept' ? 'accepted' : 'rejected';
                await api.patch(`/api/repair_requests/${modalConfig.requestId}/`, { status: newStatus });
                setRequests(prev => prev.filter(r => r.id !== modalConfig.requestId));
            } catch (err) {
                console.error('Failed to update request status:', err);
                alert('Failed to update request. Please try again.');
            }
        }
        closeModal();
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, requestId: null, actionType: null });
    };

    return (
        <div className={styles.serviceRequestsPage}>
            <header className={styles.requestsHeader}>
                <h1>Service Requests</h1>
                <p>Review and respond to incoming repair requests from customers.</p>
            </header>

            <main className={styles.requestsList}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <p>Fetching requests...</p>
                    </div>
                ) : requests.length > 0 ? (
                    requests.map(request => (
                        <RequestCard
                            key={request.id}
                            request={{
                                ...request,
                                userName: request.client || 'User', // Backend returns username as client
                                time: new Date(request.created_at).toLocaleString(),
                                description: request.description
                            }}
                            onAccept={(id) => handleActionClick(id, 'accept')}
                            onDecline={(id) => handleActionClick(id, 'decline')}
                            onViewImage={(url) => setViewingImage(url)}
                        />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <i class="fa-solid fa-bell"></i>
                        </div>
                        <h3>All caught up!</h3>
                        <p>New customer requests will appear here when they come in.</p>
                    </div>
                )}
            </main>

            {modalConfig.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Are you sure?</h3>
                        <p>
                            Do you really want to {modalConfig.actionType === 'accept' ? 'accept' : 'decline'} this service request?
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                            <button
                                className={modalConfig.actionType === 'accept' ? styles.confirmAcceptBtn : styles.confirmDeclineBtn}
                                onClick={confirmAction}
                            >
                                Yes, {modalConfig.actionType}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewingImage && (
                <div className={styles.imageModalOverlay} onClick={() => setViewingImage(null)}>
                    <button className={styles.imageModalBackBtn} onClick={() => setViewingImage(null)}>
                        <i className="fa-solid fa-arrow-left"></i> Back to Requests
                    </button>
                    <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
                        <img src={viewingImage} alt="Repair Request Full View" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceRequests;
