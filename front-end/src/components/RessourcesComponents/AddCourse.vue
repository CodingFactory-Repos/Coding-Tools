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
					<input type="datetime-local" v-model="periodStart" /><br />
					<input type="datetime-local" v-model="periodEnd" /><br />
					<input type="url" placeholder="picture link" v-model="picture" /><br />
					<input
						type="text"
						name="language"
						v-model="language"
						placeholder="Language :"
						@input="searchLanguage"
						autocomplete="off"
					/>
					<ul v-if="showSuggest">
						<li v-for="suggest in languageSuggest" :key="suggest" @click="selectSuggest(suggest)">
							{{ suggest }}
						</li>
					</ul>
					<div class="mb-4">
						<label for="file" class="block text-sm font-medium text-gray-700">Fichier :</label>
						<input type="file" id="file" ref="fileInput" @change="handleFileChange" multiple />
						<ul class="mt-4 space-y-2">
							<li v-for="file in uploadedFiles" :key="file.name" class="flex items-center">
								<button
									type="button"
									class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
									@click="removeFile(index)"
								>
									X
								</button>
								<span class="text-gray-700">{{ file.name }}</span>
							</li>
						</ul>
					</div>
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
import { ref } from 'vue';
import { useCoursStore } from '@/store/modules/course.store';
import Swal from 'sweetalert2';

export default {
	name: 'AddCourses',
	emits: ['close'],
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
			uploadedFiles: [],
		};
	},
	methods: {
		async AddCourses() {
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

			const formData = new FormData();
			formData.append('tag', this.tag);
			formData.append('periodStart', this.periodStart);
			formData.append('periodEnd', this.periodEnd);
			formData.append('picture', this.picture);
			formData.append('language', this.language);
			this.uploadedFiles.forEach((file) => {
				formData.append('uploadedFiles', file);
			});

			Swal.fire({
				title: 'Votre cours a été ajouté',
				icon: 'success',
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'OK',
			}).then(async (result) => {
				if (result.isConfirmed) {
					// Ajouter le cours
					await useCoursStore.addCourse(formData);
					// Rediriger vers la page des cours
					this.$emit('close');
				}
			});

			// Réinitialiser les champs
			this.tag = '';
			this.periodStart = null;
			this.periodEnd = null;
			this.picture = '';
			this.language = '';
			this.uploadedFiles = [];
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

		handleFileChange(event) {
			const files = event.target.files;
			this.uploadedFiles = Array.from(files);
		},

		removeFile(index) {
			this.uploadedFiles.splice(index, 1);
		},

		close() {
			this.$emit('close');
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
	color: black;
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
