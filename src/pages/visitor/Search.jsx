import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoSrc from '../../assets/logo.svg';

const Search = () => {
    const [deviceType, setDeviceType] = useState('phone');
    const [minRating, setMinRating] = useState(4.5);

    const shops = [
        {
            id: 1,
            name: "TechFix DZ",
            status: "OPEN",
            location: "Oran, Akid Lotfi",
            rating: 4.8,
            reviews: 124,
            desc: "Expert logic board repairs and screen replacements for all premium flagship devices. 2-hour express service available.",
            tags: ["Smartphone", "Laptop", "Console"],
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        },
        {
            id: 2,
            name: "Oran Micro Solutions",
            status: "CLOSED",
            location: "Oran, Bir El Djir",
            rating: 4.2,
            reviews: 86,
            desc: "Specialized in MacBook and PC motherboard micro-soldering. Authorized warranty service provider for Lenovo.",
            tags: ["MacBook", "PC Gaming"],
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
        },
        {
            id: 3,
            name: "Flash Phone Repair",
            status: "OPEN",
            location: "Oran, Es Senia",
            rating: 5.0,
            reviews: 210,
            desc: "The fastest mobile repair shop in Oran. Most repairs done in 30 minutes. Screens, batteries, and charging ports.",
            tags: ["iPhone", "Samsung", "Pixel"],
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jude"
        },
        {
            id: 4,
            name: "Pixel Tech Hub",
            status: "OPEN",
            location: "Oran, City Center",
            rating: 4.5,
            reviews: 54,
            desc: "Your one-stop shop for tablets and gaming hardware. We also offer liquid damage restoration and data recovery.",
            tags: ["iPad", "Nintendo", "Tablet"],
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha"
        }
    ];

    return (
        <div className="search-page-container">
            <header className="search-header">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-circle">
                        <img src={logoSrc} alt="FixIt logo" />
                    </div>
                    <span className="navbar-wordmark">FixIt</span>
                </Link>
                <div className="header-actions">
                    <Link to="/login" className="btn-outline">Login</Link>
                    <Link to="/register" className="btn-cyan">Register Now</Link>
                </div>
            </header>

            <main className="search-main">
                <aside className="search-sidebar">
                    <div className="sidebar-title">
                        <i className="fa-solid fa-sliders"></i>
                        Filter Results
                    </div>

                    <div className="filter-section">
                        <label>LOCATION</label>
                        <select className="filter-select">
                            <option>Oran (31)</option>
                        </select>
                        <select className="filter-select">
                            <option>Akid Lotfi</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <label>DEVICE TYPE</label>
                        <div className="device-toggle">
                            <button
                                className={`device-btn ${deviceType === 'phone' ? 'active' : ''}`}
                                onClick={() => setDeviceType('phone')}
                            >
                                <i className="fa-solid fa-mobile-screen-button"></i>
                                Phone
                            </button>
                            <button
                                className={`device-btn ${deviceType === 'pc' ? 'active' : ''}`}
                                onClick={() => setDeviceType('pc')}
                            >
                                <i className="fa-solid fa-laptop"></i>
                                PC
                            </button>
                        </div>
                    </div>

                    <div className="filter-section">
                        <label>BRANDS</label>
                        <div className="checkbox-group">
                            <label className="checkbox-item">
                                <input type="checkbox" defaultChecked />
                                <span>Samsung</span>
                            </label>
                            <label className="checkbox-item">
                                <input type="checkbox" defaultChecked />
                                <span>Apple</span>
                            </label>
                            <label className="checkbox-item">
                                <input type="checkbox" />
                                <span>Huawei</span>
                            </label>
                            <label className="checkbox-item">
                                <input type="checkbox" />
                                <span>HP</span>
                            </label>
                            <label className="checkbox-item">
                                <input type="checkbox" />
                                <span>Dell</span>
                            </label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <label>MINIMUM RATING</label>
                        <div className="rating-buttons">
                            <button
                                className={`rating-btn ${minRating === 4.5 ? 'active' : ''}`}
                                onClick={() => setMinRating(4.5)}
                            >
                                4.5 <i className="fa-solid fa-star"></i>
                            </button>
                            <button
                                className={`rating-btn ${minRating === 4.0 ? 'active' : ''}`}
                                onClick={() => setMinRating(4.0)}
                            >
                                4.0 <i className="fa-solid fa-star"></i>
                            </button>
                            <button
                                className={`rating-btn ${minRating === 3.0 ? 'active' : ''}`}
                                onClick={() => setMinRating(3.0)}
                            >
                                3.0+
                            </button>
                        </div>
                    </div>

                    <button className="btn-apply">Apply Filters</button>
                </aside>

                <section className="search-results">
                    <div className="results-header">
                        <h1 className="results-count">24 shops found in Oran</h1>
                        <div className="sort-by">
                            <span>Sort by:</span>
                            <select className="sort-select">
                                <option>Best Rated</option>
                                <option>Most Reviews</option>
                                <option>Nearest</option>
                            </select>
                        </div>
                    </div>

                    <div className="shops-grid">
                        {shops.map(shop => (
                            <div key={shop.id} className="shop-card">
                                <div className="shop-card-header">
                                    <div className="shop-info">
                                        <img src={shop.avatar} alt={shop.name} className="shop-avatar" />
                                        <div>
                                            <div className="shop-name-row">
                                                <h3 className="shop-name">{shop.name}</h3>
                                                <span className={`status-badge ${shop.status.toLowerCase()}`}>
                                                    {shop.status}
                                                </span>
                                            </div>
                                            <p className="shop-location">
                                                <i className="fa-solid fa-location-dot"></i>
                                                {shop.location}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="bookmark-btn">
                                        <i className="fa-regular fa-bookmark"></i>
                                    </button>
                                </div>

                                <div className="shop-rating">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa-solid fa-star ${i < Math.floor(shop.rating) ? 'active' : ''}`}></i>
                                        ))}
                                    </div>
                                    <span className="rating-text">{shop.rating} ({shop.reviews} reviews)</span>
                                </div>

                                <p className="shop-desc">{shop.desc}</p>

                                <div className="shop-tags">
                                    {shop.tags.map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>

                                <button className="btn-view-profile">View Profile</button>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button className="page-nav"><i className="fa-solid fa-chevron-left"></i></button>
                        <button className="page-num active">1</button>
                        <button className="page-num">2</button>
                        <button className="page-num">3</button>
                        <span className="page-dots">...</span>
                        <button className="page-num">8</button>
                        <button className="page-nav"><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Search;
