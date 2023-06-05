<template>
  <ScrumBoard 
    :semaine="1" 
    :stories="[]"
    :todo="[]"
    :inProgress="[]"
    :done="[]"

  />
</template>
  
<script setup lang="ts">
import ScrumBoard from '@/components/ScrumBoard.vue';

</script>

