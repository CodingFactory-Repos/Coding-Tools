<template>
	<div>
        <h2>Open Houses</h2>
        <button @click="openForm=!openForm" >Add open house</button>
        <FormOpenHouse v-show="openForm"/>
	</div>
</template>

<script>
import FormOpenHouse from './FormOpenHouses.vue';
export default {
    data(){
        return{
            openForm : false,
        }   
    },
    components: {
		FormOpenHouse,
	},
}
</script>



