<template>
	<form @submit.prevent="borrorwingMaterial(id)">
		<label for="borrowingDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>Borrowing Date
		</label>
		<input
			type="date"
			id="borrowingDate"
			v-model="borrowingDate"
			name="borrowingDate"
			:min="today"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder="Select date"
		/>
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
			<label for="returnDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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

<script lang="ts" setup>
import { withErrorHandler } from '@/utils/storeHandler';
import { ref } from 'vue';
import { useMaterialStore } from '@/store/modules/material.store';
import Swal from 'sweetalert2';

const props = defineProps<{
	id: string;
	userId: string;
}>();

const materialStore = useMaterialStore();
const today = new Date().toISOString().substring(0, 10);
const borrowingDate = ref('');
const description = ref('');
const returnDate = ref('');
const emit = defineEmits(['close']);

const borrorwingMaterial = async (identifiant: string) => {
	const response = await materialStore.borrowMaterial(identifiant, {
		borrowingDate: new Date(borrowingDate.value),
		borrowingUser: props.userId,
		description: description.value,
		returnDate: new Date(returnDate.value),
		status: 'PENDING',
	});
	if (response) {
		Swal.fire({
			title: 'Success',
			text: 'Material borrowed successfully',
			icon: 'success',
			confirmButtonText: 'OK',
		}).then(() => {
			emit('close');
		});
	} else {
		Swal.fire({
			title: 'Error',
			text: 'An error occured while borrowing material',
			icon: 'error',
			confirmButtonText: 'OK',
		});
	}
};
</script>
