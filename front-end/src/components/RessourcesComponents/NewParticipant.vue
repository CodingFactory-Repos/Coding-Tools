<template>
	<div>
		<button type="button" @click="showNewParticipant">add participant</button>
		<!--btn afficher gestion d'ajout-->
		<div v-show="showParticipant">
			<input type="text" placeholder="name :" v-model="name" @input="searchUser" />
			<!--input = name et lance recherche de correspondance-->
			<p v-for="(user, id) in userList" @click="selectUser(user)" :key="id">{{ user }}</p>
			<br />
		</div>
		<p v-for="user in participants" :key="user.name">{{ user }}</p>
		<br />
		<!--afficher les participants ajouter-->
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/store/modules/user.store';

export default {
	data() {
		return {
			name: '',
			usersNames: [],
			userList: [],
			userName: '', // valeur du get peut changer d'objet a string
			showParticipant: false,
		};
	},
	// eslint-disable-next-line vue/order-in-components
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

		async searchUser() {
			//recherche de participant
			//this.$emit('clear');
			this.userList = [];
			await this.getUsers(); // recuperer les users de la bdd
			console.log(this.usersNames);
			this.usersNames.forEach((element) => {
				let alreadyInList = false;
				if (element.toUpperCase().includes(this.name.toUpperCase()) && this.name != '') {
					this.participants.forEach((participant) => {
						if (participant == element) {
							alreadyInList = true;
						}
					});
					if (!alreadyInList) {
						this.userList.push(element.toUpperCase());
					}
				}
			});
		},

		async getUsers() {
			this.usersNames = [];
			const userStore = useUserStore();
			await userStore.getAllUsers();
			const usersList = userStore.users;
			const test = Object.keys(usersList);
			const testArray = test.map((key) => ({ key, value: usersList[key] }));
			testArray.forEach((element) => {
				element.value.forEach((user) => {
					this.userName = user.profile.firstName + ' ' + user.profile.lastName;
					if (!this.userCheckList()) {
						this.usersNames.push(this.userName.toUpperCase());
					}
				});
			});
			console.log(this.usersNames);
		},
		userCheckList() {
			let alreadyInList = false;
			this.usersNames.forEach((element) => {
				if (element == this.userName.toUpperCase()) {
					alreadyInList = true;
				}
			});
			return alreadyInList;
		},
		selectUser(user) {
			this.participants.push(user);
			this.name = '';
			this.userList = [];
			this.showNewParticipant();
		},
	},
};
</script>
