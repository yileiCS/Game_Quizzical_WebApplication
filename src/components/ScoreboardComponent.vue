<template>
  <section class="scoreboard" v-if="scores.length > 0">
    <h2>Session Scoreboard</h2>
    <div class="sort-buttons">
      <button @click="sortScores('score')">Sort by Score</button>
      <button @click="sortScores('number')">Sort by Number</button>
      <button @click="sortScores('phrase')">Sort by Phrase</button>
      <button @click="$emit('start-quiz')" aria-label="Start Quiz Mode">Quiz Me!</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Score</th>
          <th>Number</th>
          <th>Phrase</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(score, index) in sortedScores" :key="index">
          <td>{{ score.score }}</td>
          <td>{{ score.number }}</td>
          <td>{{ score.phrase }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'ScoreboardComponent',
  props: {
    scores: {
      type: Array,
      required: true
    }
  },
  emits: ['start-quiz'],

  setup(props) {
    const sortKey = ref('score');
    const sortDirection = ref('desc');

    const sortedScores = computed(() => {
      return [...props.scores].sort((a, b) => {
        let compareA = a[sortKey.value];
        let compareB = b[sortKey.value];

        if (typeof compareA === 'string') {
          compareA = compareA.toLowerCase();
          compareB = compareB.toLowerCase();
        }

        if (sortDirection.value === 'desc') {
          return compareA > compareB ? -1 : 1;
        } else {
          return compareA < compareB ? -1 : 1;
        }
      });
    });

    const sortScores = (key) => {
      if (sortKey.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortDirection.value = 'desc';
      }
    };

    return {
      sortedScores,
      sortScores
    };
  }
};
</script>