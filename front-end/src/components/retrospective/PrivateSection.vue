<template>

	<div
		v-for="(privatePostit, index) in privatePostits"
		:key="index"
		>
			<UpdatePostit :privatePostit="privatePostit" />
	</div>
	<CreatePostit />
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import CreatePostit from './CreatePostit.vue';
import UpdatePostit from './UpdatePostit.vue';
import { computed } from 'vue';
const retroStore = useRetrospectiveStore();

const privatePostits = computed(() => retroStore.privatePostit);


</script>