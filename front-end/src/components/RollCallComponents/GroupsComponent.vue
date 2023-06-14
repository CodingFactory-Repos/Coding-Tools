<template>
	<div class="grid grid-cols-3 gap-8 mx-auto w-3/4 max-w-2x mb-4 h-100">
		<div
			v-for="(group, index) in groups"
			:key="group.id"
			class="dark:bg-[#343a40] hover:bg-gray-100 dark:hover:bg-gray-600 bg-[#ffff] text-gray-700 dark:text-gray-100 shadow rounded-lg flex flex-col"
		>
			<h2 class="p-2 rounded-t-lg font-bold text-center">Group {{ index + 1 }}</h2>
			<div class="flex-grow">
				<div
					v-for="(student, sIndex) in group.group"
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
					@click="joinGroup(group.id)"
				>
					Join Group {{ index + 1 }}
				</button>
			</div>
		</div>
	</div>
	<div v-if="isPO" class="flex justify-center p-4 space-x-4">
		<button
			:disabled="isGroupLocked"
			class="py-2 px-4 bg-blue-500 hover:bg-blue-700 dark:text-white font-bold rounded disabled:hover:bg-[#A1A1AA] disabled:cursor-not-allowed"
			@click="createRandomGroups"
		>
			Create Random Groups
		</button>
		<button
			:disabled="isGroupLocked"
			class="py-2 px-4 bg-blue-500 hover:bg-blue-700 dark:text-white font-bold rounded disabled:hover:bg-[#A1A1AA] disabled:cursor-not-allowed"
			@click="emptyGroups"
		>
			Empty Groups
		</button>
	</div>
	<div v-if="isPO" class="flex justify-center items-center">
			<button
			:disabled="isGroupLocked"
			class="p-1 text-black disabled:bg-transparent dark:disabled:bg-transparent disabled:cursor-not-allowed"
			@click="lockRetro"
		>
			<svg v-if="!isGroupLocked" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
				<path fill="none" stroke="#DAA520" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H8zm0 0V7c0-1.333.8-4 4-4c1.904 0 2.958.944 3.5 1.99M12 14v3"
				/>
			</svg>
			<svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
				<g fill="#DAA520">
					<path d="M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-6zm3-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H6z"
					/>
					<path d="M7 7a5 5 0 0 1 10 0v4a1 1 0 1 1-2 0V7a3 3 0 1 0-6 0v4a1 1 0 1 1-2 0V7zm5 7a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z"
					/>
				</g>
			</svg>
		</button>
	</div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import router from '@/router';
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
			isGroupLocked: false
		};
	},
	mounted() {
		this.getCourseId();
		this.isProductOwner();
	},
	methods: {
		getCourseId: withErrorHandler(async function () {
			try {
				// need to get the entire course
				const response = await http.get(`/calls/actual_course_group/`);
				this.courseId = response.data.actualCourse._id;


				this.isGroupLocked = response.data.actualCourse.isLocked;

				await this.isThereCourse();
			} catch (error) {
				this.displaySwalGroup(error);
			}
		}),
		isThereCourse: withErrorHandler(async function () {
			if (this.courseId) {
				try {
					await this.getStudentAmount();
					await this.getGroups();
				} catch (error) {
					this.displaySwalGroup(error);
				}
			}
		}),
		getStudentAmount: withErrorHandler(async function () {
			try {
				const response = await http.get(`/calls/student_list/${this.courseId}`);
				this.studentList = response.data.studentList.length;
				await this.setNumberArrays();
			} catch (error) {
				this.displaySwalGroup(error);
			}
		}),
		setNumberArrays: withErrorHandler(async function () {
			try {
				await http.get(`/calls/array_generator/${this.studentList}/${this.courseId}`);
			} catch (error) {
				this.displaySwalGroup(error);
			}
		}),
		getGroups: withErrorHandler(async function () {
			try {
				const response = await http.get(`/calls/get_groups/${this.courseId}`);
				const groups = response.data.array;
				this.groups = [];
				groups.forEach((group) => {
					this.groups.push(group);
				});
			} catch (error) {
				this.displaySwalGroup(error);
			}
		}),
		joinGroup: withErrorHandler(async function (groupId: string) {
			try {
				const response = await http.get(`/calls/join_group/${this.courseId}/${groupId}`);
				this.displaySwalGroup(response.data.status);
				await this.getGroups();
			} catch (error) {
				this.displaySwalGroup(error);
			}
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
					swalConfig.text = 'Vous avez créé des groupes aléatoires !';
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
			try {
				const response = await http.get(`/calls/create_random_groups/${this.courseId}`);
				this.displaySwalGroup(response.data.status);
				await this.getGroups();
			} catch (error) {
				this.displaySwalGroup(error);
			}
		}),
		emptyGroups: withErrorHandler(async function () {
			try {
				const response = await http.get(`/calls/empty_groups/${this.courseId}`);
				this.displaySwalGroup(response.data.status);
				await this.getGroups();
			} catch (error) {
				this.displaySwalGroup(error);
			}
		}),
		getStudentIdentity: withErrorHandler(async function (student) {
			try {
				return await http.get(`/calls/get_student_identity/${student}`);
			} catch (error) {
				this.displaySwalGroup(error);
			}
		}),
		isProductOwner: withErrorHandler(async function () {
			try {
				this.isPO = await http.get(`/calls/is_product_owner/`);
			} catch (error) {
				console.log(error);
			}
		}),
		lockRetro () {
			Swal.fire({
				title: 'Are you sure to lock the groups ?',
				text:'This action will create the week organisation and this action is irreversible',
				icon: 'info',
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				showCancelButton: true,
				confirmButtonText: 'Yes I\'m sure',
				cancelButtonText: 'No I\'m not',
				width: 'auto'
			}).then(async (result) => {
				if (result.isConfirmed) {
					this.isGroupLocked = true;
					const resp = await http.get(`/groups/lock/${this.courseId}`);
					if (resp.status == 200) {
						Swal.fire({
							title: 'Congrats ! Your week has been created !',
							icon: 'success',
							confirmButtonColor: '#3085d6',
							showCancelButton: false,
							confirmButtonText: 'Go to my course',
							width: 'auto'
						}).then((res) => {
							if (res.isConfirmed) {
								router.push(`/app/ressource/courses/${this.courseId}`)
							}
						})
					}

				}
			});

		}
	},
};
</script>
