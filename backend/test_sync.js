const axios = require('axios');

// Test the sync functionality
async function testSync() {
  const BASE_URL = 'http://localhost:3001';
  
  try {
    console.log('🧪 Testing DSA-Samurai Sync System...\n');
    
    // Test 1: Check if sync service is running
    console.log('1. Testing sync service health...');
    try {
      const response = await axios.get(`${BASE_URL}/api/sync/test`, {
        headers: { 'Authorization': 'Bearer test-token' }
      });
      console.log('✅ Sync service is running:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('❌ Sync service test failed:');
        console.log('   Status:', error.response.status);
        console.log('   Data:', error.response.data);
        if (error.response.status === 401) {
          console.log('   Note: This is expected - we need a valid Firebase token for authentication');
        }
      } else {
        console.log('❌ Sync service test failed:', error.message);
        console.log('   This might mean the server is not running');
        return;
      }
    }
    
    // Test 2: Test LeetCode API directly
    console.log('\n2. Testing LeetCode API directly...');
    try {
      const leetcodeResponse = await axios.get('https://alfa-leetcode-api.onrender.com/aarushi_28/acSubmission?limit=5');
      console.log('✅ LeetCode API working. Sample data:');
      if (leetcodeResponse.data.submission && leetcodeResponse.data.submission.length > 0) {
        console.log(`   - Found ${leetcodeResponse.data.submission.length} submissions`);
        console.log(`   - Latest problem: ${leetcodeResponse.data.submission[0].title}`);
      } else {
        console.log('   - No submissions found for this user');
      }
    } catch (error) {
      console.log('❌ LeetCode API test failed:', error.message);
    }
    
    // Test 3: Get a student ID from database
    console.log('\n3. Getting student ID for testing...');
    try {
      // We need to first get students from database
      // For now, we'll just show how to test with a student ID
      console.log('   To test sync, you need:');
      console.log('   - A student ID from your database');
      console.log('   - That student must have a leetcode_id set');
      console.log('   - Some questions in your questions table');
      console.log('\n   Example sync test command:');
      console.log('   POST http://localhost:3001/api/sync/student/1');
    } catch (error) {
      console.log('❌ Database test failed:', error.message);
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.log('❌ General error:', error.message);
  }
}

// Run the test
testSync();
