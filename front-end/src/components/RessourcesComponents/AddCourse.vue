<template>
	<div class="modal">
		<div class="modal-overlay" @click="$emit('close')"></div>
		<div class="modal-container">
			<h3 class="text-xl pb-2 font-medium leading-6 text-gray-900 flex justify-center mb-3">
				Ajouter un cours
			</h3>
			<div class="modal-body">
				<form class="w-full max-w-sm">
					<input type="text" name="title" v-model="this.tag" placeholder="Title :" /><br />
					<input type="datetime-local" class="text-field" v-model="this.periodStart" /><br />
					<input type="datetime-local" class="text-field" v-model="this.periodEnd" /><br />
					<input type="url" placeholder="picture link" v-model="this.picture" /><br />
					<input
						type="text"
						name="language"
						v-model="this.language"
						placeholder="Language :"
					/><br />
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
import { useCoursStore } from '@/store/modules/course.store';

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
			uploadedFiles: [],
		};
	},
	methods: {
		handleFileChange(event) {
			const files = event.target.files;

			// Mettez à jour la liste uploadedFiles avec les informations des fichiers téléchargés
			for (let i = 0; i < files.length; i++) {
				this.uploadedFiles.push(files[i]);
			}
		},
		removeFile(index) {
			this.uploadedFiles.splice(index, 1);
		},
		AddCourses() {
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
