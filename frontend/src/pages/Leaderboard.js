import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all-time');

  // Mock data - replace with API call
  const mockStudents = [
    { id: 1, name: 'Alice Johnson', solved: 120, rank: 1 },
    { id: 2, name: 'Bob Smith', solved: 105, rank: 2 },
    { id: 3, name: 'Charlie Brown', solved: 95, rank: 3 },
    { id: 4, name: 'Diana Prince', solved: 88, rank: 4 },
    { id: 5, name: 'Edward Norton', solved: 75, rank: 5 },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
    }, 500);
  }, []);

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>Leaderboard</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <button 
              className={`btn ${filter === 'all-time' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setFilter('all-time')}
            >
              All Time
            </button>
            <button 
              className={`btn ${filter === 'weekly' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('weekly')}
            >
              Weekly
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Problems Solved</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className={`badge ${student.rank <= 3 ? 'bg-warning' : 'bg-secondary'}`}>
                        #{student.rank}
                      </span>
                    </td>
                    <td>{student.name}</td>
                    <td>{student.solved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
