<template>
	<!--<Ressources></Ressources>-->
    <div>
        <h1>Ressources</h1>
        <div>
            <button v-on:click="setState(0)">Cours</button>
            <p></p>
            <button @click="setState(1)">JPO</button>
        </div>
        <div>
	        <CoursPage v-show="state == 0" />
		    <OpenHousesPage  v-show="state == 1" />
        </div>
	</div>
</template>



<script lang="ts">
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { defineComponent } from 'vue';
import CoursPage from '@/components/RessourcesComponents/Cours.vue';
import OpenHousesPage from '@/components/RessourcesComponents/OpenHouses.vue';

export default defineComponent({
	components: {
		OpenHousesPage,
        CoursPage,
	},
	data(){
        return {
            state : 0,
        }
  
    },
    methods : {
     setState(index){
        this.state = index;
     }
    },

});
</script>

