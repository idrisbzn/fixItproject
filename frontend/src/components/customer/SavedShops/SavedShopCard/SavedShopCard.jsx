import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SavedShopCard.module.css';
import api from '../../../../api/axios';

const SavedShopCard = ({ shop, onRemove }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [noteText, setNoteText] = useState(shop.quote || shop.note || '');
    const [tempNote, setTempNote] = useState('');

    const checkIsOpen = () => {
        // Primary override: if manual toggle is off, shop is closed
        if (!shop.is_open) return false;

        // Ensure we have hours and it's an array
        if (shop.hours && Array.isArray(shop.hours) && shop.hours.length > 0) {
            const now = new Date();
            const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const currentDayStr = daysMap[now.getDay()];

            // Find the hours for the current day
            const todayHours = shop.hours.find(h => h.day === currentDayStr);

            if (todayHours) {
                const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                const openTime = todayHours.open_time.slice(0, 5);
                const closeTime = todayHours.close_time.slice(0, 5);

                // Compare current time with open and close times
                return currentTime >= openTime && currentTime <= closeTime;
            }
        }

        // If no hours are set for today, or no hours set at all, shop is closed
        return false;
    };

    const isOpen = checkIsOpen();

    const handleStartEdit = () => {
        setTempNote(noteText);
        setIsEditing(true);
    };

    const handleSaveNote = async () => {
        try {
            await api.post('/api/list-shops/update-note/', {
                shop_id: shop.id,
                note: tempNote
            });
            setNoteText(tempNote);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save note. Full error:', err);
            console.error('Response data:', err.response?.data);
            const msg = err.response?.data?.error || err.response?.data?.detail || 'Failed to save note. Please try again.';
            alert(msg);
        }
    };

    const handleCancelNote = () => {
        setIsEditing(false);
    };

    const handleDeleteNote = async () => {
        try {
            await api.post('/api/list-shops/update-note/', {
                shop_id: shop.id,
                note: ''
            });
            setNoteText('');
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to delete note', err);
            const msg = err.response?.data?.error || err.response?.data?.detail || 'Failed to delete note. Please try again.';
            alert(msg);
        }
    };


    return (
        <div className={styles.shopCard}>
            <div className={styles.shopCardMain}>
                <div className={styles.shopHeader}>
                    <div className={styles.shopAvatar}>
                        <img src={shop.avatar || '/default-avatar.svg'} alt={shop.name} onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }} />
                    </div>
                    <div className={styles.shopInfo}>
                        <div className={styles.shopNameRow}>
                            <h3>{shop.name}</h3>
                            <span className={`${styles.statusBadge} ${isOpen ? styles.open : styles.closed}`}>{isOpen ? 'OPEN' : 'CLOSED'}</span>
                        </div>
                        <div className={styles.shopMeta}>
                            <span className={styles.rating}><i className="fa-solid fa-star"></i> {shop.rating}</span>
                            <span className={styles.location}>{shop.location}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.shopTags}>
                    {shop.tags.map(tag => (
                        <span key={tag} className={styles.tag}>
                            <i className={`fa-solid ${tag === 'Phone' ? 'fa-mobile-screen' : 'fa-laptop'}`}></i> {tag}
                        </span>
                    ))}
                </div>

                <div className={styles.shopNoteBox}>
                    {isEditing ? (
                        <div className={styles.noteEditor}>
                            <textarea
                                value={tempNote}
                                onChange={(e) => setTempNote(e.target.value)}
                                placeholder="Write a private note..."
                                autoFocus
                            />
                            <div className={styles.noteActions}>
                                <button className={styles.btnSaveNote} onClick={handleSaveNote}>Save</button>
                                <button className={styles.btnCancelNote} onClick={handleCancelNote}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.noteView} onClick={handleStartEdit}>
                            {noteText ? (
                                <p className={styles.shopQuote}>"{noteText}"</p>
                            ) : (
                                <p className={styles.shopNotePlaceholder}>Add a private note...</p>
                            )}
                            <div className={styles.noteHoverActions}>
                                <i className="fa-solid fa-pen"></i>
                                {noteText && (
                                    <i
                                        className="fa-solid fa-trash-can"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteNote(); }}
                                    ></i>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>


            <div className={styles.shopCardActions}>
                <button
                    className={styles.btnSendRequest}
                    onClick={() => navigate(`/shop/${shop.id || 1}/request`)}
                >
                    Send Request
                </button>
                <button className={styles.btnViewProfile} onClick={() => navigate(`/shop-profile/${shop.id}`)}>View Profile</button>
                <button className={styles.btnDelete} onClick={onRemove}><i className="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    );
};

export default SavedShopCard;
