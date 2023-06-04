<template>
    <div>
        <!--div v-if="course">
            <h1>{{ course.tag }}</h1>
            <p>{{ course.description }}</p>
        </div-->

        <!--div v-else>
            <p>Chargement...</p>
        </div-->
    </div>
</template>

<script lang="ts">
/*
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/store/modules/course.store';


// Use the openHouses store
const courseStore = useCourseStore();
// Create a reactive variable to store the articles
const items = computed(() => courseStore);

// Display the modal
const showModal = ref(false);

// Get the router
const router = useRouter();

// Fetch the articles
const getOpenHouse = async () => {
	await courseStore.getAllCourses();
    return;
};

// Call the getArticles method when the component is created
onMounted(() => {
	getOpenHouse();
});

//import { defineComponent } from 'vue';

export default defineComponent({
    async beforeRouteEnter(to, from, next) {
        const store = useCourseStore();
        await store.getAllCourses();
        next(true);
    },
    setup() {
       const store = useCourseStore();

        return {
            course: store.course,
        };
    },

});*/

import { computed, onMounted, ref } from 'vue';
import { useCourseStore } from '@/store/modules/course.store';
//import { useAuthStore } from '@/store/modules/auth.store';  //authentification pour plus tard
//import ModalOverlay from '@/components/common/Modal.vue';

import Swal from 'sweetalert2';
/*import MarkdownIt from 'markdown-it';

let markdown = ref('');

// create renderMarkdown method
const renderMarkdown = () => {
	const md = new MarkdownIt();
	return md.render(markdown.value);
};
*/
// get store
const courseStore = useCourseStore();
const allcourse = computed(() => courseStore.getAllCourses);

/*const authStore = useAuthStore();
const user = computed(() => authStore.user);*/

// Display the modal
//const showModal = ref(false);

/* Function to open and close the modal
const openMetaModal = () => (showModal.value = true);
const closeMetaModal = () => (showModal.value = false);
const openCommentModal = () => (showCommentModal.value = true);
const closeCommentModal = () => (showCommentModal.value = false);
const changeComments = () => (showComments.value = !showComments.value);
*/
// get id from url
const _id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});
/*
// get article by id
const getArticleById = async (_id: string) => {
	await articleStore.getArticleById(_id);
	markdown.value = oneItems.value.descriptions;
};*/

const formatDate = (date: Date) => {
	// transform date to string
	const newDate = date.toString();
	const dateSplited = newDate.split('T')[0].split('-').reverse().join('/');
	const timeSplited = newDate.split('T')[1].split('.')[0];
	return `${dateSplited} at ${timeSplited}`;
};

// get article by id on mounted
onMounted(() => {
	console.log(allcourse);
//	markdown.value = oneItems.value.descriptions;
});





</script>
