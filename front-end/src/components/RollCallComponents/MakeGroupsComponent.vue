<template>
	<div v-if="courseId">
		<!-- Button that will redirect to url -->
		<a :href="groupUrl">
			<button class="bg-blue-500 text-white py-2 px-4 rounded mt-4">Former les groupes</button>
		</a>
	</div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let groupUrl = '';
let courseId = '';

export default {
	name: 'MakeGroupsButton',
	data() {
		return {
			courseId,
			groupUrl,
		};
	},
	mounted() {
		this.getCourseId();
	},
	methods: {
		getCourseId: withErrorHandler(async function () {
			http.get(`/calls/actual_course/`).then((response) => {
				this.courseId = response.data.actualCourse;
				this.setGroupUrl();
			});
		}),
		setGroupUrl() {
			this.groupUrl = `rollcall/groups`;
		},
	},
};
</script>
