<template>
	<div class="grid grid-cols-3 gap-8 mx-auto w-3/4 max-w-2x h-100">
		<div
			v-for="(group, index) in groups"
			:key="index"
			class="dark:bg-[#343a40] hover:bg-gray-100 dark:hover:bg-gray-600 bg-[#ffff] text-gray-700 dark:text-gray-100 shadow rounded-lg flex flex-col"
		>
			<h2 class="p-2 rounded-t-lg font-bold text-center">Group {{ index + 1 }}</h2>
			<div class="flex-grow">
				<div
					v-for="(student, sIndex) in group"
					:key="sIndex"
					class="flex flex-row items-center p-2 border-b"
				>
					<div class="w-1/3">Membre n°{{ sIndex + 1 }}</div>
					<div class="w-2/3 text-black dark:text-gray-100">
						{{
							student
								? student.profile.firstName + ' ' + student.profile.lastName
								: 'Rejoindre le groupe'
						}}
					</div>
				</div>
			</div>
			<div v-if="!isPO" class="flex justify-center items-center p-4">
				<button
					class="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
					@click="joinGroup(index)"
				>
					Join Group {{ index + 1 }}
				</button>
			</div>
		</div>
	</div>
	<div v-if="isPO" class="flex justify-center p-4 space-x-4">
		<button
			class="py-2 px-4 bg-blue-500 hover:bg-blue-700 dark:text-white font-bold rounded"
			@click="createRandomGroups"
		>
			Create Random Groups
		</button>
		<button
			class="py-2 px-4 bg-blue-500 hover:bg-blue-700 dark:text-white font-bold rounded"
			@click="emptyGroups"
		>
			Empty Groups
		</button>
	</div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';
import Swal from 'sweetalert2';

let courseId = '';
let studentList = [];
let groups = [];

export default {
	name: 'StudentList',
	data() {
		return {
			courseId,
			groups,
			studentList,
			isPO: false,
		};
	},
	mounted() {
		this.getCourseId();
		this.isProductOwner();
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
				this.getGroups();
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
				this.getGroups();
			});
		}),
		getGroups: withErrorHandler(async function () {
			http.get(`/calls/get_groups/${this.courseId}`).then((response) => {
				this.groups = response.data.array;
			});
		}),
		joinGroup: withErrorHandler(async function (index: number) {
			http.get(`/calls/join_group/${this.courseId}/${index}`).then((response) => {
				// If error sweet alert error
				this.displaySwalGroup(response.data.status);
				this.getGroups();
			});
		}),
		chooseSwalConfig(message) {
			let successMessages = ['successJoin', 'successUpdate', 'successEmpty'];
			let swalConfig = {
				icon: '',
				title: '',
				text: '',
			};
			// First do the "icon: and :title" part
			if (successMessages.includes(message)) {
				swalConfig.icon = 'success';
				swalConfig.title = 'Succès !';
			} else {
				swalConfig.icon = 'error';
				swalConfig.title = 'Oups ...';
			}

			switch (message) {
				case 'full':
					swalConfig.text = 'Ce groupe est plein !';
					break;
				case 'alreadyInGroup':
					swalConfig.text = 'Tu es déjà dans ce groupe !';
					break;
				case 'successJoin':
					swalConfig.text = 'Tu as bien rejoint le groupe !';
					break;
				case 'successUpdate':
					swalConfig.text = 'Vous avez bien été répartis dans des groupes !';
					break;
				case 'successEmpty':
					swalConfig.text = 'Les groupes ont bien été vidés !';
					break;
				default:
					swalConfig.text = 'Une erreur est survenue !';
					break;
			}
			return swalConfig;
		},
		displaySwalGroup(message) {
			Swal.fire(this.chooseSwalConfig(message));
		},
		createRandomGroups: withErrorHandler(async function () {
			http.get(`/calls/create_random_groups/${this.courseId}`).then((response) => {
				this.displaySwalGroup(response.data.status);
				this.getGroups();
			});
		}),
		emptyGroups: withErrorHandler(async function () {
			http.get(`/calls/empty_groups/${this.courseId}`).then((response) => {
				this.displaySwalGroup(response.data.status);
				this.getGroups();
			});
		}),
		getStudentIdentity: withErrorHandler(async function (student) {
			http.get(`/calls/get_student_identity/${student}`).then((response) => {
				return response.data.identity;
			});
		}),
		isProductOwner: withErrorHandler(async function () {
			http.get(`/calls/is_product_owner/`).then((response) => {
				this.isPO = response.data.isProductOwner;
			});
		}),
	},
};
</script>
