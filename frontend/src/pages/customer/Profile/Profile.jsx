import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { clearTokens } from '../../../api/axios';
import styles from './Profile.module.css';
import ProfileHeader from '../../../components/customer/Profile/ProfileHeader/ProfileHeader';
import PersonalInfo from '../../../components/customer/Profile/PersonalInfo/PersonalInfo';
import EmailSettings from '../../../components/customer/Profile/EmailSettings/EmailSettings';
import SecuritySettings from '../../../components/customer/Profile/SecuritySettings/SecuritySettings';
import DangerZone from '../../../components/customer/Profile/DangerZone/DangerZone';

const Profile = () => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        memberSince: '',
        avatar: '/default-avatar.svg',
        wilaya: '',
        city: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/accounts/me/');
                const data = res.data;
                setUser({
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || '',
                    email: data.email || '',
                    phone: data.phone_number || '',
                    memberSince: data.date_joined ? new Date(data.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
                    avatar: data.profile_picture ? (data.profile_picture.startsWith('http') ? data.profile_picture : `http://127.0.0.1:8000${data.profile_picture}`) : '/default-avatar.svg',
                    wilaya: data.wilaya || '',
                    city: data.city || ''
                });
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUserChange = (field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveAll = async () => {
        setSaving(true);
        setError('');
        try {
            // Parse name into first/last
            const nameParts = user.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            await api.put('/accounts/me/', {
                first_name: firstName,
                last_name: lastName,
                email: user.email,
                phone_number: user.phone,
                wilaya: user.wilaya,
                city: user.city
            });

            // Update sessionStorage
            const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
            userData.email = user.email;
            userData.avatar = user.avatar;
            sessionStorage.setItem('userData', JSON.stringify(userData));

            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Failed to save profile:', err);
            setError('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        clearTokens();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className={styles.profilePage} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <p style={{ color: 'var(--muted)', fontSize: '16px' }}>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            <ProfileHeader 
                user={user} 
                onAvatarUpdate={(url) => {
                    const fullUrl = url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`;
                    handleUserChange('avatar', fullUrl);
                    
                    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
                    userData.avatar = fullUrl;
                    sessionStorage.setItem('userData', JSON.stringify(userData));
                }} 
            />
            
            <PersonalInfo user={user} onChange={handleUserChange} />
            
            <EmailSettings user={user} onChange={handleUserChange} />
            
            <SecuritySettings />
            
            <DangerZone />

            <div className={styles.saveAllContainer}>
                {error && (
                    <div style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
                        <i className="fa-solid fa-circle-exclamation"></i> {error}
                    </div>
                )}
                <button
                    className={`${styles.saveAllBtn} ${saved ? styles.savedState : ''}`}
                    onClick={handleSaveAll}
                    disabled={saving}
                >
                    <span className={styles.icon}>
                        {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : saved ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-floppy-disk"></i>}
                    </span>
                    {saving ? 'SAVING...' : saved ? 'CHANGES SAVED!' : 'SAVE ALL CHANGES'}
                </button>
            </div>

            <div className={styles.profileActions}>
                <button className={styles.btnLogout} onClick={handleLogout}>
                    <span className={styles.icon}><i className="fa-solid fa-right-from-bracket"></i></span>
                    Log Out
                </button>
            </div>
        </div>
    );
};



export default Profile;
