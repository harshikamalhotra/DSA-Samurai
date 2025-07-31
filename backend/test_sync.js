const axios = require('axios');

// Test the sync functionality without authentication
async function testSync() {
  try {
    console.log('Testing sync functionality...');
    
    // First, let's test the no-auth endpoint
    const testResponse = await axios.get('http://localhost:3001/api/sync/test-no-auth');
    console.log('Test endpoint response:', testResponse.data);
    
    // Test sync with the actual student ID created earlier
    const studentId = '688b9fea640710be69f37b87';
    console.log(`\nTesting sync for student ID: ${studentId}`);
    
    const syncResponse = await axios.post(`http://localhost:3001/api/sync/test-sync/${studentId}`);
    console.log('Sync response:', syncResponse.data);
    
    console.log('\nSync test completed successfully!');
    
  } catch (error) {
    console.error('Error testing sync:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSync();
