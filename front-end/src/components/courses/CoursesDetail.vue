<template>
    <div>
        
    </div>
</template>

<script  lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    beforeRouteEnter(to,from,next){
        console.log(to.params.slug)
        next(true);
    },
    setup(){
    return {
    }
    }
})
</script>