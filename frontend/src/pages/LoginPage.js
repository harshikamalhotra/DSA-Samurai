import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FirebaseDiagnostic from '../components/FirebaseDiagnostic';
import './LoginPage.css';

function LoginPage() {
  const [isStudentTab, setIsStudentTab] = useState(true);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
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
              <p>Please sign in with your college Google account.</p>
              <button 
                className="btn btn-primary btn-google mt-2" 
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>
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
                <a href="#" className="forgot-password">Forgot Password?</a>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
