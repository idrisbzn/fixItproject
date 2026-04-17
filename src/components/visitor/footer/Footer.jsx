import logoSrc from '../../../assets/logo.svg';

export default function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-brand-logo">
                            <div className="footer-brand-logo-circle">
                                <img src={logoSrc} alt="FixIt" />
                            </div>
                            <span className="footer-brand-wordmark">FixIt</span>
                        </div>
                        <p className="footer-brand-desc">
                            Algeria's first platform connecting device owners with
                            certified repair specialists. Reliability at your fingertips.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="footer-column-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="#find">Find a Shop</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="footer-column-title">Support</h4>
                        <ul className="footer-links">
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#safety">Safety</a></li>
                            <li><a href="#terms">Terms</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="footer-column-title">Contact Us</h4>
                        <div className="footer-contact-item">
                            <i className="fa-solid fa-envelope footer-contact-icon email"></i>
                            <span>i_bouzenacha@estin.dz</span>
                        </div>
                        <div className="footer-contact-item">
                            <i className="fa-solid fa-location-dot footer-contact-icon location"></i>
                            <span>amizour, bejaia, Algeria</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2026 FixIt. All rights reserved. Designed for the digital age.
                </div>
            </div>
        </footer>
    );
}
