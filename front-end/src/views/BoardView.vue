<template>
  <ScrumBoard 
    :semaine="1" 
    :stories="[]"
    :todo="[]"
    :inProgres="[]"
    :done="[]"

  />
</template>
  
<script setup lang="ts">
import ScrumBoard from '@/components/ScrumBoard.vue';

</script>

