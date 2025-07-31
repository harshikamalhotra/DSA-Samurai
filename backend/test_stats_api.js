const axios = require('axios');

// Test the stats API endpoints
async function testStatsAPI() {
  try {
    console.log('Testing Stats API endpoints...\n');
    
    // First, we need to login to get a JWT token
    const loginData = {
      email: 'test@example.com',
      password: '2401010999tes'
    };
    
    console.log('1. Testing login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', loginData);
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('Student:', loginResponse.data.student.name);
    
    // Set up headers with the token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('\n2. Testing /api/user/profile endpoint...');
    const profileResponse = await axios.get('http://localhost:3001/api/user/profile', { headers });
    console.log('✅ Profile endpoint working');
    console.log('LeetCode progress:', profileResponse.data.progress.leetcode.length);
    console.log('GFG progress:', profileResponse.data.progress.geeksforgeeks.length);
    
    console.log('\n3. Testing /api/user/stats endpoint...');
    const statsResponse = await axios.get('http://localhost:3001/api/user/stats', { headers });
    console.log('✅ Stats endpoint working');
    console.log('Total solved:', statsResponse.data.stats.total_solved);
    console.log('LeetCode solved:', statsResponse.data.stats.platforms.leetcode.solved);
    console.log('GFG solved:', statsResponse.data.stats.platforms.geeksforgeeks.solved);
    console.log('Recent activity:', statsResponse.data.stats.recent_activity.length, 'items');
    
    console.log('\n4. Testing /api/user/solved-questions endpoint...');
    const questionsResponse = await axios.get('http://localhost:3001/api/user/solved-questions?limit=5', { headers });
    console.log('✅ Solved questions endpoint working');
    console.log('Questions returned:', questionsResponse.data.questions.length);
    console.log('Total count:', questionsResponse.data.pagination.total_count);
    
    // Show detailed stats
    console.log('\n📊 DETAILED STATS:');
    console.log('==================');
    const stats = statsResponse.data.stats;
    console.log(`Total Problems Solved: ${stats.total_solved}`);
    console.log(`Current Streak: ${stats.streak_count}`);
    console.log('\\nPlatform Breakdown:');
    console.log(`  LeetCode: ${stats.platforms.leetcode.solved} solved`);
    console.log(`    - Easy: ${stats.platforms.leetcode.easy}`);
    console.log(`    - Medium: ${stats.platforms.leetcode.medium}`);
    console.log(`    - Hard: ${stats.platforms.leetcode.hard}`);
    console.log(`  GeeksforGeeks: ${stats.platforms.geeksforgeeks.solved} solved`);
    console.log(`    - Basic: ${stats.platforms.geeksforgeeks.basic}`);
    console.log(`    - Easy: ${stats.platforms.geeksforgeeks.easy}`);
    console.log(`    - Medium: ${stats.platforms.geeksforgeeks.medium}`);
    console.log(`    - Hard: ${stats.platforms.geeksforgeeks.hard}`);
    
    if (stats.recent_activity.length > 0) {
      console.log('\\n🕐 Recent Activity:');
      stats.recent_activity.forEach((activity, index) => {
        console.log(`  ${index + 1}. ${activity.title} (${activity.platform}) - ${activity.difficulty}`);
      });
    }
    
    console.log('\\n🎉 All API endpoints working successfully!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testStatsAPI();
