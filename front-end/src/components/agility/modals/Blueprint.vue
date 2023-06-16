<template>
	<ModalOverlay v-if="showBlueprintModal" @close="beforeModalClose" size="xl">
		<template #header>
			<span class="text-lg font-bold pb-2 text-black dark:text-white">Available blueprints</span>
		</template>
		<template #body>
			<div class="flex flex-wrap justify-between content-start w-full h-[400px] overflow-y-scroll gap-4 pt-6 px-3">
				<AgilityTemplateCard
					class="!h-fit capitalize"
					v-for="(template, key) in metaTemplates"
					:name="`${template.name}`"
					:isNew="template.isNew"
					:url="template.url"
					:key="template.name + key"
					@click="setBlueprintType(template.type)"
				></AgilityTemplateCard>
			</div>
		</template>
	</ModalOverlay>
	<PersonaModal v-if="isPersonaModalOpen" @close="finishPersonaBuilder"/>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';

import PersonaModal from '@/components/agility/modals/Persona.vue';
import ModalOverlay from '@/components/common/Modal.vue';
import { useAgilityStore } from '@/store/modules/agility.store';
import AgilityTemplateCard from '@/components/agility/cards/AgilityTemplateCard.vue';
import { LitteralBlueprintTypes } from '@/store/interfaces/agility.interface';
import { useProjectStore } from '@/store/modules/project.store';

const emit = defineEmits(['close']);
const agilityStore = useAgilityStore();
const projectStore = useProjectStore();
const metaTemplates = computed(() => agilityStore.metaTemplates);
const showBlueprintModal = ref(false);
const isPersonaModalOpen = ref(false);

const openBlueprintModal = () => showBlueprintModal.value = true;
const closeBlueprintModal = () => showBlueprintModal.value = false;
const openPersonaModal = () => isPersonaModalOpen.value = true;
const closePersonaModal = () => isPersonaModalOpen.value = false;

const finishPersonaBuilder = () => {
	closePersonaModal();
	beforeModalClose();
}

const beforeModalClose = () => {
	closeBlueprintModal();
	emit("close");
}

const setBlueprintType = (type: LitteralBlueprintTypes) => {
	if(type === 'personas') {
		openPersonaModal();
		return;
	}

	projectStore.deferredBlueprint = type;
	projectStore.setBlueprintEvent('pointer');
	closeBlueprintModal();
	emit("close");
}

onMounted(() => {
	if(metaTemplates.value.length === 0) {
		agilityStore.tryGetTemplatesMeta();
	}
})

openBlueprintModal();
defineExpose({
	openPersonaModal
})
</script>
