import React, { useState } from 'react';
import Navigation from '../components/Navigation';

function AdminPanel() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', link: '', difficulty: 'Easy', platform: 'LeetCode' });

  const handleAddQuestion = () => {
    if (newQuestion.title && newQuestion.link) {
      setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
      setNewQuestion({ title: '', link: '', difficulty: 'Easy', platform: 'LeetCode' });
    }
  };

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>Admin Panel</h1>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Add New Question</h5>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Question Title"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Question Link"
                value={newQuestion.link}
                onChange={(e) => setNewQuestion({ ...newQuestion, link: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" onClick={handleAddQuestion}>
              Add Question
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <h3>Questions List</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Platform</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.title}</td>
                  <td>{question.platform}</td>
                  <td>{question.difficulty}</td>
                  <td>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
