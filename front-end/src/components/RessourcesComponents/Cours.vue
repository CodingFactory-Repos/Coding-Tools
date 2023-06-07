<template>
	
	<div>
		<div v-if="userRole === Roles.USER">
			<h1>ELEVE</h1>
		</div>
		<div class="flex items-center justify-center">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4"
                @click="startYears-- && endYears--; getCurrentYearsCours(); ">←</button>
            <span class="text-2xl font-bold">{{ startYears }} - {{ endYears }}</span>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-4"
                @click="startYears++ && endYears++; getCurrentYearsCours();">→</button>
        </div>
		<div>
			<div class="flex items-center justify-center">
            <div class="flex items-center justify-center">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    @click="showModal = true">+</button>
                <AddCourse v-if="showModal" @close="showModal = false" />
            </div>
        </div>
		</div>
		<div v-for="language in TagList" @click="showCoursesByLanguage(language)" >
			<h5>{{ language }}</h5>
		</div>	
		<div class="text-center flex items-center justify-center max-w-full h-full">
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
				<div
					v-for="item in coursesFiltered"
					class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
					@click="openCourse(item._id)"
				>
					<img
						class="object-cover h-48 w-96 rounded-t-lg"
						:src="
							item.picture && item.picture != ''
								? item.picture
								: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
						"
						alt=""
					/>
					<div class="pt-3 pb-2">
						<span
							class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
							>{{ formatDate(item.periodStart) }}</span
						>
					</div>
					<div class="pt-2 pb-5">
						<a href="#">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{{ item.tag ? item.tag : 'Pas de titre spécifié' }}
							</h5>
						</a>
						<p class="mb-3 p-3 font-normal text-gray-700 dark:text-gray-400">
							{{ item.language ? item.language : 'Pas de description spécifiée' }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCoursStore } from '@/store/modules/course.store';
import AddCourse from './AddCourse.vue'
import { useAuthStore } from '@/store/modules/auth.store';
import { Roles } from '@/store/interfaces/auth.interfaces';

const startYears = ref(new Date().getFullYear());
const endYears = ref(new Date().getFullYear() + 1);
const TagList = ref([]);
let currentYearsCourses = [];
const showModal = ref(false)
// let coursesFiltered = [];
const coursesFiltered = ref([])
// Use the openHouses store
const courseStore = useCoursStore();
const authStore = useAuthStore();
// Create a reactive variable to store the articles
const items = computed(() => courseStore.items);
const user = computed(() => authStore.user);
const userRole = computed(() => user.value?.role);

function showCoursesByLanguage(language){
	coursesFiltered.value = [];
	currentYearsCourses.forEach(element =>{
		if(element.language.toUpperCase() == language){
			coursesFiltered.value.push(element);
		}
	})
};

function getCurrentYearsCours(){
	currentYearsCourses = [];
	const coursesList = items.value;
	coursesList.forEach(element =>{
		const dateStart = new Date(element.periodStart).getFullYear();
		const dateEnd = new Date(element.periodEnd).getFullYear();
		if(dateStart>=startYears.value && dateEnd<=endYears.value){
			currentYearsCourses.push(element);
		}
	})
	getAllTagCourse();
	coursesFiltered.value = currentYearsCourses;
};

function getAllTagCourse() {
	TagList.value = [];
	currentYearsCourses.forEach(element =>{
		if(!TagList.value.includes(element.language.toUpperCase())){
			TagList.value.push(element.language.toUpperCase());
		}
	})
};

// Get the router
const router = useRouter();

// Fetch the articles
const getCourses = async () => {
	await courseStore.getCourse();
	getCurrentYearsCours();
};

// Call the getArticles method when the component is created
onMounted(async() => {
	await getCourses();
});

// Function to open the openHouse page
const openCourse = (id: string) => {
	router.push(`/app/ressource/courses/${id}`);
};

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
