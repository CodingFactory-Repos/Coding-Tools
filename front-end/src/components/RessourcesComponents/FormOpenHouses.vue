<template>
	<div>
		<button @click="openMetaModal"> add open house</button>
        <ModalOverlay v-if="showMetaModal" @close="closeMetaModal" size="lg">
			<template #body>
				<form @submit.prevent="addOpenHouses">
				<input type="text" name="title" v-model="title" placeholder="Title :"><br>
				<input type="datetime-local" v-model="date"><br>
				<input type="url" placeholder="picture link" v-model="picture" ><br>
				<!--button type="button" @click="showActivity=true">new Activity</button-->
				<activity :Activities="Activities"></activity>
				<div>
					<input type="text" v-model="street" placeholder="street :"><br>	
					<input type="text" v-model="zipCode" placeholder="zip code :"><br>	
					<input type="text" v-model="town" placeholder="town :"><br>		
				</div>
				<textarea placeholder="Description :" v-model="description"></textarea><br>
				<participant :participants="participants" ></participant>
				<input type="file" @change="onFileSelected" ><br>
				<button type="submit">Submit</button>
			</form>
			</template>
		</ModalOverlay>
	</div>
</template>


<script setup lang="ts">
import ModalOverlay from '@/components/common/Modal.vue';
import FormOpenHouse from './FormOpenHouses.vue';
import { useOpenHouseStore } from "@/store/modules/openHouse.store";
import { setgroups } from 'process';
import { ref } from 'vue';
import activity from "./NewActivity.vue";
import participant from "./NewParticipant.vue"
import { http } from "@/api/network/axios";

const openHouseStore = useOpenHouseStore();

const showMetaModal = ref(false);

const openMetaModal = () => showMetaModal.value = true;
const closeMetaModal = () => showMetaModal.value = false;

    




//	data(){
	//	return {
			const title =  '';
			const date  = "";
			const street = "";
			const zipCode = "";
			const town = "";
			const description = "";
			const picture = "";
			const adress = {
				street: "",
				zipCode: "",
				city: "",
			};
			const participants = [];
			const Activities = [];
	//	}
//	},
/*	components : {
		activity,
		participant,
	},*/

//	methods : {
	

		const addOpenHouses = function(){
			this.adress = {
				street: this.street,
				zipCode: this.zipCode,
				city: this.town,
			};
			console.log(this.Activities);
			http.post('/openhouses/create', {
					title: this.title,
					date: this.date,
					picture: this.picture,
					schedule: this.Activities,
					adress: this.adress,
					description: this.description,
					participants: this.participants,
				})
				.catch((error) => {
					console.log(error);
				});

			this.title = "";
			this.date= "";
			this.picture = "";
			this.street = "";
			this.zipCode = "";
			this.town = "";
			this.description = "";
			this.Activities = [];
			this.participants = [];

		};
		
		const onFileSelected = function(event){
			console.log(event);
			
		};
//	 },


//}
</script>