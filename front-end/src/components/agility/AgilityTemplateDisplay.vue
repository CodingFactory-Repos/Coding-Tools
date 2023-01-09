<template>
	<div class="w-auto max-w-fit flex flex-col gap-4">
		<h1 class="text-2xl font-bold dark:text-gray-400">Create a new project</h1>
		<div class="w-full flex flex-col rounded bg-white dark:bg-gray-800 pt-2 pb-2 pl-4 pr-4">
			<h3 class="text-sm dark:text-gray-400 font-bold">Recommended Blueprint</h3>
			<div class="w-full flex overflow-x-scroll gap-1">
				<AgilityTemplateCard
					name="New project"
					@click="startNewProject('default')"
				/>
				<AgilityTemplateCard
					v-for="template, key in metaTemplates"
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
import AgilityTemplateCard from '@/components/common/cards/AgilityTemplateCard.vue';

const router = useRouter();
const agilityStore = useAgilityStore();
const metaTemplates = computed(() => agilityStore.metaTemplates);

const startNewProject = (key: string) => {
	// key not used atm

	const id = "fiuofpaiefzufb";
	router.push(`/agility/project/${id}`);
}
</script>