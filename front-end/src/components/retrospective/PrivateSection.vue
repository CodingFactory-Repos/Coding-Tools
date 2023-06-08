<template>
	<div v-if="!isLock">
		<div v-for="(privatePostit, index) in privatePostits" :key="index">
			<UpdatePostit :privatePostit="privatePostit" />
		</div>
	</div>
	<CreatePostit v-if="!isLock" />
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import CreatePostit from './CreatePostit.vue';
import UpdatePostit from './UpdatePostit.vue';
import { computed } from 'vue';

const retroStore = useRetrospectiveStore();

const isLock = computed(() => {
	const { isLocked, isRetroEnded } = retroStore.currentRetro;
	return [isLocked, isRetroEnded].some((b) => b);
});

const privatePostits = computed(() => retroStore.privatePostit);
</script>
