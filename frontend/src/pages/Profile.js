import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

function Profile() {
  const { currentUser, getUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    leetcode_username: '',
    gfg_username: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await getUserProfile();
        console.log('Profile data:', profileResponse);
        
        const profile = profileResponse.student;
        setProfileData(profile);
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          leetcode_username: profile.leetcode_username || '',
          gfg_username: profile.gfg_username || '',
          phone: profile.phone || ''
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      // API call to update profile
      const response = await fetch('http://localhost:3001/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          leetcode_username: formData.leetcode_username,
          gfg_username: formData.gfg_username,
          phone: formData.phone
        })
      });

      const data = await response.json();
      if (response.ok) {
        setProfileData({...profileData, ...formData});
        setEditMode(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileData?.name || '',
      email: profileData?.email || '',
      leetcode_username: profileData?.leetcode_username || '',
      gfg_username: profileData?.gfg_username || '',
      phone: profileData?.phone || ''
    });
    setEditMode(false);
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profileData) return <div>No profile data available</div>;

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>👤 Profile</h1>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 text-center">
                <div className="mb-3">
                  <div className="rounded-circle bg-primary d-inline-flex justify-content-center align-items-center" 
                       style={{width: '100px', height: '100px', fontSize: '48px', color: 'white'}}>
                    {profileData.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <h4>{profileData.name || 'User'}</h4>
              </div>
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      ) : (
                        <p className="form-control-plaintext">{formData.name || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <p className="form-control-plaintext">{formData.email}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">LeetCode Username</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.leetcode_username}
                          onChange={(e) => setFormData({...formData, leetcode_username: e.target.value})}
                        />
                      ) : (
                        <p className="form-control-plaintext">{formData.leetcode_username || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">GeeksForGeeks Username</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.gfg_username}
                          onChange={(e) => setFormData({...formData, gfg_username: e.target.value})}
                        />
                      ) : (
                        <p className="form-control-plaintext">{formData.gfg_username || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  {editMode ? (
                    <>
                      <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                      <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
