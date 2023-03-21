<template>
	<div>
        <h2>Open Houses</h2>
        <button @click="openForm=!openForm" >Add open house</button>
        <FormOpenHouse v-show="openForm"/>

	</div>
</template>

<script>
import axios from 'axios';
import FormOpenHouse from './FormOpenHouses.vue';
export default {
    data(){
        return{
            /* list of all open houses */
			openHouses: [],
            openForm : false,
        }   
    }, 
       components: {
		FormOpenHouse,
	},
    async mounted() {
		await axios.get('http://localhost:8010/openhouses').then((response) => {
			console.log(response);
			this.openHouses = response.data;
			console.log(this.openHouses);
		});
    } 
}
</script>




