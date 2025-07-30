import React from 'react';
import Navigation from '../components/Navigation';

function Leaderboard() {
  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>Leaderboard</h1>
        <p>See how you rank against other students!</p>
      </div>
    </div>
  );
}

export default Leaderboard;
