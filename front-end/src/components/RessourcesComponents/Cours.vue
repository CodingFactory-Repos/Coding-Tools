<template>

	<div>
        <h2>Cours</h2>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCoursStore } from '@/store/modules/course.store';


// Use the openHouses store
const courseStore = useCoursStore();
// Create a reactive variable to store the articles
const items = computed(() => courseStore.items);

// Display the modal
//const showModal = ref(false);

// Get the router
const router = useRouter();

// Fetch the articles
const getCourses = async () => {
	await courseStore.getCourse();
};

// Call the getArticles method when the component is created
onMounted(() => {
	getCourses();
});

// Function to open the openHouse page
/*const openCourse = (id: string) => {
	router.push(`/app/ressource/openhouse/${id}`);
};*/

// Function to format the date
const formatDate = (date) => {
	const options = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	} as Intl.DateTimeFormatOptions;
	return new Date(date).toLocaleDateString('fr-FR', options);
};
</script>
