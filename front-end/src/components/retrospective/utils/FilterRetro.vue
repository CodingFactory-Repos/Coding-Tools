<template>
	<div id="dropdownDivider"
		class="mt-2 z-10  w-11/12 flex flex-col gap-2">
		<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<svg aria-hidden="true" class="w-5 h-5 text-[#959595;] dark:text-gray-400" fill="none" stroke="currentColor"
					viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
			</div>
			<input
				@input="setInput"
				v-model="searchInput"
				type="search"
				id="default-search"
				class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 placeholder-[#959595;] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Search retro by title or creator"
			>
		</div>
		<VueDatePicker
			v-model="dateChoosed"
			@update:model-value="selectedDate"
			@cleared="clearDate"
			year-picker
			auto-apply
			:year-range="rangeDate"
			placeholder="Select Date"
			menu-class-name="dp-custom-menu"
			mode-height="auto"
		/>
	</div>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { computed, ref } from 'vue';

const props = defineProps({
	allRetros: { type: Object, required: true }
})
const dateChoosed = ref(0);
const retroStore = useRetrospectiveStore();
const searchInput = ref("");

const rangeDate = computed(() => {
	const datesRetro = props.allRetros.map(item => new Date(item.createdAt).getFullYear());

	const minDate = Math.min(...datesRetro);
	const maxDate = Math.max(...datesRetro)
	return [minDate, maxDate]
})
const setInput = () => {
	retroStore.inputSearchFilter(searchInput.value)
}
const selectedDate = () => {
	retroStore.dateSearchFilter(dateChoosed.value)
}
const clearDate = () => {
	retroStore.dateSearchFilter(0)
}
</script>

<style lang="scss" >
.dp__theme_light {
	--dp-text-color: #212121;
	--dp-highlight-color: rgba(25, 118, 210, 0.1);
	--dp-border-radius: 0.5rem;
	--dp-font-size: 0.875rem;
	--dp-input-padding: 16px  16px 16px;
	--dp-input-icon-padding: 40px;
	--dp-background-color: rgb(249 250 251);
	--dp-border-color: rgb(209 213 219);
	--dp-border-color-hover: #1C64F2;
}

.dp-custom-menu {
	box-shadow: 0 0 6px #1976d2;
}
</style>