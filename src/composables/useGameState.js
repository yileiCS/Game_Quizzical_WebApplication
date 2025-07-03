/**
 * Game State Management
 * Centralized game logic and state management using Vue 3 Composition API
 */

import { ref, computed } from 'vue';

export function useGameState() {
  // Game state
  const currentPhrase = ref('');
  const currentNumber = ref(null);
  const guessedLetters = ref([]);
  const guessedPhrase = ref('');
  const guessedNumber = ref('');
  const gameOver = ref(false);
  const gameOverMessage = ref('');
  const currentScore = ref(26);

  // UI state
  const showMessage = ref(false);
  const message = ref('');
  const messageType = ref('');
  const showModal = ref(false);
  const modalMessage = ref('');

  // Constants
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const maxScore = 30;
  const initialScore = 26;

  // Computed properties
  const maskedPhrase = computed(() => {
    if (!currentPhrase.value) return '';
    return currentPhrase.value
      .split('')
      .map(char => {
        if (char === ' ') return ' ';
        if (guessedLetters.value.includes(char.toUpperCase())) return char;
        return '_';
      })
      .join('');
  });

  const correctLetters = computed(() => {
    return guessedLetters.value.filter(letter =>
      currentPhrase.value.toUpperCase().includes(letter)
    );
  });

  const wrongLetters = computed(() => {
    return guessedLetters.value.filter(letter =>
      !currentPhrase.value.toUpperCase().includes(letter)
    );
  });

  // Game actions
  const resetGame = () => {
    currentPhrase.value = '';
    currentNumber.value = null;
    guessedLetters.value = [];
    guessedPhrase.value = '';
    guessedNumber.value = '';
    gameOver.value = false;
    gameOverMessage.value = '';
    currentScore.value = initialScore;
    hideMessage();
    hideModal();
  };

  const showTemporaryMessage = (msg, type = 'info') => {
    message.value = msg;
    messageType.value = type;
    showMessage.value = true;

    setTimeout(() => {
      showMessage.value = false;
    }, 1500);
  };

  const showGameModal = (msg) => {
    modalMessage.value = msg;
    showModal.value = true;
  };

  const hideMessage = () => {
    showMessage.value = false;
    message.value = '';
    messageType.value = '';
  };

  const hideModal = () => {
    showModal.value = false;
    modalMessage.value = '';
  };

  return {
    // State
    currentPhrase,
    currentNumber,
    guessedLetters,
    guessedPhrase,
    guessedNumber,
    gameOver,
    gameOverMessage,
    currentScore,
    showMessage,
    message,
    messageType,
    showModal,
    modalMessage,

    // Constants
    letters,
    maxScore,
    initialScore,

    // Computed
    maskedPhrase,
    correctLetters,
    wrongLetters,

    // Actions
    resetGame,
    showTemporaryMessage,
    showGameModal,
    hideMessage,
    hideModal
  };
}
