<template>
	<div
		v-if="studentList && courseId"
		class="w-7/12 flex mx-auto md:w-6/12 mt-2.5 mb-4 align-left justify-start"
	>
		<table class="text-center w-full">
			<caption hidden>
				Students
			</caption>
			<thead :class="background" class="border-b-[6px] h-14 dark:border-[#1f2028] border-[#f3f4f6]">
				<tr>
					<th scope="col" :class="color">Prénom & Nom</th>
					<th scope="col" :class="color">Status de présence</th>
				</tr>
			</thead>
			<tbody>
				<tr
					:class="border"
					class="dark:hover:bg-[#43494e] h-11 dark:bg-[#343a40] hover:bg-[#91919128] bg-[#ffff]"
					v-for="student in studentList"
					:key="student.id"
				>
					<td>
						<p class="text-black dark:text-white">
							{{ student.profile.firstName }} {{ student.profile.lastName }}
						</p>
					</td>
					<td>
						<p
							:class="[
								student.presence.present ? 'text-green-500' : 'text-red-500',
								student.presence.late || student.presence.leftEarly ? 'text-yellow-500' : '',
							]"
						>
							{{ student.presence.present ? 'Présent' : 'Absent' }}
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let courseId = '';
let studentList = [];
let studentListInterval = null;

export default {
	name: 'StudentList',
	data() {
		return {
			courseId,
			studentList,
			border: 'border-t-4 dark:border-[#1f2028] border-[#f3f4f6]',
			background: 'dark:bg-[#343a40] bg-[#ffff]',
			color: 'dark:text-white text-[#343a40]',
		};
	},
	mounted() {
		this.getCourseId();
		studentListInterval = setInterval(() => {
			this.getStudentList();
		}, 5000);
	},
	unmounted() {
		clearInterval(studentListInterval);
	},
	methods: {
		getCourseId: withErrorHandler(async function () {
			http.get(`/calls/actual_course/`).then((response) => {
				this.courseId = response.data.actualCourse;
				this.isThereCourse();
			});
		}),
		getStudentList: withErrorHandler(async function () {
			http.get(`/calls/student_list/${this.courseId}`).then((response) => {
				this.studentList = response.data.studentList;
			});
		}),
		isThereCourse() {
			if (this.courseId) {
				this.getStudentList();
			}
		},
	},
};
</script>
