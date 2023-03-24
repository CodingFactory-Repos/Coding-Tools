<template>
	<div class="flex flex-col items-center mt-10">
		<div v-if="arrayList">
			<div class="grid grid-cols-4 gap-x-20 gap-y-3">
				<div v-for="(array, index) in arrayList" :key="index" class="items-center">
					<h2 class="font-bold text-lg mb-2 text-center">Groupe {{ index + 1 }}</h2>
					<div
						v-for="(group, groupIndex) in array"
						:key="`group${index}-member${groupIndex}`"
						class="flex items-center"
					>
						<table>
							<div
								v-for="(member, memberIndex) in group"
								:key="`member${memberIndex}`"
								class="flex items-center"
							>
								<tr>
									<td
										class="border-2 border-gray-500 hover:border-gray-600 rounded-lg p-2 w-64 text-center"
									>
										{{ member || 'Vide' }}
									</td>
								</tr>
							</div>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let courseId = '';
let arrayList = [];

export default {
	name: 'StudentList',
	data() {
		return {
			courseId,
			arrayList,
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
			console.log('You are here', this.studentList);
			http.get(`/calls/array_generator/${this.studentList}`).then((response) => {
				this.arrayList = response.data.array;
			});
		}),
	},
};
</script>
