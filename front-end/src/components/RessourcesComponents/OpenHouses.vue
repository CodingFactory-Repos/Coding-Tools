<template>
	<div>
        <FormOpenHouse />

	</div>
</template>

<script lang="ts">
import {http} from "@/api/network/axios"
import FormOpenHouse from "./FormOpenHouses.vue"

export default {
    data(){
        return{
            /* list of all open houses */
			openHouses: [],
            openForm : false,
           

        }   
    }, 
    components: {
        FormOpenHouse
	},
    methods : {
       

        

         mounted() {
             http.get('http://localhost:8010/openhouses').then((response) => {
                console.log(response);
                this.openHouses = response.data;
                console.log(this.openHouses);
            });
        } 
    }

}
</script>




