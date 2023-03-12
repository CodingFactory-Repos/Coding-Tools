<template>
	<div class="w-auto flex flex-col gap-4 h-full">
		<h1 class="text-2xl font-bold dark:text-gray-400">Your projects</h1>
		<div v-if="metaProjects.length === 0" class="flex grow relative items-center rounded-xl bg-white dark:bg-gray-800">
			<div class="w-2/4 p-5">
				<SVGIllustrationProject :size="300"/>
			</div>
			<div class="w-2/4 flex flex-col items-center justify-center gap-5 z-10">
				<h2 class="text-xl font-bold dark:text-gray-400">Welcome to coding tools agility !</h2>
				<h3 class="text-lg font-bold dark:text-gray-400 text-center">Your saved projects will be shown here in the future.</h3>
				<DefaultButton
					type="button"
					text="Start my first project !"
					background="bg-pink-600"
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
import SVGIllustrationProject from '@/components/common/svg/illustrations/SVGIllustationProject';
import AgilityProjectCard from '@/components/common/cards/AgilityProjectCard.vue';

const router = useRouter();
const agilityStore = useAgilityStore();
const metaProjects = computed(() => agilityStore.metaProjects);

const startNewProject = (key: string) => {
	// key not used atm

	const id = "fiuofpaiefzufb";
	router.push(`/agility/project/${id}`);
}

const openExistingProject = (id: string) => {
	//id not used atm
	router.push(`/agility/project/${id}`);
}
</script>