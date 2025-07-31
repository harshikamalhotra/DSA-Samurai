const LEETCODE_API_BASE = 'https://alfa-leetcode-api.onrender.com';

export const leetcodeService = {
  // Get user profile details
  async getUserProfile(username) {
    try {
      const response = await fetch(`${LEETCODE_API_BASE}/userProfile/${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch profile for ${username}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching LeetCode profile:', error);
      throw error;
    }
  },

  // Get user solved questions count
  async getSolvedCount(username) {
    try {
      console.log(`Fetching LeetCode solved count for: ${username}`);
      const url = `${LEETCODE_API_BASE}/${username}/solved`;
      console.log(`LeetCode API URL: ${url}`);
      
      const response = await fetch(url);
      console.log(`LeetCode API Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`LeetCode API Error Response: ${errorText}`);
        throw new Error(`LeetCode API returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('LeetCode solved data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching LeetCode solved count:', error);
      throw error;
    }
  },

  // Get user contest details
  async getContestDetails(username) {
    try {
      const response = await fetch(`${LEETCODE_API_BASE}/${username}/contest`);
      if (!response.ok) {
        throw new Error(`Failed to fetch contest details for ${username}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching LeetCode contest details:', error);
      throw error;
    }
  },

  // Get user submissions
  async getSubmissions(username) {
    try {
      const response = await fetch(`${LEETCODE_API_BASE}/${username}/submission`);
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions for ${username}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching LeetCode submissions:', error);
      throw error;
    }
  },

  // Get user accepted submissions
  async getAcceptedSubmissions(username) {
    try {
      const response = await fetch(`${LEETCODE_API_BASE}/${username}/acSubmission`);
      if (!response.ok) {
        throw new Error(`Failed to fetch accepted submissions for ${username}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching LeetCode accepted submissions:', error);
      throw error;
    }
  },

  // Get user badges
  async getBadges(username) {
    try {
      const response = await fetch(`${LEETCODE_API_BASE}/${username}/badges`);
      if (!response.ok) {
        throw new Error(`Failed to fetch badges for ${username}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching LeetCode badges:', error);
      throw error;
    }
  },

  // Get language stats
  async getLanguageStats(username) {
    try {
      const response = await fetch(`${LEETCODE_API_BASE}/languageStats?username=${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch language stats for ${username}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching LeetCode language stats:', error);
      throw error;
    }
  },

  // Get skill stats
  async getSkillStats(username) {
    try {
      const response = await fetch(`${LEETCODE_API_BASE}/skillStats/${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch skill stats for ${username}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching LeetCode skill stats:', error);
      throw error;
    }
  }
};
