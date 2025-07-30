import React from 'react';
import Navigation from '../components/Navigation';

function Profile() {
  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>Profile</h1>
        <p>Your profile information.</p>
      </div>
    </div>
  );
}

export default Profile;
