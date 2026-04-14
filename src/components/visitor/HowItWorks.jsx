const steps = [
    {
        num: 1,
        title: 'Search',
        desc: 'Find shops near you based on your location and specific device model.',
    },
    {
        num: 2,
        title: 'Request',
        desc: 'Get quotes, compare ratings, and book your repair slot instantly.',
    },
    {
        num: 3,
        title: 'Track',
        desc: 'Monitor your repair progress in real-time and get notified when ready.',
    },
];

export default function HowItWorks() {
    return (
        <section className="how-section" id="how-it-works">
            <h2 className="how-section-title">How FixIt Works</h2>
            <p className="how-section-subtitle">
                Get your device repaired in three simple steps without the stress of
                finding a reliable technician.
            </p>

            <div className="how-grid">
                {steps.map((s) => (
                    <div className="how-card" key={s.num}>
                        <div className="how-step-circle">{s.num}</div>
                        <h3 className="how-card-title">{s.title}</h3>
                        <p className="how-card-desc">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
