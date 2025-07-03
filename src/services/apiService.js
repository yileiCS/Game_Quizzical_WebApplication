/**
 * API Service for handling data fetching
 * Provides centralized API management with fallback mechanisms
 */

import { getRandomMathLocal } from '../../utilities/localutilities.js';

export class ApiService {
  /**
   * Fetch a random math fact from Numbers API with local fallback
   * @returns {Promise<Object>} Math fact object
   */
  static async fetchMathFact() {
    try {
      const response = await fetch('https://numbersapi.com/random/math?json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.text,
        number: data.number,
        found: data.found,
        type: 'math',
        source: 'api'
      };
    } catch (error) {
      console.warn('API fetch failed, falling back to local data:', error.message);
      const localData = await getRandomMathLocal();
      return {
        ...localData,
        source: 'local'
      };
    }
  }

  /**
   * Fetch trivia data (placeholder for future expansion)
   * @returns {Promise<Object>} Trivia fact object
   */
  static async fetchTriviaFact() {
    try {
      // Placeholder for trivia API integration
      const { getRandomTriviaLocal } = await import('../../utilities/localutilities.js');
      return getRandomTriviaLocal();
    } catch (error) {
      console.error('Failed to fetch trivia fact:', error);
      throw error;
    }
  }
}
