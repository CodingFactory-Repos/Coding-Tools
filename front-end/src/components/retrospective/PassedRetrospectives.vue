<template>
	<div class="w-full flex flex-col gap-4 h-full justify-start items-start mx-5 mt-16 mb-4" v-if="allRetros.length > 0">
		<h1 class="text-2xl font-bold text-[#5c5f73] dark:text-dark-font">Your Retrospectives</h1>
		<div class="w-full">
			<FilterRetro :allRetros="allRetros"/>
		</div>
		<div class="flex gap-4 flex-col" v-if="isSearchInput === '' && isDateInput === 0">
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
		<div class="flex gap-4 flex-col w-full" v-else-if="isSearchInput !== '' || isDateInput !== 0">
			<div class="flex gap-4 flex-wrap" v-if="retroFiltered.length > 0">
				<div v-for="(retro, index) in retroFiltered" :key="index">
					<RetroCard :retro="retro" />
				</div>
			</div>
			<div class="flex flex-1 gap-4 flex-wrap items-center w-full justify-center" v-else>
				<div class="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
					<h2
						class="mb-8 lg:mb-16 text-2xl font-extrabold tracking-tight leading-tight text-center text-gray-900 dark:text-white md:text-4xl"
					>
						No retros found...
					</h2>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { computed, onMounted } from 'vue';
import RetroCard from './utils/RetroCard.vue';
import FilterRetro from './utils/FilterRetro.vue';


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

const isSearchInput = computed(() => retroStore.inputSearch);
const isDateInput = computed(() => retroStore.dateSearch);
const retroFiltered = computed(() => allRetros.value.filter((el) => {
	if (isSearchInput.value !== "") {
		if (isDateInput.value !== 0) {
		return (
			new Date(el.createdAt).getFullYear() === isDateInput.value)
			&&
			el.creator.toLocaleLowerCase().includes(isSearchInput.value.toLowerCase())
			||
			el.title.toLocaleLowerCase().includes(isSearchInput.value.toLowerCase()
			);
		} else {
			return (
				el.creator.toLocaleLowerCase().includes(isSearchInput.value.toLowerCase())
				||
				el.title.toLocaleLowerCase().includes(isSearchInput.value.toLowerCase())
				);
		}
	} else if (isSearchInput.value === "" && isDateInput.value !== 0) {
		return (new Date(el.createdAt).getFullYear() === isDateInput.value);
	}
}

	))

onMounted(() => {
	retroStore.getAllRetros();
})

</script>