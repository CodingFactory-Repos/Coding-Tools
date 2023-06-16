<template>
	<div class="mb-5"></div>
	<form @submit.prevent="addBoard(this.projectId)">
		<div class="form-group relative z-0 w-full mb-6">
			<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Titre de la board</label
			>
			<input
				type="text"
				id="title"
				v-model="title"
				name="title"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="Release n°..."
				required
			/>
		</div>

		<div class="mb-5"></div>
		<!-- Put the button in the center -->
		<Button
			type="submit"
			class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none gap-2 gradiant"
		>
			Créer une nouvelle board
		</Button>
	</form>
</template>

<script lang="ts">
import { ref } from 'vue';
import { http } from '@/api/network/axios';

const titleRef = ref('');

export default {
	name: 'StoriesForm',
	props: {
		projectId: String,
	},
	data() {
		return {
			title: titleRef.value
		};
	},
	setup(props) {
		console.log(props);
	},
	methods: {
		addBoard(projectId) {
			console.log("addBoard: ", this.title);
			const self = this;
			http.post('/boards/create', {
				title: this.title,
				project: projectId,
			}).then((res) => {
				console.log(res);
				self.$emit('close');
			});
		},
	}
};

</script>
