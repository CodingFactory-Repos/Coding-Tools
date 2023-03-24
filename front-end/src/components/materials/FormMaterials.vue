<template>
	<form @submit.prevent="borrorwingMaterial(id)">
		<div class="form-group relative z-0 w-full">
			<label
				for="borrowingDate"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
				>Borrowing Date
			</label>
			<div class="absolute top-9 left-0 flex items-center pl-3 pointer-events-none">
				<svg
					aria-hidden="true"
					class="w-5 h-5 text-gray-500 dark:text-gray-400"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<input
				type="date"
				id="borrowingDate"
				v-model="borrowingDate"
				name="borrowingDate"
				:min="today"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Select date"
			/>
		</div>
		<div class="mb-5"></div>
		<div>
			<textarea
				id="description"
				v-model="description"
				class="max-h-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Enter a description"
			></textarea>
		</div>
		<div class="mb-5"></div>
		<div>
			<label for="returnDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
				>Return Date
			</label>
			<input
				type="date"
				id="returnDate"
				v-model="returnDate"
				name="returnDate"
				:min="today"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Select date"
			/>
			<div class="mb-5"></div>
		</div>
		<button
			type="submit"
			class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
		>
			Submit
		</button>
	</form>
</template>

<script lang="ts">
//Import datepicker from flowbite from node_modules
import { defineProps, toRefs } from 'vue';
import { http } from '@/api/network/axios';

export default {
	props: {
		id: String,
		userId: String,
	},
	setup(props) {
		const data = toRefs(
			defineProps({
				id: { type: String, required: true },
				userId: { type: String, required: true },
			}),
		);

		let today = new Date().toISOString().substr(0, 10);
		let borrowingDate = '';
		let borrowingUser = '';
		let description = '';
		let returnDate = '';

		function borrorwingMaterial(identifiant) {
			console.log('Borrowing material');

			// this.borrowingUsers = props.userId;

			console.log(props.userId);
			console.count(this.borrowingDate);
			console.log(this.description);
			console.log(this.returnDate);

			http
				.put('/materials/reservation/' + identifiant, {
					borrowingHistory: {
						borrowingDate: this.borrowingDate,
						borrowingUser: props.userId,
						description: this.description,
						returnDate: this.returnDate,
					},
				})
				.then((response) => {
					console.log(response);
				});
		}

		return {
			...data,
			...props,
			today,
			borrowingDate,
			borrowingUser,
			description,
			returnDate,
			borrorwingMaterial,
		};
	},
};
</script>

<style scoped></style>
