import styles from './Stats.module.css';

const stats = [
    { number: '120+', label: 'Verified Shops' },
    { number: '3,400+', label: 'Repairs Completed' },
    { number: '58', label: 'Wilayas Covered' },
];

export default function StatsSection() {
    return (
        <section className={styles.statsSection} id="stats">
            <div className={styles.statsGrid}>
                {stats.map((s, i) => (
                    <div className={styles.statCard} key={i}>
                        <div className={styles.statNumber}>{s.number}</div>
                        <div className={styles.statLabel}>{s.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
