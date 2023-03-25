<template>
	<div>
		<qrcode v-if="url" :value="url" />
		<div v-else>
			<p>{{ message }}</p>
		</div>
		<div v-if="studentList">
			<div v-for="student in studentList" :key="student.id">
				<p>{{ student.profile.firstName }} {{ student.profile.lastName }}</p>
			</div>
		</div>
	</div>
</template>


<script lang="ts">
import Qrcode from 'vue-qrcode';
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let url = '';
let courseId = '';
let message = '';
let studentList = [];

export default {
	name: 'QrCode',
	components: {
		Qrcode,
	},
	data() {
		return {
			url,
			courseId,
			message,
			studentList,
			QrGen: '',
		};
	},
	mounted() {
		this.QRGen = setInterval(() => {
			this.getCourseId();
		}, 180000);

		this.getCourseId();
	},
	beforeUnmount() {
		clearInterval(this.QRGen);
	},
	methods: {
		getQrCode: withErrorHandler(async function () {
			const courseId = this.courseId;
			http.get(`/calls/qrcode_generator/${courseId}`).then((response) => {
				this.url = response.data.qrcode;
			});
		}),
		getCourseId: withErrorHandler(async function () {
			http.get(`/calls/actual_course/`).then((response) => {
				this.courseId = response.data.actualCourse;
				this.isThereCourse();
			});
		}),
		isThereCourse() {
			if (this.courseId) {
				this.getQrCode();
				this.getStudentList();
				this.message = '';
			} else {
				this.message = "Vous n'avez pas de cours aujourd'hui";
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
