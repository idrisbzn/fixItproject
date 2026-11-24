import React, { useRef } from 'react';
import styles from './ProfileHeader.module.css';
import api from '../../../../api/axios';

const ProfileHeader = ({ user, onAvatarUpdate }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('profile_picture', file);

            const res = await api.put('/accounts/me/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Notify parent about the updated profile picture
            if (onAvatarUpdate && res.data.profile_picture) {
                onAvatarUpdate(res.data.profile_picture);
            }
        } catch (error) {
            console.error('Failed to upload profile picture:', error);
            alert('Failed to upload profile picture. Please try again.');
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <header className={styles.profileHeader}>
            <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                    <img src={user.avatar || '/default-avatar.svg'} alt={user.name} onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }} />
                    <button className={styles.btnEditAvatar} onClick={() => fileInputRef.current?.click()}>
                        <i className="fa-solid fa-pen"></i>
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*" 
                        onChange={handleFileChange}
                    />
                </div>
                <h1 className={styles.profileName}>{user.name}</h1>
                <p className={styles.profileMeta}>{user.email} • {user.phone}</p>
                <p className={styles.memberSince}>Member since {user.memberSince}</p>
            </div>
        </header>
    );
};

export default ProfileHeader;
