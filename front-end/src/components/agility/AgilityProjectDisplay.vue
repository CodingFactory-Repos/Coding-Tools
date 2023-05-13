<template>
	<div class="w-full flex flex-col gap-4 h-full justify-start items-start">
		<h1 class="text-2xl font-bold dark:text-dark-font">Your projects</h1>
		<div v-if="projects.length === 0" class="w-full flex grow relative items-center justify-center">
			<div class="flex flex-col items-center justify-center gap-5 p-4 z-10 bg-light-primary dark:bg-dark-tertiary rounded-lg">
				<h3 class="text-lg font-bold dark:text-dark-font text-center">Your saved projects will be shown here in the future.</h3>
				<DefaultButton
					type="button"
					text="Start my first project !"
					background="bg-pink-600"
					text-style="text-white"
					@click="startNewProject()"
				/>
			</div>
		</div>
		<div v-else class="w-full flex grow gap-3 flex-wrap">
			<AgilityProjectCard
				v-for="project, key in projects"
				:room-id="project.roomId"
				:isOwner="project.isOwner"
				:title="project.meta.title"
				:url="project.meta.snapshot"
				:key="project.meta.title + key"
				@open="openExistingProject(project.roomId)"
				@openDetail="onModalOpen"
			/>
		</div>
		<ModalProject
			v-if="active"
			@close="onModalClose"
			:roomId="modalRoomId"
		/>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';

import { useAgilityStore } from '@/store/modules/agility.store';
import DefaultButton from '@/components/common/buttons/Default.vue';
import AgilityProjectCard from '@/components/agility/cards/AgilityProjectCard.vue';
import ModalProject from '@/components/agility/modals/Project.vue';

const router = useRouter();
const agilityStore = useAgilityStore();
const projects = computed(() => agilityStore.projects);
const active = ref(false);
const modalRoomId = ref<string>(null);

const startNewProject = async () => {
	const roomId = await agilityStore.tryCreateNewProject();
	if(!roomId) return;

	router.push(`/app/agility/project/${roomId}`);
}

const openExistingProject = (roomId: string) => {
	router.push(`/app/agility/project/${roomId}`);
}

const onModalOpen = (roomId: string) => {
	active.value = true;
	modalRoomId.value = roomId;
}

const onModalClose = () => {
	active.value = false;
	modalRoomId.value = null;
}
</script>