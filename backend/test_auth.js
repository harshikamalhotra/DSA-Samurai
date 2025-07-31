const axios = require('axios');

async function testAuth() {
  const BASE_URL = 'http://localhost:3001';
  
  try {
    console.log('🧪 Testing Custom Authentication System...\n');
    
    // Test 1: Try login with enrollment ID
    console.log('1. Testing login with enrollment ID...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        username: '2401010001', // Aarushi's enrollment ID
        password: '2401010001123'
      });
      
      console.log('✅ Login successful!');
      console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
      console.log('Student:', loginResponse.data.student.name);
      
      const token = loginResponse.data.token;
      
      // Test 2: Get profile with token
      console.log('\n2. Testing profile access...');
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Profile access successful!');
      console.log('Student details:', {
        name: profileResponse.data.student.name,
        enrollment_id: profileResponse.data.student.enrollment_id,
        leetcode_id: profileResponse.data.student.leetcode_id,
        gfg_id: profileResponse.data.student.gfg_id
      });
      
    } catch (error) {
      if (error.response) {
        console.log('❌ Login failed:');
        console.log('   Status:', error.response.status);
        console.log('   Error:', error.response.data.error);
      } else {
        console.log('❌ Connection error:', error.message);
        console.log('   Make sure your server is running: npm start');
      }
    }
    
    console.log('\n🎉 Authentication test completed!');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testAuth();
