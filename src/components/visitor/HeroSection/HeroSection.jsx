import { useState } from 'react';
import { Link } from 'react-router-dom';
import GridAnimation from '../../common/gridAnimation/GridAnimation';

export default function HeroSection() {
    const [deviceType, setDeviceType] = useState('phone');

    return (
        <section className="hero-section" id="hero">
            {/* Animated grid canvas behind the title */}
            <div className="hero-canvas-wrapper">
                <GridAnimation />
            </div>
            <div className="hero-overlay" />

            <div className="hero-panel">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Find a Trusted<br />
                        Repair Shop<br />
                        <span className="hero-title-accent">Near You</span>
                    </h1>
                    <p className="hero-subtitle">
                        Compare shops, track your device, and get it fixed — hassle-free.
                    </p>
                </div>

                <div className="hero-search" id="hero-search">
                    <select className="hero-select" id="select-wilaya" defaultValue="">
                        <option value="" disabled>Select Wilaya</option>
                        <option value="algiers">Algiers</option>
                        <option value="oran">Oran</option>
                        <option value="constantine">Constantine</option>
                    </select>

                    <select className="hero-select" id="select-city" defaultValue="">
                        <option value="" disabled>Select City</option>
                        <option value="hydra">Hydra</option>
                        <option value="bab-el-oued">Bab El Oued</option>
                    </select>

                    <div className="hero-toggle-group">
                        <button
                            className={`hero-toggle-btn ${deviceType === 'phone' ? 'active' : ''}`}
                            onClick={() => setDeviceType('phone')}
                            id="toggle-phone"
                        >
                            Phone
                        </button>
                        <button
                            className={`hero-toggle-btn ${deviceType === 'pc' ? 'active' : ''}`}
                            onClick={() => setDeviceType('pc')}
                            id="toggle-pc"
                        >
                            PC
                        </button>
                    </div>

                    <Link to="/search" className="btn-find-shops" id="btn-find-shops">Find Shops</Link>
                </div>
            </div>
        </section>
    );
}
