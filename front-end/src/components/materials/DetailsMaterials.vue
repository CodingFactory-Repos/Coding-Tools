<template>
	<div v-if="userRole === Roles.USER">
		<a href="#">
			<img
				v-if="props.material.picture"
				class="w-full h-96 rounded-lg shadow-md"
				:src="props.material.picture"
				alt="product image"
			/>
		</a>
		<div class="px-5 pb-5 text-center flex flex-col">
			<a href="#">
				<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
					{{ props.material.name }}
				</h5>
			</a>
			<div class="flex items-center mt-2.5">
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{
					props.material.acquisitionDate
				}}</span>
				<span class="mx-2 text-gray-400 dark:text-gray-300">•</span>
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400"
					>Etats : {{ props.material.state }}</span
				>
			</div>
			<div class="flex items-center mt-2.5">
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{
					props.material.siteLocation
				}}</span>
				<span class="mx-2 text-gray-400 dark:text-gray-300">•</span>
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400"
					>Armoire : {{ props.material.storageCupboard }}</span
				>
			</div>
			<span class="text-2xl font-bold text-gray-900 dark:text-white"
				>{{ props.material.price }} €</span
			>
		</div>
	</div>
	<div v-if="userRole === Roles.PRODUCT_OWNER || userRole === Roles.PEDAGOGUE">
		<div class="mb-5"></div>
		<!-- Show the image and make it fit the screen -->
		<div class="flex flex-col items-center justify-center w-full h-full">
			<img
				@click="showLink = !showLink"
				v-if="props.material.picture"
				class="w-24 h-24 rounded-lg shadow-md"
				:src="props.material.picture"
				alt="product image"
			/>
		</div>
		<div v-if="showLink === true">
			<Modal v-if="showLink" @close="showLink = false">
				<template #body>
					<ImagePicker @selectImage="onImageSelected" />
				</template>
			</Modal>
		</div>
		<div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
			<div>
				<label class="text-white dark:text-gray-200" for="username">Name</label>
				<input
					id="name"
					v-model="props.material.name"
					type="text"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				/>
			</div>

			<div>
				<label class="text-white dark:text-gray-200" for="passwordConfirmation">Type</label>
				<select
					v-model="props.material.type"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				>
					<option value="Hardware">Hardware</option>
					<option value="Mac">Mac</option>
					<option value="Livre">Livres</option>
				</select>
			</div>

			<div>
				<label class="text-white dark:text-gray-200" for="password">Price</label>
				<input
					id="password"
					type="number"
					v-model="props.material.price"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				/>
			</div>

			<div>
				<label class="text-white dark:text-gray-200" for="passwordConfirmation">Type</label>
				<select
					v-model="props.material.state"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				>
					<option value="Excellent">Etat Excellent</option>
					<option value="Bon">Bon Etat</option>
					<option value="Mauvais">Mauvais Etat</option>
				</select>
			</div>
			<div>
				<label class="text-white dark:text-gray-200" for="passwordConfirmation">Site</label>
				<select
					v-model="props.material.siteLocation"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				>
					<option value="Cergy">Cergy</option>
					<option value="Paris">Paris</option>
				</select>
			</div>
			<div>
				<label class="text-white dark:text-gray-200" for="passwordConfirmation"
					>Storage Cupboard</label
				>
				<select
					v-model="props.material.storageCupboard"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</div>
		</div>
		<div class="mb-5"></div>
		<div>
			<label class="text-white dark:text-gray-200" for="passwordConfirmation">Description</label>
			<textarea
				id="textarea"
				type="textarea"
				v-model="props.material.description"
				class="max-h-48 block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
			></textarea>
		</div>
		<div class="mb-5"></div>
		<!-- Create a div that show all the borrowingHistory -->
		<div v-if="showHistory">
			<!-- Only send the borrowingHistory that are RETURNED -->
			<BorrowHistoryMaterials
				:history="props.material.borrowingHistory.filter((history) => history.status == 'RETURNED')"
				:userEmail="userEmail"
			/>
		</div>
		<div class="mb-5"></div>
		<div class="flex items-center justify-between">
			<Button
				type="button"
				@click="showHistory = !showHistory"
				class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
				>History</Button
			>
			<Button
				v-if="props.material.status"
				type="submit"
				class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
				@click="editMaterial"
				>Edit</Button
			>
			<Button
				type="button"
				@click="deleteMaterial"
				class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
				>Delete</Button
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { http } from '@/api/network/axios';
import BorrowHistoryMaterials from '@/components/materials/BorrowHistoryMaterials.vue';
import { useMaterialStore } from '@/store/modules/material.store';
import { Material } from '@/store/interfaces/material.interface';
import { useAuthStore } from '@/store/modules/auth.store';
import { Roles } from '@/store/interfaces/auth.interfaces';
import { withErrorHandler } from '@/utils/storeHandler';
import Modal from '@/components/common/Modal.vue';
import ImagePicker from '@/components/materials/ImagePicker.vue';
import Swal from 'sweetalert2';

const props = defineProps<{
	id: string;
	material: Object;
}>();

const emit = defineEmits(['close']);
const authStore = useAuthStore();
const materialStore = useMaterialStore();
const user = computed(() => authStore.user);
const userEmail = computed(() => user.value?.profile?.email);
const userRole = computed(() => user.value?.role);

const showLink = ref({});
const showHistory = ref(false);

const editMaterial = async () => {
	// console.log(props.material);
	const response = await materialStore.updateMaterial(props.material, props.id);

	if (response) {
		Swal.fire({
			title: 'Material edited',
			icon: 'success',
			confirmButtonText: 'Ok',
		});
		emit('close');
	} else {
		Swal.fire({
			title: 'Error',
			text: 'An error occured while editing the material',
			icon: 'error',
			confirmButtonText: 'Ok',
		});
	}
};

function onImageSelected(image) {
	props.material.picture = image;
	showLink.value = false;
}

const deleteMaterial = () => {
	Swal.fire({
		title: 'Are yu sure you want to delete this material?',
		showCancelButton: true,
		confirmButtonText: 'Delete',
		cancelButtonText: `Cancel`,
	}).then(async (result) => {
		if (result.isConfirmed) {
			const response = await materialStore.deleteMaterial(props.id);
			if (response) {
				Swal.fire('The material has been deleted', '', 'success');
				emit('close');
			} else {
				Swal.fire('An error occured while deleting the material', '', 'error');
			}
		}
	});
	emit('close');
};
</script>
