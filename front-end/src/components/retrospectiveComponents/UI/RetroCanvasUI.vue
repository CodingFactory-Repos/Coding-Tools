<template>
	<ToolsMode v-if="focusMode" @update:focus-mode="updateFocusMode"/>
	<div class="w-full h-full relative">
		<div class="w-full h-full absolute pointer-events-none flex align-center items-center justify-center text-red-500">+</div>
		<RetroSceneUI v-if="!focusMode" @update:focus-mode="updateFocusMode"/>
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import RetroSceneUI from '@/components/retrospectiveComponents/UI/RetroSceneUI.vue'
import ToolsMode from '../ToolsMode.vue';

const focusMode = ref(false);

const updateFocusMode = (val: boolean) => {
	focusMode.value = val;
}
</script>