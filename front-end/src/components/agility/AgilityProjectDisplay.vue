<template>
	<div class="w-full flex flex-col gap-4 h-full justify-start items-start">
		<h1 class="text-2xl font-bold dark:text-gray-400">Your projects</h1>
		<div v-if="metaProjects.length === 0" class="w-full flex grow relative items-center justify-center">
			<div class="flex flex-col items-center justify-center gap-5 p-4 z-10 bg-light-primary dark:bg-dark-tertiary rounded-lg">
				<h3 class="text-lg font-bold dark:text-gray-400 text-center">Your saved projects will be shown here in the future.</h3>
				<DefaultButton
					type="button"
					text="Start my first project !"
					background="bg-pink-600"
					text-style="text-white"
					@click="startNewProject('default')"
				/>
			</div>
		</div>
		<div v-else class="w-full flex grow gap-3 flex-wrap">
			<AgilityProjectCard
				v-for="project, key in metaProjects"
				:title="project.title"
				:url="project.snapshot"
				:key="project.title + key"
				@click="openExistingProject(project.id)"
			></AgilityProjectCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAgilityStore } from '@/store/modules/agility.store';
import DefaultButton from '@/components/common/buttons/Default.vue';
import AgilityProjectCard from '@/components/agility/cards/AgilityProjectCard.vue';

const router = useRouter();
const agilityStore = useAgilityStore();
const metaProjects = computed(() => agilityStore.metaProjects);

const startNewProject = (key: string) => {
	// key not used atm

	const id = "fiuofpaiefzufb";
	router.push(`/app/agility/project/${id}`);
}

const openExistingProject = (id: string) => {
	//id not used atm
	router.push(`/app/agility/project/${id}`);
}
</script>