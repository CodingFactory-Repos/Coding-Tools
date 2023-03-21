<template>
	<form action="">
		<input type="text" v-model="title" placeholder="Title :"><br>
		<input type="date" v-model="date"><br>
		<input type="text" v-model="adress" placeholder="adress :"><br>
		<textarea placeholder="Description :"></textarea><br>
		<input id="buttonUser" type="text" placeholder="participants :" v-model="participant">
		<button type="button"  @click="addParticipants">Ok</button> <br>
		<p v-for="user in participants">{{user}}</p><br>
		<input type="file" placeholder="Documents :"><br>
		<button type="submit">Submit</button>

	</form>
</template>

<script lang="ts">
import axios from 'axios';
export default {
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
		};
	},
	methods :  {
		addParticipants(){
			if(this.participant != null){
				this.participants.push(this.participant);
				this.participant = null;
				
			}
		}
	},
}

</script>