<template>
	<div class="fixed z-10 inset-0 overflow-y-auto">
  <div class="flex justify-center items-center min-h-screen">
    <div class="fixed inset-0 bg-gray-500 opacity-75"></div>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden w-5/6 md:w-1/2 lg:w-1/3">

      <div class="bg-gray-100 p-3">
        <h2 class="text-lg font-bold">Titre du Modal</h2>
      </div>

      
      <div class="flex flex-row">
        <div class="w-1/2 p-4">
          <h3 class="font-bold text-gray-700">Template</h3>
          <p class="text-gray-600">Official</p>
          <p class="text-gray-600">Communautary</p>
          <p class="text-gray-600">My Template</p>
        </div>
        <div class="w-1/2 p-4">
          <h3 class="font-bold text-gray-700">List Of template</h3>
          <p class="text-gray-600">Blabla</p>
          <p class="text-gray-600">Blabla</p>
          <p class="text-gray-600">Blabla</p>
        </div>
      </div>

    
      <div class="bg-gray-100 p-3 flex justify-end">
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue" onclick="closeModal()">Fermer</button>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useProjectStore } from '@/store/modules/project.store';
import DefaultButton from '@/components/common/buttons/Default.vue';
import ModalOverlay from '@/components/common/Modal.vue';
import SvgInfo from '@/components/common/svg/Info.vue';

const emit = defineEmits(['close']);

const projectStore = useProjectStore();
const meta = computed(() => projectStore.meta);

const showMetaModal = ref(false);
const showWarningModal = ref(false);
const isFormValid = ref(true);

const previousMetaTitle = ref<string>(meta.value.title);
const previousMetaDesc = ref<string>(meta.value.description);
const formTitle = ref<HTMLInputElement>();
const formDesc = ref<HTMLTextAreaElement>();

const openMetaModal = () => (showMetaModal.value = true);
const closeMetaModal = () => (showMetaModal.value = false);
const openWarningModal = () => (showWarningModal.value = true);
const closeWarningModal = () => (showWarningModal.value = false);

const updateTitle = () => {
	const len = formTitle.value.value.length;
	if (len <= 25 && len >= 1) isFormValid.value = true;
	else isFormValid.value = false;

	projectStore.meta.title = formTitle.value.value;
};

const updateDescription = () => {
	const len = formDesc.value.value.length;
	if (len <= 100) isFormValid.value = true;
	else isFormValid.value = false;

	projectStore.meta.description = formDesc.value.value;
};

const restoreProjectMeta = () => {
	projectStore.meta.title = previousMetaTitle.value;
	projectStore.meta.description = previousMetaDesc.value;

	closeWarningModal();
	emit('close');
};

const saveProjectMeta = () => {
	// API CALL, no need to verify if it fails the user fucked up something and the api will reject anyway.

	if (showMetaModal.value) closeMetaModal();
	if (showWarningModal.value) closeWarningModal();
	emit('close');
};

const beforeModalClose = () => {
	closeMetaModal();

	if (
		previousMetaTitle.value !== meta.value.title ||
		previousMetaDesc.value !== meta.value.description
	) {
		openWarningModal();
	} else {
		emit('close');
	}
};

openMetaModal();
</script>
