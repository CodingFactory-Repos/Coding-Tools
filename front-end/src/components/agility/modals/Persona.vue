<template>
	<ModalOverlay v-if="showPersonaModal" @close="beforeModalClose" size="2xl">
		<template #header>
			<span class="text-lg font-bold pb-2 text-black dark:text-white">Build your persona</span>
		</template>
		<template #body>
			<div class="flex flex-wrap justify-between content-start w-full h-[400px] overflow-y-scroll gap-4 pt-6 px-3">
				<FormField
					label="Name of your persona"
					:limit="true"
					:char-limit="50"
					:char-number="personaBuilder.name.length"
				>
					<input
						v-model="personaBuilder.name"
						maxlength="50"
						class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					/>
				</FormField>
			</div>
		</template>
	</ModalOverlay>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

import ModalOverlay from '@/components/common/Modal.vue';
import { LitteralBlueprintTypes } from '@/store/interfaces/agility.interface';
import { useProjectStore } from '@/store/modules/project.store';
import FormField from '@/components/common/FormField.vue';

const emit = defineEmits(['close']);
const projectStore = useProjectStore();
const showPersonaModal = ref(false);
const personaBuilder = reactive({
	name: '',
})

const openPersonaModal = () => showPersonaModal.value = true;
const closePersonaModal = () => showPersonaModal.value = false;

const beforeModalClose = () => {
	closePersonaModal();
	emit("close");
}

const setPersonaTemplate = (type: LitteralBlueprintTypes) => {
	projectStore.deferredBlueprint = type;
	projectStore.setBlueprintEvent('pointer');
	closePersonaModal();
	emit("close");
}

openPersonaModal();
</script>
