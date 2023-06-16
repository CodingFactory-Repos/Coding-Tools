<template>
	<div class="mb-5"></div>
	<form @submit.prevent="addMember()">
		<div class="form-group relative z-0 w-full mb-6">
			<label for="name" class="text-center block mb-2 text-xl text-gray-900 dark:text-white"
				>Rechercher des utilisateurs à ajouter au groupe</label
			>
			<select
				id="user"
				v-model="user"
				name="user"
				class="block w-full px-4 py-2 mt-2 text-xl text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				required
			>
				<option v-for="student in studentList" :value="student._id">{{ student.profile.firstName }} {{ student.profile.lastName }}</option>
			</select>
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
			user: '',
		};
	},
	props: {
		projectId: String,
		studentList: Array,
	},
	mounted() {
		console.log('STUDENT LIST: ', this.studentList);
	},
	methods: {
		addMember() {
			console.log('addMember: ', this.user);
			const self = this;
			http.post('/projects/addMember/'+this.projectId, {
				userId: this.user,
			}).then((res) => {
				console.log(res);//emit with this.user as param
				self.$emit('close', this.user);
			});
		},
	}
};

</script>