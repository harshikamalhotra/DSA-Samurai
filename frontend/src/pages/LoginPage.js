import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [isStudentTab, setIsStudentTab] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card card">
          <div className="login-tabs">
            <button 
              className={`tab ${!isStudentTab ? 'active' : ''}`}
              onClick={() => setIsStudentTab(false)}
            >
              Admin / Teacher
            </button>
            <button 
              className={`tab ${isStudentTab ? 'active' : ''}`}
              onClick={() => setIsStudentTab(true)}
            >
              Student
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}

          {isStudentTab ? (
            <div className="login-form student-form">
              <h2 className="card-title">Student Login</h2>
              <p>Enter your email and password to access your dashboard.</p>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label" htmlFor="student-email">Email</label>
                  <input 
                    className="form-input" 
                    type="email" 
                    id="student-email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="student-password">Password</label>
                  <input 
                    className="form-input" 
                    type="password" 
                    id="student-password" 
                    placeholder="Enrollment ID + first 3 letters of name"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary mt-2"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>
              <div className="login-help">
                <small>Password format: EnrollmentID + first 3 letters of your name (lowercase)</small>
                <br />
                <small>Example: 2401010035har</small>
              </div>
            </div>
          ) : (
            <div className="login-form admin-form">
              <h2 className="card-title">Admin Login</h2>
              <form>
                <div className="form-group">
                  <label className="form-label" htmlFor="admin-username">Username</label>
                  <input className="form-input" type="text" id="admin-username" placeholder="Enter your username" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="admin-password">Password</label>
                  <input className="form-input" type="password" id="admin-password" placeholder="Enter your password" />
                </div>
                <button type="submit" className="btn btn-primary mt-2" disabled>Login</button>
                <button type="button" className="btn btn-link forgot-password">Forgot Password?</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
