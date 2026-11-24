import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import TaskCard from '../../../components/shop/ActiveTasks/TaskCard/TaskCard';
import styles from './ActiveTasks.module.css';

const filterOptions = ['All', 'Accepted', 'In Repair', 'Ready', 'Completed', 'Rejected'];

const ActiveTasks = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/repair_requests/');
            const data = res.data.results || res.data;
            
            if (!Array.isArray(data)) {
                setTasks([]);
                return;
            }

            // Exclude pending and rejected from main "Active Tasks" view if you want, 
            // but user said "all tasks" and filters include Accepted, In Repair, etc.
            const mapped = data.map(r => {
                let displayStatus = 'Accepted';
                if (r.status === 'accepted') displayStatus = 'Accepted';
                else if (r.status === 'in_repair') displayStatus = 'In Repair';
                else if (r.status === 'ready') displayStatus = 'Ready';
                else if (r.status === 'completed') displayStatus = 'Completed';
                else if (r.status === 'rejected') displayStatus = 'Rejected';
                else if (r.status === 'pending') displayStatus = 'Pending';

                return {
                    id: r.id,
                    customerName: r.client || 'User',
                    customerPhone: r.client_phone || '+213 00 00 00 00',
                    customerInitials: (r.client || 'U').substring(0, 2).toUpperCase(),
                    deviceName: (r.model_name || r.title).toUpperCase(),
                    description: r.description,
                    status: displayStatus,
                    rawStatus: r.status,
                    shopNote: r.shop_note
                };
            });
            setTasks(mapped);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = activeFilter === 'All'
        ? tasks
        : tasks.filter(t => t.status === activeFilter);

    const getStats = () => {
        return [
            { label: 'Accepted', count: tasks.filter(t => t.status === 'Accepted').length, color: '#8b5cf6' },
            { label: 'In Repair', count: tasks.filter(t => t.status === 'In Repair').length, color: '#06b6d4' },
            { label: 'Ready', count: tasks.filter(t => t.status === 'Ready').length, color: '#10b981' },
            { label: 'Completed', count: tasks.filter(t => t.status === 'Completed').length, color: '#64748b' },
        ];
    };

    const stats = getStats();

    return (
        <div className={styles.activeTasksPage}>
            <header className={styles.tasksHeader}>
                <h1>Active Repair Tasks</h1>
                <div className={styles.statsSummary}>
                    {stats.map(stat => (
                        <div key={stat.label} className={styles.statItem}>
                            <span className={styles.dot} style={{ backgroundColor: stat.color }}></span>
                            <span className={styles.count}>{stat.count}</span>
                            <span className={styles.label}>{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.filterBar}>
                    {filterOptions.map(filter => (
                        <button
                            key={filter}
                            className={`${styles.filterBtn} ${activeFilter === filter ? styles.active : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </header>

            <main className={styles.tasksGrid}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <p>Loading tasks...</p>
                    </div>
                ) : (
                    activeFilter === 'All' ? (
                        <>
                            <section className={styles.taskSection}>
                                <h2 className={styles.sectionTitle}>Active Repairs</h2>
                                <div className={styles.grid}>
                                    {tasks.filter(t => ['Accepted', 'In Repair', 'Ready', 'Pending'].includes(t.status)).length > 0 ? (
                                        tasks.filter(t => ['Accepted', 'In Repair', 'Ready', 'Pending'].includes(t.status)).map(task => (
                                            <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
                                        ))
                                    ) : (
                                        <p className={styles.emptyText}>No active repairs.</p>
                                    )}
                                </div>
                            </section>

                            <section className={styles.taskSection}>
                                <h2 className={`${styles.sectionTitle} ${styles.completedTitle}`}>Completed</h2>
                                <div className={styles.grid}>
                                    {tasks.filter(t => t.status === 'Completed').length > 0 ? (
                                        tasks.filter(t => t.status === 'Completed').map(task => (
                                            <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
                                        ))
                                    ) : (
                                        <p className={styles.emptyText}>No completed tasks.</p>
                                    )}
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className={styles.grid}>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>No tasks with status <strong>{activeFilter}</strong>.</p>
                                </div>
                            )}
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default ActiveTasks;
