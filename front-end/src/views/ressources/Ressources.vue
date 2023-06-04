<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div>
		<h1>Ressources</h1>
		<div>
			<button v-on:click="SetPage(0)">Cours</button>
			<p></p>
			<button v-on:click="SetPage(1)">JPO</button>
		</div>
		<div>
			<h2>{{ state }}</h2>
			<CoursPage v-show="state == 0" />
			<OpenHousesPage v-show="state == 1" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CoursPage from '@/components/RessourcesComponents/Cours.vue';
import OpenHousesPage from '@/components/RessourcesComponents/OpenHouses.vue';

export default defineComponent({
	components: {
		OpenHousesPage,
		CoursPage,
	},
	data() {
		return {
			state: 0,
		};
	},
	methods: {
		SetPage(index) {
			this.state = index;
		},
	},
});
</script>
