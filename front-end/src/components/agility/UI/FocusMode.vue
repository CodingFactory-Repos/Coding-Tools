<template>
	<div class="w-full flex flex-col" style="min-height: 100px;">
		<div class="w-full flex justify-between bg-gray-900">
			<div class="flex gap-2 p-1 rounded h-12">
				<DefaultButton to="/agility/dashboard" text="Dashboard" color="text-white hover:text-white"
					background="bg-gradient-to-r from-violet-900 to-pink-600 hover:from-violet-800 hover:to-pink-500">
					<SVGLoader v-bind="{ name: 'arrows', size: '20px', color:'fill-white' }"/>	
				</DefaultButton>
				<hr class="h-full w-px bg-gray-400" />
				<DefaultButton @click="activateProjectModal" type="button" :text="meta.title" color="text-gray-400"/>
				<hr class="h-full w-px bg-gray-400" />
			</div>
			<div class="flex gap-2 p-1 rounded h-12 items-center">
				<IconButton type="button"
					:logo="{ name: 'gear', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<DefaultButton type="button" text="Share" color="text-white hover:text-white"
					background="bg-gradient-to-r from-violet-900 to-pink-600 hover:from-violet-800 hover:to-pink-500">
					<SVGLoader v-bind="{ name: 'group', size: '22px', color: 'fill-white' }"/>
				</DefaultButton>
			</div>
		</div>
		<div class="w-full flex bg-gray-800 items-center h-full px-2">
			<div class="w-full flex h-fit">
				<IconButton type="button" @click="endFocusMode"
					:logo="{ name: 'default', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
			</div>
		</div>
	</div>
	<ModalProject v-if="activate" @close="deactivateProjectModal"/>
</template>


<script lang="ts" setup>
import { computed, ref, toRaw } from 'vue';

import { useProjectStore } from '@/store/modules/project.store';
import SVGLoader from '@/components/common/SVGLoader';
import DefaultButton from '@/components/common/buttons/Default.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import ModalProject from '@/components/agility/modals/Project.vue';

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