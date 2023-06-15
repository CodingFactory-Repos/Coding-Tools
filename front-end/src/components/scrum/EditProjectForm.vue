<template>
	<div class="mb-5"></div>
	<form @submit.prevent="updateProject(this.projectId)">
		<div class="form-group relative z-0 w-full mb-6">
			<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Titre</label
			>
			<input
				type="text"
				id="title"
				v-model="title"
				name="title"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="Titre du project"
				required
			/>
		</div>

        <div class="form-group relative z-0 w-full mb-6">
			<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Description</label
			>
			<input
				type="text"
				id="description"
				v-model="description"
				name="description"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="Description du project"
				required
			/>
		</div>

		<div class="mb-5"></div>
		<!-- Put the button in the center -->
		<Button
			type="submit"
			class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none gap-2 gradiant"
		>
			Modifier le nom/la description du groupe
		</Button>
	</form>
</template>

<script lang="ts">
import { ref } from 'vue';
import { http } from '@/api/network/axios';


const titleRef = ref('');
const descriptionRef = ref('');


export default {
	name: 'EditProjectForm',
	props: {
        projectId: String,
        initialTitle: String,
        initialDescription: String,
    },
    mounted() {
        this.setInputTextToInitValues();
    },
	data() {
		return {
			title: this.initialTitle,
            description: this.initialDescription,
		};
	},
	setup(props) {
		console.log(props);
	},
	methods: {
		updateProject(projectId) {
			console.log("updateProject");
			const self = this;
			http.put(`/projects/update/${this.projectId}`, {
				title: this.title,
                description: this.description,
			}).then((res) => {
				console.log(res);
                self.$emit('close');
                self.$emit('doesProjectExist')
			});
        },
        setInputTextToInitValues() {
            titleRef.value = this.initialTitle;
            descriptionRef.value = this.initialDescription;
        }
	}
};

</script>