import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">DSA Samurai Tracker</h1>
        <p className="home-subtitle">Your ultimate platform for tracking DSA progress and mastering algorithms.</p>
        <Link to="/login" className="btn btn-primary btn-lg">Get Started</Link>
      </div>
    </div>
  );
}

export default HomePage;
