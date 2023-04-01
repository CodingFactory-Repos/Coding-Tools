<template>
	<AgilityFocusUI v-if="focusMode" @update:focus-mode="updateFocusMode"/>
	<div class="w-full h-full relative">
		<div class="w-full h-full absolute pointer-events-none flex align-center items-center justify-center text-red-500">+</div>
		<AgilitySceneUI2 v-if="!focusMode && route.path === '/app/agility/new'" @update:focus-mode="updateFocusMode"/>
		<AgilitySceneUI v-else @update:focus-mode="updateFocusMode"/>
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import AgilitySceneUI from '@/components/agility/UI/SceneMode.vue';
import AgilitySceneUI2 from '@/components/agility/UI/SceneMode2.vue';
import AgilityFocusUI from '@/components/agility/UI/FocusMode.vue';


const route = useRoute();
const focusMode = ref(false);

const updateFocusMode = (val: boolean) => {
	focusMode.value = val;
}
</script>