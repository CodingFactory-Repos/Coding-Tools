<template>
	<div class="w-300 flex flex-col gap-4 h-full">
		<div class="w-full">
			<label
				for="default-search"
				class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
				>Search</label
			>
			<div class="relative">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<svg
						aria-hidden="true"
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<input
					type="text"
					v-model="input"
					@change="filteredList()"
					id="default-search"
					class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Rechercher un matériel.."
					required
				/>
				<button
					type="submit"
					@click="filteredList()"
					class="text-white absolute right-2.5 bottom-2.5 gradiant hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Rechercher
				</button>
			</div>
			<div class="relative w-fit">
				<div>
					<div class="w-fit mt-4 flex flex-row items-center justify-between">
						<select
							id="selectSite"
							class="w-100 bg-gray-50 m-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="site"
						>
							<option value="" selected>Campus</option>
							<option value="Cergy">Cergy</option>
							<option value="Paris">Paris</option>
						</select>
						<select
							id="selectState"
							class="bg-gray-50 m-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="state"
						>
							<option value="" selected>État</option>
							<option value="Mauvais">Mauvais</option>
							<option value="Bon">Bon</option>
							<option value="Excellent">Excellent</option>
						</select>
						<select
							id="selectCategory"
							class="bg-gray-50 m-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="type"
						>
							<option value="" selected>Type</option>
							<option value="Mac">Mac</option>
							<option value="Livre">Livre</option>
							<option value="Hardware">Hardware</option>
						</select>
						<select
							id="selectStatus"
							class="bg-gray-50 m-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							v-model="status"
						>
							<option :value="true" selected>Disponibilité</option>
							<option :value="true">Disponible</option>
							<option :value="false">Indisponible</option>
						</select>
					</div>
				</div>
			</div>
			<div class="w-full flex flex-wrap flex-row">
				<MaterialCard
					v-for="(material, index) in materials"
					:key="`material_${material.name}_${index}`"
					:id="material._id"
					:material="material"
					:name="material.name"
					:url="material.picture"
					:status="material.status"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useMaterialStore } from '@/store/modules/material.store';
import MaterialCard from '@/components/materials/MaterialCard.vue';

const materialStore = useMaterialStore();
const materials = computed(() => materialStore.filteredMaterial);
const input = ref('');
const state = ref('');
const site = ref('');
const type = ref('');
const status = ref(true);

const filteredList = () => {
	materialStore.input = input.value;
	materialStore.filter.state = state.value;
	materialStore.filter.site = site.value;
	materialStore.filter.type = type.value;
	materialStore.filter.status = status.value;
};

onMounted(async () => {
	await materialStore.getMaterials();
});
</script>
