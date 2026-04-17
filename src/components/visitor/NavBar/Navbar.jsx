import { Link } from 'react-router-dom';
import logoSrc from '../../../assets/logo.svg';

export default function Navbar() {
    return (
        <nav className="navbar" id="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo">
                        <img src={logoSrc} alt="FixIt logo" />
                    </div>
                </Link>
                <div className="navbar-actions">
                    <Link to="/login" className="btn-login" id="btn-login">Login</Link>
                    <Link to="/register" className="btn-register" id="btn-register">Register</Link>
                </div>
            </div>

        </nav>
    );
}
