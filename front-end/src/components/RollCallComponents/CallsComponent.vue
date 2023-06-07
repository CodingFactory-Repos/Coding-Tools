<template>
	<div class="flex flex-col items-center mt-2.5">
		<!-- PUT A FRAME AROUND THE QRCODE TO MAKE IT PRETTIER -->
		<div v-if="url" class="border-4 border-white dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 p-4">
			<qrcode :value="url" />
		</div>
		<div v-else>
			<div class="text-4xl text-red-700">
				<p>{{ message }}</p>
			</div>
		</div>
		<a :href="url" v-if="url" target="_blank">
			<button class="bg-blue-500 text-white py-1 px-10 rounded mt-6 mb-2">Ouvrir le lien</button>
		</a>
	</div>
</template>

<script lang="ts">
import Qrcode from 'vue-qrcode';
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let url = '';
let courseId = '';
let message = '';
let groupUrl = '';
let studentList = [];

export default {
	name: 'CallsComponent',
	components: {
		Qrcode,
	},
	data() {
		return {
			url,
			courseId,
			message,
			studentList,
			groupUrl,
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
				this.isThereCourse(response);
			});
		}),
		isThereCourse(response) {
			if (this.courseId) {
				this.getQrCode();
			}
			this.message = response.data.message;
		},
	},
};
</script>
