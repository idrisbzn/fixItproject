import logoSrc from '../../../assets/logo.svg';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer} id="footer">
            <div className={styles.footerInner}>
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.footerBrand}>
                        <div className={styles.footerBrandLogo}>
                            <img src={logoSrc} alt="FixIt" />
                        </div>
                        <p className={styles.footerBrandDesc}>
                            Algeria's first platform connecting device owners with
                            certified repair specialists. Reliability at your fingertips.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className={styles.footerColumnTitle}>Quick Links</h4>
                        <ul className={styles.footerLinks}>
                            <li><a href="#find">Find a Shop</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className={styles.footerColumnTitle}>Support</h4>
                        <ul className={styles.footerLinks}>
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#safety">Safety</a></li>
                            <li><a href="#terms">Terms</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className={styles.footerColumnTitle}>Contact Us</h4>
                        <div className={styles.footerContactItem}>
                            <i className={`fa-solid fa-envelope ${styles.footerContactIcon} ${styles.email}`}></i>
                            <span>i_bouzenacha@estin.dz</span>
                        </div>
                        <div className={styles.footerContactItem}>
                            <i className={`fa-solid fa-location-dot ${styles.footerContactIcon} ${styles.location}`}></i>
                            <span>amizour, bejaia, Algeria</span>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    © 2026 FixIt. All rights reserved. Designed for the digital age.
                </div>
            </div>
        </footer>
    );
}
