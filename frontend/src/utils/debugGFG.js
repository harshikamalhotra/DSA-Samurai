// Debug file to test GFG API
export const testGFGAPI = async (username) => {
  console.log(`🔍 Testing GFG API for username: ${username}`);
  
  // Use proxy-friendly URL in development
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? '' 
    : 'https://geeks-for-geeks-api.vercel.app';
  const url = `${baseUrl}/${username}`;
  console.log(`📡 API URL: ${url}`);
  
  try {
    // Test with fetch
    console.log('🚀 Making fetch request...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📊 Response OK: ${response.ok}`);
    console.log(`📊 Response Headers:`, [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('✅ Response Data:', data);
    
    // Check for common issues
    if (data.error) {
      console.error('❌ API returned error:', data.error);
      if (data.error === 'Profile Not Found') {
        console.log('💡 Suggestion: Check if the username is correct and public');
      }
    } else {
      console.log('🎉 API call successful!');
      console.log('📈 Total Problems Solved:', data.info?.totalProblemsSolved);
      console.log('📊 Solved Stats:', data.solvedStats);
    }
    
    return data;
  } catch (error) {
    console.error('💥 API Error:', error);
    
    // Check for common error types
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('🌐 This might be a CORS or network issue');
    }
    
    throw error;
  }
};

// Test with a known working username
export const testWithKnownUsername = async () => {
  console.log('🧪 Testing with known working username...');
  
  // Test with the username from your screenshot
  try {
    await testGFGAPI('malhotraharshika');
  } catch (error) {
    console.error('Test failed:', error);
  }
};
