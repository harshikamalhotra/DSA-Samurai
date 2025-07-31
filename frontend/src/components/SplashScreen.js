import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onAnimationComplete }) => {
  const [animationPhase, setAnimationPhase] = useState('initial');

  useEffect(() => {
    const timeline = [
      { phase: 'shake', delay: 0 },        // Start immediately
      { phase: 'gather', delay: 1500 },    // After 1.5s of shaking
      { phase: 'burst', delay: 3000 },     // After 1.5s of gathering
      { phase: 'complete', delay: 6000 }   // After 1s burst + 2s title display
    ];

    timeline.forEach(({ phase, delay }) => {
      setTimeout(() => {
        setAnimationPhase(phase);
        if (phase === 'complete') {
          setTimeout(() => onAnimationComplete(), 300);
        }
      }, delay);
    });
  }, [onAnimationComplete]);

  return (
    <div className={`splash-screen ${animationPhase}`}>
      <div className="splash-content">
        <div className="emoji-container">
          <div className={`emoji bicep-left ${animationPhase}`}>💪</div>
          <div className={`emoji brain ${animationPhase}`}>🧠</div>
          <div className={`emoji bicep-right ${animationPhase}`}>💪</div>
        </div>
        
        {/* Particles for burst effect */}
        <div className="particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1} ${animationPhase}`}></div>
          ))}
        </div>

        {/* Energy rings */}
        <div className="energy-rings">
          <div className={`energy-ring ring-1 ${animationPhase}`}></div>
          <div className={`energy-ring ring-2 ${animationPhase}`}></div>
          <div className={`energy-ring ring-3 ${animationPhase}`}></div>
        </div>

        {/* App title that appears during burst */}
        <div className={`app-title ${animationPhase}`}>
          <h1>DSA SAMURAI</h1>
          <p>Mental Strength • Algorithmic Power</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
