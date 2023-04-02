<template>
	<div class="w-full flex dark:bg-dark-secondary h-12 border-b border-darker-primary gap-4 py-1 px-3 items-center justify-between">
		<div class="flex h-full gap-1 items-center">
			<DefaultButton
				to="/app/agility/dashboard"
				text="Dashboard"
				text-style="text-white hover:text-white"
				background="gradiant"
				class="h-9"
			>
				<SvgArrows class="fill-white-icon dark:fill-white-icon"/>
			</DefaultButton>
		</div>
		<div class="grow flex h-full gap-1 items-center">
			<IconButton class="h-fit" type="button">
				<SvgCursor width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': isDefault }"/>
			</IconButton>
			<IconButton class="h-fit" type="button">
				<SvgText width="22" height="22" class="!fill-gray-400"/>
			</IconButton>
			<IconButton class="h-fit" type="button">
				<SvgPostIt width="22" height="22" class="!fill-gray-400" @click="createRectangle"/>
			</IconButton>
			<IconButton class="h-fit" type="button">
				<SvgFrame width="22" height="22" class="!fill-gray-400" @click="createFrame"/>
			</IconButton>
			<IconButton class="h-fit" type="button">
				<SvgShape width="22" height="22" class="!fill-gray-400"/>
			</IconButton>
			<hr class="h-2/3 w-px bg-light-tertiary dark:bg-dark-highlight border-none" />
			<IconButton type="button">
				<SvgDownload width="22" height="22" class="!fill-gray-400"/>
			</IconButton>
			<IconButton type="button">
				<SvgProject width="22" height="22" class="!fill-gray-400"/>
			</IconButton>
		</div>
		<div class="flex h-full gap-1 items-center">
			<DefaultButton
				type="button"
				text="Share"
				class="h-9"
				text-style="text-white hover:text-white"
				background="gradiant"
			>
				<SvgGroup class="fill-white-icon dark:fill-white-icon"/>
			</DefaultButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useProjectStorev2 } from '@/store/modules/project2.store';
import { computed, watch } from 'vue';

import SvgArrows from '@/components/common/svg/Arrows.vue';
import SvgCursor from '@/components/common/svg/Cursor.vue';
import SvgText from '@/components/common/svg/Text.vue';
import SvgPostIt from '@/components/common/svg/PostIt.vue';
import SvgFrame from '@/components/common/svg/Frame.vue';
import SvgShape from '@/components/common/svg/Shape.vue';
import SvgDownload from '@/components/common/svg/Download.vue';
import SvgProject from '@/components/common/svg/Project.vue';
import DefaultButton from '@/components/common/buttons/Default.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import SvgGroup from '@/components/common/svg/Group.vue';

const projectStore = useProjectStorev2();

const isDefault = computed(() => projectStore.default);
watch(isDefault, val => {
	if(val) projectStore.toggleDefaultCanvasMode()
	else projectStore.toggleDefaultCanvasMode(true);
});

const createRectangle = () => {
	projectStore.deferredGeometry = "RECTANGLE";
	projectStore.setDeferredEvent("pointer", false);
}

const createFrame = () => {
	projectStore.deferredGeometry = "RECTANGLE";
	projectStore.setDeferredEvent("pointer", true);
}
</script>