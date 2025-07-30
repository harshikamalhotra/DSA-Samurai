import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

function Profile() {
  const { currentUser, userProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: currentUser?.email || '',
    leetcode_id: userProfile?.leetcode_id || '',
    gfg_id: userProfile?.gfg_id || '',
    phone: userProfile?.phone || ''
  });

  const handleSave = () => {
    // API call to update profile
    console.log('Saving profile:', formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile?.name || '',
      email: currentUser?.email || '',
      leetcode_id: userProfile?.leetcode_id || '',
      gfg_id: userProfile?.gfg_id || '',
      phone: userProfile?.phone || ''
    });
    setEditMode(false);
  };

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <h1>Profile</h1>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 text-center">
                <div className="mb-3">
                  <div className="rounded-circle bg-primary d-inline-flex justify-content-center align-items-center" 
                       style={{width: '100px', height: '100px', fontSize: '48px', color: 'white'}}>
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </div>
                </div>
                <h4>{currentUser?.displayName || 'User'}</h4>
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
                      <label className="form-label">LeetCode ID</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.leetcode_id}
                          onChange={(e) => setFormData({...formData, leetcode_id: e.target.value})}
                        />
                      ) : (
                        <p className="form-control-plaintext">{formData.leetcode_id || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">GeeksForGeeks ID</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.gfg_id}
                          onChange={(e) => setFormData({...formData, gfg_id: e.target.value})}
                        />
                      ) : (
                        <p className="form-control-plaintext">{formData.gfg_id || 'Not set'}</p>
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
