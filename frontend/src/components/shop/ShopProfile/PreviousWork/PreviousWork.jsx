import React, { useRef, useState } from 'react';
import api from '../../../../api/axios';
import styles from './PreviousWork.module.css';

const PreviousWork = ({ portfolio = [], shopId, onUpdate }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [actionError, setActionError] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            // We can optionally add a caption here, for now it's empty
            formData.append('caption', '');
            
            // Backend URL handles shop association based on the authenticated user
            await api.post('/api/portfolio-images/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            setActionError('Failed to upload image. Please try again.');
            setTimeout(() => setActionError(''), 4000);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteClick = (imageId, event) => {
        event.stopPropagation(); // Prevent opening the image modal when clicking delete
        setDeleteConfirmId(imageId);
    };

    const handleConfirmDelete = async (imageId, event) => {
        event.stopPropagation();
        try {
            await api.delete(`/api/portfolio-images/${imageId}/`);
            setDeleteConfirmId(null);
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
            setActionError('Failed to delete image. Please try again.');
            setTimeout(() => setActionError(''), 4000);
        }
    };

    const handleCancelDelete = (event) => {
        event.stopPropagation();
        setDeleteConfirmId(null);
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <div className={styles.previousWorkContainer}>
                <div className={styles.sectionHeader}>
                    <span className={styles.icon}><i className="fa-solid fa-image"></i></span>
                    <h3>Previous Work</h3>
                    <span className={styles.imageCount}>{portfolio.length}/12 Images</span>
                    {actionError && (
                        <span style={{ color: '#ff4d4d', fontSize: '14px', marginLeft: 'auto', marginRight: '12px' }}>
                            <i className="fa-solid fa-circle-exclamation"></i> {actionError}
                        </span>
                    )}
                </div>

                <div className={styles.workGrid}>
                    <div className={styles.uploadBox} onClick={handleUploadClick}>
                        {uploading ? (
                            <>
                                <div className={styles.uploadIcon}><i className="fa-solid fa-spinner fa-spin"></i></div>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <div className={styles.uploadIcon}><i className="fa-solid fa-cloud-arrow-up"></i></div>
                                <span>Upload Project</span>
                            </>
                        )}
                    </div>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*" 
                        onChange={handleFileChange}
                        disabled={uploading}
                    />

                    {portfolio.map((item) => (
                        <div 
                            key={item.id} 
                            className={styles.workItem}
                            onClick={() => deleteConfirmId === item.id ? null : openImageModal(item.image)}
                            style={{ cursor: deleteConfirmId === item.id ? 'default' : 'pointer' }}
                        >
                            <img src={item.image} alt={item.caption || 'Portfolio'} style={{ filter: deleteConfirmId === item.id ? 'brightness(0.3)' : 'none', transition: 'filter 0.2s' }} />
                            
                            {deleteConfirmId === item.id ? (
                                <div className={styles.confirmOverlay}>
                                    <span>Delete?</span>
                                    <div className={styles.confirmActions}>
                                        <button className={styles.confirmYes} onClick={(e) => handleConfirmDelete(item.id, e)}>Yes</button>
                                        <button className={styles.confirmNo} onClick={handleCancelDelete}>No</button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    className={styles.deleteBtn}
                                    onClick={(e) => handleDeleteClick(item.id, e)}
                                    title="Delete image"
                                >
                                    ×
                                </button>
                            )}
                            
                            {item.caption && <span className={styles.caption}>{item.caption}</span>}
                        </div>
                    ))}

                    {portfolio.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No portfolio images yet. Upload your best work to showcase your skills!</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <div className={styles.imageModalOverlay} onClick={closeImageModal}>
                    <button className={styles.closeModalBtn} onClick={closeImageModal}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Fullscreen View" />
                    </div>
                </div>
            )}
        </>
    );
};

export default PreviousWork;
