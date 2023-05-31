<template>
	<div class="w-full flex flex-col gap-4 h-full justify-start items-start mx-5 mt-16" v-if="allRetros.length > 0">
		<h1 class="text-2xl font-bold text-[#5c5f73] dark:text-dark-font">Your Retrospectives</h1>
		<div class="flex gap-4 flex-col">
			<div
				class="flex flex-col gap-2"
				v-for="(yearRetro, year) in retrospectivesByYear"
				:key="year"
			>
				<h2 class="text-xl font-bold text-[#5c5f73]">{{ yearRetro.year }}</h2>
				<div class="flex gap-4 flex-wrap">
					<div v-for="(retro, index) in yearRetro.retros" :key="index">
						<RetroCard :retro="retro" />
					</div>
				</div>
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
const retrospectivesByYear = computed(() => {
	const groupedRetros = {};

	allRetros.value.forEach(retro => {
		const year = new Date(retro.createdAt).getFullYear()
		if (!groupedRetros[year]) {
			groupedRetros[year] = [];
		}
		groupedRetros[year].push(retro);
	});

	const retrospectivesByYearArray = Object.entries(groupedRetros)
		.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
		.map(([year, retros]) => ({ year, retros }));

	return retrospectivesByYearArray;
});

onMounted(() => {
	retroStore.getAllRetros();
})

</script>