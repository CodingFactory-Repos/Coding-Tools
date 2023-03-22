<template>
    <div class="flex flex-col items-center justify-center container">

        <div class="m-10">
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-5xl font-bold text-white">Cours</h1>
            </div>
        </div>

        <div class="flex flex-row items-center justify-center m-10">
            <div>
                <p>Année {{ StartYears }} - {{ EndYears }}</p>
            </div>
        </div>

        <div>
            <div class="flex flex-row items-center justify-center">
                <input type="text" v-model="serach" placeholder="Rechercher un cours"
                    class="border-2 border-black m-4 inline-block p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-full">
            </div>
            <div>
                <div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div v-for="course in filteredCourses" :key="course.id" v-on:click="showCourseDetails(course)" class="cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-lg">
                            <div class="max-w-sm rounded overflow-hidden shadow-lg">
                                <div class="flex flex-row m-2">
                                    <img class="w-10 h-10 mr-4" :src="course.picture" alt="Avatar of Jonathan Reinink">
                                    <div class="text-sm">
                                        <p class="leading-none">{{ course.language }}</p>
                                    </div>
                                </div>
                                <p class="text-gray-700 text-base m-4">
                                    {{ course.description }}
                                </p>
                                <div class=" py-4 px-3">
                                    <span
                                        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{
                                            course.periodStart }}</span>
                                    <span
                                        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{
                                            course.schedule }}</span>
                                    <span
                                        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{
                                            course.adress }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="filteredCourses.length === 0">
                        <p>Aucun cours trouvé</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

//définir l'année en cours et l'année suivante
const StartYears = new Date().getFullYear();
const EndYears = StartYears + 1;

const serach = ref('');

//crée moi un jeu de donnée de cours grace au information de l'interface courses
const course = ref([
    {
        id: "1a2d8v2bg1g8;",
        tag: "PHP",
        picture: "https://www.php.net/images/logos/new-php-logo.svg",
        language: "PHP",
        createdAt: "01/01/2021",
        productOwner : "Jonathan Reinink",
        periodStart: "21/03/2021",
        periodEnd: "21/06/2021",
        call: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        projets: ["https://github.com/CodingFactory-Repos/Coding-Tools"],
        siteLocation: "https://codingfactory.fr/",
        student : ["Jonathan Reinink", "Jean Dupont"],
        schedule: "10h00 - 12h00",
        adress: "Paris",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    }
]);

const filteredCourses = computed(() => {
    return course.value.filter((course) => {
        return course.language.toLowerCase().includes(serach.value.toLowerCase());
    });
});

function showCourseDetails(course) {
    router.push(`/app/classes/${course.id}`)
}



</script>