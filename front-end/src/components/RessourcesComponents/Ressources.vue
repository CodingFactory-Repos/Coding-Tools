<template>
	<div>
        <h1>Ressources</h1>
        <div>
	        <CoursPage v-if="state === 0" />
			<OpenHousesPage v-else-if="state === 1" />
        </div>
	</div>
</template>

<script lang="ts" setup>
import CoursPage from '@/components/RessourcesComponents/Cours.vue';
import OpenHousesPage from '@/components/RessourcesComponents/OpenHouses.vue';

const state = 0;

</script>