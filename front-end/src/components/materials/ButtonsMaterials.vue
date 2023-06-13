<template>
	<div class="mb-5"></div>
	<form @submit.prevent="addMaterial">
		<div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
			<div>
				<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Nom</label
				>
				<input
					type="text"
					id="name"
					v-model="name"
					name="name"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					placeholder="Entrez le nom du matériel"
					required
				/>
			</div>
			<div>
				<label for="Type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Type</label
				>
				<select
					id="type"
					v-model="type"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					required
				>
					<option value="" disabled selected>Sélectionnez le type</option>
					<option value="Hardware">Hardware</option>
					<option value="Mac">Mac</option>
					<option value="Livre">Livres</option>
				</select>
			</div>
		</div>
		<!-- Put the button in center -->
		<div class="row justify-center">
			<div class="form-group">
				<div class="flex justify-center">
					<img :src="picture" alt="Selected Image" class="mt-4 w-28 h-28" />
				</div>
			</div>
			<button
				type="button"
				@click="showImageModal = true"
				class="bg-blue-500 text-white py-2 px-4 rounded mt-2 mb-4 max-w-128 left-16"
			>
				Choisir une image
			</button>
			<Modal v-if="showImageModal" @close="showImageModal = false">
				<template #body>
					<ImagePicker @selectImage="onImageSelected" />
				</template>
			</Modal>
		</div>

		<div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
			<div>
				<label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Prix</label
				>
				<input
					type="number"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					id="price"
					v-model="price"
					placeholder="Entrez le prix du matériel"
					required
				/>
			</div>

			<div class="form-group">
				<label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>État</label
				>
				<select
					v-model="state"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					required
				>
					<option value="" disabled selected>Sélectionnez l'état du matériel</option>
					<option value="Excellent">Excellent État</option>
					<option value="Bon">Bon État</option>
					<option value="Mauvais">Mauvais État</option>
				</select>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
			<div>
				<label for="site" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Campus</label
				>
				<select
					v-model="siteLocation"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					required
				>
					<option value="" disabled selected>Sélectionnez le campus</option>
					<option value="Cergy">Cergy</option>
					<option value="Paris">Paris</option>
				</select>
			</div>

			<div class="form-group">
				<label
					for="storageCupboard"
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Étagère de stockage</label
				>
				<select
					v-model="storageCupboard"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					required
				>
					<option value="" disabled selected>Sélectionnez l'étagère</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</div>
		</div>
		<div class="form-group">
			<label
				for="description"
				class="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
				>Description</label
			>
			<input
				type="text"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				id="description"
				v-model="description"
				placeholder="Entrer la description du matériel"
				required
			/>
		</div>
		<div class="mb-5"></div>
		<Button
			type="submit"
			class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none gap-2 gradiant"
		>
			Ajouter
		</Button>
	</form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useMaterialStore } from '@/store/modules/material.store';
import ImagePicker from '@/components/materials/ImagePicker.vue';
import Modal from '@/components/common/Modal.vue';
import Swal from 'sweetalert2';

const materialStore = useMaterialStore();

const showImageModal = ref(false);
const name = ref('');
const type = ref('');
const price = ref(0);
const picture = ref('/template-no-image.png');
const state = ref('');
const siteLocation = ref('');
const storageCupboard = ref('');
const description = ref('');
const emit = defineEmits(['close']);

function onImageSelected(image) {
	picture.value = image;
	showImageModal.value = false;
}

const addMaterial = async () => {
	const response = await materialStore.addMaterial({
		name: name.value,
		type: type.value,
		price: price.value,
		acquisitionDate: new Date(Date.now()),
		picture: picture.value,
		state: state.value,
		siteLocation: siteLocation.value,
		storageCupboard: storageCupboard.value,
		description: description.value,
		status: true,
	});
	if (response) {
		emit('close');
		Swal.fire({
			position: 'center',
			icon: 'success',
			title: 'Material added successfully',
			showConfirmButton: false,
			timer: 1500,
		});
	} else {
		Swal.fire({
			position: 'center',
			icon: 'error',
			title: 'Error while adding material',
			showConfirmButton: false,
			timer: 1500,
		});
	}
};
</script>
