<template>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let courseId = '';
let groupList = [];
let studentList = [];

export default {
	name: 'StudentList',
	data() {
		return {
			courseId,
      groupList,
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
				this.getStudentAmount();
			}
		},
		getStudentAmount: withErrorHandler(async function () {
			http.get(`/calls/student_list/${this.courseId}`).then((response) => {
				this.studentList = response.data.studentList.length;
				this.setNumberArrays();
			});
		}),
		setNumberArrays: withErrorHandler(async function () {
			http.get(`/calls/array_generator/${this.studentList}/${this.courseId}`).then((response) => {
				this.groupList = response.data.array;
			});
		}),
	},
};
</script>
