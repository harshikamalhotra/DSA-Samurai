const axios = require('axios');

// Test the leaderboard API endpoints
async function testLeaderboardAPI() {
  try {
    console.log('Testing Leaderboard API endpoints...\n');
    
    // First, login to get JWT token using Harshika's credentials
    const loginData = {
      email: 'harshika.malhotra.sot.2428@pwioi.com',
      password: '2401010035har' // enrollment_id + first 3 letters of name
    };
    
    console.log('1. Testing login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', loginData);
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Set up headers with the token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('\n2. Testing /api/leaderboard endpoint...');
    const leaderboardResponse = await axios.get('http://localhost:3001/api/leaderboard?sortBy=total_solved&limit=10', { headers });
    console.log('✅ Leaderboard endpoint working');
    console.log('Students found:', leaderboardResponse.data.leaderboard.length);
    console.log('Total students:', leaderboardResponse.data.total_students);
    
    if (leaderboardResponse.data.leaderboard.length > 0) {
      const topStudent = leaderboardResponse.data.leaderboard[0];
      console.log('Top student:', topStudent.name, '- Total solved:', topStudent.total_solved);
    }
    
    console.log('\n3. Testing /api/leaderboard/my-rank endpoint...');
    const rankResponse = await axios.get('http://localhost:3001/api/leaderboard/my-rank', { headers });
    console.log('✅ My rank endpoint working');
    console.log('Your rank:', rankResponse.data.rank);
    console.log('Problems solved:', rankResponse.data.problems_solved);
    console.log('Percentile:', rankResponse.data.percentile + '%');
    
    console.log('\n4. Testing /api/leaderboard/top-performers endpoint...');
    const topPerformersResponse = await axios.get('http://localhost:3001/api/leaderboard/top-performers', { headers });
    console.log('✅ Top performers endpoint working');
    console.log('Top 3 performers:');
    topPerformersResponse.data.top_performers.forEach((performer, index) => {
      console.log(`  ${index + 1}. ${performer.name} - ${performer.total_solved} solved`);
    });
    
    console.log('\n5. Testing /api/leaderboard/detailed endpoint...');
    const detailedResponse = await axios.get('http://localhost:3001/api/leaderboard/detailed?limit=5', { headers });
    console.log('✅ Detailed leaderboard endpoint working');
    console.log('Detailed stats for top students:');
    detailedResponse.data.leaderboard.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.name}:`);
      console.log(`     Total: ${student.total_solved}`);
      console.log(`     LeetCode: ${student.leetcode_stats.total} (E:${student.leetcode_stats.easy}, M:${student.leetcode_stats.medium}, H:${student.leetcode_stats.hard})`);
      console.log(`     GFG: ${student.gfg_stats.total} (B:${student.gfg_stats.basic}, E:${student.gfg_stats.easy}, M:${student.gfg_stats.medium}, H:${student.gfg_stats.hard})`);
    });
    
    console.log('\n🎉 All leaderboard API endpoints working successfully!');
    
  } catch (error) {
    console.error('❌ Error testing leaderboard API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLeaderboardAPI();
