<template>
	<div class="w-full h-full flex flex-col gap-0 h-20">
		<div class="relative w-full flex dark:bg-darker-primary h-9 min-h-[2.25rem]">
			<div class="w-14 min-w-[3.5rem] h-full flex justify-center items-center" @click="onContextMenu">
				<SvgBurger class="!fill-white hover:!fill-[#2e7bbe] cursor-pointer" width="28" height="28"/>
			</div>
			<CanvasTabulation/>
		</div>
		<slot/>
		<ContextMenu
			v-model:show="showContextMenu"
			:options="{
				x: 15,
				y: 40,
				zIndex: 999,
				minWidth: 230,
				theme: 'default dark',
				customClass: '!text-white dark:bg-dark-tertiary shadow-none p-0 overflow-hidden'
			}"
		>
			<ContextMenuItem label="Switch UI" class="cursor-pointer" @click="switchUI"/>
		</ContextMenu>
	</div>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import { useProjectStorev2 } from '@/store/modules/project2.store';
import { ContextMenu, ContextMenuItem } from '@imengyu/vue3-context-menu';

import CanvasTabulation from '@/components/agility/UI/CanvasTabulation.vue';
import SvgBurger from '@/components/common/svg/Burger.vue';

const projectStore = useProjectStorev2();

const showContextMenu = ref(false);
const onContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	showContextMenu.value = true;
}

const switchUI = () => {
	projectStore.toggleImmersion();
}
</script>