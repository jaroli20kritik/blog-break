import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Immersive Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content page-animate">
                    <h1 className="hero-title" style={{fontSize: '4.5rem'}}>SAISAGAR</h1>
                    <p className="hero-subtitle">Authentic Tandoor. Unforgettable Flavors.</p>
                    <button className="btn btn-primary hero-btn" onClick={() => navigate('/table/1')}>
                        Explore Our Menu
                    </button>
                </div>
            </section>

            {/* Brief Philosophy */}
            <section className="brief-about page-animate" style={{ animationDelay: '0.2s' }}>
                <h2>Spice in Every Bite.</h2>
                <p>We bring you the vibrant heat of the streets and the smoky perfection of the tandoor, crafted daily with passion.</p>
            </section>

            {/* Sleek Minimal Contact Footer */}
            <footer className="minimal-footer page-animate" style={{ animationDelay: '0.3s' }}>
                <div className="footer-content">
                    <div>
                        <strong>Saisagar Tandoor Tadka</strong>
                        <p>Food District, City Center</p>
                    </div>
                    <div>
                        <strong>Reservations</strong>
                        <p>+1 (555) 123-4567</p>
                    </div>
                    <div>
                        <strong>Service Hours</strong>
                        <p>Everyday, 5PM - 11PM</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
