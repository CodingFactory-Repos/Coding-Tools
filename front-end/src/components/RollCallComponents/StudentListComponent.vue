<template>
	<div class="flex flex-col items-center mt-10">
		<div v-if="studentList">
			<div class="grid grid-cols-4 gap-x-20 gap-y-3">
				<div v-for="student in studentList" :key="student.id">
					<p>{{ student.profile.firstName }} {{ student.profile.lastName }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let courseId = '';
let studentList = [];

export default {
	name: 'StudentList',
	data() {
		return {
			courseId,
			studentList,
		};
	},
	mounted() {
		this.getCourseId();
	},

	methods: {
		getCourseId: withErrorHandler(async function () {
			http.get(`/calls/actual_course/`).then((response) => {
				this.courseId = response.data.actualCourse;
				this.isThereCourse();
			});
		}),
		isThereCourse() {
			if (this.courseId) {
				this.getStudentList();
			}
		},
		getStudentList: withErrorHandler(async function () {
			http.get(`/calls/student_list/${this.courseId}`).then((response) => {
				this.studentList = response.data.studentList;
			});
		}),
	},
};
</script>
