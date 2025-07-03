<template>
  <section class="quiz-section">
    <h2>Test Your Memory!</h2>

    <div v-if="!quizCompleted">
      <div class="quiz-item" v-for="(fact, index) in shuffledFacts" :key="index">
        <p>{{ fact.phrase }}</p>
        <input type="number" v-model="answers[index]" placeholder="Enter the number"
          :aria-label="`Enter number for fact: ${fact.phrase}`">
      </div>

      <div class="quiz-controls">
        <button @click="checkAnswers">Check Answers</button>
        <button @click="$emit('exit-quiz')" class="secondary">Exit Quiz</button>
      </div>
    </div>

    <div v-else class="quiz-results">
      <p>You got {{ correctAnswers }} out of {{ facts.length }} correct!</p>
      <div v-for="(fact, index) in shuffledFacts" :key="index">
        <p :class="answers[index] == fact.number ? 'correct' : 'incorrect'">
          {{ fact.phrase }} = {{ fact.number }}
          <span v-if="answers[index] != fact.number">
            (You answered: {{ answers[index] }})
          </span>
        </p>
      </div>
      <button @click="resetQuiz">Try Again</button>
      <button @click="$emit('exit-quiz')" class="secondary">Exit Quiz</button>
    </div>
  </section>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'QuizComponent',
  props: {
    facts: {
      type: Array,
      required: true
    }
  },
  emits: ['exit-quiz'],

  setup(props) {
    const answers = ref([]);
    const quizCompleted = ref(false);
    const shuffledFacts = ref([]);

    const correctAnswers = computed(() => {
      return answers.value.reduce((count, answer, index) => {
        return count + (Number(answer) === shuffledFacts.value[index].number ? 1 : 0);
      }, 0);
    });

    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const initializeQuiz = () => {
      shuffledFacts.value = shuffleArray(props.facts);
      answers.value = new Array(props.facts.length).fill('');
      quizCompleted.value = false;
    };

    const checkAnswers = () => {
      quizCompleted.value = true;
    };

    const resetQuiz = () => {
      initializeQuiz();
    };

    // Initialize on creation
    initializeQuiz();

    return {
      answers,
      quizCompleted,
      shuffledFacts,
      correctAnswers,
      checkAnswers,
      resetQuiz
    };
  }
};
</script>