<template>
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

<!--script lang="ts" >
import axios from 'axios';

export default {
	props : {
		usersNames : Array
	},
	data() {
		return {
			title: '',
			date: '',
			schedule: [],
			adress: '',
			project: [],
			participants: [],
			participant: '',
			description: '',
			count: 0,
			Users : this.usersNames,
		};
	},
	
	methods :  {
		addParticipants(){
			if(this.participant != null){
				this.participants.push(this.participant);
				this.participant = null;
				
			}
		},	//Create a POST with axios
		addOpenHouses() {
			//! This will crash the front in case of reject.
			//! You're also using axios without the instance.
			//! So with credentials is false and the the cookie token will not be attached to the request.
			//! Consider using : http.post('/articles/add', { ... })
			//! And for the catch : addArticle: withErrorHandler(async function() { ... } );

			//! By the way : Date.now() won't work. You're missing the "new" identifier.
			axios.post('http://localhost:8010/openhouses/create', {
					title: this.title,
					date: this.date,
					adress: this.adress,
					description: this.description,
					participants: this.participants,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		searchUser(){
			console.log(this.Users);
			/*usersNames.forEach(element => {
				if(element.contains(this.participant)){
					console.log("test");
				}
			});*/
	
		},
		

	},
	
}

</script>-->

<script lang="ts">
import { ref } from 'vue';
import activity from "./NewActivity.vue";
import participant from "./NewParticipant.vue"
import { http } from "@/api/network/axios";

export default {
	data(){
		return {
			title : '',
			date  : "",
			street : "",
			zipCode : "",
			town : "",
			description : "",
			picture : "",
			adress : {
				street: "",
				zipCode: "",
				city: "",
			},
			participants : [],
			Activities : [],
		}
	},
	components : {
		activity,
		participant,
	},

	methods : {
	

		addOpenHouses(){
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

		},
		
		onFileSelected(event){
			console.log(event);
			
		},
	 },


}
</script>