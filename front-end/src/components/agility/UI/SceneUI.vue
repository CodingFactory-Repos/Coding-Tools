<template>
	<div class="w-full h-full flex flex-col gap-0 h-20">
		<div class="relative w-full flex dark:bg-darker-primary h-9 min-h-[2.25rem]">
			<div class="w-14 min-w-[3.5rem] h-full flex justify-center items-center" @click="onContextMenu">
				<SvgBurger class="!fill-white hover:!fill-[#2e7bbe] cursor-pointer" width="28" height="28"/>
			</div>
			<CanvasTabulation :room-id="roomId"/>
		</div>
		<slot/>
		<ContextMenu
			v-model:show="showContextMenu"
			:options="contextMenuOptions"
		>
			<ContextMenuItem class="cursor-pointer" @click="switchUI">
				<span class="text-sm text-center w-full">Switch UI</span>
			</ContextMenuItem>
			<ContextMenuItem class="cursor-pointer" @click="openModal">
				<span class="text-sm text-center w-full">Edit project</span>
			</ContextMenuItem>
		</ContextMenu>

		<ModalProject
			v-if="active"
			@close="onModalClose"
			:roomId="roomId"
		/>
	</div>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import { useProjectStore } from '@/store/modules/project.store';
import { type MenuOptions, ContextMenu, ContextMenuItem } from '@imengyu/vue3-context-menu';

import CanvasTabulation from '@/components/agility/UI/CanvasTabulation.vue';
import SvgBurger from '@/components/common/svg/Burger.vue';
import ModalProject from '@/components/agility/modals/Project.vue';

defineProps({
	roomId: { type: String, required: true },
})

const projectStore = useProjectStore();

const contextMenuOptions = ref<MenuOptions>({
	x: 10,
	y: 40,
	zIndex: 999,
	minWidth: 300,
	theme: 'default dark',
	customClass: '!text-white dark:bg-darker-primary shadow-none p-0 overflow-hidden min-h-[10rem] min-w-[10rem]',
})

const showContextMenu = ref(false);
const active = ref(false);

const onContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	showContextMenu.value = true;
	contextMenuOptions.value.x = e.x;
	contextMenuOptions.value.y = e.y;
}

const switchUI = () => {
	projectStore.toggleImmersion();
}

const openModal = () => {
	active.value = true;
}

const onModalClose = () => {
	active.value = false;
}
</script>

<style>
.mx-context-menu-item .label {
	padding: unset;
}

.mx-context-menu-item:hover {
	background: #2c2e3a;
}
</style>