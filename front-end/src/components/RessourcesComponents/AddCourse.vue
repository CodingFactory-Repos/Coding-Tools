<template>
	<div class="modal">
		<div class="modal-overlay" @click="$emit('close')"></div>
		<div class="modal-container">
			<h3 class="text-xl pb-2 font-medium leading-6 text-gray-900 flex justify-center mb-3">
				Ajouter un cours
			</h3>
			<div class="modal-body">
				<form class="grid gap-6 my-6 md:grid-cols-2 justify-items-center">
					<input
						type="text"
						name="title"
						v-model="tag"
						placeholder="Title :"
						class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
					<VueDatePicker
						placeholder="debut"
						v-model="periodStart"
						:format="dateFormat"
						:language="datePickerLanguage"
						class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
					<VueDatePicker
						placeholder="fin"
						v-model="periodEnd"
						:format="dateFormat"
						:language="datePickerLanguage"
						class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
					<input
						type="url"
						placeholder="picture link"
						v-model="picture"
						class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
					<input
						type="text"
						name="language"
						v-model="language"
						placeholder="Language :"
						@input="searchLanguage"
						autocomplete="off"
						class="form-control w-full sm:w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
					<ul v-if="showSuggest">
						<li v-for="suggest in languageSuggest" :key="suggest" @click="selectSuggest(suggest)">
							{{ suggest }}
						</li>
					</ul>
					<input
						type="file"
						id="file"
						ref="fileInput"
						@change="onFileSelected"
						class="block w-full sm:w-30 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					/>
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
			languages: [],
			languageSuggest: [],
			showSuggest: false,
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
				files: this.base64String,
			};

			Swal.fire({
				title: 'Votre cours a été ajouté',
				icon: 'success',
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'OK',
			}).then(async (result) => {
				if (result.isConfirmed) {
					// Ajouter le cours
					course.addCourse(this.newCourse);
				}
			});
			// Rediriger vers la page des cours
			this.$emit('close');
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

		searchLanguage() {
			//recherche de toutes les matieres
			this.showSuggest = true;
			this.getAllTagCourse();
			this.languageSuggest = [];
			this.languages.forEach((element) => {
				let alreadyInList = false;
				if (element.toUpperCase().includes(this.language.toUpperCase()) && this.language != '') {
					this.languageSuggest.forEach((languageInList) => {
						if (languageInList == element.toUpperCase()) {
							alreadyInList = true;
						}
					});
					if (!alreadyInList) {
						this.languageSuggest.push(element.toUpperCase());
					}
				}
			});
		},

		getAllTagCourse() {
			this.languages = []; //reset la list
			const courseStore = useCoursStore();
			const course = courseStore.items;
			course.forEach((element) => {
				if (!this.languages.includes(element.language)) {
					this.languages.push(element.language);
				}
			});
		},

		selectSuggest(suggest) {
			this.language = suggest;
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
