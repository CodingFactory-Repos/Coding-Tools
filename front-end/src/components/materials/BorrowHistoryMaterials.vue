<template>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
			<caption class="text-gray-700 dark:text-gray-300 text-lg font-medium">
				Borrow History
			</caption>
			<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" class="dark:text-white px-6 py-3">User Email</th>
					<th scope="col" class="dark:text-white px-6 py-3">Starting Date</th>
					<th scope="col" class="dark:text-white px-6 py-3">Return Date</th>
					<th scope="col" class="dark:text-white px-6 py-3">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="histoire in history"
					:key="histoire.id"
					class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
				>
					<td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
						{{ userEmail }}
					</td>
					<td class="px-6 py-4">{{ new Date(histoire.borrowingDate).toLocaleDateString() }}</td>
					<td class="px-6 py-4">{{ new Date(histoire.dateReturned).toLocaleDateString() }}</td>
					<td class="px-6 py-4">{{ histoire.description }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
import { BorrowingMaterial } from '@/store/interfaces/material.interface';

defineProps<{
	history: Array<BorrowingMaterial>;
	userEmail: string;
	returnedUser: string;
}>();
</script>
