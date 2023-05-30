<template>
	<div class="w-full flex flex-col gap-4 h-full justify-start items-start mx-5 mt-16" v-if="allRetros.length > 0">
		<h1 class="text-2xl font-bold text-[#5c5f73] dark:text-dark-font">Your Retrospectives</h1>
		<div class="flex gap-4 flex-wrap">
			<div v-for="(retro, index) in allRetros" :key="index">
				<RetroCard :retro="retro" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { computed, onMounted } from 'vue';
import RetroCard from './utils/RetroCard.vue';


const retroStore = useRetrospectiveStore();
const allRetros = computed(() => retroStore.allRetros)

onMounted(() => {
	retroStore.getAllRetros();
})

</script>