<template>
	<Modal v-if="reservationModal" @close="reservationModal = false">
		<template #body>
			<FormMaterial :id="id" :userId="currentUserId" @close="reservationModal = false" />
		</template>
	</Modal>
	<Modal v-if="detailsModal" @close="detailsModal = false">
		<template #body>
			<DetailsMaterials :id="cardId" :material="materials" @close="detailsModal = false" />
		</template>
	</Modal>
	<div
		class="w-auto h-100 flex flex-col gap-3 rounded-lg bg-light-primary dark:bg-dark-tertiary py-2 px-4 m-1.5 justify-start items-center"
	>
		<div
			@click="openModalByRef('detailsModal', id, material)"
			class="w-32 h-full flex flex-col justify-between gap-2 relative"
			style="min-width: 8rem"
		>
			<img
				v-if="url"
				class="w-100 p-2 h-100 rounded-lg cursor-pointer select h-100"
				:src="url"
				:alt="`template_${name}_img`"
			/>
			<img
				v-else
				class="w-full h-24 rounded-lg cursor-pointer select"
				alt="template_img"
				src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg"
			/>

			<span class="dark:text-dark-font text-s font-bold text-center text-gray-900">{{ name }}</span>
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
			v-if="status === false && userRole === Roles.USER"
			disabled
			data
			class="font-bold rounded-lg text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
		>
			<span class="text-white">Reserved</span>
		</button>
		<button
			v-if="status === false && userRole === Roles.PEDAGOGUE"
			type="button"
			data
			class="font-bold rounded-lg text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
			@click="materialReturned(id, material)"
		>
			<span class="text-white">Validate the return</span>
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
import { ref, computed } from 'vue';
import FormMaterial from '@/components/materials/FormMaterials.vue';
import Modal from '@/components/common/Modal.vue';
import DetailsMaterials from './DetailsMaterials.vue';
import { useAuthStore } from '@/store/modules/auth.store';
import { useMaterialStore } from '@/store/modules/material.store';
import { Roles } from '@/store/interfaces/auth.interfaces';
import { Material } from '@/store/interfaces/material.interface';
import Swal from 'sweetalert2';

defineProps({
	id: { type: String, required: true },
	name: { type: String, required: true },
	material: { type: Object, required: true },
	url: { type: String, required: true },
	status: { type: Boolean, required: true },
});

const authStore = useAuthStore();
const materialStore = useMaterialStore();
const user = computed(() => authStore.user);
const userRole = computed(() => user.value?.role);
const currentUserId = computed(() => authStore.user._id);

const reservationModal = ref(false);
const materials = ref();
const detailsModal = ref(false);
const cardId = ref('');

function openModalByRef(ref: string, identifiant: string, material?: Material) {
	if (ref === 'reservationModal') {
		cardId.value = identifiant;
		reservationModal.value = true;
	} else if (ref === 'detailsModal') {
		cardId.value = identifiant;

		materials.value = material;
		detailsModal.value = true;
	}
}

function materialReturned(id: string, material: Material) {
	const payload = {
		returnedTo: currentUserId.value,
		borrowingID: material.borrowingHistory.filter((material) => material.status === 'ACCEPTED')[0]
			.borrowingID,
	};
	materialStore.returnMaterial(id, payload);
	Swal.fire({
		icon: 'success',
		title: 'Success',
		text: 'The material has been returned successfully',
	});
}
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
