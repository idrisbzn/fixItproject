import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axios';
import styles from './SendRequest.module.css';

const SendRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Form state
    const [deviceType, setDeviceType] = useState('phone');
    const [model, setModel] = useState('');
    const [problem, setProblem] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const res = await api.get(`/api/shops/${id}/`);
                setShop(res.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch shop:', err);
                setError('Failed to load shop information.');
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size too large (max 5MB)');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitted || !shop) return;
        
        try {
            const formData = new FormData();
            formData.append('shop', id);
            formData.append('title', `Repair Request: ${model}`);
            formData.append('description', problem);
            formData.append('device_type', deviceType);
            formData.append('model_name', model);
            if (image) {
                formData.append('image', image);
            }

            await api.post('/api/repair_requests/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSubmitted(true);
            setTimeout(() => navigate('/devices'), 1500);
        } catch (err) {
            console.error('Failed to send request:', err);
            alert('Failed to send request. Please try again.');
        }
    };

    if (loading) return <div className={styles.loading}>Loading shop data...</div>;
    if (error || !shop) return <div className={styles.error}>{error || 'Shop not found'}</div>;

    const shopAvatar = shop.profile_image ? (shop.profile_image.startsWith('http') ? shop.profile_image : `http://127.0.0.1:8000${shop.profile_image}`) : '/default-avatar.svg';

    return (
        <div className={styles.pageContainer}>
            <button onClick={() => navigate(-1)} className={styles.backLink}>
                <i className="fa-solid fa-arrow-left"></i>
                {shop.name} / Send Repair Request
            </button>

            <div className={styles.shopBanner}>
                <div className={styles.shopInfo}>
                    <img src={shopAvatar} alt={shop.name} className={styles.shopAvatar} onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }} />
                    <div className={styles.shopDetails}>
                        <span className={styles.shopLabel}>SENDING REQUEST TO:</span>
                        <h2 className={styles.shopName}>{shop.name}</h2>
                    </div>
                </div>
                <div className={styles.shopMeta}>
                    <div className={styles.shopRating}>
                        <i className="fa-solid fa-star"></i> {shop.rating || '0.0'}
                    </div>
                    <div className={styles.locationStatus}>
                        <span>{shop.wilaya}</span>
                        <span className={shop.is_open ? styles.statusOpen : styles.statusClosed}>
                            {shop.is_open ? 'OPEN' : 'CLOSED'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.formContainer}>
                <h1 className={styles.pageTitle}>New Repair Request</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>DEVICE TYPE</label>
                        <div className={styles.deviceTypeOptions}>
                            <button 
                                type="button" 
                                className={`${styles.deviceTypeBtn} ${deviceType === 'phone' ? styles.active : ''}`}
                                onClick={() => setDeviceType('phone')}
                            >
                                <i className="fa-solid fa-mobile-screen-button"></i>
                                Phone/Tablet
                            </button>
                            <button 
                                type="button" 
                                className={`${styles.deviceTypeBtn} ${deviceType === 'laptop' ? styles.active : ''}`}
                                onClick={() => setDeviceType('laptop')}
                            >
                                <i className="fa-solid fa-laptop"></i>
                                PC/Laptop
                            </button>
                        </div>
                    </div>



                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>DEVICE MODEL</label>
                        <input 
                            type="text" 
                            className={styles.formInput} 
                            placeholder="e.g. Galaxy S23 Ultra"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.formLabel}>
                            <span>PROBLEM DETAILS</span>
                            <span className={styles.charCount}>{problem.length}/500</span>
                        </div>
                        <textarea 
                            className={styles.formTextarea} 
                            placeholder="Describe what's wrong with your device..."
                            value={problem}
                            onChange={(e) => setProblem(e.target.value.substring(0, 500))}
                            required
                        ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>ATTACH PHOTOS (OPTIONAL)</label>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <div 
                            className={`${styles.uploadArea} ${imagePreview ? styles.hasPreview : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <div className={styles.previewContainer}>
                                    <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                                    <button type="button" className={styles.removeImageBtn} onClick={handleRemoveImage}>
                                        <i className="fa-solid fa-circle-xmark"></i>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <i className={`fa-solid fa-cloud-arrow-up ${styles.uploadIcon}`}></i>
                                    <span className={styles.uploadText}>Click to upload or drag and drop</span>
                                    <span className={styles.uploadHint}>PNG, JPG or JPEG (MAX. 5MB)</span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.submitBtn} ${submitted ? styles.submitBtnSuccess : ''}`}
                        disabled={submitted}
                    >
                        {submitted ? (
                            <><i className="fa-solid fa-check"></i> Request Sent!</>
                        ) : (
                            <>Send Repair Request <i className="fa-solid fa-arrow-right"></i></>
                        )}
                    </button>
                    
                    <div className={styles.securityNote}>
                        <i className="fa-solid fa-lock"></i>
                        Only visible to this shop
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendRequest;
