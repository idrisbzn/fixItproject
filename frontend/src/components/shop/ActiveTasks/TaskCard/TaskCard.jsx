import React, { useState } from 'react';
import api from '../../../../api/axios';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onUpdate }) => {
    const [status, setStatus] = useState(task.status);
    const [note, setNote] = useState(task.shopNote || '');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async () => {
        try {
            setLoading(true);
            const statusMap = {
                'Accepted': 'accepted',
                'In Repair': 'in_repair',
                'Ready': 'ready',
                'Completed': 'completed',
                'Pending': 'pending',
                'Rejected': 'rejected'
            };

            await api.patch(`/api/repair_requests/${task.id}/`, {
                status: statusMap[status],
                shop_note: note
            });

            setSaved(true);
            if (onUpdate) onUpdate();
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error('Failed to update task:', err);
            alert('Failed to update task.');
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        'In Repair': '#06b6d4',
        'Ready': '#10b981',
        'Pending': '#f59e0b',
        'Completed': '#64748b',
        'Accepted': '#8b5cf6',
    };

    if (task.status === 'Completed') {
        return (
            <div className={`${styles.taskCard} ${styles.simpleTaskCard}`}>
                <div className={styles.taskCardHeader}>
                    <div className={styles.customerAvatar}>
                        {task.customerInitials}
                    </div>
                    <div className={styles.customerInfo}>
                        <h4>{task.customerName}</h4>
                        <span className={styles.deviceNameSimple}>{task.deviceName}</span>
                    </div>
                    <div className={styles.completedBadge}>
                        <i className="fa-solid fa-check-double"></i> Completed
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.taskCard}>
            <div className={styles.taskCardHeader}>
                <div className={styles.customerAvatar}>
                    {task.customerInitials}
                </div>
                <div className={styles.customerInfo}>
                    <h4>{task.customerName}</h4>
                    <span className={styles.customerPhone}>{task.customerPhone}</span>
                </div>
                <a
                    href={`https://wa.me/${task.customerPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                >
                    <span><i className="fa-brands fa-whatsapp"></i></span> WhatsApp
                </a>
            </div>

            <div className={styles.taskDetails}>
                <div className={styles.deviceInfo}>
                    <span className={styles.deviceName}>{task.deviceName}</span>
                    <span className={styles.taskId}>ID: #{task.id}</span>
                </div>
                <p className={styles.taskDescription}>{task.description}</p>
            </div>

            {/* Internal Notes logic removed to simplify and match request for "note for user" */}

            <div className={styles.taskActions}>
                <div className={styles.statusSelector}>
                    <label>CURRENT STATUS</label>
                    <div className={styles.selectWrapper}>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            style={{ borderColor: statusColors[status] || 'var(--border)' }}
                        >
                            <option value="Accepted">Accepted</option>
                            <option value="In Repair">In Repair</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div className={styles.noteInput}>
                    <label>NOTE FOR CUSTOMER (TECH NOTE)</label>
                    <input
                        type="text"
                        placeholder="Add a note for the customer..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateStatus()}
                    />
                </div>
            </div>

            <div className={styles.taskFooterBtns}>
                <button
                    className={`${styles.updateStatusBtn} ${saved ? styles.saved : ''}`}
                    onClick={handleUpdateStatus}
                    disabled={loading}
                >
                    {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : (saved ? '✓ Updated!' : 'Update Task')}
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
