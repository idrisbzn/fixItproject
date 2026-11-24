import React from 'react';
import styles from './RequestCard.module.css';

const RequestCard = ({ request, onAccept, onDecline, onViewImage }) => {
    return (
        <div className={styles.requestCard}>
            <div className={styles.requestCardHeader}>
                <div className={styles.userAvatar}>
                    <span className={styles.icon}><i className="fa-solid fa-user"></i></span>
                </div>
                <div className={styles.userInfo}>
                    <h4>{request.userName}</h4>
                    <div className={styles.requestMeta}>
                        <span className={`${styles.badge} ${styles.new}`}>NEW REQUEST</span>
                        <span className={styles.time}>{request.time}</span>
                    </div>
                </div>
            </div>

            <p className={styles.requestDescription}>{request.description}</p>
            
            {request.image && (
                <div className={styles.requestImageContainer}>
                    <img 
                        src={request.image.startsWith('http') ? request.image : `http://127.0.0.1:8000${request.image}`} 
                        alt="Repair Request" 
                        className={styles.requestImage}
                        onClick={() => onViewImage && onViewImage(request.image.startsWith('http') ? request.image : `http://127.0.0.1:8000${request.image}`)}
                    />
                </div>
            )}

            <div className={styles.requestActions}>
                <button
                    className={styles.acceptBtn}
                    onClick={() => onAccept && onAccept(request.id)}
                >
                    <span><i className="fa-solid fa-check"></i></span> Accept Request
                </button>
                <button
                    className={styles.declineBtn}
                    onClick={() => onDecline && onDecline(request.id)}
                >
                    <span><i className="fa-solid fa-xmark"></i></span> Decline
                </button>
            </div>
        </div>
    );
};

export default RequestCard;
