<template>
	<div class="w-full grow flex flex-col gap-4">
		<div
			class="w-full h-fit flex flex-col gap-3 rounded-lg bg-light-primary dark:bg-dark-tertiary py-2 px-4 justify-start items-start"
		>
			<h3 class="text-sm text-[#5c5f73] dark:text-dark-font font-bold">Available blueprints</h3>
			<div class="w-full h-fit flex gap-4 overflow-x-scroll pt-3">
				<AgilityTemplateCard name="New project" @click="startNewProject(BlueprintKey.DEFAULT)" />
				<AgilityTemplateCard
					v-for="(template, key) in metaTemplates"
					:name="`+ ${template.name}`"
					:isNew="template.isNew"
					:url="template.url"
					:key="template.name + key"
					@click="startNewProject(template.key)"
				></AgilityTemplateCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAgilityStore } from '@/store/modules/agility.store';
import AgilityTemplateCard from '@/components/agility/cards/AgilityTemplateCard.vue';
import { BlueprintKey } from '@/lib/pixi-tools-v2/types/pixi-enums';
import { useProjectStore } from '@/store/modules/project.store';

const router = useRouter();
const agilityStore = useAgilityStore();
const projectStore = useProjectStore();
const metaTemplates = computed(() => agilityStore.metaTemplates);

const startNewProject = async (key: BlueprintKey) => {
	const roomId = await agilityStore.tryCreateNewProject();
	if(!roomId) return;

	if(key !== BlueprintKey.DEFAULT)
		projectStore.baseTemplate = key;
	router.push(`/app/agility/project/${roomId}`);
};
</script>
