<template>
	<div class="w-full flex flex-col gap-0" style="min-height: 100px;">
		<div class="w-full flex justify-between bg-light-primary dark:bg-dark-primary border-b border-light-tertiary dark:border-dark-tertiary">
			<div class="flex gap-2 p-1 rounded h-12">
				<DefaultButton
					to="/app/agility/dashboard"
					text="Dashboard"
					text-style="text-white hover:text-white"
					background="gradiant"
				>
					<SvgArrows class="fill-white-icon dark:fill-white-icon"/>
				</DefaultButton>
				<hr class="h-full w-px bg-light-tertiary dark:bg-dark-tertiary border-none" />
				<DefaultButton
					@click="activateProjectModal"
					type="button" :text="meta.title"
					text-style="text-gray-400"
				/>
				<hr class="h-full w-px bg-light-tertiary dark:bg-dark-tertiary border-none" />
			</div>
			<div class="flex gap-2 p-1 rounded h-12 items-center">
				<IconButton type="button">
					<SvgGear/>
				</IconButton>
				<DefaultButton
					type="button"
					text="Share"
					text-style="text-white hover:text-white"
					background="gradiant"
				>
					<SvgGroup class="fill-white-icon dark:fill-white-icon"/>
				</DefaultButton>
			</div>
		</div>
		<div class="w-full flex bg-light-primary dark:bg-dark-primary items-center h-full px-2 border-b border-light-tertiary dark:border-dark-tertiary">
			<div class="w-full flex h-fit">
				<IconButton type="button" @click="endFocusMode">
					<SvgFocus class="fill-selected-icon dark:fill-selected-icon"/>
				</IconButton>
			</div>
		</div>
	</div>
	<ModalProject v-if="activate" @close="deactivateProjectModal"/>
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useProjectStore } from '@/store/modules/project.store';
import DefaultButton from '@/components/common/buttons/Default.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import ModalProject from '@/components/agility/modals/Project.vue';
import SvgArrows from '@/components/common/svg/Arrows.vue';
import SvgGear from '@/components/common/svg/Gear.vue';
import SvgGroup from '@/components/common/svg/Group.vue';
import SvgFocus from '@/components/common/svg/Focus.vue';

const emit = defineEmits(['update:focus-mode']);

const projectStore = useProjectStore();
const meta = computed(() => projectStore.meta);

const activate = ref(false);
const activateProjectModal = () => activate.value = true;
const deactivateProjectModal = () => activate.value = false;

const endFocusMode = () => {
	projectStore.deactivateFocusMode();
	emit("update:focus-mode", false);
}
</script>