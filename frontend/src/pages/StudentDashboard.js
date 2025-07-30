import React from 'react';
import Navigation from '../components/Navigation';

function StudentDashboard() {
  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>Student Dashboard</h1>
        <p>Welcome to your DSA progress tracker!</p>
      </div>
    </div>
  );
}

export default StudentDashboard;
