const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001/api';

async function testLoginFlow() {
  try {
    console.log('Testing login flow...');
    
    // Step 1: Login
    console.log('\n1. Testing login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'harshika.malhotra.sot.2428@pwioi.com',
        password: '2401010035har'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginResponse.ok) {
      throw new Error('Login failed: ' + loginData.error);
    }
    
    const token = loginData.token;
    console.log('✅ Login successful');
    
    // Step 2: Get profile
    console.log('\n2. Testing /auth/me...');
    const profileResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile response:', profileData);
    
    if (!profileResponse.ok) {
      throw new Error('Profile fetch failed: ' + profileData.error);
    }
    
    console.log('✅ Profile fetch successful');
    
    // Step 3: Get stats
    console.log('\n3. Testing /user/stats...');
    const statsResponse = await fetch(`${API_BASE_URL}/user/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const statsData = await statsResponse.json();
    console.log('Stats response:', statsData);
    
    if (!statsResponse.ok) {
      throw new Error('Stats fetch failed: ' + statsData.error);
    }
    
    console.log('✅ Stats fetch successful');
    console.log('\n🎉 All tests passed! Login flow works correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLoginFlow();
