<template>
    <div class="flex flex-col items-center justify-center container">

        <div class="m-10">
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-5xl font-bold">Cours</h1>
            </div>
        </div>

        <div class="flex items-center justify-center">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4"
                @click="startYears-- && endYears--">←</button>
            <span class="text-2xl font-bold">{{ startYears }} - {{ endYears }}</span>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-4"
                @click="startYears++ && endYears++">→</button>
        </div>

        <div class="flex items-center justify-center">
            <div class="flex items-center justify-center">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    @click="showModal = true">+</button>
                <AddCourse v-if="showModal" @close="showModal = false" />
            </div>
        </div>


        <div>
            <div class="flex flex-row items-center justify-center">
                <input type="text" v-model="search" placeholder="Rechercher un cours"
                    class="border-2 border-black m-4 inline-block p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-full">
            </div>
    
            <div>
                <div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div v-for="course in filteredCourseList" :key="course.id" v-on:click="showCourseDetails(course)"
                            class="cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-lg">
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
                    <div v-if="filteredCourseList.length === 0">

                        <p>Aucun cours trouvé</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


import AddCourse from './AddCourses.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { http } from "@/api/network/axios";


const router = useRouter()
const showModal = ref(false)
const startYears = ref(new Date().getFullYear());
const endYears = ref(new Date().getFullYear() + 1);
const search = ref('');
const course = ref([]);


http.get('/courses').then((response) => {
   // console.log(response.data);  
    course.value = response.data
})



const filteredCourseList = computed(() => {
    return course.value.filter((course) => {
        return course.language.toLowerCase().includes(search.value.toLowerCase()) ||
            course.tag.toLowerCase().includes(search.value.toLowerCase()) ||
            course.productOwner.toLowerCase().includes(search.value.toLowerCase()) ||
            course.adress.toLowerCase().includes(search.value.toLowerCase()) ||
            course.description.toLowerCase().includes(search.value.toLowerCase())
    })
})


const courses = ref([
     {
        id: "1a2d8v2bg1g8",
        tag: "PHP",
        picture: "https://www.php.net/images/logos/new-php-logo.svg",
        language: "PHP",
        createdAt: "01/01/2021",
        productOwner: "Nicolas Baudouin",
        periodStart: "24/03/2021",
        periodEnd: "21/06/2021",
        call: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        projets: ["https://github.com/CodingFactory-Repos/Coding-Tools"],
        siteLocation: "https://codingfactory.fr/",
        student: ["Jonathan Reinink", "Jean Dupont"],
        schedule: "10h00 - 12h00",
        adress: "Paris",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    },
    {
        id: "é1d8v2bg1g8",
        tag: "Javascript",
        picture: "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
        language: "Javascript",
        createdAt: "01/01/2021",
        productOwner: "Mickael Hervé",
        periodStart: "06/03/2020",
        periodEnd: "21/06/2021",
        call: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        projets: ["https://github.com/CodingFactory-Repos/Coding-Tools"],
        siteLocation: "https://codingfactory.fr/",
        student: ["Jonathan Reinink", "Jean Dupont", "patrick Paster", "Pascal Mouton"],
        schedule: "10h00 - 12h00",
        adress: "Cergy",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    },
    {
        id: "é1d8v2bg1g8",
        tag: "Vue",
        picture: "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg",
        language: "Vue",
        createdAt: "01/01/2021",
        productOwner: "Xavier Lefevre",
        periodStart: "12/12/2020",
        periodEnd: "21/06/2021",
        call: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        projets: [""],
        siteLocation: "https://codingfactory.fr/",
        student: ["Jonathan Reinink", "Jean Dupont"],
        schedule: "10h00 - 12h00",
        adress: "Cergy",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    },
    {
        id: "é1d8v2bg1g8",
        tag: "React",
        picture: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        language: "React",
        createdAt: "01/01/2021",
        productOwner: "Alexandre Wautier",
        periodStart: "21/03/2019",
        periodEnd: "21/06/2021",
        call: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        projets: [""],
        siteLocation: "https://codingfactory.fr/",
        student: ["Jonathan Reinink", "Jean Dupont"],
        schedule: "10h00 - 12h00",
        adress: "Pontoise",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    },
    {
        id: "é1d8v2bg1g8",
        tag: "Angular",
        picture: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg",
        language: "Angular",
        createdAt: "01/01/2021",
        productOwner: "Nicolas Baudouin",
        periodStart: "21/03/2021",
        periodEnd: "21/06/2021",
        call: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        projets: [""],
        siteLocation: "https://codingfactory.fr/",
        student: ["Jonathan Reinink", "Jean Dupont", "Pascal Mouton"],
        schedule: "10h00 - 12h00",
        adress: "Pontoise",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
    }
]);


function showCourseDetails(course) {
    router.push(`/app/courses/${course.id}`)
}


</script>