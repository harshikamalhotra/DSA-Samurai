import React, { useState, useEffect } from 'react';
import { questionsService } from '../services/questionsService';
import './Questions.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    difficulty: '',
    platform: '',
    status: '',
    search: '',
    sortBy: 'title',
    sortOrder: 'asc',
    category: ''
  });

  // Debounced search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionsService.getQuestions(filters);
      setQuestions(data.questions);
      setStats({
        total: data.stats.total_questions,
        solved: data.stats.solved_count,
        unsolved: data.stats.total_questions - data.stats.solved_count
      });
      setPagination({
        currentPage: data.pagination.current_page,
        totalPages: data.pagination.total_pages,
        totalCount: data.pagination.total_questions
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleStatusToggle = async (questionId, currentStatus) => {
    try {
      // Map database status to frontend status
      const frontendStatus = currentStatus === 'Solved' ? 'solved' : 'not_solved';
      const newFrontendStatus = frontendStatus === 'solved' ? 'not_solved' : 'solved';
      
      await questionsService.updateQuestionStatus(questionId, newFrontendStatus);
      
      // Map back to database status for local state update
      const newDbStatus = newFrontendStatus === 'solved' ? 'Solved' : 'Not Attempted';
      
      // Update the question in the local state
      setQuestions(prev => prev.map(q => 
        q._id === questionId ? { ...q, status: newDbStatus } : q
      ));
      
      // Refresh stats
      fetchQuestions();
    } catch (err) {
      console.error('Error updating question status:', err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#00b894';
      case 'medium': return '#fdcb6e';
      case 'hard': return '#e84393';
      case 'basic': return '#74b9ff';
      default: return '#636e72';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'leetcode': return '🔥';
      case 'geeksforgeeks': return '🚀';
      default: return '💻';
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="questions-container">
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="questions-container">
        <div className="error">Error: {error}</div>
        <button onClick={fetchQuestions} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <div className="questions-header">
        <h2>Coding Questions</h2>
        
        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-card">
            <span className="stat-number">{stats.total || 0}</span>
            <span className="stat-label">Total Questions</span>
          </div>
          <div className="stat-card solved">
            <span className="stat-number">{stats.solved || 0}</span>
            <span className="stat-label">Solved</span>
          </div>
          <div className="stat-card unsolved">
            <span className="stat-number">{stats.unsolved || 0}</span>
            <span className="stat-label">Remaining</span>
          </div>
          <div className="stat-card progress">
            <span className="stat-number">
              {stats.total ? Math.round((stats.solved / stats.total) * 100) : 0}%
            </span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="filter-select"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Basic">Basic</option>
          </select>

          <select
            value={filters.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            className="filter-select"
          >
            <option value="">All Platforms</option>
            <option value="LeetCode">LeetCode</option>
            <option value="GeeksforGeeks">GeeksforGeeks</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="solved">Solved</option>
            <option value="not_solved">Not Solved</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="title">Title</option>
            <option value="difficulty">Difficulty</option>
            <option value="platform">Platform</option>
            <option value="createdAt">Date Added</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {questions.length === 0 ? (
          <div className="no-questions">No questions found matching your criteria.</div>
        ) : (
          questions.map((question) => (
            <div key={question._id} className={`question-card ${question.status}`}>
              <div className="question-header">
                <div className="question-title-section">
                  <button
                    className={`status-toggle ${question.status === 'Solved' ? 'solved' : 'not-solved'}`}
                    onClick={() => handleStatusToggle(question._id, question.status)}
                    title={question.status === 'Solved' ? 'Mark as unsolved' : 'Mark as solved'}
                  >
                    {question.status === 'Solved' ? '✓' : '○'}
                  </button>
                  
                  <div className="question-info">
                    <h3 className="question-title">{question.title}</h3>
                    <div className="question-meta">
                      <span className="platform">
                        {getPlatformIcon(question.platform)} {question.platform}
                      </span>
                      <span 
                        className="difficulty"
                        style={{ color: getDifficultyColor(question.difficulty) }}
                      >
                        {question.difficulty}
                      </span>
                      {question.category && (
                        <span className="category">{question.category}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="question-actions">
                  <a
                    href={question.question_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="solve-btn"
                  >
                    Solve
                  </a>
                </div>
              </div>

              {question.tags && question.tags.length > 0 && (
                <div className="question-tags">
                  {question.tags.slice(0, 5).map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                  {question.tags.length > 5 && (
                    <span className="tag more">+{question.tags.length - 5} more</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            <span className="total-count">
              ({pagination.totalCount} total questions)
            </span>
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Questions;
