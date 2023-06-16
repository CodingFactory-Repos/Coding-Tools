<template>
	<div class="mb-5"></div>
	<form @submit.prevent="addStory(this.courseId)">
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
				placeholder="Titre de la story"
				required
			/>
		</div>

		<div class="form-group relative z-0 w-full mb-6">
			<label for="as" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>En tant que</label
			>
			<input
				type="text"
				id="as"
				v-model="as"
				name="as"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="..."
				required
			/>
		</div>

		<div class="form-group relative z-0 w-full mb-6">
			<label for="iWant" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Je veux</label
			>
			<input
				type="text"
				id="iWant"
				v-model="iWant"
				name="iWant"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="..."
				required
			/>
		</div>

		<div class="form-group relative z-0 w-full mb-6">
			<label for="soThat" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Afin de</label
			>
			<input
				type="text"
				id="soThat"
				v-model="soThat"
				name="soThat"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="..."
				required
			/>
		</div>

		<div class="form-group relative z-0 w-full mb-6">
			<label for="acceptationCriteria" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Critères d'acceptation</label
			>
			<input
				type="text"
				id="acceptationCriteria"
				v-model="acceptationCriteria"
				name="acceptationCriteria"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="..."
				required
			/>
		</div>

		<div class="form-group">
			<label for="value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Valeur</label
			>
			<input
				type="number"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				id="value"
				v-model="value"
				placeholder="..."
				required
			/>
		</div>

		<div class="mb-5"></div>
		<!-- Put the button in the center -->
		<Button
			type="submit"
			class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none gap-2 gradiant"
		>
			Submit
		</Button>
	</form>
</template>

<script lang="ts">
import { ref } from 'vue';
import { http } from '@/api/network/axios';


const titleRef = ref('');
const asRef = ref('');
const iWantRef = ref('');
const soThatRef = ref('');
const acceptationCriteriaRef = ref('');
const valueRef = ref(0);


export default {
	name: 'StoriesForm',
	props: {
		courseId: String,
	},
	data() {
		return {
			title: titleRef.value,
			as: asRef.value,
			iWant: iWantRef.value,
			soThat: soThatRef.value,
			acceptationCriteria: acceptationCriteriaRef.value,
			value: valueRef.value,
		};
	},
	setup(props) {
		console.log(props);
	},
	methods: {
		addStory(courseId) {
			console.log("addStory");
			const self = this;
			http.post('/stories/create', {
				title: this.title,
				as: this.as,
				iWant: this.iWant,
				soThat: this.soThat,
				acceptationCriteria: this.acceptationCriteria,
				value: this.value,
				course: this.courseId,
			}).then((res) => {
				console.log(res);
				self.$emit('close');
			});
		},
	}
};

</script>
