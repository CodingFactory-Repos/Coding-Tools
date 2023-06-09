<template>
	<div>
		<button type="button" @click="showNewParticipant">add participant</button>
		<!--btn afficher gestion d'ajout-->
		<div v-show="showParticipant">
			<input type="text" placeholder="name :" v-model="name" @input="searchUser" />
			<!--input = name et lance recherche de correspondance-->
			<p v-for="user in userList" @click="selectUser(user)" :key="user._id">{{ user }}</p>
			<br />
		</div>
		<p v-for="user in participants" :key="user.name">{{ user }}</p>
		<br />
		<!--afficher les participants ajouter-->
	</div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
export default {
	data() {
		return {
			firstName: '',
			lastName: '',
			name: '',
			usersNames: [],
			userList: [],
			userName: { firstName: '', lastName: '' }, // valeur du get peut changer d'objet a string
			showParticipant: false,
		};
	},
	props: {
		participants: {
			//props participants a envoyer pour le form
			type: Array<{ name: '' }>,
			required: true,
		},
	},
	methods: {
		showNewParticipant() {
			//gestion d'affichage d'ajout
			this.showParticipant = !this.showParticipant;
		},

		addParticipants() {
			let participant = { name: '' };
			if (this.name != '') {
				// si le participant ajouter est pas nul:
				participant = { name: this.name };
				this.participants.push(participant);
				this.name = '';
				this.userList = [];
			}
		},

		searchUser() {
			//recherche de participant
			// this.$emit('clear');
			this.userList = [];
			this.getUsers(); // recuperer les users de la bdd
			this.usersNames.forEach((element) => {
				const userName = element.firstName + ' ' + element.lastName;
				let alreadyInList = false;
				if (userName.toUpperCase().includes(this.name.toUpperCase()) && this.name != '') {
					this.participants.forEach((participant) => {
						console.log(participant);
						console.log(userName);
						if (participant == userName) {
							alreadyInList = true;
						}
					});
					if (!alreadyInList) {
						this.userList.push(userName);
					}
				}
			});
			console.log(this.userList);
		},

		getUsers() {
			http.get('http://localhost:8010/openhouses/users').then((response) => {
				this.users = response.data;
				this.users.forEach((element) => {
					this.userName = {
						firstName: element.profile.firstName,
						lastName: element.profile.lastName,
					};
					if (!this.userCheckList()) {
						this.usersNames.push(this.userName);
					}
				});
			});
		},
		userCheckList() {
			let alreadyInList = false;
			this.usersNames.forEach((element) => {
				if (element.lastName == this.userName.lastName) {
					if (element.firstName == this.userName.firstName) {
						alreadyInList = true;
					}
				}
			});
			return alreadyInList;
		},
		selectUser(user) {
			this.participants.push(user);
			this.name = '';
			this.userList = [];
			this.showNewParticipant();
			console.log(user);
			console.log(this.participants);
		},
	},
};
</script>
