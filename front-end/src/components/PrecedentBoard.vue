<template>
    <div>
      <h2>Boards EduScrum récent</h2>
      <ul>
        <li v-for="board in archivedBoards" :key="board.id" >
          <router-link :to="`/profile/${board.codeurId}/board/${board.id}`">{{ board.week }}</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        archivedBoards: [
          { id: 1, week: 'Semaine 1', codeurId: 'codeur1' },
          { id: 2, week: 'Semaine 2', codeurId: 'codeur2' },
        ]
      };
    }
  }
  </script>
  