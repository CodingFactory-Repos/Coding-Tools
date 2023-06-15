<template>
	<div class="mb-5"></div>
	<form @submit.prevent="getAllUsers(this.projectId)">
		<div class="form-group relative z-0 w-full mb-6">
			<label for="name" class="text-center block mb-2 text-xl text-gray-900 dark:text-white"
				>Rechercher des utilisateurs à ajouter au groupe</label
			>
			<input
				type="text"
				id="searchBar"
				v-model="searchBar"
				name="searchBar"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="Rechercher un utilisateur"
				required
			/>
		</div>
		<div class="grid " >
			<div class="bg-[#5C5F73] rounded-lg px-4 py-2" v-for="user in userList">
                    <p class="text-2xl text-white">{{ user }}</p>
                </div>
		</div>
		<div class="mb-5 flex justify-center">
		<button type="submit" class="text-white  font-bold rounded-lg text-l px-4 py-2 focus:outline-none gap-2 gradiant">
			Ajouter au group
		</button>
		</div>
	</form>
</template>

<script lang="ts">
import { ref } from 'vue';
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let userList = [];

export default {
	name: 'EditProjectForm',
	data() {
		return {
			userList,
		};
	},
	mounted() {
		this.getAllUsers();
	},
	methods: {
		getAllUsers: withErrorHandler(async function () {
			http.get(`/users/get_all_users`).then((response) => {
				this.userList = response.data.userList;
				this.userList.forEach(user => { //On compare avec tous les élèves
					this.userList[user._id] = (user.profile.firstName + ' ' + user.profile.lastName);
					console.log(this.userList)
				});
			});
        }),
	}
};

</script>