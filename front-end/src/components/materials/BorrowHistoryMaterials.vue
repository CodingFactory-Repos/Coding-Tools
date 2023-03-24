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
					v-for="history in history"
					:key="history.id"
					class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
				>
					<th
						scope="row"
						class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
					>
						{{ userInfo.profile.email }}
					</th>
					<td class="px-6 py-4">{{ history.borrowingDate }}</td>
					<td class="px-6 py-4">{{ history.returnDate }}</td>
					<td class="px-6 py-4">{{ history.description }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts">
import { toRefs, defineProps } from 'vue';

export default {
	name: 'BorrowHistoryMaterials',
	props: {
		history: {
			type: Array,
			required: true,
		},
		userInfo: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const data = toRefs(
			defineProps({
				history: {
					type: Array,
					required: true,
				},
				userInfo: {
					type: Object,
					required: true,
				},
			}),
		);
		console.log(props.history);
		console.log(props.userInfo);

		return {
			...props,
			...data,
		};
	},
};
</script>

<style scoped></style>
