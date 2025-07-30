import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Navigation from '../components/Navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function StudentDashboard() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data - replace with API call
  const mockProgress = {
    totalQuestions: 150,
    solved: 85,
    unsolved: 65,
    platformStats: {
      leetcode: 60,
      gfg: 25,
    },
    difficultyStats: {
      easy: 40,
      medium: 35,
      hard: 10,
    },
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProgress(mockProgress);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const pieData = {
    labels: ['Solved', 'Unsolved'],
    datasets: [
      {
        data: [progress.solved, progress.unsolved],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const barData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Solved',
        data: [progress.difficultyStats.easy, progress.difficultyStats.medium, progress.difficultyStats.hard],
        backgroundColor: '#3f51b5',
      },
    ],
  };

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>Dashboard</h1>
        <div className="row">
          <div className="col-md-6">
            <h2>Progress Overview</h2>
            <Pie data={pieData} />
          </div>
          <div className="col-md-6">
            <h2>Difficulty Breakdown</h2>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
