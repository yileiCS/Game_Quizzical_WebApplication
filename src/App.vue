<template>
  <div id="app">
    <h1>Quizzical!🤔</h1>
    <main>
      <div v-if="!showQuiz">
        <game-component @game-completed="handleGameCompleted"></game-component>
        <scoreboard-component v-if="scores.length > 0" :scores="scores" @start-quiz="startQuiz">
        </scoreboard-component>
      </div>

      <quiz-component v-else :facts="scores" @exit-quiz="exitQuiz">
      </quiz-component>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import GameComponent from './components/GameComponent.vue'
import ScoreboardComponent from './components/ScoreboardComponent.vue'
import QuizComponent from './components/QuizComponent.vue'

export default {
  name: 'App',
  components: {
    GameComponent,
    ScoreboardComponent,
    QuizComponent
  },

  setup() {
    const scores = ref([])
    const showQuiz = ref(false)

    const handleGameCompleted = (gameResult) => {
      scores.value.push({
        score: Math.round(gameResult.score * 100) / 100,
        number: gameResult.number,
        phrase: gameResult.phrase
      })
    }

    const startQuiz = () => {
      showQuiz.value = true
    }

    const exitQuiz = () => {
      showQuiz.value = false
    }

    return {
      scores,
      showQuiz,
      handleGameCompleted,
      startQuiz,
      exitQuiz
    }
  }
}
</script>
