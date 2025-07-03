/**
 * Game Logic Utilities
 * Pure functions for game calculations and scoring
 */

/**
 * Calculate score reduction for wrong letter guesses
 * @param {string} phrase - The current phrase
 * @param {Array} guessedLetters - Array of already guessed letters
 * @param {string} wrongLetter - The incorrectly guessed letter
 * @returns {number} Score reduction amount
 */
export function calculateScoreReduction(phrase, guessedLetters, wrongLetter) {
  const remainingLetters = getRemainingLetters(phrase, guessedLetters);
  const possibleWrongLetters = remainingLetters.filter(letter =>
    !phrase.toUpperCase().includes(letter)
  );

  return possibleWrongLetters.length > 0 ? 1 / possibleWrongLetters.length : 0;
}

/**
 * Get letters that haven't been guessed yet
 * @param {string} phrase - The current phrase
 * @param {Array} guessedLetters - Array of already guessed letters
 * @returns {Array} Array of remaining letters
 */
export function getRemainingLetters(phrase, guessedLetters) {
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return allLetters.filter(letter => !guessedLetters.includes(letter));
}

/**
 * Calculate final score based on guess accuracy
 * @param {number} currentScore - Current game score
 * @param {boolean} numberCorrect - Whether the number guess is correct
 * @param {boolean} phraseCorrect - Whether the phrase guess is correct
 * @returns {Object} Score calculation result
 */
export function calculateFinalScore(currentScore, numberCorrect, phraseCorrect) {
  const maxScore = 30;

  if (numberCorrect && phraseCorrect) {
    // Both correct: add 4 points (max 30)
    const finalScore = Math.min(currentScore + 4, maxScore);
    return {
      score: finalScore,
      message: `Excellent! Both answers correct! +4 points`,
      type: 'success'
    };
  } else if (numberCorrect || phraseCorrect) {
    // Partially correct: halve current score
    const finalScore = currentScore / 2;
    const correctPart = numberCorrect ? 'number' : 'phrase';
    return {
      score: finalScore,
      message: `Good job! ${correctPart} is correct, but score halved for partial answer.`,
      type: 'partial'
    };
  } else {
    // Both wrong: 0 points
    return {
      score: 0,
      message: `Sorry, both answers were incorrect. Better luck next time!`,
      type: 'failure'
    };
  }
}

/**
 * Normalize text for comparison (remove extra spaces, convert to lowercase)
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeText(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Check if phrase guess is approximately correct
 * @param {string} guess - User's guess
 * @param {string} actual - Actual phrase
 * @returns {boolean} Whether the guess is close enough
 */
export function isPhraseMatch(guess, actual) {
  const normalizedGuess = normalizeText(guess);
  const normalizedActual = normalizeText(actual);

  // Exact match
  if (normalizedGuess === normalizedActual) {
    return true;
  }

  // Check if guess contains most of the key words
  const actualWords = normalizedActual.split(' ').filter(word => word.length > 2);
  const guessWords = normalizedGuess.split(' ');

  const matchedWords = actualWords.filter(word =>
    guessWords.some(guessWord =>
      guessWord.includes(word) || word.includes(guessWord)
    )
  );

  // Consider it a match if most key words are present
  return matchedWords.length >= Math.ceil(actualWords.length * 0.7);
}

/**
 * Shuffle array elements (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
