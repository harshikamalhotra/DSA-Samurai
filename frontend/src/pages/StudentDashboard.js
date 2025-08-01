import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Navigation from '../components/Navigation';
import { leetcodeService } from '../services/leetcodeService';
import { gfgService } from '../services/gfgService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function StudentDashboard() {
  const { currentUser, getUserProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [gfgData, setGfgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const [gfgLoading, setGfgLoading] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile from database
        const profileResponse = await getUserProfile();
        const profile = profileResponse.student;
        setProfileData(profile);
        
        // Fetch LeetCode and GFG data in parallel if usernames are available
        const promises = [];
        
        // If user has LeetCode username, fetch their real data
        if (profile.leetcode_username) {
          setLeetcodeLoading(true);
          promises.push(
            Promise.race([
              Promise.all([
                leetcodeService.getSolvedCount(profile.leetcode_username),
                leetcodeService.getUserProfile(profile.leetcode_username),
                leetcodeService.getContestDetails(profile.leetcode_username).catch(() => null)
              ]),
              // Timeout after 15 seconds
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('LeetCode API timeout')), 15000)
              )
            ]).then(([solvedData, profileData, contestData]) => {
              console.log('LeetCode data fetched successfully:', { solvedData, profileData, contestData });
              setLeetcodeData({
                solved: solvedData,
                profile: profileData,
                contests: contestData
              });
            }).catch((leetcodeError) => {
              console.error('LeetCode API error:', leetcodeError);
              // Don't throw, just log the error
            }).finally(() => {
              setLeetcodeLoading(false);
            })
          );
        }
        
        // If user has GFG username, fetch their real data
        if (profile.gfg_username) {
          setGfgLoading(true);
          promises.push(
            Promise.race([
              gfgService.getUserProfile(profile.gfg_username),
              // Timeout after 10 seconds
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('GFG API timeout')), 10000)
              )
            ]).then((gfgProfileData) => {
              console.log('GFG data fetched successfully:', gfgProfileData);
              setGfgData({
                profile: gfgProfileData,
                solved: gfgService.parseSolvedData(gfgProfileData),
                info: gfgService.getUserInfo(gfgProfileData)
              });
            }).catch((gfgError) => {
              console.error('GFG API error:', gfgError);
              // Don't throw, just log the error
            }).finally(() => {
              setGfgLoading(false);
            })
          );
        }
        
        // Wait for all API calls to complete
        if (promises.length > 0) {
          await Promise.all(promises);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Typewriter effect for greeting
  useEffect(() => {
    if (!profileData) return; // Wait for profile data to load

    const typeText = (text, setTextCallback, onComplete) => {
      let index = 0;
      const speed = 100; // Typing speed in ms
      setTextCallback(''); // Reset text
      
      const type = () => {
        if (index < text.length) {
          setTextCallback(text.substring(0, index + 1));
          index++;
          setTimeout(type, speed);
        } else if (onComplete) {
          setTimeout(onComplete, 500); // Wait before next animation
        }
      };
      type();
    };
    
    // Type hello message first
    const helloString = `👋 Hello, ${profileData.name || currentUser?.name || 'Student'}!`;
    typeText(helloString, setTypewriterText, () => {
      // After hello message, type subtitle
      typeText("Welcome to your coding journey dashboard", setSubtitleText);
    });
    
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, [profileData, currentUser]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  // Prepare chart data for LeetCode statistics
  const difficultyData = leetcodeData?.solved ? {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      label: 'Problems Solved',
      data: [
        leetcodeData.solved.easySolved || 0,
        leetcodeData.solved.mediumSolved || 0,
        leetcodeData.solved.hardSolved || 0
      ],
      backgroundColor: ['#00d2aa', '#ffb800', '#ff2d55'],
      borderColor: ['#00d2aa', '#ffb800', '#ff2d55'],
      borderWidth: 2
    }]
  } : null;

  const progressData = leetcodeData?.solved ? {
    labels: ['Solved', 'Remaining'],
    datasets: [{
      data: [
        leetcodeData.solved.solvedProblem || 0,
        (leetcodeData.solved.totalQuestions || 0) - (leetcodeData.solved.solvedProblem || 0)
      ],
      backgroundColor: ['#4caf50', '#e0e0e0'],
      borderWidth: 0
    }]
  } : null;

  return (
    <div>
      <Navigation />
      <div className="container-fluid mt-4">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-gradient-primary p-4 rounded-3 shadow">
            <h1 className="mb-1 text-dark">
              {typewriterText}
              {typewriterText && !subtitleText && showCursor && <span style={{color: '#333'}}>|</span>}
            </h1>
            <p className="mb-0 text-dark">
              {subtitleText}
              {subtitleText && showCursor && <span style={{color: '#333'}}>|</span>}
            </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-3 text-center mb-3 mb-md-0">
                    <div className="stats-item">
                      <div className="stats-icon bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{width: '60px', height: '60px'}}>
                        <i className="fas fa-code text-white" style={{fontSize: '24px'}}></i>
                      </div>
                      <h2 className="stats-number text-primary mb-0 fw-bold">
                        {(leetcodeData?.solved?.solvedProblem || 0) + (gfgData?.solved?.totalSolved || 0)}
                      </h2>
                      <p className="stats-label text-muted mb-0">Problems Solved</p>
                      <small className="text-success">Keep coding! 💪</small>
                    </div>
                  </div>
                  
                  <div className="col-md-3 text-center mb-3 mb-md-0">
                    <div className="stats-item">
                      <div className="stats-icon bg-warning bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{width: '60px', height: '60px'}}>
                        <i className="fas fa-trophy text-white" style={{fontSize: '24px'}}></i>
                      </div>
                      <h2 className="stats-number text-warning mb-0 fw-bold">
                        {leetcodeData?.profile?.ranking || gfgData?.info?.codingScore || '---'}
                      </h2>
                      <p className="stats-label text-muted mb-0">{leetcodeData?.profile?.ranking ? 'Global Rank' : 'GFG Score'}</p>
                      <small className="text-info">Rising star! ⭐</small>
                    </div>
                  </div>
                  
                  <div className="col-md-3 text-center mb-3 mb-md-0">
                    <div className="stats-item">
                      <div className="stats-icon bg-success bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{width: '60px', height: '60px'}}>
                        <i className="fas fa-fire text-white" style={{fontSize: '24px'}}></i>
                      </div>
                      <h2 className="stats-number text-success mb-0 fw-bold">
                        {gfgData?.info?.currentStreak || profileData?.streak_count || 0}
                      </h2>
                      <p className="stats-label text-muted mb-0">Current Streak</p>
                      <small className="text-warning">On fire! 🔥</small>
                    </div>
                  </div>
                  
                  <div className="col-md-3 text-center">
                    <div className="stats-item">
                      <div className="stats-icon bg-info bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{width: '60px', height: '60px'}}>
                        <i className="fas fa-chart-line text-white" style={{fontSize: '24px'}}></i>
                      </div>
                      <h2 className="stats-number text-info mb-0 fw-bold">
                        {leetcodeData?.solved ? Math.round(((leetcodeData.solved.solvedProblem || 0) / (leetcodeData.solved.totalQuestions || 1)) * 100) : 0}%
                      </h2>
                      <p className="stats-label text-muted mb-0">Progress Rate</p>
                      <small className="text-primary">Keep going! 🚀</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LeetCode Data Section */}
        {profileData?.leetcode_username && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow">
                <div className="card-header bg-warning text-dark">
                  <h4 className="mb-0">🚀 LeetCode Progress</h4>
                  {leetcodeLoading && (
                    <small className="text-muted">Loading real-time data...</small>
                  )}
                </div>
                <div className="card-body">
                  {leetcodeLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading LeetCode data...</span>
                      </div>
                      <p className="mt-2 text-muted">Fetching your latest progress...</p>
                    </div>
                  ) : leetcodeData ? (
                    <div className="row">
                      {/* Stats Cards */}
                      <div className="col-md-3 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h2 className="text-success mb-1">{leetcodeData.solved.easySolved || 0}</h2>
                          <span className="text-muted">Easy</span>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h2 className="text-warning mb-1">{leetcodeData.solved.mediumSolved || 0}</h2>
                          <span className="text-muted">Medium</span>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h2 className="text-danger mb-1">{leetcodeData.solved.hardSolved || 0}</h2>
                          <span className="text-muted">Hard</span>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="text-center p-3 bg-primary text-white rounded">
                          <h2 className="mb-1">{leetcodeData.solved.solvedProblem || 0}</h2>
                          <span>Total</span>
                        </div>
                      </div>
                      
                      {/* Charts */}
                      <div className="col-md-6 mb-3">
                        <h5 className="text-center mb-3">Difficulty Distribution</h5>
                        {difficultyData && <Bar data={difficultyData} options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false }
                          }
                        }} />}
                      </div>
                      <div className="col-md-6 mb-3">
                        <h5 className="text-center mb-3">Overall Progress</h5>
                        {progressData && <Doughnut data={progressData} options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }} />}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">Unable to fetch LeetCode data. Please check your username.</p>
                      <p className="small">Username: <strong>{profileData.leetcode_username}</strong></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GeeksforGeeks Data Section */}
        {profileData?.gfg_username && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">💚 GeeksforGeeks Progress</h4>
                  {gfgLoading && (
                    <small className="text-light">Loading real-time data...</small>
                  )}
                </div>
                <div className="card-body">
                  {gfgLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading GFG data...</span>
                      </div>
                      <p className="mt-2 text-muted">Fetching your latest progress...</p>
                    </div>
                  ) : gfgData ? (
                    <div className="row">
                      {/* User Info */}
                      <div className="col-12 mb-4">
                        <div className="row text-center">
                          <div className="col-md-2">
                            <h6 className="text-muted">Full Name</h6>
                            <p className="h6 text-success">{gfgData.info.fullName || 'N/A'}</p>
                          </div>
                          <div className="col-md-2">
                            <h6 className="text-muted">Current Streak</h6>
                            <p className="h6 text-warning">{gfgData.info.currentStreak || 0} days</p>
                          </div>
                          <div className="col-md-2">
                            <h6 className="text-muted">Max Streak</h6>
                            <p className="h6 text-primary">{gfgData.info.maxStreak || 0} days</p>
                          </div>
                          <div className="col-md-2">
                            <h6 className="text-muted">Coding Score</h6>
                            <p className="h6 text-info">{gfgData.info.codingScore || 0}</p>
                          </div>
                          <div className="col-md-2">
                            <h6 className="text-muted">Monthly Score</h6>
                            <p className="h6 text-secondary">{gfgData.info.monthlyScore || 0}</p>
                          </div>
                          <div className="col-md-2">
                            <h6 className="text-muted">Total Solved</h6>
                            <p className="h6 text-success">{gfgData.solved.totalSolved || 0}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Difficulty Stats Cards */}
                      <div className="col-md-3 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h2 className="text-info mb-1">{gfgData.solved.basic || 0}</h2>
                          <span className="text-muted">Basic</span>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h2 className="text-success mb-1">{gfgData.solved.easy || 0}</h2>
                          <span className="text-muted">Easy</span>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h2 className="text-warning mb-1">{gfgData.solved.medium || 0}</h2>
                          <span className="text-muted">Medium</span>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h2 className="text-danger mb-1">{gfgData.solved.hard || 0}</h2>
                          <span className="text-muted">Hard</span>
                        </div>
                      </div>
                      
                      {/* GFG Chart */}
                      {gfgData.solved.totalSolved > 0 && (
                        <div className="col-12 mt-3">
                          <h5 className="text-center mb-3">Difficulty Distribution</h5>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <Bar data={{
                                labels: ['Basic', 'Easy', 'Medium', 'Hard'],
                                datasets: [{
                                  label: 'Problems Solved',
                                  data: [
                                    gfgData.solved.basic || 0,
                                    gfgData.solved.easy || 0,
                                    gfgData.solved.medium || 0,
                                    gfgData.solved.hard || 0
                                  ],
                                  backgroundColor: ['#17a2b8', '#28a745', '#ffc107', '#dc3545'],
                                  borderColor: ['#17a2b8', '#28a745', '#ffc107', '#dc3545'],
                                  borderWidth: 2
                                }]
                              }} options={{
                                responsive: true,
                                plugins: {
                                  legend: { display: false }
                                }
                              }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">Unable to fetch GeeksforGeeks data. Please check your username.</p>
                      <p className="small">Username: <strong>{profileData.gfg_username}</strong></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Username Warning */}
        {(!profileData?.leetcode_username && !profileData?.gfg_username) && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                <h5 className="alert-heading">🔗 Connect Your Coding Accounts</h5>
                <p>Add your LeetCode and GeeksforGeeks usernames in your profile to see real-time statistics and progress charts!</p>
                <a href="/profile" className="btn btn-primary btn-sm">Update Profile</a>
              </div>
            </div>
          </div>
        )}

        {/* LeetCode Only Warning */}
        {!profileData?.leetcode_username && profileData?.gfg_username && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-warning" role="alert">
                <h5 className="alert-heading">🔗 Connect Your LeetCode Account</h5>
                <p>Add your LeetCode username in your profile to see complete coding statistics!</p>
                <a href="/profile" className="btn btn-primary btn-sm">Update Profile</a>
              </div>
            </div>
          </div>
        )}

        {/* GFG Only Warning */}
        {profileData?.leetcode_username && !profileData?.gfg_username && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                <h5 className="alert-heading">🔗 Connect Your LeetCode Account</h5>
                <p>Add your LeetCode username in your profile to see real-time statistics and progress charts!</p>
                <a href="/profile" className="btn btn-primary btn-sm">Update Profile</a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;
