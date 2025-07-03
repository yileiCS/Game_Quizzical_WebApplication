<template>
  <section class="game-section">
    <!-- Score Display -->
    <section class="score-display" aria-labelledby="score-heading">
      <h2 id="score-heading">
        Current Score: 
        <span class="score-text" aria-live="polite">
          {{ currentScore.toFixed(2) }} points
        </span>
      </h2>
    </section>

    <!-- Game Control Buttons -->
    <div class="game-controlss" role="toolbar" aria-label="Game Controls">
      <button 
        @click="startNewGame" 
        class="control-button"
        aria-label="Start New Question">
        New Question
      </button>
      <button 
        @click="resetGame" 
        class="control-button"
        aria-label="Reset Game with 26 points">
        Reset Game (26 points)
      </button>
    </div>

    <!-- Letter Buttons -->
    <div class="letter-buttons" role="group" aria-label="Letter Selection">
      <button 
        v-for="letter in letters" 
        :key="letter" 
        :disabled="guessedLetters.includes(letter)" 
        :class="{
          'correct': correctLetters.includes(letter),
          'wrong': wrongLetters.includes(letter)
        }" 
        @click="guessLetter(letter)" 
        :aria-label="`Guess letter ${letter}${guessedLetters.includes(letter) ? ' (already guessed)' : ''}`"
        :aria-pressed="guessedLetters.includes(letter)"
      >
        {{ letter }}
      </button>
    </div>

    <!-- notification message -->
    <div v-if="showMessage" class="message-popup" 
      :class="messageType"
      role="alert"
      aria-live="assertive"
    >
      {{ message }}
    </div>
    <!-- Clue Display -->
    <div class="clue-display" aria-live="polite">
      <p aria-label="Current Clue">Clue: [{{ maskedPhrase }}]</p>
      <div class="answer-line" role="form" aria-label="Answer submission form">
        <label for="number-input">Answer:</label>
        <input
          id="number-input"
          type="number" 
          v-model="guessedNumber" 
          placeholder="Enter number" 
          aria-label="Enter your number guess"
          class="inline-input"
        > 
        <span aria-hidden="true">is</span>
        <input 
          id="phrase-input"
          type="text" 
          v-model="guessedPhrase" 
          placeholder="Enter phrase" 
          aria-label="Enter your phrase guess"
          class="inline-input phrase-input"
        >
        <button 
          @click="submitGuess" 
          class="submit-button"
          aria-label="Submit your answer">
          Submit Answer
        </button>
      </div>
    </div>

    <!-- Game Over Message -->
    <div class="game-over" 
      v-if="gameOver" 
      role="alert"
      aria-live="polite"
    >
      <p>{{ gameOverMessage }}</p>
      <p>Final Score: {{ currentScore.toFixed(2) }}</p>
      <button 
        @click="startNewGame"
        aria-label="Start a new game">
        New Game
      </button>
    </div>

    <!-- Modal -->
    <div 
      v-if="showModal" 
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="modal-content">
        <p id="modal-title">{{ modalMessage }}</p>
        <button 
          @click="closeModal" 
          class="modal-button"
          aria-label="Close modal">
          OK
        </button>
      </div>
    </div>
    
  </section>
</template>

<script>
import { ref, computed } from 'vue';
import { getRandomMathLocal } from '../../utilities/localutilities.js';

export default {
  name: 'GameComponent',
  emits: ['game-completed'],

  setup(props, { emit }) {
    // Reactive Data
    const currentPhrase = ref('');
    const currentNumber = ref(null);
    const guessedLetters = ref([]);
    const guessedPhrase = ref('');
    const guessedNumber = ref('');
    const gameOver = ref(false);
    const gameOverMessage = ref('');
    const currentScore = ref(26);
    const showMessage = ref(false);
    const message = ref('');
    const messageType = ref('');
    const showModal = ref(false);
    const modalMessage = ref('');

    // Constants
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Computed Properties
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

    const showTemporaryMessage = (msg, type) => {
      message.value = msg;
      messageType.value = type;
      showMessage.value = true;
      
      setTimeout(() => {
        showMessage.value = false;
      }, 1500);
    };

    const fetchNewFact = async () => {
      try {
        const response = await fetch('https://numbersapi.com/random/math?json');
        const data = await response.json();
        return {
          text: data.text,
          number: data.number,
          found: data.found,
          type: 'math'
        };
      } catch (err) {
        console.log("Falling back to local data...");
        return getRandomMathLocal();
      }
    };

    const calculatePenalty = () => {
      // Get all unique letters that are not in the phrase
      const phraseLetters = new Set(currentPhrase.value.toUpperCase().split(''));
      const wrongLetters = letters.filter(letter => !phraseLetters.has(letter));
      return 26 / wrongLetters.length;
    };

    const guessLetter = (letter) => {
      if (!guessedLetters.value.includes(letter)) {
        guessedLetters.value.push(letter);

        // Check if letter is wrong
        if (currentPhrase.value.toUpperCase().includes(letter)) {
          showTemporaryMessage('Good guess!', 'success');
        } else {
          const penalty = calculatePenalty();
          currentScore.value = Math.max(0, currentScore.value - penalty);
          showTemporaryMessage('Sorry, it\'s wrong.', 'error');

          if (currentScore.value === 0) {
            modalMessage.value = "Game over! You've run out of points. Please reset the game.";
            showModal.value = true;
            gameOver.value = true;
          }
        }
      }
    };

    const closeModal = () => {
      showModal.value = false;
    };
    
    const submitGuess = () => {
      const normalizedPhrase = currentPhrase.value.toLowerCase().trim();
      const normalizedGuess = guessedPhrase.value.toLowerCase().trim();
      const correctNumber = currentNumber.value === Number(guessedNumber.value);
      const correctPhrase = normalizedPhrase === normalizedGuess;

      if (correctNumber && correctPhrase) {
        currentScore.value = Math.min(30, currentScore.value + 4);
        gameOverMessage.value = "Congratulations! Both number and phrase are correct!";
      } else if (correctNumber) {
        currentScore.value = currentScore.value / 2;
        gameOverMessage.value = "Number is correct, but phrase is wrong.";
      } else if (correctPhrase) {
        currentScore.value = currentScore.value / 2;
        gameOverMessage.value = "Phrase is correct, but number is wrong.";
      } else {
        currentScore.value = 0;
        gameOverMessage.value = "Sorry, both guesses are incorrect.";
      }

      emit('game-completed', {
        score: currentScore.value,
        number: currentNumber.value,
        phrase: currentPhrase.value
      });

      gameOver.value = true;
    };

    const startNewGame = async () => {
      try {
        const data = await fetchNewFact();
        currentPhrase.value = data.text;
        currentNumber.value = data.number;
        guessedLetters.value = [];
        guessedPhrase.value = '';
        guessedNumber.value = '';
        gameOver.value = false;
        gameOverMessage.value = '';
      } catch (err) {
        console.error("Failed to start new game:", err);
      }
    };

    const resetGame = () => {
      currentScore.value = 26;
      guessedLetters.value = [];
      guessedPhrase.value = '';
      guessedNumber.value = '';
      gameOver.value = false;
      gameOverMessage.value = '';
      startNewGame(); // Get a new question when resetting
    };

    // Initialize game
    resetGame();

    return {
      letters,
      currentPhrase,
      currentNumber,
      guessedLetters,
      guessedPhrase,
      guessedNumber,
      maskedPhrase,
      gameOver,
      gameOverMessage,
      correctLetters,
      wrongLetters,
      currentScore,
      guessLetter,
      submitGuess,
      startNewGame,
      showMessage,
      message,
      messageType,
      showModal,
      modalMessage,
      closeModal,
      resetGame
    };
  }
};
</script>