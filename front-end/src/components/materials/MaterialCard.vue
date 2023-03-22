<template>
	<div v-if="reservationModal" class="popup">
		<div class="popup-content">
			<FormMaterial :id="id" />
			<button
				@click="reservationModal = false"
				class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
			>
				Fermer
			</button>
		</div>
	</div>
	<Modal v-if="detailsModal" @close="detailsModal = false">
		<template #body>
			<DetailsMaterials />
		</template>
	</Modal>
	<div
		class="w-auto h-100 flex flex-col gap-3 rounded-lg bg-light-primary dark:bg-dark-tertiary py-2 px-4 justify-start items-start"
	>
		<div
			@click="openModalByRef('detailsModal', id)"
			class="w-32 h-full flex flex-col justify-between gap-2 relative"
			style="min-width: 8rem"
		>
			<img
				v-if="url"
				class="w-100 h-100 rounded-lg cursor-pointer select h-100"
				:src="url"
				:alt="`template_${name}_img`"
			/>
			<img
				v-else
				class="w-full h-24 rounded-lg cursor-pointer select"
				src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg"
			/>

			<span class="dark:text-dark-font text-s font-bold text-center">{{ name }}</span>
			<span
				v-if="status === true"
				class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
				>Available
			</span>
			<span
				v-else
				class="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
			>
				Not Available
			</span>
		</div>
		<button
			v-if="status === false"
			disabled
			data
			class="font-bold rounded-lg text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
		>
			<span class="text-white">Reserved</span>
		</button>
		<button
			v-else
			@click="openModalByRef('reservationModal', id)"
			class="font-bold rounded-lg text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
		>
			<span class="text-white">Reservation</span>
		</button>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FormMaterial from '@/components/materials/FormMaterials.vue';
import Modal from '../common/Modal.vue';
import DetailsMaterials from './DetailsMaterials.vue';

defineProps({
	id: { type: String, required: true },
	name: { type: String, required: true },
	url: { type: String, required: true },
	status: { type: Boolean, required: true },
});
let reservationModal = ref(false);
let detailsModal = ref(false);

function openModalByRef(ref, identifiant) {
	if (ref === 'reservationModal') {
		this.id = identifiant;
		this.reservationModal = true;
	} else if (ref === 'detailsModal') {
		this.id = identifiant;
		this.detailsModal = true;
	}
}
// function sendIdAndShowMOdal(identifiant) {
// 	console.log(identifiant);
// }
</script>

<style scoped>
.select:hover {
	box-shadow: 0 0 0 1px #3b82f6;
}
.popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
}
.popup-content {
	background-color: white;
	padding: 20px;
	border-radius: 10px;
	width: 35%;
}
</style>
