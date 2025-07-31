import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Navigation from '../components/Navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function StudentDashboard() {
  const { getUserStats, syncProgress } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const syncedData = await syncProgress();
        console.log('Sync response:', syncedData);

        const statsData = await getUserStats();
        setStats(statsData.stats);
      } catch (err) {
        setError('Failed to load stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  if (!stats) return null;

  const pieData = {
    labels: ['LeetCode Solved', 'GFG Solved'],
    datasets: [
      {
        data: [stats.platforms.leetcode.solved, stats.platforms.geeksforgeeks.solved],
        backgroundColor: ['#4caf50', '#2196f3'],
      },
    ],
  };

  const barData = {
    labels: ['Easy', 'Medium', 'Hard', 'Basic'],
    datasets: [
      {
        label: 'LeetCode',
        data: [stats.platforms.leetcode.easy, stats.platforms.leetcode.medium, stats.platforms.leetcode.hard],
        backgroundColor: '#3f51b5',
      },
      {
        label: 'GeeksForGeeks',
        data: [stats.platforms.geeksforgeeks.easy, stats.platforms.geeksforgeeks.medium, stats.platforms.geeksforgeeks.hard, stats.platforms.geeksforgeeks.basic],
        backgroundColor: '#ff5722',
      },
    ],
  };

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>{`Hello, ${stats.student.name}`}</h1>
        <h1>Dashboard</h1>
        <h3>Total Solved: {stats.total_solved}</h3>
        <div className="row">
          <div className="col-md-6">
            <h2>Platform Overview</h2>
            <Pie data={pieData} />
          </div>
          <div className="col-md-6">
            <h2>Difficulty Breakdown</h2>
            <Bar data={barData} />
          </div>
        </div>
        <div className="mt-4">
          <h2>Recent Activity</h2>
          <ul>
            {stats.recent_activity.map((activity, index) => (
              <li key={index}>
                {activity.title} ({activity.platform}) - {activity.difficulty || "-"} - {new Date(activity.solved_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
