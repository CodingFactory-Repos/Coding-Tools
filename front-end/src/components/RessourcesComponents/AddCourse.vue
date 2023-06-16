<template>
	<div class="modal">
		<div class="modal-overlay" @click="$emit('close')"></div>
		<div class="modal-container">
			<h3 class="text-xl pb-2 font-medium leading-6 text-gray-900 flex justify-center mb-3">
				Ajouter un cours
			</h3>
			<div class="modal-body">
				<form class="w-full max-w-sm">
					<input type="text" name="title" v-model="tag" placeholder="Title :" /><br />
					<VueDatePicker
						placeholder="debut"
						v-model="periodStart"
						:format="dateFormat"
						:language="datePickerLanguage"
					/>
					<VueDatePicker
						placeholder="fin"
						v-model="periodEnd"
						:format="dateFormat"
						:language="datePickerLanguage"
					/>
					<input type="url" placeholder="picture link" v-model="picture" /><br />
					<input type="text" name="language" v-model="language" placeholder="Language :" /><br />
					<input type="file" v-model="selectedFile" @change="onFileSelected" />
					<div class="flex justify-center mt-6">
						<button
							class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
							type="button"
							@click="$emit('close')"
						>
							Fermer
						</button>
						<button
							class="ml-4 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
							type="submit"
							@click="AddCourses"
						>
							Ajouter
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useCoursStore } from '@/store/modules/course.store';
import VueDatePicker from '@vuepic/vue-datepicker';
import Swal from 'sweetalert2';

export default {
	name: 'AddCourses',
	data() {
		return {
			tag: '',
			classTag: '',
			picture: '',
			language: '',
			createdAt: new Date(),
			periodStart: null,
			periodEnd: null,
			presence: [],
			project: [],
			site: '',
			teacherId: '',
			dateFormat: 'yyyy-MM-dd HH:mm',
			datePickerLanguage: 'fr', // Langue du date picker
			selectedFile: null,
			base64String: '',
		};
	},
	methods: {
		AddCourses(event) {
			event.preventDefault();

			// Vérifier si tous les champs sont remplis
			if (!this.tag || !this.periodStart || !this.periodEnd || !this.picture || !this.language) {
				Swal.fire({
					title: 'Vous devez remplir tous les champs',
					text: 'Veuillez remplir tous les champs pour ajouter un nouveau cours',
					icon: 'error',
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'OK',
				});
				return;
			}
			const course = useCoursStore();

			this.newCourse = {
				tag: this.tag,
				classTag: '',
				picture: this.picture,
				language: this.language,
				createdAt: this.createdAt,
				periodStart: this.periodStart,
				periodEnd: this.periodEnd,
				presence: [],
				project: [],
				site: '',
				teacherId: '',
			};
			course.addCourse(this.newCourse);
		},
		onFileSelected(event) {
			this.selectedFile = event.target.files[0];
			this.convertToBase64();
		},

		convertToBase64() {
			if (this.selectedFile) {
				const reader = new FileReader();
				reader.onload = (event) => {
					let result = event.target.result;
					this.base64String = result.toString();
				};
				reader.readAsDataURL(this.selectedFile);
			}
		},
	},
};
</script>

<style>
.modal {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: white;
	border: 1px solid black;
	padding: 20px;
	z-index: 1000;
	border-radius: 0.375rem;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.text-field,
.text-field input[type='text'] {
	color: black; /* Modifier la couleur du texte ici */
}
</style>
