<template>
	<div
		class="w-full flex bg-light-primary dark:bg-dark-secondary h-12 border-b dark:border-darker-primary gap-4 py-1 px-3 items-center justify-between h-[53px]"
	>
		<div class="flex h-full gap-1 items-center">
			<DefaultButton
				to="/app/agility/dashboard"
				text="Dashboard"
				text-style="text-white hover:text-white"
				background="gradiant"
				class="h-9"
			>
			<SvgArrows class="fill-white-icon dark:fill-white-icon" />
			</DefaultButton>
		</div>
		<div class="grow flex h-full gap-1 items-center">
			<IconButton class="h-fit" type="button" @click="setDefaultMode">
				<SvgCursor
					width="22"
					height="22"
					class="!fill-gray-400"
					:class="{ '!fill-selected-icon dark:!fill-selected-icon': isDefault }"
				/>
			</IconButton>
			<IconButton class="h-fit" type="button" @click="createGeometry('textarea', 'text')">
				<SvgText
					width="22"
					height="22"
					class="!fill-gray-400"
					:class="{
						'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'textarea',
					}"
				/>
			</IconButton>
			<IconButton class="h-fit" type="button" @click="createFrame">
				<SvgFrame
					width="22"
					height="22"
					class="!fill-gray-400"
					:class="{
						'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'framebox',
					}"
				/>
			</IconButton>
			<div class="relative flex items-center justify-center z-10">
				<IconButton class="h-fit" type="button" @click="toggleGeometryPopUp">
					<SvgShape
						width="22"
						height="22"
						class="!fill-gray-400"
						:class="{ '!fill-selected-icon dark:!fill-selected-icon': showGeometryPopUp }"
					/>
				</IconButton>
				<div
					v-if="showGeometryPopUp"
					class="absolute bottom-[-60px] w-fit h-[46px] px-1 py-1 bg-light-primary dark:bg-dark-secondary rounded-lg flex items-center justify-center border dark:border-darker-primary"
				>
					<IconButton class="h-fit" type="button" @click="createGeometry('rectangle')">
						<SvgRectangle
							width="22"
							height="22"
							class="!fill-gray-400"
							:class="{
								'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'rectangle',
							}"
						/>
					</IconButton>
					<IconButton class="h-fit" type="button" @click="createGeometry('circle')">
						<SvgCircle
							width="22"
							height="22"
							class="!fill-gray-400"
							:class="{
								'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'circle',
							}"
						/>
					</IconButton>
					<IconButton class="h-fit" type="button" @click="createGeometry('triangle')">
						<SvgTriangle
							width="22"
							height="22"
							class="!fill-gray-400"
							:class="{
								'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'triangle',
							}"
						/>
					</IconButton>
				</div>
			</div>

			<hr class="h-2/3 w-px bg-light-tertiary dark:bg-dark-highlight border-none" />

			<IconButton class="h-fit" type="button" @click="onContextMenu">
				<SvgDownload
					width="22"
					height="22"
					class="!fill-gray-400"
					:class="{ '!fill-selected-icon dark:!fill-selected-icon': showDownloadContextMenu }"
				/>
				<ContextMenu v-model:show="showDownloadContextMenu" :options="contextMenuOptions">
					<ContextMenuItem
						class="cursor-pointer border-b-[0.1px] border-gray-200"
						@click="download(DownloadType.MIME_PNG)"
					>
						<span class="text-sm text-center w-full">Export PNG</span>
					</ContextMenuItem>
					<ContextMenuItem
						class="cursor-pointer border-b-[0.1px] border-gray-200"
						@click="download(DownloadType.MIME_JPG)"
					>
						<span class="text-sm text-center w-full">Export JPG</span>
					</ContextMenuItem>
					<ContextMenuItem class="cursor-pointer" @click="download(DownloadType.MIME_WEBP)">
						<span class="text-sm text-center w-full">Export WEBP</span>
					</ContextMenuItem>
				</ContextMenu>
			</IconButton>
			<IconButton class="h-fit" type="button" @click="openBlueprintModal">
				<SvgProject
					width="22"
					height="22"
					class="!fill-gray-400"
					:class="{ '!fill-selected-icon dark:!fill-selected-icon': isBlueprintModalOpen }"
				/>
			</IconButton>
			<ColorPickerOption position="bottom-[-330px] left-[30px]" />
			<div v-if="isTextAreaEdited">
				<IconButton class="h-fit" type="button">
					<SvgFrame
						width="22"
						height="22"
						class="!fill-gray-400"
						:class="{
							'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'framebox',
						}"
					/>
				</IconButton>
				<IconButton class="h-fit" type="button">
					<SvgFrame
						width="22"
						height="22"
						class="!fill-gray-400"
						:class="{
							'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'framebox',
						}"
					/>
				</IconButton>
				<IconButton class="h-fit" type="button">
					<SvgFrame
						width="22"
						height="22"
						class="!fill-gray-400"
						:class="{
							'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'framebox',
						}"
					/>
				</IconButton>
				<IconButton class="h-fit" type="button">
					<SvgFrame
						width="22"
						height="22"
						class="!fill-gray-400"
						:class="{
							'!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'framebox',
						}"
					/>
				</IconButton>
			</div>
		</div>

		<ShareProject v-if="isShareModalOpen" @close="closeShareModal" />
		<ManageUser v-if="isOwner && isManagerModalOpen" @close="closeManagerModal" />
		<BlueprintModal v-if="isBlueprintModalOpen" @close="closeBlueprintModal" />
		<TextAreaEditor v-if="isTextAreaEdited" @close="openTextAreaEdited"></TextAreaEditor>
		<div class="flex h-full gap-1 items-center">
			<IconButton class="h-fit" type="button" @click="openManagerModal" v-if="isOwner">
				<SvgGear width="22" height="22" class="!fill-gray-400" />
			</IconButton>
			<DefaultButton
				type="button"
				text="Share"
				class="h-9"
				text-style="text-white hover:text-white"
				background="gradiant"
				@click="openShareModal"
			>
				<SvgGroup class="fill-white-icon dark:fill-white-icon" />
			</DefaultButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue';
import { useProjectStore } from '@/store/modules/project.store';
import { type MenuOptions, ContextMenu, ContextMenuItem } from '@imengyu/vue3-context-menu';
import { DownloadType, LiteralGeometryTypes } from '@/lib/pixi-tools-v2/types/pixi-enums';

import TextAreaEditor from '@/components/agility/UI/TextAreaEditor.vue';
import BlueprintModal from '@/components/agility/modals/Blueprint.vue';
import ColorPickerOption from '@/components/agility/UI/ColorPickerOption.vue';
import ShareProject from '@/components/agility/UI/ShareProject.vue';
import SvgArrows from '@/components/common/svg/Arrows.vue';
import SvgCursor from '@/components/common/svg/Cursor.vue';
import SvgText from '@/components/common/svg/Text.vue';
import SvgFrame from '@/components/common/svg/Frame.vue';
import SvgShape from '@/components/common/svg/Shape.vue';
import SvgDownload from '@/components/common/svg/Download.vue';
import SvgProject from '@/components/common/svg/Project.vue';
import DefaultButton from '@/components/common/buttons/Default.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import SvgGroup from '@/components/common/svg/Group.vue';
import SvgGear from '@/components/common/svg/Gear.vue';
import SvgCircle from '@/components/common/svg/Circle.vue';
import SvgRectangle from '@/components/common/svg/Rectangle.vue';
import SvgTriangle from '@/components/common/svg/Triangle.vue';
import ManageUser from '@/components/agility/UI/ManageUser.vue';
import { useAgilityStore } from '@/store/modules/agility.store';
import { ContainerTypeId } from '@/lib/pixi-tools-v2/types/pixi-serialize';

const projectStore = useProjectStore();
const agilityStore = useAgilityStore();

const isOwner = computed(() => agilityStore.isOwner);
const selectedGeometry = computed(() => projectStore.deferredGeometry);
const isDefault = computed(() => projectStore.default);
watch(isDefault, (val) => {
	if (val) {
		projectStore.enableSelectionBox();
		closeGeometryPopUp();
	} else projectStore.enableSelectionBox(true);
});

const setDefaultMode = () => {
	projectStore.default = true;
	projectStore.deferredGeometry = null;
	projectStore.deferredContainer = null;
	projectStore.deferredBlueprint = null;
	projectStore.removeGeometryEvent();
};

const createGeometry = (geometry: LiteralGeometryTypes, container: ContainerTypeId = 'generic') => {
	projectStore.deferredGeometry = geometry;
	projectStore.deferredContainer = container;
	projectStore.setDeferredEvent('pointer', false);
};

const createFrame = () => {
	closeGeometryPopUp();
	projectStore.deferredGeometry = 'framebox';
	projectStore.setDeferredEvent('pointer', true);
};

const contextMenuOptions = ref<MenuOptions>({
	x: 10,
	y: 40,
	zIndex: 999,
	minWidth: 300,
	theme: 'default dark',
	customClass: '!text-white dark:bg-darker-primary shadow-none p-0 overflow-hidden min-w-[10rem]',
});

const showDownloadContextMenu = ref(false);
const onContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	showDownloadContextMenu.value = true;
	contextMenuOptions.value.x = e.x;
	contextMenuOptions.value.y = e.y;
};

const download = (mime: string) => {
	projectStore.canvasDownload(mime);
};

const isShareModalOpen = ref(false);
const openShareModal = () => {
	isShareModalOpen.value = true;
};
const closeShareModal = () => {
	isShareModalOpen.value = false;
};

const isManagerModalOpen = ref(false);
const openManagerModal = () => {
	isManagerModalOpen.value = true;
};
const closeManagerModal = () => {
	isManagerModalOpen.value = false;
};

const isBlueprintModalOpen = ref(false);
const openBlueprintModal = () => {
	isBlueprintModalOpen.value = true;
};
const closeBlueprintModal = () => {
	isBlueprintModalOpen.value = false;
};

const isTextAreaEdited = ref(true);
const openTextAreaEdited = () => {
	isTextAreaEdited.value = true;
};
const closeTextAreaEdited = () => {
	isTextAreaEdited.value = false;
};

const showGeometryPopUp = ref(false);
const toggleGeometryPopUp = () => {
	showGeometryPopUp.value = !showGeometryPopUp.value;
};
const closeGeometryPopUp = () => {
	if (showGeometryPopUp.value) {
		showGeometryPopUp.value = false;
	}
};
</script>
