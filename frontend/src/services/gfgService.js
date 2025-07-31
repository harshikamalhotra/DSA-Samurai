// Use CORS proxy to avoid CORS issues
const GFG_API_BASE = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://geeks-for-geeks-api.vercel.app');

export const gfgService = {
  // Get user profile and stats
  async getUserProfile(username) {
    try {
      console.log(`Fetching GFG profile for: ${username}`);
      
      // Create the proper CORS proxy URL
      const targetUrl = `https://geeks-for-geeks-api.vercel.app/${username}`;
      const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      
      console.log(`Target GFG API URL: ${targetUrl}`);
      console.log(`CORS Proxy URL: ${corsProxyUrl}`);
      
      const response = await fetch(corsProxyUrl);
      console.log(`CORS Proxy Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`CORS Proxy Error Response: ${errorText}`);
        throw new Error(`CORS Proxy returned ${response.status}: ${errorText}`);
      }
      
      const proxyData = await response.json();
      console.log('CORS Proxy Data:', proxyData);
      
      // AllOrigins returns the actual API response in the 'contents' field
      if (!proxyData.contents) {
        throw new Error('No contents received from CORS proxy');
      }
      
      // Parse the actual GFG API response
      const data = JSON.parse(proxyData.contents);
      console.log('GFG profile data:', data);
      
      // Check if profile was found
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching GFG profile:', error);
      throw error;
    }
  },

  // Parse solved problems from the profile data
  parseSolvedData(profileData) {
    if (!profileData || !profileData.solvedStats) {
      return {
        totalSolved: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        basic: 0
      };
    }

    const stats = profileData.solvedStats;
    return {
      totalSolved: profileData.info?.totalProblemsSolved || 0,
      easy: stats.easy?.count || 0,
      medium: stats.medium?.count || 0,
      hard: stats.hard?.count || 0,
      basic: stats.basic?.count || 0
    };
  },

  // Get user info from profile data
  getUserInfo(profileData) {
    if (!profileData || !profileData.info) {
      return {
        userName: '',
        fullName: '',
        currentStreak: 0,
        maxStreak: 0,
        codingScore: 0,
        monthlyScore: 0
      };
    }

    return {
      userName: profileData.info.userName || '',
      fullName: profileData.info.fullName || '',
      currentStreak: profileData.info.currentStreak || 0,
      maxStreak: profileData.info.maxStreak || 0,
      codingScore: profileData.info.codingScore || 0,
      monthlyScore: profileData.info.monthlyScore || 0
    };
  }
};
