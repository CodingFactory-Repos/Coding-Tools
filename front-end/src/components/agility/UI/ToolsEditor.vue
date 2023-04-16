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
			<IconButton class="h-fit" type="button" @click="setDefaultMode">
				<SvgCursor width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': isDefault }"/>
			</IconButton>
			<IconButton class="h-fit" type="button">
				<SvgText width="22" height="22" class="!fill-gray-400"/>
			</IconButton>
			<IconButton class="h-fit" type="button" @click="createRectangle">
				<SvgPostIt width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'rectangle' }"/>
			</IconButton>
			<IconButton class="h-fit" type="button" @click="createFrame">
				<SvgFrame width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'framebox' }"/>
			</IconButton>
			<IconButton class="h-fit" type="button">
				<SvgShape width="22" height="22" class="!fill-gray-400"/>
			</IconButton>
			<hr class="h-2/3 w-px bg-light-tertiary dark:bg-dark-highlight border-none" />
			<IconButton class="h-fit" type="button" @click="onContextMenu">
				<SvgDownload width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': showDownloadContextMenu }"/>
				<ContextMenu
					v-model:show="showDownloadContextMenu"
					:options="contextMenuOptions"
				>
					<ContextMenuItem class="cursor-pointer border-b-[0.1px] border-gray-200" @click="download(DownloadType.MIME_PNG)">
						<span class="text-sm text-center w-full">Export PNG</span>
					</ContextMenuItem>
					<ContextMenuItem class="cursor-pointer border-b-[0.1px] border-gray-200" @click="download(DownloadType.MIME_JPG)">
						<span class="text-sm text-center w-full">Export JPG</span>
					</ContextMenuItem>
					<ContextMenuItem class="cursor-pointer" @click="download(DownloadType.MIME_WEBP)">
						<span class="text-sm text-center w-full">Export WEBP</span>
					</ContextMenuItem>
				</ContextMenu>
			</IconButton>
			<IconButton class="h-fit" type="button">
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
				@click="shareRoom"
			>
				<SvgGroup class="fill-white-icon dark:fill-white-icon"/>
			</DefaultButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue';
import { useProjectStore } from '@/store/modules/project.store';
import { type MenuOptions, ContextMenu, ContextMenuItem } from '@imengyu/vue3-context-menu';
import { DownloadType } from '@/lib/pixi-tools-v2/types/pixi-enums';

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
import Swal from 'sweetalert2';

const projectStore = useProjectStore();

const selectedGeometry = computed(() => projectStore.deferredGeometry);
const isDefault = computed(() => projectStore.default);
watch(isDefault, val => {
	if(val) projectStore.enableSelectionBox()
	else projectStore.enableSelectionBox(true);
});

const setDefaultMode = () => {
	projectStore.default = true;
	projectStore.deferredGeometry = null;
	projectStore.removeGeometryEvent();
}

const createRectangle = () => {
	projectStore.deferredGeometry = "rectangle";
	projectStore.setDeferredEvent("pointer", false);
}

const createFrame = () => {
	projectStore.deferredGeometry = "framebox";
	projectStore.setDeferredEvent("pointer", true);
}

const contextMenuOptions = ref<MenuOptions>({
	x: 10,
	y: 40,
	zIndex: 999,
	minWidth: 300,
	theme: 'default dark',
	customClass: '!text-white dark:bg-darker-primary shadow-none p-0 overflow-hidden min-w-[10rem]',
})

const showDownloadContextMenu = ref(false);
const onContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	showDownloadContextMenu.value = true;
	contextMenuOptions.value.x = e.x;
	contextMenuOptions.value.y = e.y;
}

const download = (mime: string) => {
	projectStore.canvasDownload(mime);
}

const shareRoom = () => {
	Swal.fire({
		text: "Kinda want a list of users there. So we can select them, and send an email. But we can also propsose a link to share. Both are valid"
	})
}
</script>