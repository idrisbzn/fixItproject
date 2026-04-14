import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/customer/Profile.css';

const Profile = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real app, you would clear auth tokens/state here
        navigate('/login');
    };
    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="avatar-section">
                    <div className="avatar-wrapper">
                        <img src="https://via.placeholder.com/120" alt="Youcef Benali" />
                        <button className="btn-edit-avatar"><i className="fa-solid fa-pen"></i></button>
                    </div>
                    <h1 className="profile-name">Youcef Benali</h1>
                    <p className="profile-meta">youcef@example.com • +213 555 12 34 56</p>
                    <p className="member-since">Member since January 2025</p>
                </div>
            </header>

            <section className="profile-section">
                <h2 className="section-label">YOUR INFORMATION</h2>
                <div className="profile-card">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" defaultValue="Youcef Benali" />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" defaultValue="+213 555 12 34 56" />
                        </div>
                        <div className="form-group">
                            <label>Wilaya</label>
                            <select defaultValue="oran">
                                <option value="oran">31 - Oran</option>
                                <option value="algiers">16 - Algiers</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <select defaultValue="bir-el-djir">
                                <option value="bir-el-djir">Bir El Djir</option>
                                <option value="oran">Oran</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn-save">Save Changes</button>
                </div>
            </section>

            <section className="profile-section">
                <h2 className="section-label">SECURITY</h2>
                <div className="profile-card">
                    <h3 className="card-subtitle">Change Password</h3>
                    <div className="form-stack">
                        <div className="form-group">
                            <input type="password" placeholder="Current Password" />
                        </div>
                        <div className="form-group">
                            <input type="password" placeholder="New Password" />
                        </div>
                        <div className="form-group">
                            <input type="password" placeholder="Confirm New Password" />
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn-update-password">Update Password</button>
                    </div>
                </div>
            </section>

            <section className="profile-section danger-zone">
                <div className="danger-card">
                    <h3 className="danger-title">Delete Account</h3>
                    <p className="danger-desc">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="btn-delete-account">Delete My Account</button>
                </div>
            </section>

            <div className="profile-actions">
                <button className="btn-logout" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
