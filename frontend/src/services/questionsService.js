import api from './api';

export const questionsService = {
  // Fetch questions with filters and pagination
  async getQuestions(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter params
      if (params.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params.platform) queryParams.append('platform', params.platform);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.category) queryParams.append('category', params.category);
      
      const response = await api.get(`/questions?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Mark question as solved/unsolved
  async updateQuestionStatus(questionId, status) {
    try {
      const response = await api.put(`/questions/${questionId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating question status:', error);
      throw error;
    }
  }
};
