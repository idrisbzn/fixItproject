import React from 'react';
import '../../styles/pages/customer/SavedShops.css';

const SavedShops = () => {
    const shops = [
        {
            id: 1,
            name: 'TechFix Oran',
            rating: 4.8,
            location: 'Oran',
            status: 'open',
            statusText: 'OPEN',
            tags: ['Phone', 'PC'],
            quote: 'Great for screen repairs, very fast.',
            avatar: 'https://via.placeholder.com/48'
        },
        {
            id: 2,
            name: 'PC Masters',
            rating: 4.9,
            location: 'Algiers',
            status: 'closed',
            statusText: 'CLOSED',
            tags: ['PC'],
            note: 'Add a private note...',
            avatar: 'https://via.placeholder.com/48'
        },
        {
            id: 3,
            name: 'QuickFix Constantine',
            rating: 4.7,
            location: 'Constantine',
            status: 'open',
            statusText: 'OPEN',
            tags: ['Phone'],
            note: 'Add a private note...',
            avatar: 'https://via.placeholder.com/48'
        }
    ];

    return (
        <div className="saved-shops-page">
            <header className="saved-shops-header">
                <div className="header-content">
                    <h1 className="saved-shops-title">Saved Shops</h1>
                    <p className="saved-shops-subtitle">Your bookmarked repair shops — 3 saved</p>
                </div>
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search saved shops..." />
                </div>
            </header>

            <div className="shops-grid">
                {shops.map(shop => (
                    <div key={shop.id} className="shop-card">
                        <div className="shop-card-main">
                            <div className="shop-header">
                                <div className="shop-avatar">
                                    <img src={shop.avatar} alt={shop.name} />
                                </div>
                                <div className="shop-info">
                                    <div className="shop-name-row">
                                        <h3>{shop.name}</h3>
                                        <span className={`status-badge ${shop.status}`}>{shop.statusText}</span>
                                    </div>
                                    <div className="shop-meta">
                                        <span className="rating"><i className="fa-solid fa-star"></i> {shop.rating}</span>
                                        <span className="location">{shop.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="shop-tags">
                                {shop.tags.map(tag => (
                                    <span key={tag} className="tag">
                                        <i className={`fa-solid ${tag === 'Phone' ? 'fa-mobile-screen' : 'fa-laptop'}`}></i> {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="shop-note-box">
                                {shop.quote ? (
                                    <p className="shop-quote">"{shop.quote}"</p>
                                ) : (
                                    <p className="shop-note-placeholder">{shop.note}</p>
                                )}
                                <i className="fa-solid fa-pen edit-icon"></i>
                            </div>
                        </div>

                        <div className="shop-card-actions">
                            <button className="btn-send-request">Send Request</button>
                            <button className="btn-view-profile">View Profile</button>
                            <button className="btn-delete"><i className="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedShops;
