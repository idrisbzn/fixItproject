const stats = [
    { number: '120+', label: 'Verified Shops' },
    { number: '3,400+', label: 'Repairs Completed' },
    { number: '48', label: 'Wilayas Covered' },
];

export default function StatsSection() {
    return (
        <section className="stats-section" id="stats">
            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div className="stat-card" key={i}>
                        <div className="stat-number">{s.number}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
