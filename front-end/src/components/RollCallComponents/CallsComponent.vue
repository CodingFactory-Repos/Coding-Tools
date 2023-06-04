<template>
	<div class="flex flex-col items-center mt-2.5">
		<qrcode v-if="url" :value="url" />
		<div v-else>
			<p>{{ message }}</p>
		</div>
		<a :href="url" v-if="url" target="_blank">
			<button class="bg-gray-500 text-black py-0.5 px-5 rounded mt-2 mb-4">Ouvrir le lien</button>
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
				this.isThereCourse();
			});
		}),
		isThereCourse() {
			if (this.courseId) {
				this.getQrCode();
				this.message = '';
			} else {
				this.message = "Vous n'avez pas de cours aujourd'hui";
			}
		},
	},
};
</script>
