<template>
	<!--<Ressources></Ressources>-->
    <div>
        <h1>Ressources</h1>
        <div>
            <button v-on:click=SetPage(0)>Cours</button>
            <p></p>
            <button v-on:click="SetPage(1)">JPO</button>
        </div>
        <div>
            <h2 >{{state}}</h2>
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
    computed : {
        SetPage(index){
           return this.state = index;
        },
    },

});
</script>

