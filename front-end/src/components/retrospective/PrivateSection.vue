<template>

	<div
		v-if="!isLock"
		v-for="(privatePostit, index) in privatePostits"
		:key="index"
		>
			<UpdatePostit :privatePostit="privatePostit" />
	</div>
	<CreatePostit v-if="!isLock"/>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import CreatePostit from './CreatePostit.vue';
import UpdatePostit from './UpdatePostit.vue';
import { computed } from 'vue';

const retroStore = useRetrospectiveStore();
const isLock = computed(() =>
	retroStore.currentRetro.isLocked && retroStore.currentRetro.isRetroEnded
	?
		true
	:
		!retroStore.currentRetro.isLocked && !retroStore.currentRetro.isRetroEnded
	?
		false
	:
		retroStore.currentRetro.isLocked || retroStore.currentRetro.isRetroEnded
	?
		true
	:
		false
);

const privatePostits = computed(() => retroStore.privatePostit);


</script>