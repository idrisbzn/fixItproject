import styles from './HowItWorks.module.css';

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
        <section className={styles.howSection} id="how-it-works">
            <h2 className={styles.howSectionTitle}>How FixIt Works</h2>
            <p className={styles.howSectionSubtitle}>
                Get your device repaired in three simple steps without the stress of
                finding a reliable technician.
            </p>

            <div className={styles.howGrid}>
                {steps.map((s) => (
                    <div className={styles.howCard} key={s.num}>
                        <div className={styles.howStepCircle}>{s.num}</div>
                        <h3 className={styles.howCardTitle}>{s.title}</h3>
                        <p className={styles.howCardDesc}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
