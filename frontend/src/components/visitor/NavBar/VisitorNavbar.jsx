import { Link } from 'react-router-dom';
import logoSrc from '../../../assets/logo.svg';
import styles from './VisitorNavbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar} id="navbar">
            <div className={styles.navbarInner}>
                <Link to="/" className={styles.navbarLogo}>
                    <div className={styles.navbarLogo}>
                        <img src={logoSrc} alt="FixIt logo" />
                    </div>
                </Link>
                <div className={styles.navbarActions}>
                    <Link to="/login" className={styles.btnLogin} id="btn-login">Login</Link>
                    <Link to="/register" className={styles.btnRegister} id="btn-register">Register</Link>
                </div>
            </div>

        </nav>
    );
}
