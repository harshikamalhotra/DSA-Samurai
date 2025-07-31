import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

function Leaderboard() {
  const { token } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // For now, show mock data until we create the leaderboard API
        const mockData = [
          {
            id: '688b9fea640710be69f37b87',
            name: 'Test Student',
            total_solved: 1,
            leetcode_solved: 0,
            gfg_solved: 1,
            streak_count: 0,
            last_active: new Date()
          }
        ];
        setLeaderboard(mockData);
      } catch (err) {
        setError('Failed to load leaderboard.');
        console.error('Leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (loading) return <div className="loading">Loading leaderboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>🏆 Leaderboard</h1>
        
        {leaderboard.length === 0 ? (
          <div className="alert alert-info">
            No data available yet. Complete some problems to see the leaderboard!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>🥇 Rank</th>
                  <th>👤 Name</th>
                  <th>📊 Total Solved</th>
                  <th>💻 LeetCode</th>
                  <th>🌟 GeeksforGeeks</th>
                  <th>🔥 Current Streak</th>
                  <th>📅 Last Active</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((student, index) => (
                  <tr key={student.id}>
                    <td>
                      <span className={`badge ${
                        index === 0 ? 'bg-warning' : 
                        index === 1 ? 'bg-secondary' : 
                        index === 2 ? 'bg-warning' : 'bg-primary'
                      }`}>
                        {index + 1}
                        {index === 0 && ' 🥇'}
                        {index === 1 && ' 🥈'}
                        {index === 2 && ' 🥉'}
                      </span>
                    </td>
                    <td><strong>{student.name}</strong></td>
                    <td>
                      <span className="badge bg-success">{student.total_solved}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary">{student.leetcode_solved}</span>
                    </td>
                    <td>
                      <span className="badge bg-info">{student.gfg_solved}</span>
                    </td>
                    <td>
                      <span className="badge bg-danger">{student.streak_count}</span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {student.last_active ? new Date(student.last_active).toLocaleDateString() : 'Never'}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
