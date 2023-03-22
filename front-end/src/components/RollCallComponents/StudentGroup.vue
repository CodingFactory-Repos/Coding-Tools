<!-- eslint-disable prettier/prettier -->
<script >
export default {
  setup() {

  },

  randomGroup() {
      
  }
};

</script>

<template>
  <div>
    <h1 class="text-center">Groupes</h1>

    <button @click="randomGroup()"
      class="mr-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    >
      Groupe aléatoire
    </button>
    <button
      class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    >
      Groupe personnalisé
    </button>

    <table class="border-2 border-black">
      <tr>
        <th>#</th>
        <th>Prénom</th>
        <th>Nom</th>
        <th>Status</th>
      </tr>
      <tr v-for="(item, index) in list" :key="index">
        <th>Groupe {{ index + 1 }}</th>
        <td>{{ firstname }}</td>
        <td>{{ lastname }}</td>
        <td>{{ statuts }}</td>
      </tr>
    </table>
  </div>
</template>
